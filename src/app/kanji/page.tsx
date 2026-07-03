import StudyClient, { type StudyItem } from "@/components/study/StudyClient";
import { KANJI } from "@/data/kanji";

const items: StudyItem[] = KANJI.map((k) => ({
  id: k.id,
  level: k.level,
  category: null,
  front: k.char,
  reading: `음 ${k.onyomi} · 훈 ${k.kunyomi}`,
  meaning: `${k.meaning} (한자음: ${k.korean})`,
  detail: k.examples,
}));

export default function KanjiPage() {
  return <StudyClient deck="kanji" title="한자 학습" items={items} testHref="/kanji/test" />;
}
