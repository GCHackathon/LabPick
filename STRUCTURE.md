# 프로젝트 구조

## 기술 스택
- Frontend: Next.js 16 + Tailwind CSS
- Backend: Next.js API Route
- AI: Gemini 2.5 Flash (RAG 방식 — 모델 재학습 없이 교수님별 context 주입)
- 논문: Semantic Scholar 무료 API (교수님 이름으로 자동 조회)
- DB: Supabase (미연동, 더미 데이터 사용 중)

## 폴더 구조
```
vibecoding/
├── app/
│   ├── api/
│   │   ├── bot/chat/route.js     ← 교수님 대역 AI 챗봇
│   │   ├── papers/route.js       ← 논문 조회 + 3줄 요약
│   │   ├── match/route.js        ← (구버전) 공고 매칭
│   │   └── applications/route.js ← (구버전) 지원자 목록
│   ├── auth/
│   │   ├── signup/page.jsx       ← 회원가입
│   │   └── login/page.jsx        ← 로그인
│   └── page.js                   ← 메인 (front.jsx 렌더)
├── utils/
│   ├── rag.js                    ← RAG 챗봇 답변 + 에스컬레이션 감지
│   ├── scholar.js                ← Semantic Scholar API
│   └── gemini.js                 ← Gemini 매칭 점수 (구버전)
├── front.jsx                     ← 메인 UI 컴포넌트
└── .env.local                    ← GEMINI_API_KEY
```

## 파일 목록
| 파일/폴더 | 역할 |
|----------|------|
| `교수님대역AI_명세서_v3.md` | 최신 명세서 (RAG + 대역 AI) |
| `utils/rag.js` | RAG 챗봇 답변 생성 + 에스컬레이션 감지 |
| `utils/scholar.js` | Semantic Scholar 논문 조회 + context 변환 |
| `utils/gemini.js` | Gemini API (구버전 매칭용) |
| `app/api/bot/chat/route.js` | 교수님 대역 AI 챗봇 API |
| `app/api/papers/route.js` | 논문 조회 + 3줄 요약 API |
| `app/auth/signup/page.jsx` | 회원가입 (3단계, 역할 선택) |
| `app/auth/login/page.jsx` | 로그인 |
| `front.jsx` | 메인 프론트엔드 컴포넌트 |
