// 단어/한자/회화 학습 화면의 UI 상태(필터·뷰·보던 위치·가리기)를 덱별로 저장.
// 다시 들어와도 보던 조건·카드에서 이어가게 한다. localStorage 기반, SSR 가드.

import type { DeckId } from "./progress";
import type { StudyLevel } from "@/data/vocab";

export type StudyFilter = "all" | "unstudied" | "studied";
export type ViewMode = "card" | "list";

export interface StudyUiState {
  level: StudyLevel | null;
  category: string | null;
  studyFilter: StudyFilter;
  view: ViewMode;
  index: number;
  hideMeaning: boolean;
  hideReading: boolean;
}

const key = (deck: DeckId) => `study-ui-${deck}-v1`;

export function loadStudyUi(deck: DeckId): Partial<StudyUiState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(deck));
    return raw ? (JSON.parse(raw) as Partial<StudyUiState>) : null;
  } catch {
    return null;
  }
}

export function saveStudyUi(deck: DeckId, state: StudyUiState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(deck), JSON.stringify(state));
  } catch {
    /* 저장 실패는 무시 */
  }
}
