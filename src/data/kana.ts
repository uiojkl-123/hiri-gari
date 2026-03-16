export type KanaType = "hiragana" | "katakana";
export type QuizMode = "hiragana" | "katakana" | "both" | "dakuten" | "youon" | "dakuten-youon";

export interface Kana {
  char: string;
  korean: string;
  type: KanaType;
}

// 히라가나 기본 46자 (한글 발음)
export const HIRAGANA: Kana[] = [
  { char: "あ", korean: "아", type: "hiragana" },
  { char: "い", korean: "이", type: "hiragana" },
  { char: "う", korean: "우", type: "hiragana" },
  { char: "え", korean: "에", type: "hiragana" },
  { char: "お", korean: "오", type: "hiragana" },
  { char: "か", korean: "카", type: "hiragana" },
  { char: "き", korean: "키", type: "hiragana" },
  { char: "く", korean: "쿠", type: "hiragana" },
  { char: "け", korean: "케", type: "hiragana" },
  { char: "こ", korean: "코", type: "hiragana" },
  { char: "さ", korean: "사", type: "hiragana" },
  { char: "し", korean: "시", type: "hiragana" },
  { char: "す", korean: "스", type: "hiragana" },
  { char: "せ", korean: "세", type: "hiragana" },
  { char: "そ", korean: "소", type: "hiragana" },
  { char: "た", korean: "타", type: "hiragana" },
  { char: "ち", korean: "치", type: "hiragana" },
  { char: "つ", korean: "쓰", type: "hiragana" },
  { char: "て", korean: "테", type: "hiragana" },
  { char: "と", korean: "토", type: "hiragana" },
  { char: "な", korean: "나", type: "hiragana" },
  { char: "に", korean: "니", type: "hiragana" },
  { char: "ぬ", korean: "누", type: "hiragana" },
  { char: "ね", korean: "네", type: "hiragana" },
  { char: "の", korean: "노", type: "hiragana" },
  { char: "は", korean: "하", type: "hiragana" },
  { char: "ひ", korean: "히", type: "hiragana" },
  { char: "ふ", korean: "후", type: "hiragana" },
  { char: "へ", korean: "헤", type: "hiragana" },
  { char: "ほ", korean: "호", type: "hiragana" },
  { char: "ま", korean: "마", type: "hiragana" },
  { char: "み", korean: "미", type: "hiragana" },
  { char: "む", korean: "무", type: "hiragana" },
  { char: "め", korean: "메", type: "hiragana" },
  { char: "も", korean: "모", type: "hiragana" },
  { char: "や", korean: "야", type: "hiragana" },
  { char: "ゆ", korean: "유", type: "hiragana" },
  { char: "よ", korean: "요", type: "hiragana" },
  { char: "ら", korean: "라", type: "hiragana" },
  { char: "り", korean: "리", type: "hiragana" },
  { char: "る", korean: "루", type: "hiragana" },
  { char: "れ", korean: "레", type: "hiragana" },
  { char: "ろ", korean: "로", type: "hiragana" },
  { char: "わ", korean: "와", type: "hiragana" },
  { char: "を", korean: "오", type: "hiragana" },
  { char: "ん", korean: "응", type: "hiragana" },
];

// 가타카나 기본 46자
export const KATAKANA: Kana[] = [
  { char: "ア", korean: "아", type: "katakana" },
  { char: "イ", korean: "이", type: "katakana" },
  { char: "ウ", korean: "우", type: "katakana" },
  { char: "エ", korean: "에", type: "katakana" },
  { char: "オ", korean: "오", type: "katakana" },
  { char: "カ", korean: "카", type: "katakana" },
  { char: "キ", korean: "키", type: "katakana" },
  { char: "ク", korean: "쿠", type: "katakana" },
  { char: "ケ", korean: "케", type: "katakana" },
  { char: "コ", korean: "코", type: "katakana" },
  { char: "サ", korean: "사", type: "katakana" },
  { char: "シ", korean: "시", type: "katakana" },
  { char: "ス", korean: "스", type: "katakana" },
  { char: "セ", korean: "세", type: "katakana" },
  { char: "ソ", korean: "소", type: "katakana" },
  { char: "タ", korean: "타", type: "katakana" },
  { char: "チ", korean: "치", type: "katakana" },
  { char: "ツ", korean: "쓰", type: "katakana" },
  { char: "テ", korean: "테", type: "katakana" },
  { char: "ト", korean: "토", type: "katakana" },
  { char: "ナ", korean: "나", type: "katakana" },
  { char: "ニ", korean: "니", type: "katakana" },
  { char: "ヌ", korean: "누", type: "katakana" },
  { char: "ネ", korean: "네", type: "katakana" },
  { char: "ノ", korean: "노", type: "katakana" },
  { char: "ハ", korean: "하", type: "katakana" },
  { char: "ヒ", korean: "히", type: "katakana" },
  { char: "フ", korean: "후", type: "katakana" },
  { char: "ヘ", korean: "헤", type: "katakana" },
  { char: "ホ", korean: "호", type: "katakana" },
  { char: "マ", korean: "마", type: "katakana" },
  { char: "ミ", korean: "미", type: "katakana" },
  { char: "ム", korean: "무", type: "katakana" },
  { char: "メ", korean: "메", type: "katakana" },
  { char: "モ", korean: "모", type: "katakana" },
  { char: "ヤ", korean: "야", type: "katakana" },
  { char: "ユ", korean: "유", type: "katakana" },
  { char: "ヨ", korean: "요", type: "katakana" },
  { char: "ラ", korean: "라", type: "katakana" },
  { char: "リ", korean: "리", type: "katakana" },
  { char: "ル", korean: "루", type: "katakana" },
  { char: "レ", korean: "레", type: "katakana" },
  { char: "ロ", korean: "로", type: "katakana" },
  { char: "ワ", korean: "와", type: "katakana" },
  { char: "ヲ", korean: "오", type: "katakana" },
  { char: "ン", korean: "응", type: "katakana" },
];

// 탁점(濁点) · 반탁점(半濁点) - 히라가나
export const HIRAGANA_DAKUTEN: Kana[] = [
  { char: "が", korean: "가", type: "hiragana" },
  { char: "ぎ", korean: "기", type: "hiragana" },
  { char: "ぐ", korean: "구", type: "hiragana" },
  { char: "げ", korean: "게", type: "hiragana" },
  { char: "ご", korean: "고", type: "hiragana" },
  { char: "ざ", korean: "자", type: "hiragana" },
  { char: "じ", korean: "지", type: "hiragana" },
  { char: "ず", korean: "주", type: "hiragana" },
  { char: "ぜ", korean: "제", type: "hiragana" },
  { char: "ぞ", korean: "조", type: "hiragana" },
  { char: "だ", korean: "다", type: "hiragana" },
  { char: "ぢ", korean: "지", type: "hiragana" },
  { char: "づ", korean: "쓰", type: "hiragana" },
  { char: "で", korean: "데", type: "hiragana" },
  { char: "ど", korean: "도", type: "hiragana" },
  { char: "ば", korean: "바", type: "hiragana" },
  { char: "び", korean: "비", type: "hiragana" },
  { char: "ぶ", korean: "부", type: "hiragana" },
  { char: "べ", korean: "베", type: "hiragana" },
  { char: "ぼ", korean: "보", type: "hiragana" },
  { char: "ぱ", korean: "파", type: "hiragana" },
  { char: "ぴ", korean: "피", type: "hiragana" },
  { char: "ぷ", korean: "푸", type: "hiragana" },
  { char: "ぺ", korean: "페", type: "hiragana" },
  { char: "ぽ", korean: "포", type: "hiragana" },
];

// 탁점 · 반탁점 - 가타카나
export const KATAKANA_DAKUTEN: Kana[] = [
  { char: "ガ", korean: "가", type: "katakana" },
  { char: "ギ", korean: "기", type: "katakana" },
  { char: "グ", korean: "구", type: "katakana" },
  { char: "ゲ", korean: "게", type: "katakana" },
  { char: "ゴ", korean: "고", type: "katakana" },
  { char: "ザ", korean: "자", type: "katakana" },
  { char: "ジ", korean: "지", type: "katakana" },
  { char: "ズ", korean: "주", type: "katakana" },
  { char: "ゼ", korean: "제", type: "katakana" },
  { char: "ゾ", korean: "조", type: "katakana" },
  { char: "ダ", korean: "다", type: "katakana" },
  { char: "ヂ", korean: "지", type: "katakana" },
  { char: "ヅ", korean: "쓰", type: "katakana" },
  { char: "デ", korean: "데", type: "katakana" },
  { char: "ド", korean: "도", type: "katakana" },
  { char: "バ", korean: "바", type: "katakana" },
  { char: "ビ", korean: "비", type: "katakana" },
  { char: "ブ", korean: "부", type: "katakana" },
  { char: "ベ", korean: "베", type: "katakana" },
  { char: "ボ", korean: "보", type: "katakana" },
  { char: "パ", korean: "파", type: "katakana" },
  { char: "ピ", korean: "피", type: "katakana" },
  { char: "プ", korean: "푸", type: "katakana" },
  { char: "ペ", korean: "페", type: "katakana" },
  { char: "ポ", korean: "포", type: "katakana" },
];

// 요음(拗音) - 스테가나(작은 ゃゅょ) 히라가나
export const HIRAGANA_YOUON: Kana[] = [
  { char: "きゃ", korean: "캬", type: "hiragana" },
  { char: "きゅ", korean: "큐", type: "hiragana" },
  { char: "きょ", korean: "쿄", type: "hiragana" },
  { char: "しゃ", korean: "샤", type: "hiragana" },
  { char: "しゅ", korean: "슈", type: "hiragana" },
  { char: "しょ", korean: "쇼", type: "hiragana" },
  { char: "ちゃ", korean: "차", type: "hiragana" },
  { char: "ちゅ", korean: "추", type: "hiragana" },
  { char: "ちょ", korean: "초", type: "hiragana" },
  { char: "にゃ", korean: "냐", type: "hiragana" },
  { char: "にゅ", korean: "뉴", type: "hiragana" },
  { char: "にょ", korean: "뇨", type: "hiragana" },
  { char: "ひゃ", korean: "햐", type: "hiragana" },
  { char: "ひゅ", korean: "휴", type: "hiragana" },
  { char: "ひょ", korean: "효", type: "hiragana" },
  { char: "みゃ", korean: "먀", type: "hiragana" },
  { char: "みゅ", korean: "뮤", type: "hiragana" },
  { char: "みょ", korean: "묘", type: "hiragana" },
  { char: "りゃ", korean: "랴", type: "hiragana" },
  { char: "りゅ", korean: "류", type: "hiragana" },
  { char: "りょ", korean: "료", type: "hiragana" },
  { char: "ぎゃ", korean: "갸", type: "hiragana" },
  { char: "ぎゅ", korean: "규", type: "hiragana" },
  { char: "ぎょ", korean: "교", type: "hiragana" },
  { char: "じゃ", korean: "자", type: "hiragana" },
  { char: "じゅ", korean: "쥬", type: "hiragana" },
  { char: "じょ", korean: "조", type: "hiragana" },
  { char: "びゃ", korean: "뱌", type: "hiragana" },
  { char: "びゅ", korean: "뷰", type: "hiragana" },
  { char: "びょ", korean: "뵤", type: "hiragana" },
  { char: "ぴゃ", korean: "퍄", type: "hiragana" },
  { char: "ぴゅ", korean: "퓨", type: "hiragana" },
  { char: "ぴょ", korean: "표", type: "hiragana" },
];

// 요음 - 가타카나
export const KATAKANA_YOUON: Kana[] = [
  { char: "キャ", korean: "캬", type: "katakana" },
  { char: "キュ", korean: "큐", type: "katakana" },
  { char: "キョ", korean: "쿄", type: "katakana" },
  { char: "シャ", korean: "샤", type: "katakana" },
  { char: "シュ", korean: "슈", type: "katakana" },
  { char: "ショ", korean: "쇼", type: "katakana" },
  { char: "チャ", korean: "차", type: "katakana" },
  { char: "チュ", korean: "추", type: "katakana" },
  { char: "チョ", korean: "초", type: "katakana" },
  { char: "ニャ", korean: "냐", type: "katakana" },
  { char: "ニュ", korean: "뉴", type: "katakana" },
  { char: "ニョ", korean: "뇨", type: "katakana" },
  { char: "ヒャ", korean: "햐", type: "katakana" },
  { char: "ヒュ", korean: "휴", type: "katakana" },
  { char: "ヒョ", korean: "효", type: "katakana" },
  { char: "ミャ", korean: "먀", type: "katakana" },
  { char: "ミュ", korean: "뮤", type: "katakana" },
  { char: "ミョ", korean: "묘", type: "katakana" },
  { char: "リャ", korean: "랴", type: "katakana" },
  { char: "リュ", korean: "류", type: "katakana" },
  { char: "リョ", korean: "료", type: "katakana" },
  { char: "ギャ", korean: "갸", type: "katakana" },
  { char: "ギュ", korean: "규", type: "katakana" },
  { char: "ギョ", korean: "교", type: "katakana" },
  { char: "ジャ", korean: "자", type: "katakana" },
  { char: "ジュ", korean: "쥬", type: "katakana" },
  { char: "ジョ", korean: "조", type: "katakana" },
  { char: "ビャ", korean: "뱌", type: "katakana" },
  { char: "ビュ", korean: "뷰", type: "katakana" },
  { char: "ビョ", korean: "뵤", type: "katakana" },
  { char: "ピャ", korean: "퍄", type: "katakana" },
  { char: "ピュ", korean: "퓨", type: "katakana" },
  { char: "ピョ", korean: "표", type: "katakana" },
];

export function getKanaPool(type: QuizMode): Kana[] {
  if (type === "hiragana") return [...HIRAGANA];
  if (type === "katakana") return [...KATAKANA];
  if (type === "both") return [...HIRAGANA, ...KATAKANA];
  if (type === "dakuten") return [...HIRAGANA_DAKUTEN, ...KATAKANA_DAKUTEN];
  if (type === "youon") return [...HIRAGANA_YOUON, ...KATAKANA_YOUON];
  if (type === "dakuten-youon") return [...HIRAGANA_DAKUTEN, ...KATAKANA_DAKUTEN, ...HIRAGANA_YOUON, ...KATAKANA_YOUON];
  return [...HIRAGANA, ...KATAKANA];
}

export function getRandomKana(pool: Kana[], count: number): Kana[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function getWrongChoices(correctKorean: string, pool: Kana[], count: number): string[] {
  const others = pool
    .map((k) => k.korean)
    .filter((k) => k !== correctKorean);
  const unique = Array.from(new Set(others));
  const shuffled = unique.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
