import { Suspense } from "react";
import ChartClient from "./ChartClient";

export default function ChartPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <p className="text-muted-foreground">로딩 중...</p>
        </main>
      }
    >
      <ChartClient />
    </Suspense>
  );
}
