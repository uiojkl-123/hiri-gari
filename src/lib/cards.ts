// 통합 카드 레지스트리 — vocab/kanji/phrase 를 하나의 SRS 카드 모델로 묶는다.
// SRS 엔진(srs.ts)과 저장소(srs-store.ts)는 덱의 세부 구조를 몰라도 되게,
// 여기서 표시용 필드(front/reading/meaning/detail)로 평탄화한다.

import type { CardType } from "./srs";
import type { DeckId } from "./progress";
import { VOCAB, VOCAB_CATEGORY_LABEL, type StudyLevel } from "@/data/vocab";
import { KANJI } from "@/data/kanji";
import { PHRASES, PHRASE_CATEGORY_LABEL } from "@/data/phrases";

export interface StudyCard {
  key: string; // SRS 저장 키 ("word:v-0001")
  deck: DeckId; // 기존 진도/시험 호환용
  itemId: string; // 원본 데이터 id
  type: CardType;
  level: StudyLevel;
  category: string | null;
  front: string; // 크게 보여줄 일본어
  reading: string; // 읽기
  meaning: string; // 뜻
  detail?: string[]; // 부가 정보(한자 음/훈, 예시 등)
}

/** 덱 ↔ 카드 타입 매핑 */
export const DECK_TO_TYPE: Record<DeckId, CardType> = {
  vocab: "word",
  kanji: "kanji",
  phrase: "sentence",
};

export function cardKey(deck: DeckId, itemId: string): string {
  return `${DECK_TO_TYPE[deck]}:${itemId}`;
}

const vocabCards: StudyCard[] = VOCAB.map((v) => ({
  key: cardKey("vocab", v.id),
  deck: "vocab",
  itemId: v.id,
  type: "word",
  level: v.level,
  category: VOCAB_CATEGORY_LABEL[v.category],
  front: v.word,
  reading: v.kana,
  meaning: v.korean,
}));

const kanjiCards: StudyCard[] = KANJI.map((k) => ({
  key: cardKey("kanji", k.id),
  deck: "kanji",
  itemId: k.id,
  type: "kanji",
  level: k.level,
  category: `한국음 ${k.korean}`,
  front: k.char,
  reading: `${k.onyomi} · ${k.kunyomi}`,
  meaning: k.meaning,
  detail: [`한국 한자음: ${k.korean}`, ...k.examples],
}));

const phraseCards: StudyCard[] = PHRASES.map((p) => ({
  key: cardKey("phrase", p.id),
  deck: "phrase",
  itemId: p.id,
  type: "sentence",
  level: p.level,
  category: PHRASE_CATEGORY_LABEL[p.category],
  front: p.jp,
  reading: p.kana,
  meaning: p.korean,
}));

/** 전체 카드 */
export const ALL_CARDS: StudyCard[] = [...vocabCards, ...kanjiCards, ...phraseCards];

/** 키 → 카드 조회 맵 */
const CARD_BY_KEY = new Map(ALL_CARDS.map((c) => [c.key, c]));

export function getCardByKey(key: string): StudyCard | undefined {
  return CARD_BY_KEY.get(key);
}

export function getDeckCards(deck: DeckId): StudyCard[] {
  return ALL_CARDS.filter((c) => c.deck === deck);
}

export const DECK_LABEL: Record<DeckId, string> = {
  vocab: "단어",
  kanji: "한자",
  phrase: "회화",
};
