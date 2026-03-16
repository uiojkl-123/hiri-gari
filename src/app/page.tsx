import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const linkButtonBase =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-transparent px-2.5 text-sm font-medium transition-all w-full";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-8 px-6 py-16">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            히라가나 · 가타카나
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            일본어 문자 암기 & 퀴즈
          </p>
        </header>

        <Card className="w-full border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>테스트 시작</CardTitle>
            <CardDescription>
              문자를 보고 한글 발음을 고르세요. 10문제 출제됩니다.
            </CardDescription>
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

        <Card className="w-full border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>탁점 · 요음(스테가나)</CardTitle>
            <CardDescription>
              탁점(゛), 반탁점(゜), 요음(ゃゅょ) 문자를 연습하세요.
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
              className={`${linkButtonBase} border-border bg-background hover:bg-muted text-sm`}
            >
              탁점 · 요음 표 보기
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full border-slate-200/80 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>표 보기</CardTitle>
            <CardDescription>
              히라가나·가타카나 전체 표를 확인하세요.
            </CardDescription>
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
