"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  getKanaPool,
  getRandomKana,
  getWrongChoices,
  type Kana,
} from "@/data/kana";
import { saveQuizResult, type QuizResultItem } from "@/lib/storage";

const QUIZ_SIZE = 10;
const CHOICE_COUNT = 5;

type QuizStep = "quiz" | "result";

export default function QuizClient() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [step, setStep] = useState<QuizStep>("quiz");
  const [questions, setQuestions] = useState<Kana[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [answers, setAnswers] = useState<QuizResultItem[]>([]);
  const [resultItems, setResultItems] = useState<QuizResultItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const validTypes = ["hiragana", "katakana", "both", "dakuten", "youon", "dakuten-youon"] as const;
  const type = validTypes.includes(typeParam as (typeof validTypes)[number])
    ? (typeParam as (typeof validTypes)[number])
    : "both";

  const pool = useMemo(() => getKanaPool(type), [type]);
  const currentQuestion = questions[currentIndex];

  const startQuiz = useCallback(() => {
    const q = getRandomKana(pool, QUIZ_SIZE);
    setQuestions(q);
    setCurrentIndex(0);
    setAnswers([]);
    setResultItems([]);
    setStep("quiz");
    setSelected(null);
  }, [pool]);

  useEffect(() => {
    if (pool.length === 0) return;
    startQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 초기 퀴즈 1회만 시작
  }, [pool.length]);

  useEffect(() => {
    if (questions.length === 0) return;
    const q = questions[currentIndex];
    if (!q) return;
    const wrong = getWrongChoices(q.korean, pool, CHOICE_COUNT - 1);
    const all = [q.korean, ...wrong].sort(() => Math.random() - 0.5);
    setChoices(all);
    setSelected(null);
  }, [questions, currentIndex, pool]);

  const handleChoice = (choice: string) => {
    setSelected(choice);
  };

  const handleNext = () => {
    if (!currentQuestion || selected === null) return;
    const correct = selected === currentQuestion.korean;
    setAnswers((prev) => [
      ...prev,
      {
        char: currentQuestion.char,
        korean: currentQuestion.korean,
        correct,
        userAnswer: selected,
      },
    ]);
    if (currentIndex + 1 >= questions.length) {
      const finalAnswers: QuizResultItem[] = [
        ...answers,
        {
          char: currentQuestion.char,
          korean: currentQuestion.korean,
          correct,
          userAnswer: selected,
        },
      ];
      setResultItems(finalAnswers);
      saveQuizResult({
        timestamp: new Date().toISOString(),
        type,
        total: questions.length,
        correct: finalAnswers.filter((a) => a.correct).length,
        items: finalAnswers,
      });
      setStep("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  };

  if (pool.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>오류</CardTitle>
            <CardDescription>데이터를 불러올 수 없습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" className={buttonVariants()}>
              메인으로
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "result") {
    const correctCount = resultItems.filter((a) => a.correct).length;
    const total = resultItems.length;
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-lg">
          <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle>결과</CardTitle>
              <CardDescription>
                {correctCount} / {total} 맞음 (
                {total > 0 ? Math.round((correctCount / total) * 100) : 0}%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {resultItems.map((a, i) => (
                  <li
                    key={i}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                      a.correct
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                        : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
                    }`}
                  >
                    <span className="text-xl font-medium">{a.char}</span>
                    <span className="text-muted-foreground">
                      정답: {a.korean}
                      {!a.correct && ` (선택: ${a.userAnswer})`}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 pt-4">
                <Button onClick={startQuiz} className="flex-1">
                  다시 하기
                </Button>
                <Link
                  href="/"
                  className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                >
                  메인으로
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-muted-foreground">준비 중...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            ← 메인
          </Link>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-center text-4xl font-bold tracking-wide">
              {currentQuestion.char}
            </CardTitle>
            <CardDescription className="text-center">
              한글 발음을 고르세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {choices.map((choice) => (
              <Button
                key={choice}
                variant={selected === choice ? "default" : "outline"}
                size="lg"
                className="w-full justify-start text-lg"
                onClick={() => handleChoice(choice)}
              >
                {choice}
              </Button>
            ))}
            <Button
              className="mt-4 w-full"
              disabled={selected === null}
              onClick={handleNext}
            >
              다음
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
