"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, LayoutGrid, List, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import {
  loadStudyUi,
  saveStudyUi,
  type StudyFilter,
  type ViewMode,
} from "@/lib/study-ui";

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

const STUDY_FILTER_LABEL: Record<StudyFilter, string> = {
  all: "전체",
  unstudied: "미학습",
  studied: "학습함",
};

/** front 길이에 맞춰 카드 글자 크기 (한자 1자 ~ 긴 회화 문장까지) */
function frontSizeClass(text: string): string {
  const len = Array.from(text).length;
  if (len <= 2) return "text-7xl";
  if (len <= 6) return "text-6xl";
  if (len <= 12) return "text-5xl";
  if (len <= 20) return "text-3xl";
  return "text-2xl leading-relaxed";
}

export interface StudyItem {
  id: string;
  level: StudyLevel;
  category: string | null;
  front: string;
  reading: string;
  meaning: string;
  detail?: string[];
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
  const [hideReading, setHideReading] = useState(false);
  const [revealMeaning, setRevealMeaning] = useState(false);
  const [revealReading, setRevealReading] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [now] = useState(() => Date.now());
  const ready = useRef(false);

  useEffect(() => {
    const saved = loadStudyUi(deck);
    if (saved) {
      if (saved.level !== undefined) setLevel(saved.level);
      if (saved.category !== undefined) setCategory(saved.category);
      if (saved.studyFilter) setStudyFilter(saved.studyFilter);
      if (saved.view) setView(saved.view);
      if (typeof saved.index === "number") setIndex(saved.index);
      if (typeof saved.hideMeaning === "boolean") setHideMeaning(saved.hideMeaning);
      if (typeof saved.hideReading === "boolean") setHideReading(saved.hideReading);
    }
    setProgress(getAllProgress());
    ready.current = true;
  }, [deck]);

  useEffect(() => {
    if (!ready.current) return;
    saveStudyUi(deck, { level, category, studyFilter, view, index, hideMeaning, hideReading });
  }, [deck, level, category, studyFilter, view, index, hideMeaning, hideReading]);

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

  const total = filtered.length;
  const current = view === "card" ? filtered[Math.min(index, total - 1)] : undefined;
  const studiedTotal = items.filter((it) => progressFor(it.id)).length;

  const currentProgress = current
    ? progressFor(current.id) ?? newCard(cardKey(deck, current.id), DECK_TO_TYPE[deck], now)
    : null;

  const activeFilterCount =
    (level !== null ? 1 : 0) + (category !== null ? 1 : 0) + (studyFilter !== "all" ? 1 : 0);

  const resetReveals = () => {
    setRevealMeaning(false);
    setRevealReading(false);
  };

  const changeLevel = (v: StudyLevel | null) => { setLevel(v); setIndex(0); resetReveals(); };
  const changeCategory = (v: string | null) => { setCategory(v); setIndex(0); resetReveals(); };
  const changeStudyFilter = (v: StudyFilter) => { setStudyFilter(v); setIndex(0); resetReveals(); };
  const resetFilters = () => { setLevel(null); setCategory(null); setStudyFilter("all"); setIndex(0); resetReveals(); };

  const go = (delta: number) => {
    setIndex((i) => Math.min(Math.max(i + delta, 0), total - 1));
    resetReveals();
  };

  const handleGrade = (grade: Grade) => {
    if (!current) return;
    const updated = gradeCard(deck, current.id, grade);
    setProgress((prev) => ({ ...prev, [updated.id]: updated }));
    resetReveals();
    if (studyFilter === "unstudied") {
      setIndex((i) => Math.max(0, Math.min(i, total - 2)));
    } else if (index < total - 1) {
      setIndex((i) => i + 1);
    }
  };

  const openCardAt = (i: number) => { setIndex(i); resetReveals(); setView("card"); };

  const meaningHidden = hideMeaning && !revealMeaning;
  const readingHidden = hideReading && !revealReading;
  const showBottomBar = view === "card" && total > 0 && !!current;

  return (
    <main className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* 슬림 앱바 */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-3 py-2 backdrop-blur">
        <Link
          href="/"
          className="inline-flex h-8 items-center rounded-md px-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
        >
          ← 메인
        </Link>
        <h1 className="truncate text-sm font-semibold text-foreground">{title}</h1>
        <Link
          href={testHref}
          className="inline-flex h-8 items-center rounded-md px-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
        >
          시험 →
        </Link>
      </header>

      {/* 컨트롤 */}
      <div className="mx-auto w-full max-w-2xl px-4 pt-3">
        <div className="flex items-center justify-between gap-2">
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

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {total > 0 ? `${Math.min(index, total - 1) + 1}/${total}` : `0/${total}`}
            </span>
            <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
              <ViewToggle active={view === "card"} onClick={() => setView("card")}>
                <LayoutGrid className="h-4 w-4" />
              </ViewToggle>
              <ViewToggle active={view === "list"} onClick={() => setView("list")}>
                <List className="h-4 w-4" />
              </ViewToggle>
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {level !== null && (
              <RemovableChip onRemove={() => changeLevel(null)}>
                Lv{level} {STUDY_LEVEL_LABEL[level]}
              </RemovableChip>
            )}
            {category !== null && (
              <RemovableChip onRemove={() => changeCategory(null)}>{category}</RemovableChip>
            )}
            {studyFilter !== "all" && (
              <RemovableChip onRemove={() => changeStudyFilter("all")}>
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

        {/* 리스트 뷰: 가리기 토글을 여기에 (카드 뷰는 하단 바) */}
        {view === "list" && total > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">가리기</span>
            <ToggleChip active={hideMeaning} onClick={() => setHideMeaning((v) => !v)}>뜻</ToggleChip>
            <ToggleChip active={hideReading} onClick={() => setHideReading((v) => !v)}>발음</ToggleChip>
          </div>
        )}
      </div>

      {/* 콘텐츠 (화면 채움) */}
      <div
        className={cn(
          "mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-3",
          showBottomBar ? "pb-40" : "pb-8"
        )}
      >
        {total === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-semibold">항목 없음</p>
            <p className="text-sm text-muted-foreground">
              {studyFilter === "unstudied"
                ? "이 조건은 다 학습했어요! 필터를 바꿔보세요."
                : "선택한 조건에 해당하는 항목이 없습니다."}
            </p>
          </div>
        ) : view === "list" ? (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-slate-200/80 bg-background shadow-sm dark:border-slate-800">
            {filtered.map((it, i) => {
              const p = progressFor(it.id);
              const state: CardState = p?.state ?? "new";
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => openCardAt(i)}
                    className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition hover:bg-muted/60"
                  >
                    <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", STATE_DOT[state])} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-semibold">{it.front}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        <span className={cn(hideReading && "select-none blur-[3px]")}>{it.reading}</span>
                        {it.reading !== it.meaning && (
                          <>
                            {" · "}
                            <span className={cn(hideMeaning && "select-none blur-[3px]")}>{it.meaning}</span>
                          </>
                        )}
                      </span>
                    </span>
                    {p?.isLeech && (
                      <span className="shrink-0 self-center rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                        약점
                      </span>
                    )}
                    <span className="shrink-0 self-center text-[10px] text-muted-foreground">Lv{it.level}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : current ? (
          <div className="flex flex-1 flex-col">
            {/* 중앙: front/reading/meaning 이 화면을 채움 */}
            <div className="flex flex-1 flex-col items-center justify-center gap-5 py-4 text-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {current.category && <span>Lv{current.level} · {current.category}</span>}
                {currentProgress && progressFor(current.id) && (
                  <span className="flex items-center gap-1">
                    <span className={cn("h-2 w-2 rounded-full", STATE_DOT[currentProgress.state])} />
                    {STATE_LABEL[currentProgress.state]}
                  </span>
                )}
              </div>

              <p className={cn("break-keep font-bold tracking-wide", frontSizeClass(current.front))}>
                {current.front}
              </p>

              <button
                type="button"
                onClick={() => hideReading && setRevealReading((v) => !v)}
                className={cn(
                  "text-lg text-muted-foreground transition",
                  readingHidden && "select-none blur-sm",
                  hideReading && "cursor-pointer"
                )}
              >
                {current.reading}
              </button>

              <button
                type="button"
                onClick={() => hideMeaning && setRevealMeaning((v) => !v)}
                className={cn(
                  "w-full max-w-md rounded-xl border bg-muted/40 px-4 py-4 text-xl font-medium transition",
                  meaningHidden && "select-none blur-sm",
                  hideMeaning && "cursor-pointer"
                )}
              >
                {current.meaning}
              </button>

              {current.detail && current.detail.length > 0 && (
                <ul
                  className={cn(
                    "space-y-1 text-sm text-muted-foreground transition",
                    meaningHidden && "select-none blur-sm"
                  )}
                >
                  {current.detail.map((d, i) => (
                    <li key={i} className="break-keep">{d}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* 채점 (색 없이 작게) */}
            <div className="grid grid-cols-4 gap-1.5">
              {GRADE_ORDER.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGrade(g)}
                  className="flex flex-col items-center gap-0.5 rounded-md border border-border bg-background py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <span>{GRADE_LABEL[g]}</span>
                  {currentProgress && (
                    <span className="text-[10px] opacity-60">{previewInterval(currentProgress, g, now)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* 하단 고정 바: 가리기 + 이전/다음 */}
      {showBottomBar && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 pb-[calc(0.625rem+env(safe-area-inset-bottom))] pt-2.5">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">가리기</span>
              <ToggleChip active={hideMeaning} onClick={() => { setHideMeaning((v) => !v); setRevealMeaning(false); }}>뜻</ToggleChip>
              <ToggleChip active={hideReading} onClick={() => { setHideReading((v) => !v); setRevealReading(false); }}>발음</ToggleChip>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-14 flex-1 text-base"
                onClick={() => go(-1)}
                disabled={index === 0}
              >
                ← 이전
              </Button>
              <Button
                className="h-14 flex-1 text-base"
                onClick={() => go(1)}
                disabled={index >= total - 1}
              >
                다음 →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 필터 바텀시트 */}
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="필터">
        <FilterGroup label="레벨">
          <FilterChip active={level === null} onClick={() => changeLevel(null)}>전체</FilterChip>
          {STUDY_LEVELS.map((lv) => (
            <FilterChip key={lv} active={level === lv} onClick={() => changeLevel(lv)}>
              Lv{lv} {STUDY_LEVEL_LABEL[lv]}
            </FilterChip>
          ))}
        </FilterGroup>

        <FilterGroup label="학습 상태">
          {(Object.keys(STUDY_FILTER_LABEL) as StudyFilter[]).map((f) => (
            <FilterChip key={f} active={studyFilter === f} onClick={() => changeStudyFilter(f)}>
              {STUDY_FILTER_LABEL[f]}
            </FilterChip>
          ))}
        </FilterGroup>

        {categories.length > 0 && (
          <FilterGroup label="분류">
            <FilterChip active={category === null} onClick={() => changeCategory(null)}>전체</FilterChip>
            {categories.map((c) => (
              <FilterChip key={c} active={category === c} onClick={() => changeCategory(c)}>{c}</FilterChip>
            ))}
          </FilterGroup>
        )}

        <div className="mt-2 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={resetFilters}>
            <RotateCcw className="mr-1.5 h-4 w-4" /> 초기화
          </Button>
          <Button className="flex-1" onClick={() => setFilterOpen(false)}>{total}개 보기</Button>
        </div>
      </FilterSheet>
    </main>
  );
}

// ===== 하위 컴포넌트 =====

function ViewToggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-foreground/30 bg-foreground/10 text-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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

function RemovableChip({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 py-1 pl-3 pr-1.5 text-xs font-medium text-primary">
      {children}
      <button type="button" onClick={onRemove} className="rounded-full p-0.5 hover:bg-primary/20" aria-label="필터 제거">
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg space-y-5 rounded-t-2xl border border-border bg-background p-5 shadow-xl animate-in slide-in-from-bottom sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="닫기">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
