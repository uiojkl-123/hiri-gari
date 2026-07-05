import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const linkButtonBase =
  "inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-transparent px-3 text-sm font-medium transition-all w-full";

export default function KanaHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-10 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted"
          >
            ← 메인
          </Link>
        </div>

        <header>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            히라가나 · 가타카나
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            일본어의 첫 관문. 문자를 보고 발음을 맞히는 퀴즈로 떼세요.
          </p>
        </header>

        {/* 기본 테스트 */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>테스트</CardTitle>
            <CardDescription>문자를 보고 한글 발음을 고르세요. 10문제 출제.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link
              href="/test?type=hiragana"
              className={`${linkButtonBase} bg-primary text-primary-foreground hover:opacity-90`}
            >
              히라가나
            </Link>
            <Link
              href="/test?type=katakana"
              className={`${linkButtonBase} bg-secondary text-secondary-foreground hover:opacity-90`}
            >
              가타카나
            </Link>
            <Link
              href="/test?type=both"
              className={`${linkButtonBase} border-border bg-background hover:bg-muted`}
            >
              둘 다
            </Link>
          </CardContent>
        </Card>

        {/* 탁점 · 요음 */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>탁점 · 요음 (스테가나)</CardTitle>
            <CardDescription>
              탁점(゛)·반탁점(゜)·요음(ゃゅょ)까지 한 단계 더.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link
              href="/test?type=dakuten"
              className={`${linkButtonBase} bg-primary text-primary-foreground hover:opacity-90`}
            >
              탁점 · 반탁점 테스트
            </Link>
            <Link
              href="/test?type=youon"
              className={`${linkButtonBase} bg-secondary text-secondary-foreground hover:opacity-90`}
            >
              요음(스테가나) 테스트
            </Link>
            <Link
              href="/test?type=dakuten-youon"
              className={`${linkButtonBase} border-border bg-background hover:bg-muted`}
            >
              탁점 + 요음 둘 다
            </Link>
            <Link
              href="/chart?mode=dakuten"
              className={`${linkButtonBase} border-border bg-background hover:bg-muted`}
            >
              탁점 · 요음 표 보기
            </Link>
          </CardContent>
        </Card>

        {/* 표 보기 */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>표 보기</CardTitle>
            <CardDescription>헷갈릴 땐 50음도 전체를 한눈에.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/chart"
              className={`${linkButtonBase} border-border bg-background hover:bg-muted`}
            >
              히라가나 · 가타카나 표 보기
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
