// 학습 진행 상태 저장 (localStorage 기반)
// SPEC.md §5, §7 참고 — 추후 DB(user_progress 테이블)로 이관 예정.
// 이관 시 이 파일의 함수 시그니처는 유지하고 내부 구현만 서버 호출로 교체한다.

export type DeckId = "vocab" | "kanji" | "phrase";

const PROGRESS_KEY = "study-progress-v1";

interface ProgressState {
  vocab: string[];
  kanji: string[];
  phrase: string[];
  updatedAt: string;
}

const EMPTY_STATE: ProgressState = {
  vocab: [],
  kanji: [],
  phrase: [],
  updatedAt: "",
};

function readState(): ProgressState {
  if (typeof window === "undefined") return { ...EMPTY_STATE };
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...EMPTY_STATE };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      vocab: Array.isArray(parsed.vocab) ? parsed.vocab : [],
      kanji: Array.isArray(parsed.kanji) ? parsed.kanji : [],
      phrase: Array.isArray(parsed.phrase) ? parsed.phrase : [],
      updatedAt: parsed.updatedAt ?? "",
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

function writeState(state: ProgressState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
}

/** 덱의 학습 완료 id 집합 */
export function getLearnedIds(deck: DeckId): Set<string> {
  return new Set(readState()[deck]);
}

/** 특정 항목이 학습 완료 상태인지 */
export function isLearned(deck: DeckId, id: string): boolean {
  return readState()[deck].includes(id);
}

/** 덱의 학습 완료 개수 */
export function getProgressCount(deck: DeckId): number {
  return readState()[deck].length;
}

/** 학습 완료로 표시 */
export function markLearned(deck: DeckId, id: string): void {
  const state = readState();
  if (!state[deck].includes(id)) {
    state[deck] = [...state[deck], id];
    state.updatedAt = new Date().toISOString();
    writeState(state);
  }
}

/** 학습 완료 해제 */
export function unmarkLearned(deck: DeckId, id: string): void {
  const state = readState();
  if (state[deck].includes(id)) {
    state[deck] = state[deck].filter((x) => x !== id);
    state.updatedAt = new Date().toISOString();
    writeState(state);
  }
}

/** 학습 완료 토글. 토글 후의 상태(true=완료)를 반환 */
export function toggleLearned(deck: DeckId, id: string): boolean {
  if (isLearned(deck, id)) {
    unmarkLearned(deck, id);
    return false;
  }
  markLearned(deck, id);
  return true;
}

/** 덱 진행 상태 전체 초기화 */
export function resetDeck(deck: DeckId): void {
  const state = readState();
  state[deck] = [];
  state.updatedAt = new Date().toISOString();
  writeState(state);
}
