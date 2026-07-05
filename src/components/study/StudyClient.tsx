"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, LayoutGrid, List, X, RotateCcw } from "lucide-react";
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
  type CardState,
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

const STATE_LABEL: Record<CardState, string> = {
  new: "새 카드",
  learning: "학습 중",
  review: "복습 중",
  mastered: "숙달",
};

const STATE_DOT: Record<CardState, string> = {
  new: "bg-slate-300 dark:bg-slate-600",
  learning: "bg-amber-400",
  review: "bg-sky-400",
  mastered: "bg-emerald-400",
};

type StudyFilter = "all" | "unstudied" | "studied";
const STUDY_FILTER_LABEL: Record<StudyFilter, string> = {
  all: "전체",
  unstudied: "미학습",
  studied: "학습함",
};

type ViewMode = "card" | "list";

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
  const [studyFilter, setStudyFilter] = useState<StudyFilter>("all");
  const [view, setView] = useState<ViewMode>("card");
  const [filterOpen, setFilterOpen] = useState(false);
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

  const progressFor = (id: string): CardProgress | undefined => progress[cardKey(deck, id)];

  const filtered = useMemo(
    () =>
      items.filter((it) => {
        if (level !== null && it.level !== level) return false;
        if (category !== null && it.category !== category) return false;
        const studied = Boolean(progress[cardKey(deck, it.id)]);
        if (studyFilter === "unstudied" && studied) return false;
        if (studyFilter === "studied" && !studied) return false;
        return true;
      }),
    [items, level, category, studyFilter, progress, deck]
  );

  // 필터가 바뀌면 첫 카드로
  useEffect(() => {
    setIndex(0);
    setHideMeaning(false);
  }, [level, category, studyFilter]);

  const total = filtered.length;
  const current = view === "card" ? filtered[Math.min(index, total - 1)] : undefined;

  const studiedTotal = items.filter((it) => progressFor(it.id)).length;

  const currentProgress = current
    ? progressFor(current.id) ?? newCard(cardKey(deck, current.id), DECK_TO_TYPE[deck], now)
    : null;

  const activeFilterCount =
    (level !== null ? 1 : 0) + (category !== null ? 1 : 0) + (studyFilter !== "all" ? 1 : 0);

  const resetFilters = () => {
    setLevel(null);
    setCategory(null);
    setStudyFilter("all");
  };

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
    setHideMeaning(false);
    if (studyFilter === "unstudied") {
      // 채점한 항목이 '미학습' 목록에서 빠지므로 같은 index가 곧 다음 항목이 됨.
      // 다만 마지막 항목이었으면 줄어든 목록 끝으로 index를 당겨준다.
      setIndex((i) => Math.max(0, Math.min(i, total - 2)));
    } else if (index < total - 1) {
      go(1);
    }
  };

  const openCardAt = (i: number) => {
    setIndex(i);
    setHideMeaning(false);
    setView("card");
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

        <header className="mb-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            전체 {items.length}개 · 학습 시작 {studiedTotal}개 · 조건 {total}개
          </p>
        </header>

        {/* 컨트롤 바: 필터 버튼 + 뷰 토글 */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition",
              activeFilterCount > 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-foreground hover:bg-muted"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            필터
            {activeFilterCount > 0 && (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
            <ViewToggle active={view === "card"} onClick={() => setView("card")}>
              <LayoutGrid className="h-4 w-4" />
              카드
            </ViewToggle>
            <ViewToggle active={view === "list"} onClick={() => setView("list")}>
              <List className="h-4 w-4" />
              리스트
            </ViewToggle>
          </div>
        </div>

        {/* 활성 필터 요약 (제거 가능한 칩) */}
        {activeFilterCount > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {level !== null && (
              <RemovableChip onRemove={() => setLevel(null)}>
                Lv{level} {STUDY_LEVEL_LABEL[level]}
              </RemovableChip>
            )}
            {category !== null && (
              <RemovableChip onRemove={() => setCategory(null)}>{category}</RemovableChip>
            )}
            {studyFilter !== "all" && (
              <RemovableChip onRemove={() => setStudyFilter("all")}>
                {STUDY_FILTER_LABEL[studyFilter]}만
              </RemovableChip>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" /> 초기화
            </button>
          </div>
        )}

        {total === 0 ? (
          <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle>항목 없음</CardTitle>
              <CardDescription>
                {studyFilter === "unstudied"
                  ? "이 조건은 다 학습했어요! 필터를 바꿔보세요."
                  : "선택한 조건에 해당하는 항목이 없습니다."}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : view === "list" ? (
          /* ===== 리스트 뷰 ===== */
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-slate-200/80 bg-background shadow-sm dark:border-slate-800">
            {filtered.map((it, i) => {
              const p = progressFor(it.id);
              const state: CardState = p?.state ?? "new";
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => openCardAt(i)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-muted/60"
                  >
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", STATE_DOT[state])} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="truncate text-base font-semibold">{it.front}</span>
                        <span className="shrink-0 truncate text-xs text-muted-foreground">
                          {it.reading}
                        </span>
                      </span>
                      <span className="truncate text-sm text-muted-foreground">{it.meaning}</span>
                    </span>
                    {p?.isLeech && (
                      <span className="shrink-0 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                        약점
                      </span>
                    )}
                    <span className="shrink-0 text-[10px] text-muted-foreground">Lv{it.level}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : current ? (
          /* ===== 카드 뷰 ===== */
          <>
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {Math.min(index, total - 1) + 1} / {total}
              </span>
              {currentProgress && progressFor(current.id) && (
                <span className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", STATE_DOT[currentProgress.state])} />
                  {STATE_LABEL[currentProgress.state]}
                </span>
              )}
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
                    {currentProgress.isLeech && "⚠ 약점 · "}
                    {currentProgress.lastGrade &&
                      `지난 채점: ${GRADE_LABEL[currentProgress.lastGrade]}`}
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
        ) : null}
      </div>

      {/* ===== 필터 바텀시트 ===== */}
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="필터">
        <FilterGroup label="레벨">
          <FilterChip active={level === null} onClick={() => setLevel(null)}>
            전체
          </FilterChip>
          {STUDY_LEVELS.map((lv) => (
            <FilterChip key={lv} active={level === lv} onClick={() => setLevel(lv)}>
              Lv{lv} {STUDY_LEVEL_LABEL[lv]}
            </FilterChip>
          ))}
        </FilterGroup>

        <FilterGroup label="학습 상태">
          {(Object.keys(STUDY_FILTER_LABEL) as StudyFilter[]).map((f) => (
            <FilterChip key={f} active={studyFilter === f} onClick={() => setStudyFilter(f)}>
              {STUDY_FILTER_LABEL[f]}
            </FilterChip>
          ))}
        </FilterGroup>

        {categories.length > 0 && (
          <FilterGroup label="분류">
            <FilterChip active={category === null} onClick={() => setCategory(null)}>
              전체
            </FilterChip>
            {categories.map((c) => (
              <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </FilterChip>
            ))}
          </FilterGroup>
        )}

        <div className="mt-2 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={resetFilters}>
            <RotateCcw className="mr-1.5 h-4 w-4" /> 초기화
          </Button>
          <Button className="flex-1" onClick={() => setFilterOpen(false)}>
            {total}개 보기
          </Button>
        </div>
      </FilterSheet>
    </main>
  );
}

// ===== 하위 컴포넌트 =====

function ViewToggle({
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
        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium transition",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
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
        "rounded-full border px-3 py-1.5 text-sm font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

function RemovableChip({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 py-1 pl-3 pr-1.5 text-xs font-medium text-primary">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-primary/20"
        aria-label="필터 제거"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in"
        onClick={onClose}
      />
      {/* panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg space-y-5 rounded-t-2xl border border-border bg-background p-5 shadow-xl animate-in slide-in-from-bottom sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
