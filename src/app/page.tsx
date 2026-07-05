import Link from "next/link";
import {
  Languages,
  BookOpen,
  ScrollText,
  MessageCircle,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VOCAB_COUNT } from "@/data/vocab";
import { KANJI_COUNT } from "@/data/kanji";
import { PHRASE_COUNT } from "@/data/phrases";
import { COMPOSITION_COUNT } from "@/data/compositions";
import TodayReviewCard from "@/components/study/TodayReviewCard";

interface Entry {
  href: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: string; // 아이콘 배경 색
}

const ENTRIES: Entry[] = [
  {
    href: "/kana",
    title: "문자",
    desc: "히라가나 · 가타카나",
    icon: Languages,
    accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    href: "/vocab",
    title: "단어 학습",
    desc: `${VOCAB_COUNT}개`,
    icon: BookOpen,
    accent: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    href: "/kanji",
    title: "한자 학습",
    desc: `${KANJI_COUNT}자`,
    icon: ScrollText,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    href: "/phrases",
    title: "회화 문장",
    desc: `${PHRASE_COUNT}개`,
    icon: MessageCircle,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/compose",
    title: "문장 써보기",
    desc: `작문 ${COMPOSITION_COUNT}문장`,
    icon: PenLine,
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12 sm:px-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            🌸 ひらがり
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            문자부터 작문까지, 내 속도로 익히는 일본어
          </p>
        </header>

        {/* 오늘의 복습 (SRS 메인 진입점) */}
        <TodayReviewCard />

        {/* 학습 진입점 */}
        <section>
          <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">학습하기</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ENTRIES.map((e) => (
              <EntryTile key={e.href} entry={e} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function EntryTile({ entry }: { entry: Entry }) {
  const { href, title, desc, icon: Icon, accent } = entry;
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800"
    >
      <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", accent)}>
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block font-semibold text-foreground">{title}</span>
        <span className="block text-sm text-muted-foreground">{desc}</span>
      </span>
    </Link>
  );
}
