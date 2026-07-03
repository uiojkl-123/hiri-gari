import type { StudyLevel } from "./vocab";

export type PhraseCategory =
  | "greeting" // 인사
  | "daily" // 일상
  | "restaurant" // 식당
  | "shopping" // 쇼핑
  | "travel" // 여행
  | "business" // 비즈니스
  | "emergency" // 긴급
  | "smalltalk"; // 잡담

export const PHRASE_CATEGORY_LABEL: Record<PhraseCategory, string> = {
  greeting: "인사",
  daily: "일상",
  restaurant: "식당",
  shopping: "쇼핑",
  travel: "여행",
  business: "비즈니스",
  emergency: "긴급",
  smalltalk: "잡담",
};

export interface Phrase {
  id: string;
  jp: string; // 일본어 문장
  kana: string; // 읽기(후리가나)
  korean: string; // 뜻
  level: StudyLevel;
  category: PhraseCategory;
}

// prettier-ignore
export const PHRASES: Phrase[] = [
  // ===== 인사 =====
  { id: "p-0001", jp: "はじめまして。", kana: "はじめまして。", korean: "처음 뵙겠습니다.", level: 1, category: "greeting" },
  { id: "p-0002", jp: "よろしくお願いします。", kana: "よろしくおねがいします。", korean: "잘 부탁드립니다.", level: 1, category: "greeting" },
  { id: "p-0003", jp: "お元気ですか。", kana: "おげんきですか。", korean: "잘 지내세요?", level: 1, category: "greeting" },
  { id: "p-0004", jp: "おかげさまで元気です。", kana: "おかげさまでげんきです。", korean: "덕분에 잘 지냅니다.", level: 2, category: "greeting" },
  { id: "p-0005", jp: "お久しぶりです。", kana: "おひさしぶりです。", korean: "오랜만입니다.", level: 2, category: "greeting" },
  { id: "p-0006", jp: "また会いましょう。", kana: "またあいましょう。", korean: "또 만나요.", level: 1, category: "greeting" },
  { id: "p-0007", jp: "行ってきます。", kana: "いってきます。", korean: "다녀오겠습니다.", level: 1, category: "greeting" },
  { id: "p-0008", jp: "ただいま。", kana: "ただいま。", korean: "다녀왔습니다.", level: 1, category: "greeting" },
  { id: "p-0009", jp: "お疲れ様でした。", kana: "おつかれさまでした。", korean: "수고하셨습니다.", level: 2, category: "greeting" },
  { id: "p-0010", jp: "お世話になっております。", kana: "おせわになっております。", korean: "신세를 지고 있습니다. (비즈니스 인사)", level: 3, category: "greeting" },
  { id: "p-0011", jp: "お先に失礼します。", kana: "おさきにしつれいします。", korean: "먼저 실례하겠습니다.", level: 3, category: "greeting" },
  { id: "p-0012", jp: "気をつけて。", kana: "きをつけて。", korean: "조심히 가.", level: 1, category: "greeting" },

  // ===== 일상 =====
  { id: "p-0013", jp: "名前は何ですか。", kana: "なまえはなんですか。", korean: "이름이 뭐예요?", level: 1, category: "daily" },
  { id: "p-0014", jp: "私は韓国人です。", kana: "わたしはかんこくじんです。", korean: "저는 한국인입니다.", level: 1, category: "daily" },
  { id: "p-0015", jp: "日本語が少し分かります。", kana: "にほんごがすこしわかります。", korean: "일본어를 조금 압니다.", level: 2, category: "daily" },
  { id: "p-0016", jp: "もう一度お願いします。", kana: "もういちどおねがいします。", korean: "한 번 더 말씀해 주세요.", level: 2, category: "daily" },
  { id: "p-0017", jp: "ゆっくり話してください。", kana: "ゆっくりはなしてください。", korean: "천천히 말해 주세요.", level: 2, category: "daily" },
  { id: "p-0018", jp: "分かりました。", kana: "わかりました。", korean: "알겠습니다.", level: 1, category: "daily" },
  { id: "p-0019", jp: "よく分かりません。", kana: "よくわかりません。", korean: "잘 모르겠습니다.", level: 1, category: "daily" },
  { id: "p-0020", jp: "大丈夫です。", kana: "だいじょうぶです。", korean: "괜찮습니다.", level: 1, category: "daily" },
  { id: "p-0021", jp: "ちょっと待ってください。", kana: "ちょっとまってください。", korean: "잠깐만 기다려 주세요.", level: 1, category: "daily" },
  { id: "p-0022", jp: "何時ですか。", kana: "なんじですか。", korean: "몇 시예요?", level: 1, category: "daily" },
  { id: "p-0023", jp: "今日はいい天気ですね。", kana: "きょうはいいてんきですね。", korean: "오늘은 날씨가 좋네요.", level: 2, category: "daily" },
  { id: "p-0024", jp: "手伝ってもらえますか。", kana: "てつだってもらえますか。", korean: "도와주실 수 있나요?", level: 3, category: "daily" },
  { id: "p-0025", jp: "写真を撮ってもいいですか。", kana: "しゃしんをとってもいいですか。", korean: "사진을 찍어도 될까요?", level: 3, category: "daily" },
  { id: "p-0026", jp: "トイレはどこですか。", kana: "トイレはどこですか。", korean: "화장실은 어디예요?", level: 1, category: "daily" },
  { id: "p-0027", jp: "電話番号を教えてください。", kana: "でんわばんごうをおしえてください。", korean: "전화번호를 알려 주세요.", level: 2, category: "daily" },
  { id: "p-0028", jp: "また連絡します。", kana: "またれんらくします。", korean: "다시 연락할게요.", level: 2, category: "daily" },

  // ===== 식당 =====
  { id: "p-0029", jp: "メニューをください。", kana: "メニューをください。", korean: "메뉴판 주세요.", level: 1, category: "restaurant" },
  { id: "p-0030", jp: "おすすめは何ですか。", kana: "おすすめはなんですか。", korean: "추천 메뉴는 뭐예요?", level: 2, category: "restaurant" },
  { id: "p-0031", jp: "これをください。", kana: "これをください。", korean: "이거 주세요.", level: 1, category: "restaurant" },
  { id: "p-0032", jp: "水をもう一杯ください。", kana: "みずをもういっぱいください。", korean: "물 한 잔 더 주세요.", level: 2, category: "restaurant" },
  { id: "p-0033", jp: "お会計をお願いします。", kana: "おかいけいをおねがいします。", korean: "계산해 주세요.", level: 2, category: "restaurant" },
  { id: "p-0034", jp: "とても美味しかったです。", kana: "とてもおいしかったです。", korean: "정말 맛있었어요.", level: 2, category: "restaurant" },
  { id: "p-0035", jp: "辛いものは食べられません。", kana: "からいものはたべられません。", korean: "매운 건 못 먹어요.", level: 3, category: "restaurant" },
  { id: "p-0036", jp: "アレルギーがあります。", kana: "アレルギーがあります。", korean: "알레르기가 있어요.", level: 3, category: "restaurant" },
  { id: "p-0037", jp: "持ち帰りできますか。", kana: "もちかえりできますか。", korean: "포장 되나요?", level: 3, category: "restaurant" },
  { id: "p-0038", jp: "予約したいのですが。", kana: "よやくしたいのですが。", korean: "예약하고 싶은데요.", level: 3, category: "restaurant" },
  { id: "p-0039", jp: "いただきます。", kana: "いただきます。", korean: "잘 먹겠습니다.", level: 1, category: "restaurant" },
  { id: "p-0040", jp: "ごちそうさまでした。", kana: "ごちそうさまでした。", korean: "잘 먹었습니다.", level: 1, category: "restaurant" },

  // ===== 쇼핑 =====
  { id: "p-0041", jp: "いくらですか。", kana: "いくらですか。", korean: "얼마예요?", level: 1, category: "shopping" },
  { id: "p-0042", jp: "これを試着してもいいですか。", kana: "これをしちゃくしてもいいですか。", korean: "이거 입어봐도 될까요?", level: 3, category: "shopping" },
  { id: "p-0043", jp: "もう少し安くなりませんか。", kana: "もうすこしやすくなりませんか。", korean: "조금 더 싸게 안 될까요?", level: 3, category: "shopping" },
  { id: "p-0044", jp: "別の色はありますか。", kana: "べつのいろはありますか。", korean: "다른 색깔 있나요?", level: 2, category: "shopping" },
  { id: "p-0045", jp: "カードで払えますか。", kana: "カードではらえますか。", korean: "카드로 낼 수 있나요?", level: 2, category: "shopping" },
  { id: "p-0046", jp: "袋をください。", kana: "ふくろをください。", korean: "봉투 주세요.", level: 1, category: "shopping" },
  { id: "p-0047", jp: "これを見せてください。", kana: "これをみせてください。", korean: "이거 보여 주세요.", level: 1, category: "shopping" },
  { id: "p-0048", jp: "返品できますか。", kana: "へんぴんできますか。", korean: "반품 되나요?", level: 3, category: "shopping" },
  { id: "p-0049", jp: "レシートをください。", kana: "レシートをください。", korean: "영수증 주세요.", level: 2, category: "shopping" },
  { id: "p-0050", jp: "少し考えます。", kana: "すこしかんがえます。", korean: "조금 생각해 볼게요.", level: 2, category: "shopping" },

  // ===== 여행 =====
  { id: "p-0051", jp: "駅はどこですか。", kana: "えきはどこですか。", korean: "역은 어디예요?", level: 1, category: "travel" },
  { id: "p-0052", jp: "ここへ行きたいです。", kana: "ここへいきたいです。", korean: "여기에 가고 싶어요.", level: 2, category: "travel" },
  { id: "p-0053", jp: "この電車は東京に行きますか。", kana: "このでんしゃはとうきょうにいきますか。", korean: "이 전철은 도쿄에 가나요?", level: 2, category: "travel" },
  { id: "p-0054", jp: "切符はどこで買えますか。", kana: "きっぷはどこでかえますか。", korean: "표는 어디서 살 수 있나요?", level: 2, category: "travel" },
  { id: "p-0055", jp: "道に迷いました。", kana: "みちにまよいました。", korean: "길을 잃었어요.", level: 3, category: "travel" },
  { id: "p-0056", jp: "ここから遠いですか。", kana: "ここからとおいですか。", korean: "여기서 먼가요?", level: 2, category: "travel" },
  { id: "p-0057", jp: "タクシーを呼んでください。", kana: "タクシーをよんでください。", korean: "택시를 불러 주세요.", level: 3, category: "travel" },
  { id: "p-0058", jp: "何時に着きますか。", kana: "なんじにつきますか。", korean: "몇 시에 도착하나요?", level: 2, category: "travel" },
  { id: "p-0059", jp: "チェックインをお願いします。", kana: "チェックインをおねがいします。", korean: "체크인 부탁합니다.", level: 3, category: "travel" },
  { id: "p-0060", jp: "荷物を預けられますか。", kana: "にもつをあずけられますか。", korean: "짐을 맡길 수 있나요?", level: 3, category: "travel" },
  { id: "p-0061", jp: "近くにコンビニはありますか。", kana: "ちかくにコンビニはありますか。", korean: "근처에 편의점 있나요?", level: 2, category: "travel" },
  { id: "p-0062", jp: "写真を撮ってもらえますか。", kana: "しゃしんをとってもらえますか。", korean: "사진 좀 찍어 주시겠어요?", level: 3, category: "travel" },

  // ===== 비즈니스 =====
  { id: "p-0063", jp: "お世話になります。", kana: "おせわになります。", korean: "잘 부탁드립니다. (거래처 인사)", level: 3, category: "business" },
  { id: "p-0064", jp: "少々お待ちください。", kana: "しょうしょうおまちください。", korean: "잠시만 기다려 주십시오.", level: 3, category: "business" },
  { id: "p-0065", jp: "確認いたします。", kana: "かくにんいたします。", korean: "확인하겠습니다.", level: 3, category: "business" },
  { id: "p-0066", jp: "承知しました。", kana: "しょうちしました。", korean: "알겠습니다. (겸양)", level: 4, category: "business" },
  { id: "p-0067", jp: "後ほどご連絡いたします。", kana: "のちほどごれんらくいたします。", korean: "나중에 연락드리겠습니다.", level: 4, category: "business" },
  { id: "p-0068", jp: "会議は何時からですか。", kana: "かいぎはなんじからですか。", korean: "회의는 몇 시부터인가요?", level: 3, category: "business" },
  { id: "p-0069", jp: "資料を送っていただけますか。", kana: "しりょうをおくっていただけますか。", korean: "자료를 보내 주실 수 있나요?", level: 4, category: "business" },
  { id: "p-0070", jp: "申し訳ございません。", kana: "もうしわけございません。", korean: "대단히 죄송합니다.", level: 4, category: "business" },
  { id: "p-0071", jp: "お手数をおかけします。", kana: "おてすうをおかけします。", korean: "번거롭게 해 드립니다.", level: 4, category: "business" },
  { id: "p-0072", jp: "検討させていただきます。", kana: "けんとうさせていただきます。", korean: "검토하겠습니다.", level: 4, category: "business" },
  { id: "p-0073", jp: "よろしくお願いいたします。", kana: "よろしくおねがいいたします。", korean: "잘 부탁드립니다. (정중)", level: 3, category: "business" },
  { id: "p-0074", jp: "ご不明な点はございますか。", kana: "ごふめいなてんはございますか。", korean: "궁금하신 점 있으신가요?", level: 5, category: "business" },

  // ===== 긴급 =====
  { id: "p-0075", jp: "助けてください。", kana: "たすけてください。", korean: "도와주세요.", level: 1, category: "emergency" },
  { id: "p-0076", jp: "救急車を呼んでください。", kana: "きゅうきゅうしゃをよんでください。", korean: "구급차를 불러 주세요.", level: 3, category: "emergency" },
  { id: "p-0077", jp: "警察を呼んでください。", kana: "けいさつをよんでください。", korean: "경찰을 불러 주세요.", level: 3, category: "emergency" },
  { id: "p-0078", jp: "気分が悪いです。", kana: "きぶんがわるいです。", korean: "몸이 안 좋아요.", level: 2, category: "emergency" },
  { id: "p-0079", jp: "病院に連れて行ってください。", kana: "びょういんにつれていってください。", korean: "병원에 데려가 주세요.", level: 3, category: "emergency" },
  { id: "p-0080", jp: "財布をなくしました。", kana: "さいふをなくしました。", korean: "지갑을 잃어버렸어요.", level: 3, category: "emergency" },
  { id: "p-0081", jp: "パスポートを盗まれました。", kana: "パスポートをぬすまれました。", korean: "여권을 도난당했어요.", level: 4, category: "emergency" },
  { id: "p-0082", jp: "ここが痛いです。", kana: "ここがいたいです。", korean: "여기가 아파요.", level: 2, category: "emergency" },
  { id: "p-0083", jp: "近くに病院はありますか。", kana: "ちかくにびょういんはありますか。", korean: "근처에 병원 있나요?", level: 2, category: "emergency" },
  { id: "p-0084", jp: "急いでください。", kana: "いそいでください。", korean: "서둘러 주세요.", level: 2, category: "emergency" },

  // ===== 잡담 =====
  { id: "p-0085", jp: "趣味は何ですか。", kana: "しゅみはなんですか。", korean: "취미가 뭐예요?", level: 2, category: "smalltalk" },
  { id: "p-0086", jp: "週末は何をしますか。", kana: "しゅうまつはなにをしますか。", korean: "주말에 뭐 하세요?", level: 2, category: "smalltalk" },
  { id: "p-0087", jp: "日本料理が大好きです。", kana: "にほんりょうりがだいすきです。", korean: "일본 요리를 정말 좋아해요.", level: 2, category: "smalltalk" },
  { id: "p-0088", jp: "音楽を聞くのが好きです。", kana: "おんがくをきくのがすきです。", korean: "음악 듣는 걸 좋아해요.", level: 2, category: "smalltalk" },
  { id: "p-0089", jp: "最近どうですか。", kana: "さいきんどうですか。", korean: "요즘 어때요?", level: 2, category: "smalltalk" },
  { id: "p-0090", jp: "それはいいですね。", kana: "それはいいですね。", korean: "그거 좋네요.", level: 1, category: "smalltalk" },
  { id: "p-0091", jp: "本当ですか。", kana: "ほんとうですか。", korean: "정말이에요?", level: 1, category: "smalltalk" },
  { id: "p-0092", jp: "そうですね。", kana: "そうですね。", korean: "그렇네요.", level: 1, category: "smalltalk" },
  { id: "p-0093", jp: "楽しみにしています。", kana: "たのしみにしています。", korean: "기대하고 있어요.", level: 3, category: "smalltalk" },
  { id: "p-0094", jp: "また今度誘ってください。", kana: "またこんどさそってください。", korean: "다음에 또 불러 주세요.", level: 3, category: "smalltalk" },
  { id: "p-0095", jp: "お誕生日おめでとうございます。", kana: "おたんじょうびおめでとうございます。", korean: "생일 축하합니다.", level: 2, category: "smalltalk" },
  { id: "p-0096", jp: "無理しないでください。", kana: "むりしないでください。", korean: "무리하지 마세요.", level: 3, category: "smalltalk" },
  { id: "p-0097", jp: "頑張ってください。", kana: "がんばってください。", korean: "힘내세요.", level: 2, category: "smalltalk" },
  { id: "p-0098", jp: "お大事に。", kana: "おだいじに。", korean: "몸조리 잘하세요.", level: 2, category: "smalltalk" },
  { id: "p-0099", jp: "久しぶりに会えて嬉しいです。", kana: "ひさしぶりにあえてうれしいです。", korean: "오랜만에 만나서 기뻐요.", level: 3, category: "smalltalk" },
  { id: "p-0100", jp: "また遊びに来てください。", kana: "またあそびにきてください。", korean: "또 놀러 오세요.", level: 2, category: "smalltalk" },
  { id: "p-0101", jp: "どういたしまして。", kana: "どういたしまして。", korean: "천만에요.", level: 1, category: "smalltalk" },
  { id: "p-0102", jp: "とんでもないです。", kana: "とんでもないです。", korean: "별말씀을요.", level: 3, category: "smalltalk" },
];

/** 전체 회화 문장 개수 */
export const PHRASE_COUNT = PHRASES.length;

/** id로 문장 조회 */
export function getPhraseById(id: string): Phrase | undefined {
  return PHRASES.find((p) => p.id === id);
}

/** 레벨·카테고리로 필터링 (null이면 전체) */
export function filterPhrases(
  level: StudyLevel | null,
  category: PhraseCategory | null
): Phrase[] {
  return PHRASES.filter(
    (p) =>
      (level === null || p.level === level) &&
      (category === null || p.category === category)
  );
}

/** 데이터에 실제로 존재하는 카테고리 목록 (표시 순서 유지) */
export function getUsedPhraseCategories(): PhraseCategory[] {
  const order = Object.keys(PHRASE_CATEGORY_LABEL) as PhraseCategory[];
  const used = new Set(PHRASES.map((p) => p.category));
  return order.filter((c) => used.has(c));
}
