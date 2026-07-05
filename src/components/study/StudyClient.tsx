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
import { STUDY_LEVEL_LABEL, STUDY_LEVELS, type StudyLevel } from "@/data/vocab";
import { type DeckId } from "@/lib/progress";
import {
  GRADE_LABEL,
  GRADE_ORDER,
  newCard,
  previewInterval,
  type CardProgress,
  type Grade,
} from "@/lib/srs";
import { gradeCard, getAllProgress } from "@/lib/srs-store";
import { DECK_TO_TYPE, cardKey } from "@/lib/cards";

const GRADE_STYLE: Record<Grade, string> = {
  again: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
  hard: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  good: "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  easy: "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
};

const STATE_LABEL: Record<CardProgress["state"], string> = {
  new: "새 카드",
  learning: "학습 중",
  review: "복습 중",
  mastered: "숙달",
};

export interface StudyItem {
  id: string;
  level: StudyLevel;
  category: string | null; // 표시용 라벨
  front: string; // 크게 보여줄 일본어
  reading: string; // 읽기
  meaning: string; // 뜻
  detail?: string[]; // 추가 정보 줄 (한자 음독/훈독/예시 등)
}

interface StudyClientProps {
  deck: DeckId;
  title: string;
  items: StudyItem[];
  testHref: string;
}

export default function StudyClient({ deck, title, items, testHref }: StudyClientProps) {
  const [level, setLevel] = useState<StudyLevel | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [hideMeaning, setHideMeaning] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [now] = useState(() => Date.now());

  useEffect(() => {
    setProgress(getAllProgress());
  }, [deck]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => it.category && set.add(it.category));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (level === null || it.level === level) &&
          (category === null || it.category === category)
      ),
    [items, level, category]
  );

  // 필터가 바뀌면 첫 카드로
  useEffect(() => {
    setIndex(0);
  }, [level, category]);

  const total = filtered.length;
  const current = filtered[index];

  const progressFor = (id: string): CardProgress | undefined => progress[cardKey(deck, id)];
  const studiedInFilter = filtered.filter((it) => progressFor(it.id)).length;
  const studiedTotal = items.filter((it) => progressFor(it.id)).length;

  const currentProgress = current
    ? progressFor(current.id) ?? newCard(cardKey(deck, current.id), DECK_TO_TYPE[deck], now)
    : null;

  const go = (delta: number) => {
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return 0;
      if (next >= total) return total - 1;
      return next;
    });
    setHideMeaning(false);
  };

  const handleGrade = (grade: Grade) => {
    if (!current) return;
    const updated = gradeCard(deck, current.id, grade);
    setProgress((prev) => ({ ...prev, [updated.id]: updated }));
    // 채점하면 자동으로 다음 카드로 (마지막이면 그대로)
    if (index < total - 1) go(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-10 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-lg">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            ← 메인
          </Link>
          <Link href={testHref} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            시험 보기 →
          </Link>
        </div>

        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            전체 {items.length}개 · 학습 시작 {studiedTotal}개
          </p>
        </header>

        {/* 레벨 필터 */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          <FilterChip active={level === null} onClick={() => setLevel(null)}>
            전체 레벨
          </FilterChip>
          {STUDY_LEVELS.map((lv) => (
            <FilterChip key={lv} active={level === lv} onClick={() => setLevel(lv)}>
              Lv{lv} {STUDY_LEVEL_LABEL[lv]}
            </FilterChip>
          ))}
        </div>

        {/* 카테고리 필터 */}
        {categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            <FilterChip active={category === null} onClick={() => setCategory(null)}>
              전체 분류
            </FilterChip>
            {categories.map((c) => (
              <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </FilterChip>
            ))}
          </div>
        )}

        {total === 0 ? (
          <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle>항목 없음</CardTitle>
              <CardDescription>선택한 조건에 해당하는 항목이 없습니다.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {index + 1} / {total}
              </span>
              <span>이 조건 학습 시작 {studiedInFilter}개</span>
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
                <div
                  className={cn(
                    "rounded-lg border bg-muted/40 px-4 py-3 text-center text-lg font-medium transition",
                    hideMeaning && "select-none blur-sm"
                  )}
                >
                  {current.meaning}
                </div>

                {current.detail && current.detail.length > 0 && (
                  <ul
                    className={cn(
                      "space-y-1 text-sm text-muted-foreground transition",
                      hideMeaning && "select-none blur-sm"
                    )}
                  >
                    {current.detail.map((d, i) => (
                      <li key={i} className="break-keep">
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                {currentProgress && progressFor(current.id) && (
                  <p className="text-center text-xs font-medium text-muted-foreground">
                    {STATE_LABEL[currentProgress.state]}
                    {currentProgress.isLeech && " · ⚠ 약점"}
                    {currentProgress.lastGrade &&
                      ` · 지난 채점: ${GRADE_LABEL[currentProgress.lastGrade]}`}
                  </p>
                )}

                <div className="flex justify-center pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setHideMeaning((v) => !v)}>
                    {hideMeaning ? "뜻 보이기" : "뜻 가리기 (스스로 테스트)"}
                  </Button>
                </div>

                {/* 4버튼 자가채점 → SRS 등록 */}
                <div>
                  <p className="mb-1.5 text-center text-sm text-muted-foreground">
                    떠올린 만큼 스스로 채점하면 복습 일정이 잡혀요
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
                        {currentProgress && (
                          <span className="text-[10px] opacity-70">
                            {previewInterval(currentProgress, g, now)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => go(-1)}
                    disabled={index === 0}
                  >
                    ← 이전
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => go(1)}
                    disabled={index >= total - 1}
                  >
                    다음 →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}
