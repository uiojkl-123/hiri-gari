"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HIRAGANA,
  KATAKANA,
  HIRAGANA_DAKUTEN,
  KATAKANA_DAKUTEN,
  HIRAGANA_YOUON,
  KATAKANA_YOUON,
} from "@/data/kana";

const ROW_LABELS = ["あ행", "か행", "さ행", "た행", "な행", "は행", "ま행", "や행", "ら행", "わ행"];
const COLS = 5;

function buildRows(
  kanaList: { char: string; korean: string }[],
  cols: number = COLS,
  maxRows?: number
) {
  const rows: { char: string; korean: string }[][] = [];
  const rowCount = maxRows ?? Math.ceil(kanaList.length / cols);
  for (let r = 0; r < rowCount; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i < kanaList.length) row.push(kanaList[i]);
    }
    if (row.length) rows.push(row);
  }
  return rows;
}

const hiraganaRows = buildRows(HIRAGANA);
const katakanaRows = buildRows(KATAKANA);
const hiraganaDakutenRows = buildRows(HIRAGANA_DAKUTEN);
const katakanaDakutenRows = buildRows(KATAKANA_DAKUTEN);
const hiraganaYouonRows = buildRows(HIRAGANA_YOUON, 3, 11);
const katakanaYouonRows = buildRows(KATAKANA_YOUON, 3, 11);

function TableSection({
  title,
  rows,
  showKorean,
  rowLabels,
  cols,
}: {
  title: string;
  rows: { char: string; korean: string }[][];
  showKorean: boolean;
  rowLabels?: string[];
  cols: number;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 dark:border-slate-800">
              {rowLabels ? (
                <TableHead className="w-20 bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400" />
              ) : null}
              {Array.from({ length: cols }, (_, i) => (
                <TableHead
                  key={i}
                  className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400"
                >
                  {i + 1}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, r) => (
              <TableRow
                key={r}
                className="border-slate-200 dark:border-slate-800"
              >
                {rowLabels && r < rowLabels.length && (
                  <TableCell className="w-20 bg-slate-50/80 text-xs text-slate-500 dark:bg-slate-800/30 dark:text-slate-400">
                    {rowLabels[r]}
                  </TableCell>
                )}
                {row.map((cell, c) => (
                  <TableCell key={c} className="text-center font-medium">
                    <span className="text-2xl">{cell.char}</span>
                    {showKorean && (
                      <span className="ml-1 block text-sm text-muted-foreground">
                        {cell.korean}
                      </span>
                    )}
                  </TableCell>
                ))}
                {row.length < cols &&
                  Array(cols - row.length)
                    .fill(0)
                    .map((_, i) => (
                      <TableCell key={`e-${i}`} className="text-muted-foreground/50">
                        —
                      </TableCell>
                    ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export default function ChartClient() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "basic";
  const [showKorean, setShowKorean] = useState(true);

  const isDakuten = mode === "dakuten";
  const isYouon = mode === "youon";
  const isBasic = !isDakuten && !isYouon;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              ← 메인
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="/chart"
              className={cn(
                "text-sm",
                isBasic ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              기본
            </Link>
            <Link
              href="/chart?mode=dakuten"
              className={cn(
                "text-sm",
                isDakuten ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              탁점
            </Link>
            <Link
              href="/chart?mode=youon"
              className={cn(
                "text-sm",
                isYouon ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              요음
            </Link>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={showKorean}
              onCheckedChange={(v) => setShowKorean(v === true)}
            />
            <span>한국 발음 표시</span>
          </label>
        </div>

        {isBasic && (
          <>
            <TableSection
              title="히라가나"
              rows={hiraganaRows}
              showKorean={showKorean}
              rowLabels={ROW_LABELS}
              cols={COLS}
            />
            <TableSection
              title="가타카나"
              rows={katakanaRows}
              showKorean={showKorean}
              rowLabels={ROW_LABELS}
              cols={COLS}
            />
          </>
        )}

        {isDakuten && (
          <>
            <TableSection
              title="탁점 · 반탁점 히라가나"
              rows={hiraganaDakutenRows}
              showKorean={showKorean}
              rowLabels={["が행", "ざ행", "だ행", "ば행", "ぱ행"]}
              cols={5}
            />
            <TableSection
              title="탁점 · 반탁점 가타카나"
              rows={katakanaDakutenRows}
              showKorean={showKorean}
              rowLabels={["ガ행", "ザ행", "ダ행", "バ행", "パ행"]}
              cols={5}
            />
          </>
        )}

        {isYouon && (
          <>
            <TableSection
              title="요음(拗音) 히라가나"
              rows={hiraganaYouonRows}
              showKorean={showKorean}
              cols={3}
            />
            <TableSection
              title="요음 가타카나"
              rows={katakanaYouonRows}
              showKorean={showKorean}
              cols={3}
            />
          </>
        )}
      </div>
    </main>
  );
}
