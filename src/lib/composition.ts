// 작문 자가 채점 저장 (localStorage 기반)
// SPEC.md §4.4, §5 참고 — 추후 DB(composition_grade 테이블)로 이관 예정.

export type CompositionGrade = "perfect" | "good" | "meh" | "again";

export const GRADE_ORDER: CompositionGrade[] = ["perfect", "good", "meh", "again"];

export const GRADE_LABEL: Record<CompositionGrade, string> = {
  perfect: "완벽!",
  good: "좋아",
  meh: "조금 아쉽",
  again: "다시",
};

const COMPOSITION_KEY = "composition-progress-v1";

interface GradeEntry {
  grade: CompositionGrade;
  at: string;
}

interface CompositionState {
  grades: Record<string, GradeEntry>;
}

function readState(): CompositionState {
  if (typeof window === "undefined") return { grades: {} };
  try {
    const raw = window.localStorage.getItem(COMPOSITION_KEY);
    if (!raw) return { grades: {} };
    const parsed = JSON.parse(raw) as Partial<CompositionState>;
    return { grades: parsed.grades ?? {} };
  } catch {
    return { grades: {} };
  }
}

function writeState(state: CompositionState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COMPOSITION_KEY, JSON.stringify(state));
}

/** 특정 작문의 채점 결과 (없으면 null) */
export function getGrade(id: string): CompositionGrade | null {
  return readState().grades[id]?.grade ?? null;
}

/** id → 채점 전체 맵 */
export function getAllGrades(): Record<string, CompositionGrade> {
  const { grades } = readState();
  const out: Record<string, CompositionGrade> = {};
  for (const [id, entry] of Object.entries(grades)) out[id] = entry.grade;
  return out;
}

/** 채점 저장 */
export function setGrade(id: string, grade: CompositionGrade): void {
  const state = readState();
  state.grades[id] = { grade, at: new Date().toISOString() };
  writeState(state);
}

/** 등급별 개수 집계 */
export function getGradeCounts(): Record<CompositionGrade, number> {
  const counts: Record<CompositionGrade, number> = {
    perfect: 0,
    good: 0,
    meh: 0,
    again: 0,
  };
  for (const entry of Object.values(readState().grades)) {
    counts[entry.grade] += 1;
  }
  return counts;
}

/** 작문 채점 전체 초기화 */
export function resetCompositions(): void {
  writeState({ grades: {} });
}
