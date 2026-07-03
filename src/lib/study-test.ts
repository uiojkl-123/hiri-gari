// 학습 완료 항목으로 보는 시험 — 출제 유틸 + 결과 저장
// SPEC.md §6.2 참고. 결과는 localStorage(study-test-results-v1)에 저장하고
// 추후 DB(test_result 테이블)로 이관 예정.

import { getLearnedIds, type DeckId } from "./progress";
import { getVocabById } from "@/data/vocab";
import { getKanjiById } from "@/data/kanji";
import { getPhraseById } from "@/data/phrases";

/** 시험 한 문제의 재료 */
export interface StudyTestItem {
  id: string;
  prompt: string; // 문제로 보여줄 일본어
  reading: string; // 읽기(정답 공개 시 표시)
  answer: string; // 정답(뜻)
}

export const DECK_LABEL: Record<DeckId, string> = {
  vocab: "단어",
  kanji: "한자",
  phrase: "회화 문장",
};

/** 덱의 학습 완료 항목을 시험 재료로 변환 */
export function getLearnedTestItems(deck: DeckId): StudyTestItem[] {
  const ids = Array.from(getLearnedIds(deck));
  const items: StudyTestItem[] = [];
  for (const id of ids) {
    if (deck === "vocab") {
      const v = getVocabById(id);
      if (v) items.push({ id: v.id, prompt: v.word, reading: v.kana, answer: v.korean });
    } else if (deck === "kanji") {
      const k = getKanjiById(id);
      if (k) items.push({ id: k.id, prompt: k.char, reading: `${k.onyomi} / ${k.kunyomi}`, answer: k.meaning });
    } else {
      const p = getPhraseById(id);
      if (p) items.push({ id: p.id, prompt: p.jp, reading: p.kana, answer: p.korean });
    }
  }
  return items;
}

/** 배열을 섞어 새 배열로 반환 */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** 풀에서 무작위 n개 추출 */
export function pickRandom<T>(pool: T[], n: number): T[] {
  return shuffle(pool).slice(0, Math.min(n, pool.length));
}

/**
 * 정답을 제외한 오답 보기를 count개 만든다.
 * 학습 완료 풀이 부족하면 전체 풀(allAnswers)에서 보충한다.
 */
export function buildWrongChoices(
  correctAnswer: string,
  candidateAnswers: string[],
  fallbackAnswers: string[],
  count: number
): string[] {
  const uniq = (list: string[]) =>
    Array.from(new Set(list.filter((a) => a !== correctAnswer)));

  let choices = shuffle(uniq(candidateAnswers)).slice(0, count);
  if (choices.length < count) {
    const need = count - choices.length;
    const extra = shuffle(uniq(fallbackAnswers).filter((a) => !choices.includes(a))).slice(0, need);
    choices = [...choices, ...extra];
  }
  return choices;
}

// ===== 결과 저장 =====

const RESULT_KEY = "study-test-results-v1";

export interface StudyTestResultItem {
  id: string;
  prompt: string;
  answer: string;
  userAnswer: string;
  correct: boolean;
}

export interface StudyTestResult {
  id: string;
  timestamp: string;
  deck: DeckId;
  total: number;
  correct: number;
  items: StudyTestResultItem[];
}

export function saveStudyTestResult(result: Omit<StudyTestResult, "id">): void {
  if (typeof window === "undefined") return;
  const list = getStudyTestResults();
  const withId: StudyTestResult = { ...result, id: crypto.randomUUID() };
  list.unshift(withId);
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(list.slice(0, 100)));
}

export function getStudyTestResults(): StudyTestResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RESULT_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
