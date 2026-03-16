import { Suspense } from "react";
import QuizClient from "./QuizClient";

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <p className="text-muted-foreground">로딩 중...</p>
        </main>
      }
    >
      <QuizClient />
    </Suspense>
  );
}
