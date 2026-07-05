// SRS 저장소 — CardProgress 영속화 + 데일리 큐 조합 + 스트릭/약점 관리.
// (IMPROVE_SPEC §2·④·⑤·§9). 개인용이라 우선 localStorage로 시작하고,
// 함수 시그니처를 유지한 채 추후 IndexedDB/DB로 내부만 교체한다.

import {
  newCard,
  review,
  type CardProgress,
  type CardState,
  type Grade,
} from "./srs";
import {
  ALL_CARDS,
  DECK_TO_TYPE,
  cardKey,
  getCardByKey,
  type StudyCard,
} from "./cards";
import type { DeckId } from "./progress";
import { markLearned, unmarkLearned } from "./progress";

const PROGRESS_KEY = "srs-progress-v1";
const META_KEY = "srs-meta-v1";
const DEFAULT_NEW_GOAL = 10;

type ProgressMap = Record<string, CardProgress>;

interface SrsMeta {
  newGoal: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD (마지막으로 채점한 날)
  today: string; // 오늘 날짜
  reviewedToday: number;
  learnedNewToday: number;
}

// ===== 저수준 read/write =====

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function writeProgress(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

function defaultMeta(today: string): SrsMeta {
  return {
    newGoal: DEFAULT_NEW_GOAL,
    streak: 0,
    lastActiveDate: "",
    today,
    reviewedToday: 0,
    learnedNewToday: 0,
  };
}

export function dateStr(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function readMeta(now: number): SrsMeta {
  const today = dateStr(now);
  if (typeof window === "undefined") return defaultMeta(today);
  let meta: SrsMeta;
  try {
    const raw = window.localStorage.getItem(META_KEY);
    meta = raw ? { ...defaultMeta(today), ...(JSON.parse(raw) as SrsMeta) } : defaultMeta(today);
  } catch {
    meta = defaultMeta(today);
  }
  // 날짜가 바뀌면 오늘 카운터 리셋 (스트릭은 채점 시점에 갱신)
  if (meta.today !== today) {
    meta.today = today;
    meta.reviewedToday = 0;
    meta.learnedNewToday = 0;
  }
  return meta;
}

function writeMeta(meta: SrsMeta): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function yesterdayStr(now: number): string {
  return dateStr(now - 24 * 60 * 60 * 1000);
}

// ===== 채점 (핵심 진입점) =====

/**
 * 카드 하나를 채점한다. SRS 상태 갱신 + 데일리/스트릭 카운터 갱신 +
 * 기존 학습완료 진도(progress.ts)와 동기화(시험 기능 호환).
 * @returns 갱신된 CardProgress
 */
export function gradeCard(deck: DeckId, itemId: string, grade: Grade): CardProgress {
  const now = Date.now();
  const key = cardKey(deck, itemId);
  const map = readProgress();
  const existing = map[key];
  const wasNew = !existing;

  const base = existing ?? newCard(key, DECK_TO_TYPE[deck], now);
  const updated = review(base, grade, now);
  map[key] = updated;
  writeProgress(map);

  // 데일리 + 스트릭 갱신
  const meta = readMeta(now);
  meta.reviewedToday += 1;
  if (wasNew) meta.learnedNewToday += 1;

  const today = dateStr(now);
  if (meta.lastActiveDate !== today) {
    meta.streak = meta.lastActiveDate === yesterdayStr(now) ? meta.streak + 1 : 1;
    meta.lastActiveDate = today;
  }
  writeMeta(meta);

  // 기존 학습완료 진도 동기화: again이 아니면 완료로 간주(시험 풀 유지)
  if (grade === "again") unmarkLearned(deck, itemId);
  else markLearned(deck, itemId);

  return updated;
}

// ===== 조회 =====

export function getProgress(deck: DeckId, itemId: string): CardProgress | null {
  return readProgress()[cardKey(deck, itemId)] ?? null;
}

export function getAllProgress(): ProgressMap {
  return readProgress();
}

/** 지금 복습 예정(due 경과)인 카드들 — due 빠른 순 */
export function getDueCards(now: number = Date.now()): StudyCard[] {
  const map = readProgress();
  return ALL_CARDS.filter((c) => {
    const p = map[c.key];
    return p && p.state !== "new" && p.due <= now;
  }).sort((a, b) => (map[a.key].due - map[b.key].due));
}

/** 아직 학습 이력이 없는 신규 카드 (레벨→순서) */
export function getNewCards(): StudyCard[] {
  const map = readProgress();
  return ALL_CARDS.filter((c) => !map[c.key]);
}

export interface DailyQueue {
  due: StudyCard[]; // 오늘 복습할 due 카드
  fresh: StudyCard[]; // 오늘 새로 배울 카드
  newGoal: number;
  newAllowance: number; // 복습량 고려해 조정된 오늘 신규 허용치
  learnedNewToday: number;
}

/**
 * 오늘의 학습 큐 = [due 카드 전부] + [신규 N개].
 * 복습이 밀리면(due가 많으면) 신규를 자동으로 줄여 복습 폭탄을 막는다. (IMPROVE_SPEC §4)
 */
export function buildDailyQueue(deck: DeckId | null = null, now: number = Date.now()): DailyQueue {
  const meta = readMeta(now);
  let due = getDueCards(now);
  let fresh = getNewCards();
  if (deck) {
    due = due.filter((c) => c.deck === deck);
    fresh = fresh.filter((c) => c.deck === deck);
  }

  const remainingGoal = Math.max(0, meta.newGoal - meta.learnedNewToday);
  // 복습이 목표치를 초과한 만큼 신규를 절반 페널티로 감산
  const overflow = Math.max(0, due.length - meta.newGoal);
  const newAllowance = Math.max(0, remainingGoal - Math.floor(overflow / 2));

  return {
    due,
    fresh: fresh.slice(0, newAllowance),
    newGoal: meta.newGoal,
    newAllowance,
    learnedNewToday: meta.learnedNewToday,
  };
}

// ===== leech / 약점 노트 (IMPROVE_SPEC §3) =====

export function getLeechCards(): { card: StudyCard; progress: CardProgress }[] {
  const map = readProgress();
  return ALL_CARDS.filter((c) => map[c.key]?.isLeech)
    .map((c) => ({ card: c, progress: map[c.key] }))
    .sort((a, b) => b.progress.lapses - a.progress.lapses);
}

/** leech 태그 해제(보류/졸업 처리용) */
export function clearLeech(key: string): void {
  const map = readProgress();
  if (map[key]) {
    map[key] = { ...map[key], isLeech: false };
    writeProgress(map);
  }
}

// ===== 통계 / 스트릭 (IMPROVE_SPEC §4·§10) =====

export interface SrsStats {
  streak: number;
  reviewedToday: number;
  learnedNewToday: number;
  newGoal: number;
  dueToday: number;
  byState: Record<CardState, number>;
  totalTracked: number;
  totalCards: number;
  leechCount: number;
  /** 향후 7일 복습 예정 개수 (오늘 index 0) */
  forecast: number[];
}

export function getStats(now: number = Date.now()): SrsStats {
  const meta = readMeta(now);
  const map = readProgress();
  const values = Object.values(map);

  const byState: Record<CardState, number> = {
    new: 0,
    learning: 0,
    review: 0,
    mastered: 0,
  };
  let leechCount = 0;
  const forecast = [0, 0, 0, 0, 0, 0, 0];

  for (const p of values) {
    byState[p.state] += 1;
    if (p.isLeech) leechCount += 1;
    if (p.state === "new") continue;
    const days = Math.floor((p.due - now) / (24 * 60 * 60 * 1000));
    if (days <= 0) forecast[0] += 1;
    else if (days < 7) forecast[days] += 1;
  }
  // new 상태로 저장되는 카드는 없지만, 아직 시작 안 한 항목을 new로 집계
  byState.new = ALL_CARDS.length - values.length;

  return {
    streak: meta.streak,
    reviewedToday: meta.reviewedToday,
    learnedNewToday: meta.learnedNewToday,
    newGoal: meta.newGoal,
    dueToday: getDueCards(now).length,
    byState,
    totalTracked: values.length,
    totalCards: ALL_CARDS.length,
    leechCount,
    forecast,
  };
}

export function getNewGoal(): number {
  return readMeta(Date.now()).newGoal;
}

export function setNewGoal(goal: number): void {
  const meta = readMeta(Date.now());
  meta.newGoal = Math.max(0, Math.min(100, Math.round(goal)));
  writeMeta(meta);
}

/** 전체 SRS 진도 초기화 (개발/리셋용) */
export function resetSrs(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROGRESS_KEY);
  window.localStorage.removeItem(META_KEY);
}

// markLearned 재노출(호출부 편의)
export { markLearned };
