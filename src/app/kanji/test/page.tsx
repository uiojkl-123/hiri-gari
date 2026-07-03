import StudyTestClient from "@/components/study/StudyTestClient";
import { KANJI } from "@/data/kanji";

const allAnswers = KANJI.map((k) => k.meaning);

export default function KanjiTestPage() {
  return <StudyTestClient deck="kanji" studyHref="/kanji" allAnswers={allAnswers} />;
}
