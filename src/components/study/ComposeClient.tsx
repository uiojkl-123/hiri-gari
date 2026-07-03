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
import {
  COMPOSITION_CATEGORY_LABEL,
  type Composition,
} from "@/data/compositions";
import {
  GRADE_LABEL,
  GRADE_ORDER,
  getAllGrades,
  getGradeCounts,
  setGrade,
  type CompositionGrade,
} from "@/lib/composition";

const GRADE_STYLE: Record<CompositionGrade, string> = {
  perfect: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  good: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  meh: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  again: "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
};

interface ComposeClientProps {
  items: Composition[];
}

export default function ComposeClient({ items }: ComposeClientProps) {
  const [level, setLevel] = useState<StudyLevel | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [grades, setGrades] = useState<Record<string, CompositionGrade>>({});
  const [counts, setCounts] = useState(() => ({ perfect: 0, good: 0, meh: 0, again: 0 } as Record<CompositionGrade, number>));

  useEffect(() => {
    setGrades(getAllGrades());
    setCounts(getGradeCounts());
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((it) => map.set(it.category, COMPOSITION_CATEGORY_LABEL[it.category]));
    return Array.from(map, ([value, label]) => ({ value, label }));
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

  // 필터 바뀌면 처음부터, 입력/공개 초기화
  useEffect(() => {
    setIndex(0);
    setDraft("");
    setRevealed(false);
  }, [level, category]);

  const total = filtered.length;
  const current = filtered[index];
  const currentGrade = current ? grades[current.id] : undefined;

  const move = (delta: number) => {
    setIndex((i) => {
      const next = Math.min(Math.max(i + delta, 0), total - 1);
      return next;
    });
    setDraft("");
    setRevealed(false);
  };

  const handleGrade = (grade: CompositionGrade) => {
    if (!current) return;
    setGrade(current.id, grade);
    setGrades((prev) => ({ ...prev, [current.id]: grade }));
    setCounts(getGradeCounts());
    // 마지막이 아니면 다음 문제로
    if (index < total - 1) move(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-10 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            ← 메인
          </Link>
        </div>

        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            문장 써보기 (작문)
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            한국어 문장을 일본어로 써보고, 정답을 본 뒤 스스로 채점하세요. 전체 {items.length}개
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {GRADE_ORDER.map((g) => (
              <span
                key={g}
                className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", GRADE_STYLE[g])}
              >
                {GRADE_LABEL[g]} {counts[g]}
              </span>
            ))}
          </div>
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
        <div className="mb-4 flex flex-wrap gap-1.5">
          <FilterChip active={category === null} onClick={() => setCategory(null)}>
            전체 분류
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c.value} active={category === c.value} onClick={() => setCategory(c.value)}>
              {c.label}
            </FilterChip>
          ))}
        </div>

        {total === 0 || !current ? (
          <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle>항목 없음</CardTitle>
              <CardDescription>선택한 조건에 해당하는 문장이 없습니다.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {index + 1} / {total}
              </span>
              {currentGrade && (
                <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", GRADE_STYLE[currentGrade])}>
                  지난 채점: {GRADE_LABEL[currentGrade]}
                </span>
              )}
            </div>

            <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
              <CardHeader className="gap-1">
                <span className="text-xs text-muted-foreground">
                  Lv{current.level} · {COMPOSITION_CATEGORY_LABEL[current.category]}
                </span>
                <CardTitle className="break-keep text-xl font-bold leading-relaxed">
                  {current.korean}
                </CardTitle>
                {current.hint && (
                  <CardDescription className="pt-1">💡 힌트: {current.hint}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="여기에 일본어로 써보세요..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-lg outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />

                {!revealed ? (
                  <Button className="w-full" onClick={() => setRevealed(true)}>
                    정답 보기
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        베스트 답안
                      </p>
                      <p className="mt-1 break-keep text-lg font-semibold">{current.best}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{current.bestKana}</p>
                    </div>

                    {current.alternatives.length > 0 && (
                      <div className="rounded-lg border bg-muted/40 px-4 py-3">
                        <p className="text-xs font-medium text-muted-foreground">이것도 정답</p>
                        <ul className="mt-1 space-y-1">
                          {current.alternatives.map((alt, i) => (
                            <li key={i} className="break-keep text-base">
                              ・{alt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <p className="mb-1.5 text-center text-sm text-muted-foreground">
                        내 답과 비교해서 스스로 채점하세요
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {GRADE_ORDER.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleGrade(g)}
                            className={cn(
                              "rounded-lg border px-1 py-2 text-sm font-medium transition hover:opacity-80",
                              GRADE_STYLE[g],
                              currentGrade === g && "ring-2 ring-offset-1 ring-current"
                            )}
                          >
                            {GRADE_LABEL[g]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => move(-1)}
                    disabled={index === 0}
                  >
                    ← 이전
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => move(1)}
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
