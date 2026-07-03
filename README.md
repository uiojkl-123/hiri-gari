# ひらがな · カタカナ — 히라가나 · 가타카나 암기

일본어 **히라가나**, **가타카나**, **탁점·반탁점**, **요음(스테가나)** 을 퀴즈로 연습하고 표로 볼 수 있는 웹 앱입니다.

---

## ✨ 기능

| 구분 | 설명 |
|------|------|
| **기본 테스트** | 히라가나 / 가타카나 / 둘 다 중 선택 → 10문제, 5지선다 (한글 발음 고르기) |
| **탁점 · 요음** | 탁점(゛)·반탁점(゜)만 / 요음(ゃゅょ)만 / 둘 다 테스트 |
| **표 보기** | 기본 50음도 표 + 탁점·요음 표, 한국 발음 표시/숨김 토글 |
| **단어 학습** | 레벨 1~5 · 카테고리별 단어 **525개**. 카드로 넘겨보며 "학습 완료" 체크, 뜻 가리기 셀프 테스트 |
| **한자 학습** | 한자 **180자**. 음독·훈독·뜻·한자음·예시 단어 카드 |
| **회화 문장** | 일상 회화 문장 **102개**. 인사/식당/여행/비즈니스 등 카테고리별 |
| **학습 시험** | 학습 완료한 항목만 랜덤 출제하는 5지선다 시험 (단어/한자/회화 각각) |
| **문장 써보기(작문)** | 한국어 문장 **110개** → 일본어로 직접 작성 → 정답(베스트 + "이것도 정답") 보기 → **자가 채점**(완벽!/좋아/조금 아쉽/다시) |
| **결과 저장** | 퀴즈·학습 진행·시험 결과를 localStorage에 저장 (추후 DB 이관 예정 — [SPEC.md](./SPEC.md) 참고) |

---

## 🛠 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Button, Card, Table, Checkbox)

---

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start
```

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 메인 허브
│   ├── test/              # 카나 퀴즈 (type=hiragana|katakana|both|dakuten|youon|dakuten-youon)
│   ├── chart/             # 표 보기 (mode=basic|dakuten|youon)
│   ├── vocab/             # 단어 학습 + /vocab/test 시험
│   ├── kanji/             # 한자 학습 + /kanji/test 시험
│   ├── phrases/           # 회화 문장 학습 + /phrases/test 시험
│   └── compose/           # 문장 써보기(작문)
├── components/
│   ├── ui/                # shadcn 컴포넌트
│   └── study/             # StudyClient(학습)·StudyTestClient(시험)·ComposeClient(작문)
├── data/
│   ├── kana.ts            # 히라가나·가타카나·탁점·요음
│   ├── vocab.ts           # 단어 525개 (레벨·카테고리)
│   ├── kanji.ts           # 한자 180자
│   ├── phrases.ts         # 회화 문장 102개
│   └── compositions.ts    # 작문 문장 110개 (베스트 답안 + 대체 정답)
└── lib/
    ├── storage.ts         # 카나 퀴즈 결과 localStorage
    ├── progress.ts        # 학습 완료 상태 localStorage (study-progress-v1)
    ├── study-test.ts      # 학습 시험 출제 유틸 + 결과 저장 (study-test-results-v1)
    ├── composition.ts     # 작문 자가 채점 저장 (composition-progress-v1)
    └── utils.ts
```

> 📄 데이터 모델, 화면 설계, **DB 이관 계획**은 [SPEC.md](./SPEC.md) 에 정리되어 있습니다.

---

## 📜 라이선스

MIT License
