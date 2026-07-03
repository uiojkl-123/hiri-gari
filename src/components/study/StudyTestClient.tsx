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
import type { DeckId } from "@/lib/progress";
import {
  DECK_LABEL,
  buildWrongChoices,
  getLearnedTestItems,
  pickRandom,
  saveStudyTestResult,
  shuffle,
  type StudyTestItem,
  type StudyTestResultItem,
} from "@/lib/study-test";

const QUIZ_SIZE = 10;
const CHOICE_COUNT = 5;
const MIN_LEARNED = 5;

interface Question extends StudyTestItem {
  choices: string[];
}

type Step = "loading" | "notEnough" | "quiz" | "result";

interface StudyTestClientProps {
  deck: DeckId;
  studyHref: string;
  /** 오답 보기 보충용 — 해당 덱 전체 뜻 목록 */
  allAnswers: string[];
}

export default function StudyTestClient({ deck, studyHref, allAnswers }: StudyTestClientProps) {
  const [step, setStep] = useState<Step>("loading");
  const [learnedCount, setLearnedCount] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<StudyTestResultItem[]>([]);
  const [resultItems, setResultItems] = useState<StudyTestResultItem[]>([]);

  const buildQuestions = useCallback(() => {
    const learned = getLearnedTestItems(deck);
    setLearnedCount(learned.length);
    if (learned.length < MIN_LEARNED) {
      setStep("notEnough");
      return;
    }
    const learnedAnswers = learned.map((it) => it.answer);
    const picked = pickRandom(learned, QUIZ_SIZE);
    const qs: Question[] = picked.map((it) => {
      const wrong = buildWrongChoices(it.answer, learnedAnswers, allAnswers, CHOICE_COUNT - 1);
      return { ...it, choices: shuffle([it.answer, ...wrong]) };
    });
    setQuestions(qs);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setResultItems([]);
    setStep("quiz");
  }, [deck, allAnswers]);

  useEffect(() => {
    buildQuestions();
  }, [buildQuestions]);

  const current = questions[index];

  const handleNext = () => {
    if (!current || selected === null) return;
    const correct = selected === current.answer;
    const item: StudyTestResultItem = {
      id: current.id,
      prompt: current.prompt,
      answer: current.answer,
      userAnswer: selected,
      correct,
    };
    const nextAnswers = [...answers, item];
    if (index + 1 >= questions.length) {
      setResultItems(nextAnswers);
      saveStudyTestResult({
        timestamp: new Date().toISOString(),
        deck,
        total: questions.length,
        correct: nextAnswers.filter((a) => a.correct).length,
        items: nextAnswers,
      });
      setStep("result");
    } else {
      setAnswers(nextAnswers);
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const deckLabel = DECK_LABEL[deck];

  if (step === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">준비 중...</p>
      </main>
    );
  }

  if (step === "notEnough") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-lg">
          <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle>학습 완료 항목이 부족해요</CardTitle>
              <CardDescription>
                시험을 보려면 {deckLabel} 학습 완료가 최소 {MIN_LEARNED}개 필요합니다. (현재{" "}
                {learnedCount}개)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link href={studyHref} className={cn(buttonVariants(), "flex-1")}>
                {deckLabel} 학습하러 가기
              </Link>
              <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                메인
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (step === "result") {
    const correctCount = resultItems.filter((a) => a.correct).length;
    const totalCount = resultItems.length;
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-lg">
          <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle>{deckLabel} 시험 결과</CardTitle>
              <CardDescription>
                {correctCount} / {totalCount} 맞음 (
                {totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0}%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {resultItems.map((a, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm",
                      a.correct
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                        : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
                    )}
                  >
                    <span className="break-keep font-medium">{a.prompt}</span>
                    <span className="shrink-0 text-right text-muted-foreground">
                      {a.answer}
                      {!a.correct && ` (선택: ${a.userAnswer})`}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 pt-2">
                <Button onClick={buildQuestions} className="flex-1">
                  다시 하기
                </Button>
                <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                  메인
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!current) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">준비 중...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <Link href={studyHref} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            ← 학습으로
          </Link>
          <span className="text-sm text-muted-foreground">
            {index + 1} / {questions.length}
          </span>
        </div>
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle className="break-keep text-center text-3xl font-bold tracking-wide">
              {current.prompt}
            </CardTitle>
            <CardDescription className="text-center">뜻을 고르세요.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {current.choices.map((choice) => (
              <Button
                key={choice}
                variant={selected === choice ? "default" : "outline"}
                size="lg"
                className="h-auto min-h-11 w-full justify-start whitespace-normal break-keep py-2 text-left text-base"
                onClick={() => setSelected(choice)}
              >
                {choice}
              </Button>
            ))}
            <Button className="mt-4 w-full" disabled={selected === null} onClick={handleNext}>
              {index + 1 >= questions.length ? "제출" : "다음"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
