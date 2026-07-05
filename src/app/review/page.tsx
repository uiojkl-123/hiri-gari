import ReviewClient from "@/components/study/ReviewClient";
import type { DeckId } from "@/lib/progress";

const VALID: DeckId[] = ["vocab", "kanji", "phrase"];
const TITLE: Record<DeckId, string> = {
  vocab: "단어 복습",
  kanji: "한자 복습",
  phrase: "회화 복습",
};

export default function ReviewPage({
  searchParams,
}: {
  searchParams: { deck?: string; mode?: string };
}) {
  const deck = VALID.includes(searchParams.deck as DeckId)
    ? (searchParams.deck as DeckId)
    : undefined;
  const mode = searchParams.mode === "leech" ? "leech" : "daily";
  const title =
    mode === "leech" ? "약점 집중 복습" : deck ? TITLE[deck] : "오늘의 복습";
  return <ReviewClient deck={deck} mode={mode} title={title} />;
}
