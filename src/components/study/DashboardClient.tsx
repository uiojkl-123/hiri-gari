"use client";

import { useCallback, useEffect, useState } from "react";
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
  clearLeech,
  getLeechCards,
  getStats,
  getNewGoal,
  setNewGoal,
  type SrsStats,
} from "@/lib/srs-store";
import { DECK_LABEL, type StudyCard } from "@/lib/cards";
import type { CardProgress } from "@/lib/srs";

const STATE_META = [
  { key: "new", label: "새 카드", color: "bg-slate-400" },
  { key: "learning", label: "학습 중", color: "bg-amber-400" },
  { key: "review", label: "복습 중", color: "bg-sky-400" },
  { key: "mastered", label: "숙달", color: "bg-emerald-400" },
] as const;

const dayLabels = ["오늘", "내일", "+2일", "+3일", "+4일", "+5일", "+6일"];

export default function DashboardClient() {
  const [stats, setStats] = useState<SrsStats | null>(null);
  const [leeches, setLeeches] = useState<{ card: StudyCard; progress: CardProgress }[]>([]);
  const [goal, setGoal] = useState(10);

  const refresh = useCallback(() => {
    setStats(getStats());
    setLeeches(getLeechCards());
    setGoal(getNewGoal());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const changeGoal = (delta: number) => {
    const next = Math.max(0, Math.min(100, goal + delta));
    setNewGoal(next);
    setGoal(next);
  };

  const handleClearLeech = (key: string) => {
    clearLeech(key);
    refresh();
  };

  if (!stats) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </main>
    );
  }

  const masteredPct =
    stats.totalCards > 0 ? Math.round((stats.byState.mastered / stats.totalCards) * 100) : 0;
  const maxForecast = Math.max(1, ...stats.forecast);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 dark:from-slate-950 dark:to-slate-900 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            ← 메인
          </Link>
          {stats.dueToday > 0 && (
            <Link href="/review" className={cn(buttonVariants({ size: "sm" }))}>
              복습 {stats.dueToday}장 →
            </Link>
          )}
        </div>

        <header>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            학습 현황
          </h1>
        </header>

        {/* 스트릭 & 오늘 */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>오늘</CardTitle>
              <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-sm font-semibold text-orange-600 dark:text-orange-400">
                🔥 {stats.streak}일 연속
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Metric label="복습함" value={stats.reviewedToday} />
              <Metric label="새로 배움" value={`${stats.learnedNewToday}/${stats.newGoal}`} />
              <Metric label="남은 복습" value={stats.dueToday} />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
              <span className="text-sm text-muted-foreground">하루 새 카드 목표</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => changeGoal(-5)}>
                  −5
                </Button>
                <span className="w-8 text-center font-semibold">{goal}</span>
                <Button variant="outline" size="sm" onClick={() => changeGoal(5)}>
                  +5
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상태 분포 */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>기억 상태</CardTitle>
            <CardDescription>
              전체 {stats.totalCards}장 중 숙달 {stats.byState.mastered}장 ({masteredPct}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
              {STATE_META.map((s) => {
                const v = stats.byState[s.key];
                const pct = stats.totalCards > 0 ? (v / stats.totalCards) * 100 : 0;
                return pct > 0 ? (
                  <div key={s.key} className={s.color} style={{ width: `${pct}%` }} />
                ) : null;
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {STATE_META.map((s) => (
                <div key={s.key} className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", s.color)} />
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="ml-auto font-medium">{stats.byState[s.key]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 향후 복습 예측 */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>앞으로 7일 복습</CardTitle>
            <CardDescription>언제 몇 장이 다시 올라올지</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-1.5" style={{ height: 96 }}>
              {stats.forecast.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-muted-foreground">{v || ""}</span>
                  <div
                    className="w-full rounded-t bg-sky-400/70 dark:bg-sky-500/60"
                    style={{ height: `${(v / maxForecast) * 64}px`, minHeight: v > 0 ? 4 : 0 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{dayLabels[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 약점 노트 (leech) */}
        <Card id="leech" className="scroll-mt-4 border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>약점 노트</CardTitle>
              {leeches.length > 0 && (
                <Link href="/review?mode=leech" className={cn(buttonVariants({ size: "sm" }))}>
                  집중 복습
                </Link>
              )}
            </div>
            <CardDescription>
              {leeches.length > 0
                ? `‘다시’를 자주 눌러 안 외워지는 카드 ${leeches.length}장`
                : "아직 약점으로 잡힌 카드가 없어요. 좋은 신호! 👍"}
            </CardDescription>
          </CardHeader>
          {leeches.length > 0 && (
            <CardContent className="space-y-2">
              {leeches.map(({ card, progress }) => (
                <div
                  key={card.key}
                  className="flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50/60 px-3 py-2 dark:border-red-900/50 dark:bg-red-950/20"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="break-keep text-base font-semibold">{card.front}</span>
                      <span className="shrink-0 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                        {DECK_LABEL[card.deck]} · 다시 {progress.lapses}회
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {card.reading} — {card.meaning}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={() => handleClearLeech(card.key)}
                  >
                    보류
                  </Button>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-2 py-3">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
