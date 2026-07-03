# 📚 단어장 · 한자 학습 기능 SPEC

> ひらがな·カタカナ 암기 앱에 **단어 학습**, **한자 학습**, **일상 회화 문장** 기능을 추가한다.
> 쉬운 단어부터 어려운 단어까지 단계별로, 스스로 학습을 완료 표시하고, 학습 완료한 항목만 랜덤으로 뽑아 시험을 볼 수 있다.

---

## 1. 목표 (Goals)

- 일본어 **단어**를 난이도(레벨 1~5)·카테고리(인사/일상/음식/여행 등)별로 500개 이상 제공한다.
- **한자(漢字)**를 별도 기능으로 분리하여 음독·훈독·뜻·예시 단어와 함께 학습한다.
- **일상 회화 문장**을 별도로 제공하여 실전 표현을 익힌다.
- 사용자가 카드를 넘겨보며 **"학습 완료"** 를 스스로 체크한다.
- **학습 완료한 항목만** 랜덤으로 출제하는 **시험 모드**를 제공한다.
- 모든 진행 상태(학습 완료 목록, 시험 결과)는 우선 **localStorage** 에 저장하고, 이후 **DB로 이관**한다. (§7 참고)

## 2. 비목표 (Non-Goals)

- 이번 단계에서는 서버/DB/로그인을 구현하지 않는다. (데이터는 상수 + localStorage)
- 발음 오디오(TTS), 필기 인식, SRS(간격 반복 알고리즘)는 이번 범위에서 제외한다. (§8 향후 과제)

---

## 3. 용어 (Glossary)

| 용어 | 의미 |
|------|------|
| **Deck (덱)** | 학습 단위 묶음. `vocab`(단어), `kanji`(한자), `phrase`(회화 문장) 3종. |
| **Level (레벨)** | 난이도 1~5. 1=아주 쉬움, 5=어려움. |
| **Category (카테고리)** | 주제 분류 (인사, 일상, 음식, 여행, 감정, 비즈니스 등). |
| **학습 완료 (Learned)** | 사용자가 해당 항목을 익혔다고 스스로 표시한 상태. |
| **시험 (Test)** | 학습 완료 항목 중 랜덤으로 뽑아 5지선다로 출제. |

---

## 4. 데이터 모델 (Data Model)

> 지금은 TypeScript 상수 배열로 두지만, 아래 스키마는 **그대로 DB 테이블로 이관**할 수 있도록 설계한다. (§7)

### 4.1 단어 (Vocab) — `src/data/vocab.ts`

```ts
export type StudyLevel = 1 | 2 | 3 | 4 | 5;
export type VocabCategory =
  | "greeting"   // 인사
  | "daily"      // 일상
  | "food"       // 음식
  | "shopping"   // 쇼핑
  | "travel"     // 여행
  | "time"       // 시간·날짜
  | "number"     // 숫자·수량
  | "body"       // 신체·건강
  | "emotion"    // 감정
  | "family"     // 가족·사람
  | "nature"     // 자연·날씨
  | "school"     // 학교·공부
  | "business"   // 비즈니스
  | "verb"       // 동사
  | "adjective"; // 형용사

export interface Vocab {
  id: string;            // 안정적 고유 ID. 예: "v-0001" (DB 이관 시 PK 후보)
  word: string;          // 표기 (한자/가나 혼용). 예: "食べる"
  kana: string;          // 히라가나 읽기. 예: "たべる"
  korean: string;        // 뜻. 예: "먹다"
  level: StudyLevel;     // 난이도
  category: VocabCategory;
}
```

### 4.2 한자 (Kanji) — `src/data/kanji.ts`

```ts
export interface Kanji {
  id: string;            // 예: "k-0001"
  char: string;          // 한자 1글자. 예: "水"
  meaning: string;       // 한국어 뜻(훈). 예: "물"
  onyomi: string;        // 음독(가타카나). 예: "スイ"
  kunyomi: string;       // 훈독(히라가나). 예: "みず"
  korean: string;        // 한국 한자음. 예: "수"
  level: StudyLevel;
  examples: string[];    // 예시 단어. 예: ["水曜日 (すいようび, 수요일)"]
}
```

### 4.3 회화 문장 (Phrase) — `src/data/phrases.ts`

```ts
export type PhraseCategory =
  | "greeting" | "daily" | "restaurant" | "shopping"
  | "travel" | "business" | "emergency" | "smalltalk";

export interface Phrase {
  id: string;            // 예: "p-0001"
  jp: string;            // 일본어 문장. 예: "はじめまして。"
  kana: string;          // 읽기(후리가나). 한자 포함 시 전체 읽기.
  korean: string;        // 뜻. 예: "처음 뵙겠습니다."
  level: StudyLevel;
  category: PhraseCategory;
}
```

### 4.4 작문 (Composition) — `src/data/compositions.ts`

> 한국어 문장을 보고 일본어로 **직접 써보는** 작문 연습. 채점은 사용자가 스스로 한다(자가 채점).

```ts
export interface Composition {
  id: string;            // 예: "c-0001"
  korean: string;        // 제시할 한국어 문장. 예: "저는 매일 아침 커피를 마셔요."
  best: string;          // 베스트 일본어 답안. 예: "私は毎朝コーヒーを飲みます。"
  bestKana: string;      // 베스트 답안의 읽기
  alternatives: string[];// 이것도 정답인 다른 표현들 (없으면 [])
  hint?: string;         // 힌트(선택). 예: "毎朝 = 매일 아침"
  level: StudyLevel;
  category: PhraseCategory; // phrases.ts의 카테고리 재사용
}
```

**자가 채점(Self-grading)**: 정답을 본 뒤 스스로 4단계로 채점한다.

| 값 | 라벨 | 의미 |
|----|------|------|
| `perfect` | 완벽! | 베스트/정답과 사실상 일치 |
| `good` | 좋아 | 통하지만 조금 다름 |
| `meh` | 조금 아쉽 | 뜻은 맞지만 어색/부족 |
| `again` | 다시 | 틀림, 다시 볼 것 |

### 4.5 규모 (Volume Targets)

| 덱 | 목표 개수 | 레벨 분포 |
|----|-----------|-----------|
| 단어 (vocab) | **520+** | L1~L5 균등 분포 |
| 한자 (kanji) | **160+** | L1~L5 |
| 회화 문장 (phrase) | **100+** | L1~L5 |
| 작문 (composition) | **100+** | L1~L5 |

---

## 5. 학습 상태 저장 (Progress Storage) — `src/lib/progress.ts`

localStorage 기반. DB 이관을 고려해 **덱별로 학습 완료된 ID 집합**을 저장한다.

```ts
// localStorage key
const PROGRESS_KEY = "study-progress-v1";

// 저장 형태 (JSON)
interface ProgressState {
  vocab:  string[];   // 학습 완료된 Vocab id 목록
  kanji:  string[];   // 학습 완료된 Kanji id 목록
  phrase: string[];   // 학습 완료된 Phrase id 목록
  updatedAt: string;  // ISO timestamp
}

// API
type DeckId = "vocab" | "kanji" | "phrase";
getLearnedIds(deck: DeckId): Set<string>;
isLearned(deck: DeckId, id: string): boolean;
toggleLearned(deck: DeckId, id: string): void;
markLearned(deck: DeckId, id: string): void;
unmarkLearned(deck: DeckId, id: string): void;
resetDeck(deck: DeckId): void;
getProgressCount(deck: DeckId): number;
```

시험 결과는 기존 `src/lib/storage.ts` 패턴을 확장한 별도 키(`study-test-results-v1`)에 저장한다.

**작문 자가 채점**은 별도 키(`composition-progress-v1`)에 저장한다 (`src/lib/composition.ts`).

```ts
type CompositionGrade = "perfect" | "good" | "meh" | "again";
interface CompositionState {
  grades: Record<string, { grade: CompositionGrade; at: string }>; // id → 채점
}
// API
getGrade(id): CompositionGrade | null;
setGrade(id, grade): void;
getGradeCounts(): Record<CompositionGrade, number>;
resetCompositions(): void;
```

---

## 6. 화면 / 라우트 (Pages & Routes)

기존 컨벤션(App Router + `?type=` 쿼리)을 따른다.

| 라우트 | 설명 |
|--------|------|
| `/` | 메인 허브. 기존 카나 카드 + **단어 / 한자 / 회화 학습** 카드 추가. |
| `/vocab` | 단어 학습. 레벨·카테고리 필터, 카드 넘겨보기, "학습 완료" 토글, 진행률 표시. |
| `/vocab/test` | 학습 완료한 단어 중 랜덤 10문제, 5지선다 (일본어→뜻 / 뜻→일본어 방향 선택). |
| `/kanji` | 한자 학습. 음독·훈독·뜻·예시 단어 카드. "학습 완료" 토글. |
| `/kanji/test` | 학습 완료한 한자 랜덤 시험 (한자→뜻 5지선다). |
| `/phrases` | 회화 문장 학습. 카테고리 필터, "학습 완료" 토글. |
| `/phrases/test` | 학습 완료한 문장 랜덤 시험 (일본어→뜻 5지선다). |
| `/compose` | 작문 연습. 한국어 문장 → 일본어 직접 입력 → 정답 보기(베스트+다른 정답) → 자가 채점. |

### 6.1 학습 화면 (Study) 공통 UX

- 상단: 뒤로가기, 진행률(`학습 완료 n / 전체 m`), 레벨/카테고리 필터 칩.
- 카드: 단어/한자/문장 크게 + 읽기 + 뜻. "뜻 가리기" 토글로 셀프 테스트 가능.
- 하단: `← 이전` / `학습 완료 ✓` / `다음 →`.
- 필터로 좁힌 목록 안에서만 이동. 이미 학습 완료한 항목은 배지 표시.

### 6.1.1 작문 화면 (Compose) UX

- 상단: 뒤로가기, 진행 요약(완벽/좋아/조금 아쉽/다시 개수), 레벨·카테고리 필터.
- 카드: **한국어 문장**을 크게 + (선택) 힌트 토글.
- 입력: 여러 줄 텍스트 입력창에 일본어로 직접 작성.
- **정답 보기** 버튼 → 베스트 답안 + 읽기 + "이것도 정답" 목록 공개. (채점은 사용자가 눈으로 비교)
- **자가 채점** 버튼(완벽!/좋아/조금 아쉽/다시) → 결과 저장 후 다음 문제로.
- 정답을 보기 전에는 채점 버튼 비활성(먼저 써보게 유도).

### 6.2 시험 화면 (Test) 공통 UX

- 진입 조건: 해당 덱에 **학습 완료 항목이 최소 5개** 있어야 시작 가능 (부족하면 안내 문구).
- 학습 완료 풀에서 랜덤 N(기본 10, 부족하면 있는 만큼) 출제.
- 5지선다, 오답 보기는 같은 덱에서 랜덤 추출.
- 결과: 점수 + 항목별 정오 표시 + "다시 하기" / "메인". 결과 localStorage 저장.

---

## 7. DB 이관 계획 (Future: Migrate to DB) ⚠️

> **현재는 상수 + localStorage 이지만, 다음 단계에서 DB로 이관한다.** 위 스키마는 이관을 전제로 설계되었다.

### 7.1 테이블 매핑

| 현재 (상수/스토리지) | 이관 후 (DB 테이블) |
|----------------------|---------------------|
| `src/data/vocab.ts` 배열 | `vocab` (id PK, word, kana, korean, level, category) |
| `src/data/kanji.ts` 배열 | `kanji` (id PK, char, meaning, onyomi, kunyomi, korean, level) + `kanji_example` (kanji_id FK) |
| `src/data/phrases.ts` 배열 | `phrase` (id PK, jp, kana, korean, level, category) |
| `src/data/compositions.ts` 배열 | `composition` (id PK, korean, best, best_kana, level, category) + `composition_alt` (composition_id FK) |
| localStorage `study-progress-v1` | `user_progress` (user_id FK, deck, item_id, learned_at) |
| localStorage `study-test-results-v1` | `test_result` (user_id FK, deck, score, total, taken_at) + `test_result_item` |
| localStorage `composition-progress-v1` | `composition_grade` (user_id FK, composition_id, grade, graded_at) |

### 7.2 이관 원칙

1. **ID 안정성**: 상수의 `id`("v-0001" 등)를 DB PK로 그대로 사용해, 기존 localStorage 진행 상태를 그대로 매핑할 수 있게 한다.
2. **데이터 접근 추상화**: 컴포넌트는 `src/data/*` 를 직접 import 하지 말고 향후 `getVocab()`, `getKanji()` 같은 **데이터 접근 함수**를 통하도록 한다. 이관 시 이 함수 내부만 `fetch('/api/...')` 로 교체.
3. **진행 상태 동기화**: 로그인 도입 시, localStorage → 서버 마이그레이션 1회 실행 후 서버를 소스 오브 트루스로 전환한다.
4. **스키마 버전 관리**: localStorage 키에 `-v1` 접미사를 붙여 스키마 변경 시 마이그레이션 가능하게 한다.

### 7.3 이관 단계 (제안)

1. Next.js Route Handler(`/api/vocab` 등)로 상수 데이터를 그대로 서빙 → 컴포넌트를 데이터 접근 함수로 전환.
2. DB(예: SQLite/Postgres + Prisma or Drizzle) 도입, 상수를 seed 스크립트로 이관.
3. 인증 도입, `user_progress`/`test_result` 서버 저장, localStorage 마이그레이션.

---

## 8. 향후 과제 (Future Work)

- SRS(간격 반복) 기반 복습 스케줄.
- 발음 TTS 재생.
- 오답 노트 / 약점 단어 집중 학습.
- 검색 및 즐겨찾기.
- 방향 선택 시험(뜻→일본어 입력형) 및 주관식.

---

## 9. 구현 체크리스트

- [ ] `src/data/vocab.ts` — 단어 520+
- [ ] `src/data/kanji.ts` — 한자 160+
- [ ] `src/data/phrases.ts` — 회화 문장 100+
- [ ] `src/data/compositions.ts` — 작문 100+
- [ ] `src/lib/progress.ts` — 학습 상태 저장/조회
- [ ] `src/lib/study-test.ts` (또는 storage 확장) — 시험 결과 저장 + 랜덤 출제 유틸
- [ ] `src/lib/composition.ts` — 작문 자가 채점 저장/조회
- [ ] `/vocab`, `/vocab/test` 페이지
- [ ] `/kanji`, `/kanji/test` 페이지
- [ ] `/phrases`, `/phrases/test` 페이지
- [ ] `/compose` 페이지 (작문)
- [ ] 메인(`/`) 허브에 카드 추가
- [ ] README 업데이트
