import StudyClient, { type StudyItem } from "@/components/study/StudyClient";
import { VOCAB, VOCAB_CATEGORY_LABEL } from "@/data/vocab";

const items: StudyItem[] = VOCAB.map((v) => ({
  id: v.id,
  level: v.level,
  category: VOCAB_CATEGORY_LABEL[v.category],
  front: v.word,
  reading: v.kana,
  meaning: v.korean,
}));

export default function VocabPage() {
  return (
    <StudyClient deck="vocab" title="단어 학습" items={items} testHref="/vocab/test" />
  );
}
