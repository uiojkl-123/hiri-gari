"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GRADE_LABEL,
  GRADE_ORDER,
  newCard,
  previewInterval,
  type CardProgress,
  type Grade,
} from "@/lib/srs";
import { buildDailyQueue, gradeCard, getProgress, getLeechCards } from "@/lib/srs-store";
import { DECK_TO_TYPE, type StudyCard } from "@/lib/cards";
import type { DeckId } from "@/lib/progress";

const GRADE_STYLE: Record<Grade, string> = {
  again: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
  hard: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  good: "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  easy: "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
};

interface QueueEntry {
  card: StudyCard;
  isNew: boolean;
}

interface ReviewClientProps {
  deck?: DeckId; // 지정 시 해당 덱만
  mode?: "daily" | "leech"; // leech: 약점 카드만 집중 복습
  title: string;
}

type Step = "loading" | "session" | "done" | "empty";

export default function ReviewClient({ deck, mode = "daily", title }: ReviewClientProps) {
  const [step, setStep] = useState<Step>("loading");
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [now] = useState(() => Date.now());
  const [tally, setTally] = useState({ again: 0, hard: 0, good: 0, easy: 0, newCount: 0 });

  useEffect(() => {
    let entries: QueueEntry[];
    let newCount = 0;
    if (mode === "leech") {
      entries = getLeechCards()
        .filter((l) => deck == null || l.card.deck === deck)
        .map((l) => ({ card: l.card, isNew: false }));
    } else {
      const q = buildDailyQueue(deck ?? null);
      newCount = q.fresh.length;
      entries = [
        ...q.due.map((card) => ({ card, isNew: false })),
        ...q.fresh.map((card) => ({ card, isNew: true })),
      ];
    }
    setQueue(entries);
    setPos(0);
    setRevealed(false);
    setStep(entries.length === 0 ? "empty" : "session");
    setTally({ again: 0, hard: 0, good: 0, easy: 0, newCount });
  }, [deck, mode]);

  const total = queue.length;
  const entry = queue[pos];
  const current = entry?.card;

  // 채점 버튼 프리뷰용 현재 카드 상태
  const currentProgress: CardProgress | null = useMemo(() => {
    if (!current) return null;
    return getProgress(current.deck, current.itemId) ?? newCard(current.key, DECK_TO_TYPE[current.deck], now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, now]);

  const handleGrade = (grade: Grade) => {
    if (!current) return;
    gradeCard(current.deck, current.itemId, grade);
    setTally((t) => ({ ...t, [grade]: t[grade] + 1 }));

    // 'again'은 이번 세션 뒤쪽에 다시 넣어 오늘 안에 한 번 더 본다
    setQueue((prev) => {
      if (grade !== "again") return prev;
      const next = [...prev];
      next.push({ card: current, isNew: false });
      return next;
    });

    // 큐 끝 도달 여부는 pos/queue.length 를 보는 useEffect가 판정
    setPos((p) => p + 1);
    setRevealed(false);
  };

  // pos가 큐 끝을 넘으면 완료
  useEffect(() => {
    if (step === "session" && pos >= queue.length && queue.length > 0) {
      setStep("done");
    }
  }, [pos, queue.length, step]);

  if (step === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">준비 중...</p>
      </main>
    );
  }

  if (step === "empty") {
    return (
      <Shell title={title}>
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl">오늘 복습 끝! 🎉</CardTitle>
            <CardDescription>
              지금 복습할 카드가 없어요. 새 단어를 배우러 갈까요?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/vocab" className={cn(buttonVariants(), "w-full")}>
              새 단어 배우러 가기
            </Link>
            <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              학습 현황 보기
            </Link>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (step === "done") {
    return (
      <Shell title={title}>
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl">복습 완료 🎉</CardTitle>
            <CardDescription>오늘의 복습을 끝냈어요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <Stat label="완벽" value={tally.easy} />
              <Stat label="좋아" value={tally.good} />
              <Stat label="조금 아쉽" value={tally.hard} />
              <Stat label="다시" value={tally.again} />
            </div>
            <div className="flex gap-3">
              <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                메인
              </Link>
              <Link href="/dashboard" className={cn(buttonVariants(), "flex-1")}>
                현황 보기
              </Link>
            </div>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (!current || !currentProgress) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">준비 중...</p>
      </main>
    );
  }

  const remaining = total - pos;

  return (
    <Shell title={title}>
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>남은 카드 {remaining}장</span>
        <span className="flex items-center gap-2">
          {entry.isNew && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              새 카드
            </span>
          )}
          {currentProgress.isLeech && (
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
              약점
            </span>
          )}
        </span>
      </div>

      <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
        <CardHeader className="items-center gap-1">
          {current.category && (
            <span className="text-xs text-muted-foreground">
              Lv{current.level} · {current.category}
            </span>
          )}
          <CardTitle className="break-keep text-center text-4xl font-bold tracking-wide">
            {current.front}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {current.reading}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!revealed ? (
            <>
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground">
                뜻을 떠올려 보세요
              </div>
              <Button className="w-full" onClick={() => setRevealed(true)}>
                뒤집기 (뜻 보기)
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-lg border bg-muted/40 px-4 py-3 text-center text-lg font-medium">
                {current.meaning}
              </div>
              {current.detail && current.detail.length > 0 && (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {current.detail.map((d, i) => (
                    <li key={i} className="break-keep text-center">
                      {d}
                    </li>
                  ))}
                </ul>
              )}
              <div>
                <p className="mb-1.5 text-center text-sm text-muted-foreground">
                  얼마나 잘 떠올렸나요?
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {GRADE_ORDER.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleGrade(g)}
                      className={cn(
                        "flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2 text-sm font-medium transition",
                        GRADE_STYLE[g]
                      )}
                    >
                      <span>{GRADE_LABEL[g]}</span>
                      <span className="text-[10px] opacity-70">
                        {previewInterval(currentProgress, g, now)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-10 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            ← 메인
          </Link>
        </div>
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>
        </header>
        {children}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
