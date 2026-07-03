import type { StudyLevel } from "./vocab";
import { PHRASE_CATEGORY_LABEL, type PhraseCategory } from "./phrases";

export { PHRASE_CATEGORY_LABEL as COMPOSITION_CATEGORY_LABEL };

export interface Composition {
  id: string;
  korean: string; // 제시할 한국어 문장
  best: string; // 베스트 일본어 답안
  bestKana: string; // 베스트 답안 읽기
  alternatives: string[]; // 이것도 정답인 다른 표현
  hint?: string; // 힌트(선택)
  level: StudyLevel;
  category: PhraseCategory;
}

// prettier-ignore
export const COMPOSITIONS: Composition[] = [
  // ===== 레벨 1 (아주 쉬움) =====
  { id: "c-0001", korean: "처음 뵙겠습니다.", best: "はじめまして。", bestKana: "はじめまして。", alternatives: [], level: 1, category: "greeting" },
  { id: "c-0002", korean: "저는 학생입니다.", best: "私は学生です。", bestKana: "わたしはがくせいです。", alternatives: ["僕は学生です。"], hint: "학생 = 学生(がくせい)", level: 1, category: "daily" },
  { id: "c-0003", korean: "이것은 무엇입니까?", best: "これは何ですか。", bestKana: "これはなんですか。", alternatives: [], level: 1, category: "daily" },
  { id: "c-0004", korean: "화장실은 어디예요?", best: "トイレはどこですか。", bestKana: "トイレはどこですか。", alternatives: ["お手洗いはどこですか。"], level: 1, category: "travel" },
  { id: "c-0005", korean: "이거 주세요.", best: "これをください。", bestKana: "これをください。", alternatives: ["これください。"], level: 1, category: "shopping" },
  { id: "c-0006", korean: "감사합니다.", best: "ありがとうございます。", bestKana: "ありがとうございます。", alternatives: ["どうもありがとうございます。"], level: 1, category: "greeting" },
  { id: "c-0007", korean: "저는 물을 마셔요.", best: "私は水を飲みます。", bestKana: "わたしはみずをのみます。", alternatives: [], hint: "마시다 = 飲む(のむ)", level: 1, category: "daily" },
  { id: "c-0008", korean: "지금 몇 시예요?", best: "今何時ですか。", bestKana: "いまなんじですか。", alternatives: [], level: 1, category: "daily" },
  { id: "c-0009", korean: "잘 먹겠습니다.", best: "いただきます。", bestKana: "いただきます。", alternatives: [], level: 1, category: "restaurant" },
  { id: "c-0010", korean: "이거 얼마예요?", best: "これはいくらですか。", bestKana: "これはいくらですか。", alternatives: ["いくらですか。"], level: 1, category: "shopping" },
  { id: "c-0011", korean: "저는 일본어를 공부해요.", best: "私は日本語を勉強します。", bestKana: "わたしはにほんごをべんきょうします。", alternatives: [], hint: "공부하다 = 勉強する", level: 1, category: "daily" },
  { id: "c-0012", korean: "오늘은 날씨가 좋아요.", best: "今日はいい天気です。", bestKana: "きょうはいいてんきです。", alternatives: ["今日は天気がいいです。"], level: 1, category: "smalltalk" },
  { id: "c-0013", korean: "저는 사과를 좋아해요.", best: "私はりんごが好きです。", bestKana: "わたしはりんごがすきです。", alternatives: [], hint: "~을 좋아하다 = ~が好きだ", level: 1, category: "daily" },
  { id: "c-0014", korean: "잠깐만 기다려 주세요.", best: "ちょっと待ってください。", bestKana: "ちょっとまってください。", alternatives: ["少々お待ちください。"], level: 1, category: "daily" },
  { id: "c-0015", korean: "역은 어디예요?", best: "駅はどこですか。", bestKana: "えきはどこですか。", alternatives: [], level: 1, category: "travel" },
  { id: "c-0016", korean: "저는 매일 아침 밥을 먹어요.", best: "私は毎朝ご飯を食べます。", bestKana: "わたしはまいあさごはんをたべます。", alternatives: [], hint: "매일 아침 = 毎朝(まいあさ)", level: 1, category: "daily" },
  { id: "c-0017", korean: "이것은 제 책이에요.", best: "これは私の本です。", bestKana: "これはわたしのほんです。", alternatives: ["これは僕の本です。"], level: 1, category: "daily" },
  { id: "c-0018", korean: "안녕히 계세요.", best: "さようなら。", bestKana: "さようなら。", alternatives: ["失礼します。"], level: 1, category: "greeting" },
  { id: "c-0019", korean: "저는 학교에 가요.", best: "私は学校に行きます。", bestKana: "わたしはがっこうにいきます。", alternatives: ["学校へ行きます。"], hint: "~에 가다 = ~に行く", level: 1, category: "daily" },
  { id: "c-0020", korean: "맛있어요.", best: "おいしいです。", bestKana: "おいしいです。", alternatives: ["うまいです。"], level: 1, category: "restaurant" },
  { id: "c-0021", korean: "저는 한국 사람이에요.", best: "私は韓国人です。", bestKana: "わたしはかんこくじんです。", alternatives: [], level: 1, category: "daily" },
  { id: "c-0022", korean: "이름이 뭐예요?", best: "名前は何ですか。", bestKana: "なまえはなんですか。", alternatives: ["お名前は何ですか。"], level: 1, category: "greeting" },
  { id: "c-0023", korean: "내일 만나요.", best: "また明日会いましょう。", bestKana: "またあしたあいましょう。", alternatives: ["また明日。"], level: 1, category: "greeting" },
  { id: "c-0024", korean: "저는 커피를 안 마셔요.", best: "私はコーヒーを飲みません。", bestKana: "わたしはコーヒーをのみません。", alternatives: [], hint: "부정형 = ~ません", level: 1, category: "daily" },
  { id: "c-0025", korean: "여기 앉아도 돼요?", best: "ここに座ってもいいですか。", bestKana: "ここにすわってもいいですか。", alternatives: [], hint: "~해도 돼요? = ~てもいいですか", level: 1, category: "daily" },

  // ===== 레벨 2 (쉬움) =====
  { id: "c-0026", korean: "저는 어제 영화를 봤어요.", best: "私は昨日映画を見ました。", bestKana: "わたしはきのうえいがをみました。", alternatives: [], hint: "과거형 = ~ました", level: 2, category: "daily" },
  { id: "c-0027", korean: "주말에 보통 뭐 하세요?", best: "週末はたいてい何をしますか。", bestKana: "しゅうまつはたいていなにをしますか。", alternatives: ["週末は普通何をしますか。"], level: 2, category: "smalltalk" },
  { id: "c-0028", korean: "이 전철은 도쿄에 가나요?", best: "この電車は東京に行きますか。", bestKana: "このでんしゃはとうきょうにいきますか。", alternatives: [], level: 2, category: "travel" },
  { id: "c-0029", korean: "물 한 잔 더 주세요.", best: "水をもう一杯ください。", bestKana: "みずをもういっぱいください。", alternatives: [], hint: "한 잔 = 一杯(いっぱい)", level: 2, category: "restaurant" },
  { id: "c-0030", korean: "사진을 찍어도 될까요?", best: "写真を撮ってもいいですか。", bestKana: "しゃしんをとってもいいですか。", alternatives: [], level: 2, category: "travel" },
  { id: "c-0031", korean: "저는 일본에 가고 싶어요.", best: "私は日本に行きたいです。", bestKana: "わたしはにほんにいきたいです。", alternatives: ["日本へ行きたいです。"], hint: "~하고 싶다 = ~たい", level: 2, category: "travel" },
  { id: "c-0032", korean: "조금 더 싸게 안 될까요?", best: "もう少し安くなりませんか。", bestKana: "もうすこしやすくなりませんか。", alternatives: [], level: 2, category: "shopping" },
  { id: "c-0033", korean: "카드로 낼 수 있나요?", best: "カードで払えますか。", bestKana: "カードではらえますか。", alternatives: ["カードで払ってもいいですか。"], level: 2, category: "shopping" },
  { id: "c-0034", korean: "생일 축하해요.", best: "お誕生日おめでとうございます。", bestKana: "おたんじょうびおめでとうございます。", alternatives: ["誕生日おめでとう。"], level: 2, category: "smalltalk" },
  { id: "c-0035", korean: "저는 음악 듣는 걸 좋아해요.", best: "私は音楽を聞くのが好きです。", bestKana: "わたしはおんがくをきくのがすきです。", alternatives: [], hint: "~하는 것 = ~のが / ~ことが", level: 2, category: "smalltalk" },
  { id: "c-0036", korean: "다시 한 번 말해 주세요.", best: "もう一度言ってください。", bestKana: "もういちどいってください。", alternatives: ["もう一度お願いします。"], level: 2, category: "daily" },
  { id: "c-0037", korean: "천천히 말해 주세요.", best: "ゆっくり話してください。", bestKana: "ゆっくりはなしてください。", alternatives: [], level: 2, category: "daily" },
  { id: "c-0038", korean: "저는 매운 걸 못 먹어요.", best: "私は辛いものが食べられません。", bestKana: "わたしはからいものがたべられません。", alternatives: ["辛いものは食べられません。"], hint: "가능형 부정 = ~られません", level: 2, category: "restaurant" },
  { id: "c-0039", korean: "근처에 편의점 있나요?", best: "近くにコンビニはありますか。", bestKana: "ちかくにコンビニはありますか。", alternatives: [], level: 2, category: "travel" },
  { id: "c-0040", korean: "이 옷 입어봐도 될까요?", best: "この服を試着してもいいですか。", bestKana: "このふくをしちゃくしてもいいですか。", alternatives: [], hint: "입어보다 = 試着する", level: 2, category: "shopping" },
  { id: "c-0041", korean: "역까지 걸어서 얼마나 걸려요?", best: "駅まで歩いてどのくらいかかりますか。", bestKana: "えきまであるいてどのくらいかかりますか。", alternatives: ["駅までどのくらいかかりますか。"], level: 2, category: "travel" },
  { id: "c-0042", korean: "저는 지금 배가 고파요.", best: "私は今お腹がすいています。", bestKana: "わたしはいまおなかがすいています。", alternatives: ["お腹がすきました。"], hint: "배고프다 = お腹がすく", level: 2, category: "daily" },
  { id: "c-0043", korean: "내일은 비가 올 거예요.", best: "明日は雨が降るでしょう。", bestKana: "あしたはあめがふるでしょう。", alternatives: ["明日は雨が降ると思います。"], hint: "~일 것이다 = ~でしょう", level: 2, category: "smalltalk" },
  { id: "c-0044", korean: "포장 되나요?", best: "持ち帰りできますか。", bestKana: "もちかえりできますか。", alternatives: ["テイクアウトできますか。"], level: 2, category: "restaurant" },
  { id: "c-0045", korean: "저는 형이 두 명 있어요.", best: "私は兄が二人います。", bestKana: "わたしはあにがふたりいます。", alternatives: [], hint: "사람이 있다 = ~がいる", level: 2, category: "daily" },
  { id: "c-0046", korean: "전화번호를 알려 주세요.", best: "電話番号を教えてください。", bestKana: "でんわばんごうをおしえてください。", alternatives: [], level: 2, category: "daily" },
  { id: "c-0047", korean: "이 근처에 맛있는 식당 있어요?", best: "この近くに美味しいお店はありますか。", bestKana: "このちかくにおいしいおみせはありますか。", alternatives: ["近くにおいしいレストランはありますか。"], level: 2, category: "restaurant" },
  { id: "c-0048", korean: "저는 어제 늦게 잤어요.", best: "私は昨日遅く寝ました。", bestKana: "わたしはきのうおそくねました。", alternatives: [], level: 2, category: "daily" },
  { id: "c-0049", korean: "취미가 뭐예요?", best: "趣味は何ですか。", bestKana: "しゅみはなんですか。", alternatives: [], level: 2, category: "smalltalk" },
  { id: "c-0050", korean: "조금 생각해 볼게요.", best: "少し考えます。", bestKana: "すこしかんがえます。", alternatives: ["ちょっと考えてみます。"], level: 2, category: "shopping" },

  // ===== 레벨 3 (보통) =====
  { id: "c-0051", korean: "괜찮으시다면 같이 갈까요?", best: "よかったら一緒に行きませんか。", bestKana: "よかったらいっしょにいきませんか。", alternatives: ["よければ一緒に行きましょうか。"], hint: "권유 = ~ませんか", level: 3, category: "smalltalk" },
  { id: "c-0052", korean: "도와주셔서 정말 감사합니다.", best: "手伝ってくださって本当にありがとうございます。", bestKana: "てつだってくださってほんとうにありがとうございます。", alternatives: ["助けてくれてありがとうございます。"], level: 3, category: "daily" },
  { id: "c-0053", korean: "죄송하지만 길을 잃었어요.", best: "すみませんが、道に迷いました。", bestKana: "すみませんが、みちにまよいました。", alternatives: [], hint: "길을 잃다 = 道に迷う", level: 3, category: "travel" },
  { id: "c-0054", korean: "이 자리 비어 있나요?", best: "この席は空いていますか。", bestKana: "このせきはあいていますか。", alternatives: [], hint: "비어 있다 = 空いている", level: 3, category: "travel" },
  { id: "c-0055", korean: "예약을 하고 싶은데요.", best: "予約をしたいのですが。", bestKana: "よやくをしたいのですが。", alternatives: ["予約をお願いしたいのですが。"], hint: "완곡한 요청 = ~のですが", level: 3, category: "restaurant" },
  { id: "c-0056", korean: "혹시 영어 할 줄 아세요?", best: "もしかして英語が話せますか。", bestKana: "もしかしてえいごがはなせますか。", alternatives: ["英語は話せますか。"], level: 3, category: "travel" },
  { id: "c-0057", korean: "그건 저도 잘 모르겠어요.", best: "それは私にもよく分かりません。", bestKana: "それはわたしにもよくわかりません。", alternatives: [], level: 3, category: "daily" },
  { id: "c-0058", korean: "다음 주에 시간 있으세요?", best: "来週お時間ありますか。", bestKana: "らいしゅうおじかんありますか。", alternatives: ["来週、時間がありますか。"], level: 3, category: "smalltalk" },
  { id: "c-0059", korean: "무리하지 마세요.", best: "無理しないでください。", bestKana: "むりしないでください。", alternatives: [], hint: "~하지 마세요 = ~ないでください", level: 3, category: "smalltalk" },
  { id: "c-0060", korean: "몸이 안 좋아서 오늘은 쉴게요.", best: "体調が悪いので今日は休みます。", bestKana: "たいちょうがわるいのできょうはやすみます。", alternatives: ["具合が悪いので今日は休みます。"], hint: "~라서(이유) = ~ので", level: 3, category: "daily" },
  { id: "c-0061", korean: "이 요리는 어떻게 만들어요?", best: "この料理はどうやって作りますか。", bestKana: "このりょうりはどうやってつくりますか。", alternatives: [], hint: "어떻게 = どうやって", level: 3, category: "restaurant" },
  { id: "c-0062", korean: "짐을 맡길 수 있을까요?", best: "荷物を預けることができますか。", bestKana: "にもつをあずけることができますか。", alternatives: ["荷物を預けられますか。"], hint: "가능 = ~ことができる", level: 3, category: "travel" },
  { id: "c-0063", korean: "생각보다 훨씬 쌌어요.", best: "思ったよりずっと安かったです。", bestKana: "おもったよりずっとやすかったです。", alternatives: [], hint: "~보다 = ~より", level: 3, category: "shopping" },
  { id: "c-0064", korean: "다음에 또 놀러 오세요.", best: "また遊びに来てください。", bestKana: "またあそびにきてください。", alternatives: [], hint: "~하러 오다 = ~に来る", level: 3, category: "smalltalk" },
  { id: "c-0065", korean: "오래 기다리게 해서 죄송합니다.", best: "お待たせしてすみません。", bestKana: "おまたせしてすみません。", alternatives: ["お待たせしました。"], level: 3, category: "daily" },
  { id: "c-0066", korean: "저는 아직 결정을 못 했어요.", best: "私はまだ決めていません。", bestKana: "わたしはまだきめていません。", alternatives: ["まだ決められません。"], hint: "아직 ~하지 않았다 = まだ~ていない", level: 3, category: "daily" },
  { id: "c-0067", korean: "이 근처에서 사진 찍어도 될까요?", best: "この辺りで写真を撮ってもいいですか。", bestKana: "このあたりでしゃしんをとってもいいですか。", alternatives: [], level: 3, category: "travel" },
  { id: "c-0068", korean: "감기에 걸린 것 같아요.", best: "風邪を引いたみたいです。", bestKana: "かぜをひいたみたいです。", alternatives: ["風邪を引いたようです。"], hint: "~인 것 같다 = ~みたいだ/ようだ", level: 3, category: "emergency" },
  { id: "c-0069", korean: "여기서 사진 좀 찍어 주시겠어요?", best: "ここで写真を撮っていただけますか。", bestKana: "ここでしゃしんをとっていただけますか。", alternatives: ["写真を撮ってもらえますか。"], hint: "정중한 부탁 = ~ていただけますか", level: 3, category: "travel" },
  { id: "c-0070", korean: "저는 매일 30분씩 운동해요.", best: "私は毎日30分ずつ運動します。", bestKana: "わたしはまいにちさんじゅっぷんずつうんどうします。", alternatives: [], hint: "~씩 = ~ずつ", level: 3, category: "daily" },
  { id: "c-0071", korean: "그렇게 말해 주셔서 기뻐요.", best: "そう言ってもらえて嬉しいです。", bestKana: "そういってもらえてうれしいです。", alternatives: ["そう言ってくれて嬉しいです。"], level: 3, category: "smalltalk" },
  { id: "c-0072", korean: "다음 역에서 내리면 돼요.", best: "次の駅で降りればいいです。", bestKana: "つぎのえきでおりればいいです。", alternatives: ["次の駅で降りてください。"], hint: "~하면 된다 = ~ればいい", level: 3, category: "travel" },
  { id: "c-0073", korean: "예약을 취소하고 싶어요.", best: "予約をキャンセルしたいです。", bestKana: "よやくをキャンセルしたいです。", alternatives: ["予約を取り消したいです。"], level: 3, category: "travel" },
  { id: "c-0074", korean: "괜찮으면 연락처를 알려 주세요.", best: "よかったら連絡先を教えてください。", bestKana: "よかったられんらくさきをおしえてください。", alternatives: [], level: 3, category: "smalltalk" },
  { id: "c-0075", korean: "저는 일본 드라마를 보면서 공부해요.", best: "私は日本のドラマを見ながら勉強します。", bestKana: "わたしはにほんのドラマをみながらべんきょうします。", alternatives: [], hint: "~하면서 = ~ながら", level: 3, category: "daily" },

  // ===== 레벨 4 (어려움) =====
  { id: "c-0076", korean: "바쁘신 와중에 시간 내주셔서 감사합니다.", best: "お忙しい中、お時間をいただきありがとうございます。", bestKana: "おいそがしいなか、おじかんをいただきありがとうございます。", alternatives: [], hint: "겸양 = いただく", level: 4, category: "business" },
  { id: "c-0077", korean: "확인 후에 다시 연락드리겠습니다.", best: "確認した上で、改めてご連絡いたします。", bestKana: "かくにんしたうえで、あらためてごれんらくいたします。", alternatives: ["確認してからご連絡いたします。"], hint: "~한 후에 = ~た上で", level: 4, category: "business" },
  { id: "c-0078", korean: "혹시 시간이 괜찮으시면 회의를 하고 싶습니다.", best: "もしお時間がよろしければ、会議をさせていただきたいです。", bestKana: "もしおじかんがよろしければ、かいぎをさせていただきたいです。", alternatives: [], hint: "겸양 사역 = ~させていただく", level: 4, category: "business" },
  { id: "c-0079", korean: "이 문제를 어떻게 해결하면 좋을지 고민이에요.", best: "この問題をどうやって解決すればいいか悩んでいます。", bestKana: "このもんだいをどうやってかいけつすればいいかなやんでいます。", alternatives: [], hint: "고민하다 = 悩む", level: 4, category: "daily" },
  { id: "c-0080", korean: "그 의견에는 저도 찬성합니다.", best: "そのご意見には私も賛成です。", bestKana: "そのごいけんにはわたしもさんせいです。", alternatives: ["その意見に賛成します。"], level: 4, category: "business" },
  { id: "c-0081", korean: "죄송하지만 이번에는 사양하겠습니다.", best: "申し訳ありませんが、今回は遠慮させていただきます。", bestKana: "もうしわけありませんが、こんかいはえんりょさせていただきます。", alternatives: [], hint: "사양하다 = 遠慮する", level: 4, category: "business" },
  { id: "c-0082", korean: "자료를 미리 보내 주시면 감사하겠습니다.", best: "資料を事前に送っていただけると助かります。", bestKana: "しりょうをじぜんにおくっていただけるとたすかります。", alternatives: ["資料を前もって送っていただけますか。"], hint: "미리 = 事前に/前もって", level: 4, category: "business" },
  { id: "c-0083", korean: "생각하면 할수록 이해가 안 돼요.", best: "考えれば考えるほど分からなくなります。", bestKana: "かんがえればかんがえるほどわからなくなります。", alternatives: [], hint: "~하면 할수록 = ~ば~ほど", level: 4, category: "daily" },
  { id: "c-0084", korean: "그가 올지 안 올지 아직 모르겠어요.", best: "彼が来るかどうかまだ分かりません。", bestKana: "かれがくるかどうかまだわかりません。", alternatives: [], hint: "~인지 아닌지 = ~かどうか", level: 4, category: "daily" },
  { id: "c-0085", korean: "이 계획은 다시 검토할 필요가 있습니다.", best: "この計画は見直す必要があります。", bestKana: "このけいかくはみなおすひつようがあります。", alternatives: ["この計画を再検討する必要があります。"], hint: "~할 필요가 있다 = ~必要がある", level: 4, category: "business" },
  { id: "c-0086", korean: "그렇게 말씀하시니 기분이 좋네요.", best: "そう言っていただけると嬉しいです。", bestKana: "そういっていただけるとうれしいです。", alternatives: [], level: 4, category: "business" },
  { id: "c-0087", korean: "저도 그렇게 생각하지 않는 건 아니에요.", best: "私もそう思わないわけではありません。", bestKana: "わたしもそうおもわないわけではありません。", alternatives: [], hint: "이중부정 = ~ないわけではない", level: 4, category: "daily" },
  { id: "c-0088", korean: "가능한 한 빨리 답장 드리겠습니다.", best: "できるだけ早くお返事いたします。", bestKana: "できるだけはやくおへんじいたします。", alternatives: ["なるべく早くご返信いたします。"], hint: "가능한 한 = できるだけ/なるべく", level: 4, category: "business" },
  { id: "c-0089", korean: "그 영화는 보면 볼수록 좋아져요.", best: "あの映画は見れば見るほど好きになります。", bestKana: "あのえいがはみればみるほどすきになります。", alternatives: [], level: 4, category: "smalltalk" },
  { id: "c-0090", korean: "혹시 폐가 안 된다면 부탁 하나 해도 될까요?", best: "もしご迷惑でなければ、一つお願いしてもいいですか。", bestKana: "もしごめいわくでなければ、ひとつおねがいしてもいいですか。", alternatives: [], hint: "폐 = 迷惑(めいわく)", level: 4, category: "business" },
  { id: "c-0091", korean: "이 근처는 밤에도 안전한 편이에요.", best: "この辺りは夜でも安全なほうです。", bestKana: "このあたりはよるでもあんぜんなほうです。", alternatives: [], hint: "~한 편이다 = ~ほうだ", level: 4, category: "travel" },
  { id: "c-0092", korean: "그 일에 대해서는 나중에 다시 이야기해요.", best: "その件については後でまた話しましょう。", bestKana: "そのけんについてはあとでまたはなしましょう。", alternatives: [], hint: "~에 대해서 = ~について", level: 4, category: "business" },
  { id: "c-0093", korean: "부탁드린 자료는 준비됐을까요?", best: "お願いした資料は準備できましたでしょうか。", bestKana: "おねがいしたしりょうはじゅんびできましたでしょうか。", alternatives: [], level: 4, category: "business" },
  { id: "c-0094", korean: "날씨가 추워졌으니 감기 조심하세요.", best: "寒くなってきたので、風邪に気をつけてください。", bestKana: "さむくなってきたので、かぜにきをつけてください。", alternatives: [], hint: "~해지다 = ~くなる", level: 4, category: "smalltalk" },
  { id: "c-0095", korean: "제가 대신 전해 드릴게요.", best: "私が代わりにお伝えします。", bestKana: "わたしがかわりにおつたえします。", alternatives: [], hint: "대신 = 代わりに", level: 4, category: "business" },

  // ===== 레벨 5 (매우 어려움) =====
  { id: "c-0096", korean: "이번 프로젝트가 성공할지는 준비에 달려 있습니다.", best: "今回のプロジェクトが成功するかどうかは準備にかかっています。", bestKana: "こんかいのプロジェクトがせいこうするかどうかはじゅんびにかかっています。", alternatives: [], hint: "~에 달려 있다 = ~にかかっている", level: 5, category: "business" },
  { id: "c-0097", korean: "말씀하신 취지는 충분히 이해했습니다.", best: "おっしゃる趣旨は十分理解いたしました。", bestKana: "おっしゃるしゅしはじゅうぶんりかいいたしました。", alternatives: [], hint: "말씀하시다(존경) = おっしゃる", level: 5, category: "business" },
  { id: "c-0098", korean: "상황에 따라 계획을 유연하게 바꿀 필요가 있어요.", best: "状況に応じて計画を柔軟に変える必要があります。", bestKana: "じょうきょうにおうじてけいかくをじゅうなんにかえるひつようがあります。", alternatives: [], hint: "~에 따라 = ~に応じて", level: 5, category: "business" },
  { id: "c-0099", korean: "그 결정이 옳았는지는 시간이 지나 봐야 알 수 있어요.", best: "その決定が正しかったかどうかは、時間が経ってみないと分かりません。", bestKana: "そのけっていがただしかったかどうかは、じかんがたってみないとわかりません。", alternatives: [], hint: "~해 봐야 = ~てみないと", level: 5, category: "daily" },
  { id: "c-0100", korean: "그는 반대를 무릅쓰고 자신의 뜻을 관철했어요.", best: "彼は反対を押し切って自分の意志を貫きました。", bestKana: "かれははんたいをおしきってじぶんのいしをつらぬきました。", alternatives: [], hint: "관철하다 = 貫く(つらぬく)", level: 5, category: "daily" },
  { id: "c-0101", korean: "노력한 만큼 결과가 따라오는 건 아니에요.", best: "努力した分だけ結果がついてくるとは限りません。", bestKana: "どりょくしたぶんだけけっかがついてくるとはかぎりません。", alternatives: [], hint: "~라고는 할 수 없다 = ~とは限らない", level: 5, category: "daily" },
  { id: "c-0102", korean: "이 자료를 바탕으로 대책을 세우겠습니다.", best: "この資料をもとに対策を立てます。", bestKana: "このしりょうをもとにたいさくをたてます。", alternatives: [], hint: "~을 바탕으로 = ~をもとに", level: 5, category: "business" },
  { id: "c-0103", korean: "일이 이렇게 될 줄은 미처 생각하지 못했어요.", best: "事がこうなるとは思ってもみませんでした。", bestKana: "ことがこうなるとはおもってもみませんでした。", alternatives: [], hint: "~일 줄은 = ~とは", level: 5, category: "daily" },
  { id: "c-0104", korean: "그 점에 대해서는 재고의 여지가 있다고 생각합니다.", best: "その点については再考の余地があると思います。", bestKana: "そのてんについてはさいこうのよちがあるとおもいます。", alternatives: [], hint: "여지 = 余地(よち)", level: 5, category: "business" },
  { id: "c-0105", korean: "아무리 바빠도 건강만큼은 챙기세요.", best: "どんなに忙しくても健康だけは大事にしてください。", bestKana: "どんなにいそがしくてもけんこうだけはだいじにしてください。", alternatives: [], hint: "아무리 ~해도 = どんなに~ても", level: 5, category: "smalltalk" },
  { id: "c-0106", korean: "이번 실패를 계기로 많은 것을 배웠어요.", best: "今回の失敗をきっかけに多くのことを学びました。", bestKana: "こんかいのしっぱいをきっかけにおおくのことをまなびました。", alternatives: [], hint: "~을 계기로 = ~をきっかけに", level: 5, category: "daily" },
  { id: "c-0107", korean: "말하기는 쉽지만 실제로 하기는 어려워요.", best: "言うのは簡単ですが、実際にやるのは難しいです。", bestKana: "いうのはかんたんですが、じっさいにやるのはむずかしいです。", alternatives: [], level: 5, category: "daily" },
  { id: "c-0108", korean: "여러분의 협조 없이는 이룰 수 없었을 겁니다.", best: "皆さんの協力なしには成し遂げられなかったでしょう。", bestKana: "みなさんのきょうりょくなしにはなしとげられなかったでしょう。", alternatives: [], hint: "~없이는 = ~なしには", level: 5, category: "business" },
  { id: "c-0109", korean: "그 소식을 듣고 놀라지 않을 수 없었어요.", best: "その知らせを聞いて驚かずにはいられませんでした。", bestKana: "そのしらせをきいておどろかずにはいられませんでした。", alternatives: [], hint: "~하지 않을 수 없다 = ~ずにはいられない", level: 5, category: "daily" },
  { id: "c-0110", korean: "형편이 허락하는 한 계속 돕고 싶어요.", best: "都合が許す限り、手伝い続けたいです。", bestKana: "つごうがゆるすかぎり、てつだいつづけたいです。", alternatives: [], hint: "~하는 한 = ~限り", level: 5, category: "smalltalk" },
];

/** 전체 작문 개수 */
export const COMPOSITION_COUNT = COMPOSITIONS.length;

/** id로 작문 조회 */
export function getCompositionById(id: string): Composition | undefined {
  return COMPOSITIONS.find((c) => c.id === id);
}

/** 레벨·카테고리로 필터링 (null이면 전체) */
export function filterCompositions(
  level: StudyLevel | null,
  category: PhraseCategory | null
): Composition[] {
  return COMPOSITIONS.filter(
    (c) =>
      (level === null || c.level === level) &&
      (category === null || c.category === category)
  );
}

/** 데이터에 실제로 존재하는 카테고리 목록 (표시 순서 유지) */
export function getUsedCompositionCategories(): PhraseCategory[] {
  const order = Object.keys(PHRASE_CATEGORY_LABEL) as PhraseCategory[];
  const used = new Set(COMPOSITIONS.map((c) => c.category));
  return order.filter((c) => used.has(c));
}
