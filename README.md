# 랩픽 (LabPick)

> **"교수님은 연구에 집중하세요. 학생 응대는 AI가 합니다."**

교수님의 논문, 연구 철학, 랩실 FAQ를 학습한 AI 봇이  
학생의 궁금증을 24시간 실시간으로 해결해주는 연구실 매칭 플랫폼

🔗 **서비스 바로가기:** https://frontend-two-theta-8.vercel.app/login

---

## 팀 소개

**가천대학교 컴퓨터공학과 해커톤 6조**

| 학번 | 이름 |
|------|------|
| 202337639 | 권민재 |
| 202337642 | 김지혁 |
| 202533728 | 노아영 |
| 202337648 | 백현종 |
| 202533776 | 안채연 |
| 202533795 | 윤지윤 |

---

## 기획 배경

### 문제 정의

**교수님 입장**
- 준비 안 된 학생의 반복 면담 요청
- 동일한 질문 반복 응대로 연구 시간 낭비
- 1시간 넘게 설명 후 지원으로 이어지지 않는 상황 반복

**학생 입장**
- 논문은 어렵고 연구실 정보는 찾기 어려움
- 교수님께 이메일 보내는 것 자체가 부담
- 연구실에서 어떤 일을 하는지 알기 어려움

### 해결 아이디어

> "학생이 교수님을 만나기 전에, 먼저 교수님의 AI 봇을 만나게 한다."

| 기존 구조 | 새로운 구조 |
|---|---|
| 학생 → 이메일/대면 → 교수님 | 학생 → AI 봇 → 교수님 이메일 연결 |
| 느리고 부담스러움 | 24시간 즉시 응대 |

---

## 핵심 기능

### 1. 연구실 탐색
- 가천대 컴공 교수님 프로필, 연구 분야, 키워드 탑재
- 키워드 필터 및 검색
- Semantic Scholar 연동 논문 목록 자동 제공
- 논문 클릭 시 AI가 학부생 눈높이로 3줄 요약

### 2. 교수님 AI 봇 상담
- 학생의 전공, 학년, 관심 분야, 보유 기술 기반 **맞춤형 답변**
- RAG 방식으로 교수님 FAQ + 논문 + 지시사항 기반 답변 생성
- OpenAI GPT-4o-mini 기반
- 교수님 직접 연결 필요 시 메일 보내기 버튼 활성화

### 3. 교수님 대시보드 & AI 튜닝
- FAQ 직접 등록 (Q&A 형식)
- 추가 지시사항 설정 (면담 가능 시간, 모집 조건 등)
- AI 봇 활성화/비활성화 관리

### 4. 오픈챗
- 같은 연구실 관심 학생들끼리 실시간 정보 공유
- 교수별 독립 채팅방

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프론트엔드 | Next.js 15 (App Router) |
| 백엔드/DB | Supabase (PostgreSQL + Auth) |
| AI 모델 | OpenAI GPT-4o-mini |
| 논문 데이터 | Semantic Scholar API |
| 배포 | Vercel |
| PWA | manifest.json + Next.js metadata |

---

## AI 봇 동작 원리

학생이 질문하면 아래 컨텍스트를 시스템 프롬프트에 주입:

1. 교수님 기본 정보 (이름, 소속, 연구 분야, 연구실 소개)
2. Semantic Scholar 논문 목록
3. 교수님이 직접 등록한 FAQ
4. 교수님 추가 지시사항
5. 학생 프로필 (학년, 전공, 관심 분야, 보유 기술)

GPT-4o-mini가 JSON 형식으로 응답:
```json
{
  "answer": "답변 내용",
  "suggest_escalation": true
}
```
`suggest_escalation: true`이면 메일 보내기 버튼 활성화

---

## 프로젝트 구조

```
app/
├── page.js                    # 연구실 탐색 메인
├── login/page.jsx             # 로그인/회원가입
├── lab/[id]/page.jsx          # 연구실 상세 (논문, 소개)
├── ai-chat/[id]/page.jsx      # AI 봇 채팅
├── openchat/page.jsx          # 오픈챗 목록
├── openchat/[id]/page.jsx     # 오픈챗 채팅방
├── ai-consultation/page.jsx   # AI 상담 안내
├── my-info/page.jsx           # 학생 내 정보
├── professor/
│   ├── setup/page.jsx         # 교수 프로필 등록
│   ├── dashboard/page.jsx     # 교수 대시보드
│   └── tuning/page.jsx        # AI 튜닝 (FAQ, 지시사항)
└── api/
    ├── professors/route.js    # 교수 목록 API
    ├── bot/chat/route.js      # AI 봇 채팅 API
    └── papers/route.js        # 논문 조회/요약 API
```

---

## 로컬 실행

```bash
# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, OPENAI_API_KEY 입력

# 개발 서버 실행
npm run dev
```

---

## 개발에 활용한 AI 워크플로우

| 단계 | 활용 도구 |
|---|---|
| 아이디어 | Claude, ChatGPT, Perplexity |
| 기획 | Claude, ChatGPT, NotebookLM |
| 개발 | Claude Code, Cursor, GitHub Copilot |
| 디자인 | Figma AI, Canva AI |

---

## 기대 효과

1. **교수님의 반복 응대 부담 감소** → 핵심 면담과 연구에 집중
2. **학생의 연구실 탐색 진입장벽 완화** → AI의 쉬운 설명으로 빠른 파악
3. **연구실 정보 체계적 관리** → FAQ, 논문, 지시사항 통합 지식 베이스
4. **효율적인 교수-학생 연결** → 필요할 때만 직접 연결

---

## 현재 한계점

- **교수님 인증 없음** → 누구나 교수 계정 생성 가능 (데모 버전)
- **문서 업로드 미구현** → 논문 PDF 직접 파싱 없이 제목/초록 기반 답변
- **벡터 DB 미사용** → FAQ, 지시사항을 프롬프트에 직접 주입하는 방식
- **논문 캐시 메모리 기반** → 서버 재시작 시 캐시 초기화
- **Semantic Scholar 미등록 교수** → 논문 자동 연동 불가
- **오픈챗 폴링 방식** → 3초 간격 폴링으로 실시간성 한계

---

## 추후 개선 사항

- **교수님 인증 강화** → 학교 이메일 도메인 인증 또는 교번 인증
- **논문 PDF 업로드 및 파싱** → 실제 논문 내용 기반 답변 품질 향상
- **벡터 DB 도입 (pgvector)** → 문서 임베딩 기반 정밀 RAG 구현
- **실시간 채팅** → Supabase Realtime 또는 WebSocket으로 오픈챗 개선
- **다른 학교 확장** → 학교 단위 멀티테넌트 구조로 전국 확장
- **대화 로그 분석** → 자주 묻는 질문 파악으로 봇 정확도 자동 개선
- **모바일 앱 고도화** → PWA에서 네이티브 앱으로 전환
