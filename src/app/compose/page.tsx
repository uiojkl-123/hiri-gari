import ComposeClient from "@/components/study/ComposeClient";
import { COMPOSITIONS } from "@/data/compositions";

export default function ComposePage() {
  return <ComposeClient items={COMPOSITIONS} />;
}
