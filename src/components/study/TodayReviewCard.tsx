"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildDailyQueue, getStats } from "@/lib/srs-store";

const linkBase =
  "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-all w-full";

export default function TodayReviewCard() {
  const [ready, setReady] = useState(false);
  const [due, setDue] = useState(0);
  const [fresh, setFresh] = useState(0);
  const [streak, setStreak] = useState(0);
  const [reviewedToday, setReviewedToday] = useState(0);
  const [leech, setLeech] = useState(0);

  useEffect(() => {
    const q = buildDailyQueue();
    const s = getStats();
    setDue(q.due.length);
    setFresh(q.fresh.length);
    setStreak(s.streak);
    setReviewedToday(s.reviewedToday);
    setLeech(s.leechCount);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <Card className="w-full border-slate-200/80 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle>오늘의 복습</CardTitle>
          <CardDescription>불러오는 중...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalToday = due + fresh;
  const empty = totalToday === 0;

  return (
    <Card className="w-full border-primary/30 bg-primary/5 shadow-sm dark:border-primary/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>오늘의 복습</CardTitle>
          {streak > 0 && (
            <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
              🔥 {streak}일 연속
            </span>
          )}
        </div>
        <CardDescription>
          {empty ? (
            <>오늘 복습할 카드가 없어요. 새로 배우거나 잠시 쉬어도 좋아요.</>
          ) : (
            <>
              복습 {due}장 + 새 카드 {fresh}장 ={" "}
              <span className="font-semibold text-foreground">오늘 {totalToday}장</span>
              {reviewedToday > 0 && ` · 오늘 ${reviewedToday}장 완료`}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {empty ? (
          <Link href="/vocab" className={`${linkBase} bg-primary text-primary-foreground hover:opacity-90`}>
            새 단어 배우러 가기
          </Link>
        ) : (
          <Link href="/review" className={`${linkBase} bg-primary text-primary-foreground hover:opacity-90`}>
            복습 시작 ({totalToday}장) →
          </Link>
        )}
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className={`${linkBase} border border-border bg-background hover:bg-muted`}
          >
            학습 현황
          </Link>
          {leech > 0 && (
            <Link
              href="/dashboard#leech"
              className={`${linkBase} border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300`}
            >
              약점 노트 {leech}
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
