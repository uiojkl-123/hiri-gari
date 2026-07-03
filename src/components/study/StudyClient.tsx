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
  getLearnedIds,
  toggleLearned,
  type DeckId,
} from "@/lib/progress";

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
  const [learned, setLearned] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLearned(getLearnedIds(deck));
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
  const learnedInFilter = filtered.filter((it) => learned.has(it.id)).length;

  const handleToggle = () => {
    if (!current) return;
    const nowLearned = toggleLearned(deck, current.id);
    setLearned((prev) => {
      const next = new Set(prev);
      if (nowLearned) next.add(current.id);
      else next.delete(current.id);
      return next;
    });
  };

  const go = (delta: number) => {
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return 0;
      if (next >= total) return total - 1;
      return next;
    });
  };

  const isLearnedNow = current ? learned.has(current.id) : false;

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
            전체 {items.length}개 · 학습 완료 {learned.size}개
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
              <span>이 조건 학습 완료 {learnedInFilter}개</span>
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

                {isLearnedNow && (
                  <p className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    ✓ 학습 완료됨
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setHideMeaning((v) => !v)}>
                    {hideMeaning ? "뜻 보이기" : "뜻 가리기"}
                  </Button>
                  <Button
                    variant={isLearnedNow ? "outline" : "default"}
                    size="sm"
                    onClick={handleToggle}
                  >
                    {isLearnedNow ? "학습 완료 해제" : "학습 완료 ✓"}
                  </Button>
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
