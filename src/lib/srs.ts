// SRS 스케줄러 — 순수 함수로 격리 (IMPROVE_SPEC §2, §9)
//
// 설계 원칙: 알고리즘 교체(SM-2 ⇄ FSRS)가 이 파일의 `review()` 하나 갈아끼기로
// 끝나게 한다. 상태 저장/큐 조합 등 부수효과는 srs-store.ts가 담당하고,
// 여기서는 "카드 + 채점 → 다음 스케줄"이라는 순수 계산만 다룬다.

export type CardType = "kana" | "word" | "kanji" | "sentence" | "writing";
export type CardState = "new" | "learning" | "review" | "mastered";
export type Grade = "again" | "hard" | "good" | "easy";

/** 자가 채점 4버튼 ↔ SRS grade 매핑 (IMPROVE_SPEC §2 표) */
export const GRADE_ORDER: Grade[] = ["again", "hard", "good", "easy"];

export const GRADE_LABEL: Record<Grade, string> = {
  again: "다시",
  hard: "조금 아쉽",
  good: "좋아",
  easy: "완벽!",
};

/** 학습 항목별 SRS 상태 (단어/한자/문장/카나 공통) */
export interface CardProgress {
  id: string; // 카드 키 ("word:v-0001" 등)
  type: CardType;
  state: CardState;
  ease: number; // SM-2 ease factor (기본 2.5)
  interval: number; // 일 단위 (learning 단계는 0)
  reps: number; // 연속 정답 횟수
  lapses: number; // Again 누적 → leech 판정
  due: number; // 다음 복습 timestamp (ms)
  isLeech: boolean;
  lastGrade?: Grade;
  lastReviewed?: number; // 마지막 채점 timestamp (ms)
}

// ===== 파라미터 (개인용 SM-2 기본형) =====
const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;
const DAY = 24 * 60 * 60 * 1000;
/** learning 단계에서 Again 시 재등장까지 (분) */
const RELEARN_STEP_MIN = 10;
/** 이 간격(일) 이상이면 사실상 졸업 = mastered */
const MASTERED_INTERVAL = 60;
/** Again N회 누적 시 leech 태그 */
const LEECH_THRESHOLD = 4;

/** 아직 학습 이력이 없는 항목의 초기 카드 */
export function newCard(id: string, type: CardType, now: number): CardProgress {
  return {
    id,
    type,
    state: "new",
    ease: DEFAULT_EASE,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: now,
    isLeech: false,
  };
}

function clampEase(ease: number): number {
  return Math.max(MIN_EASE, Math.round(ease * 100) / 100);
}

function stateForInterval(interval: number): CardState {
  if (interval <= 0) return "learning";
  if (interval >= MASTERED_INTERVAL) return "mastered";
  return "review";
}

/**
 * SM-2 기반 스케줄 계산. 순수 함수 — 입력 카드를 변형하지 않고 새 상태를 반환한다.
 * @param card 현재 카드 상태
 * @param grade 자가 채점 등급
 * @param now 기준 시각 (ms) — 테스트/서버 이관을 위해 주입받는다
 */
export function review(card: CardProgress, grade: Grade, now: number): CardProgress {
  let { ease, interval, reps, lapses } = card;
  let due: number;
  let state: CardState;

  switch (grade) {
    case "again": {
      lapses += 1;
      ease = clampEase(ease - 0.2);
      reps = 0;
      interval = 0;
      due = now + RELEARN_STEP_MIN * 60 * 1000;
      state = "learning";
      break;
    }
    case "hard": {
      ease = clampEase(ease - 0.15);
      interval = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
      reps += 1;
      due = now + interval * DAY;
      state = stateForInterval(interval);
      break;
    }
    case "good": {
      if (reps === 0) interval = 1;
      else if (reps === 1) interval = 3;
      else interval = Math.max(1, Math.round(interval * ease));
      reps += 1;
      due = now + interval * DAY;
      state = stateForInterval(interval);
      break;
    }
    case "easy": {
      ease = clampEase(ease + 0.15);
      if (reps === 0) interval = 2;
      else interval = Math.max(1, Math.round(interval * ease * 1.3));
      reps += 1;
      due = now + interval * DAY;
      state = stateForInterval(interval);
      break;
    }
  }

  return {
    ...card,
    ease,
    interval,
    reps,
    lapses,
    due,
    state,
    isLeech: card.isLeech || lapses >= LEECH_THRESHOLD,
    lastGrade: grade,
    lastReviewed: now,
  };
}

/** 카드가 지금 복습 대상인지 (due가 지났고 아직 졸업 전) */
export function isDue(card: CardProgress, now: number): boolean {
  return card.due <= now;
}

/** 다음 복습까지 사람이 읽을 간격 문구 (버튼 프리뷰용) */
export function previewInterval(card: CardProgress, grade: Grade, now: number): string {
  const next = review(card, grade, now);
  const ms = next.due - now;
  if (ms < 60 * 60 * 1000) return `${Math.max(1, Math.round(ms / 60000))}분`;
  if (next.interval < 1) return `${Math.round(ms / (60 * 60 * 1000))}시간`;
  if (next.interval < 30) return `${next.interval}일`;
  if (next.interval < 365) return `${Math.round(next.interval / 30)}개월`;
  return `${(next.interval / 365).toFixed(1)}년`;
}

export const SRS_PARAMS = {
  MIN_EASE,
  DEFAULT_EASE,
  MASTERED_INTERVAL,
  LEECH_THRESHOLD,
};
