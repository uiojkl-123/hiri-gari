import StudyTestClient from "@/components/study/StudyTestClient";
import { PHRASES } from "@/data/phrases";

const allAnswers = PHRASES.map((p) => p.korean);

export default function PhrasesTestPage() {
  return <StudyTestClient deck="phrase" studyHref="/phrases" allAnswers={allAnswers} />;
}
