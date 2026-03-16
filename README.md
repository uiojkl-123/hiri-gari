# ひらがな · カタカナ — 히라가나 · 가타카나 암기

일본어 **히라가나**, **가타카나**, **탁점·반탁점**, **요음(스테가나)** 을 퀴즈로 연습하고 표로 볼 수 있는 웹 앱입니다.

---

## ✨ 기능

| 구분 | 설명 |
|------|------|
| **기본 테스트** | 히라가나 / 가타카나 / 둘 다 중 선택 → 10문제, 5지선다 (한글 발음 고르기) |
| **탁점 · 요음** | 탁점(゛)·반탁점(゜)만 / 요음(ゃゅょ)만 / 둘 다 테스트 |
| **표 보기** | 기본 50음도 표 + 탁점·요음 표, 한국 발음 표시/숨김 토글 |
| **결과 저장** | 퀴즈 결과를 일시와 함께 localStorage에 저장 (최근 100개) |

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
│   ├── page.tsx          # 메인 (테스트/표 보기 진입)
│   ├── test/              # 퀴즈 페이지 (type=hiragana|katakana|both|dakuten|youon|dakuten-youon)
│   └── chart/             # 표 보기 (mode=basic|dakuten|youon)
├── components/ui/         # shadcn 컴포넌트
├── data/
│   └── kana.ts            # 히라가나·가타카나·탁점·요음 데이터
└── lib/
    ├── storage.ts         # 퀴즈 결과 localStorage
    └── utils.ts
```

---

## 📜 라이선스

MIT License
