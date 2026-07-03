import StudyTestClient from "@/components/study/StudyTestClient";
import { VOCAB } from "@/data/vocab";

const allAnswers = VOCAB.map((v) => v.korean);

export default function VocabTestPage() {
  return <StudyTestClient deck="vocab" studyHref="/vocab" allAnswers={allAnswers} />;
}
