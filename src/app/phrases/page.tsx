import StudyClient, { type StudyItem } from "@/components/study/StudyClient";
import { PHRASES, PHRASE_CATEGORY_LABEL } from "@/data/phrases";

const items: StudyItem[] = PHRASES.map((p) => ({
  id: p.id,
  level: p.level,
  category: PHRASE_CATEGORY_LABEL[p.category],
  front: p.jp,
  reading: p.kana,
  meaning: p.korean,
}));

export default function PhrasesPage() {
  return (
    <StudyClient deck="phrase" title="일상 회화 문장" items={items} testHref="/phrases/test" />
  );
}
