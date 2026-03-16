const STORAGE_KEY = "kana-quiz-results";

export interface QuizResultItem {
  char: string;
  korean: string;
  correct: boolean;
  userAnswer: string;
}

export interface QuizResult {
  id: string;
  timestamp: string;
  type: "hiragana" | "katakana" | "both" | "dakuten" | "youon" | "dakuten-youon";
  total: number;
  correct: number;
  items: QuizResultItem[];
}

export function saveQuizResult(result: Omit<QuizResult, "id">): void {
  if (typeof window === "undefined") return;
  const list = getQuizResults();
  const withId: QuizResult = {
    ...result,
    id: crypto.randomUUID(),
  };
  list.unshift(withId);
  const trimmed = list.slice(0, 100);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function getQuizResults(): QuizResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
