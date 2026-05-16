# 교수님 대역 AI (Proxy Agent) 서비스 명세서

> **프로토타입 기준** | 2026 학과 해커톤  
> 마지막 업데이트: 2026-05-16 (교수님 피드백 반영 — **공고 매칭 제거, 대역 AI 집중**)

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [권한 구조](#3-권한-구조)
4. [회원가입 및 프로필](#4-회원가입-및-프로필)
5. [기능 상세](#5-기능-상세)
6. [DB 스키마](#6-db-스키마)
7. [API 명세](#7-api-명세)
8. [컴포넌트 구조](#8-컴포넌트-구조)
9. [Gemini 프롬프트 설계](#9-gemini-프롬프트-설계)
10. [구현 체크리스트](#10-구현-체크리스트)
11. [발표 준비](#11-발표-준비)
12. [미결 사항](#12-미결-사항)
13. [AI 코딩 에이전트 지침](#13-ai-코딩-에이전트-지침)

---

## 1. 프로젝트 개요

### 1.1 핵심 컨셉

> **"교수님은 연구에 집중하세요, 학생 응대는 AI가 합니다."**  
> 교수님의 연구 철학, 논문, 지식을 학습한 **AI 대역(Proxy)**이 학생의 궁금증을 24시간 해결해주는 학과 지식 공유 플랫폼

### 1.2 기획 배경

- **교수님 리소스 낭비**: 학생이 연구 분야를 제대로 모른 채 면담을 요청하여 발생하는 시간 소모
- **학부생의 진입 장벽**: 논문 읽기가 어려운 학생들을 위해 교수님의 연구 내용을 쉽게 설명해줄 창구 필요
- **단절된 정보**: 연구실 생활, 필요 스택 등 실무적인 정보가 공개되어 있지 않아 발생하는 비효율

### 1.3 차별점

| 기능 | 기존 학과 포털 | 우리 앱 (v3) |
|------|-----------|----------|
| 연구 분야 탐색 | 단순 텍스트 나열 | **AI 기반 대화형 탐색** |
| 질문 응대 | 이메일/대면 (느림) | **AI 대역 응대 (실시간)** |
| 논문 이해 | 직접 읽기 (어려움) | **AI 기반 논문 요약/해설** |
| 지식 관리 | 수동 업데이트 | **교수님 문서 업로드 시 즉시 반영** |

---

## 2. 기술 스택

| 분류 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | Next.js | 상태관리: useState / 스타일: Tailwind CSS |
| 백엔드 | API route | REST API, JWT 인증 |
| 메인 DB | Supabase (PostgreSQL) | 회원/교수님/대화 로그/지식 데이터 |
| 실시간 채팅 | Firebase Firestore | 사람 ↔ 사람 (에스컬레이션 시 사용) |
| AI API | Gemini 2.5 Flash | RAG 기반 답변 생성 및 요약 |
| 논문 데이터 | Semantic Scholar API | 교수님 논문 자동 동기화 |

---

## 3. 권한 구조

| 권한 | 가능한 기능 |
|------|------------|
| 관리자 (학생회) | 교수님 프로필 등록, 전체 데이터 관리 |
| 교수님 | **지식 베이스(문서) 업로드**, 봇 답변 모니터링/피드백, 학생 직접 채팅 |
| 학생 | 키워드로 교수님 탐색, **AI 봇과 연구 상담**, 논문 해설 요청, 직접 연결 요청 |

---

## 4. 회원가입 및 프로필

### 4.1 학생 프로필
- 학번, 학년, 전공, 관심 분야, 수강 과목 등 (AI 상담 시 컨텍스트로 활용)

### 4.2 교수님 프로필
- 연구실 이름, 소속, **Semantic Scholar 링크**, **지식 베이스(업로드 문서)**, 선호 학생상 등

---

## 5. 기능 상세

### 5.1 지식 베이스 관리 (Knowledge Base)
- **문서 업로드**: 교수님이 논문 PDF, 연구실 소개 PPT, 랩실 FAQ 등 업로드
- **RAG 엔진**: 업로드된 문서에서 질문과 가장 관련 있는 내용을 추출하여 답변 생성
- **지식 재교육**: 봇의 오답 발견 시 해당 내용을 수정하거나 보완 문서를 업로드하여 정확도 향상

### 5.2 논문 탭 (Semantic Scholar 연동)
- 교수님의 최신 논문 목록 자동 연동 및 시각화
- **AI 논문 가이드**: 학생이 논문 제목 클릭 시 AI가 "학부생 수준"에서 핵심 내용 3줄 요약 및 의의 설명

### 5.3 교수님 대역 AI 채팅
- **1단계: AI Proxy 응대**: 학생의 질문에 대해 학습된 지식 범위 내에서 답변
- **2단계: 에스컬레이션**: 봇이 모르는 질문이거나, 학생이 면담을 원할 경우 교수님께 알림 후 직접 채팅방 개설

### 5.4 대화 로그 및 인사이트
- 교수님이 학생들이 주로 묻는 질문 키워드 분석
- 학생들이 어려워하는 논문/개념 파악 및 보완 자료 추천

---

## 6. DB 스키마 (Detailed)

> **Naming Rule**: Database fields use `snake_case`.

### users (사용자)
- `id`: UUID PRIMARY KEY (Supabase Auth 연동)
- `email`: VARCHAR (사용자 이메일)
- `role`: VARCHAR ('student', 'professor', 'admin')
- `full_name`: VARCHAR (사용자 실명)
- `profile_image_url`: TEXT (선택)
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### professors (교수님 프로필)
- `id`: UUID PRIMARY KEY
- `user_id`: UUID REFERENCES users(id)
- `lab_name`: VARCHAR (연구실명)
- `department`: VARCHAR (소속 학과)
- `scholar_link`: TEXT (Semantic Scholar 프로필 URL)
- `lab_intro`: TEXT (연구실 한줄 소개)
- `research_summary`: TEXT (AI 봇 학습용 기본 텍스트)
- `office_location`: VARCHAR (연구실 위치)
- `keywords`: TEXT[] (검색용 키워드: ['AI', 'Security'])
- `is_bot_active`: BOOLEAN DEFAULT TRUE

### professor_docs (지식 베이스)
- `id`: UUID PRIMARY KEY
- `professor_id`: UUID REFERENCES professors(id)
- `file_name`: VARCHAR
- `content_text`: TEXT (RAG 검색용 추출 텍스트)
- `storage_path`: TEXT (Supabase Storage 내 경로)
- `doc_type`: VARCHAR ('paper', 'faq', 'lab_guide', 'curriculum')
- `metadata`: JSONB (연도, 저자 등 추가 정보)
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### bot_conversations (대화 로그)
- `id`: UUID PRIMARY KEY
- `professor_id`: UUID REFERENCES professors(id)
- `student_id`: UUID REFERENCES users(id)
- `messages`: JSONB (대화 배열: `[{role, content, timestamp}]`)
- `status`: VARCHAR ('bot_handled', 'escalated', 'resolved')
- `escalated_at`: TIMESTAMPTZ (사람 연결 시점)
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

---

## 7. 네이밍 규칙 (Naming Conventions)

> **Naming Rule**: Variable and Function names use `camelCase`.

### 7.1 주요 엔티티 변수명
- 교수님 정보: `professorInfo`, `targetProfessor`
- 지식 문서: `knowledgeDoc`, `uploadedFile`
- 대화 내역: `chatHistory`, `botResponse`
- 검색 키워드: `searchKeyword`, `selectedCategory`

### 7.2 주요 함수명
- 문서 업로드/처리: `handleFileUpload()`, `processDocumentEmbedding()`
- 봇 대화 관련: `getBotResponse()`, `escalateToProfessor()`
- 데이터 조회: `fetchProfessorProfile()`, `fetchResearchPapers()`
- UI 토글: `isBotActive`, `isLoading`, `showChatModal`

---

## 8. API 명세 (Detailed)

### AI 봇 및 지식 관리
- `POST /api/bot/chat`: 질문 전송 및 AI 답변 수령
- `POST /api/bot/docs`: 지식 문서 업로드 및 임베딩 처리
- `GET  /api/bot/logs`: 교수님용 대화 로그 조회
- `GET  /api/papers`: Semantic Scholar API 기반 논문 조회

---

## 8. 컴포넌트 구조

```
src/
├── app/
│   ├── professor/
│   │   ├── dashboard/page.jsx -- 로그 분석 및 지식 관리
│   │   └── knowledge/page.jsx -- 문서 업로드 관리
│   ├── student/
│   │   ├── search/page.jsx    -- 교수님 탐색
│   │   └── proxy/[id]/page.jsx -- AI 대역 채팅 화면
│   └── layout.jsx
├── components/
│   ├── KnowledgeCard.jsx
│   ├── PaperList.jsx
│   ├── ChatBubble.jsx
│   └── Navbar.jsx
└── utils/
    ├── rag.js                 -- RAG 검색 및 Gemini 연동
    └── scholar.js             -- Semantic Scholar API
```

---

## 9. Gemini 프롬프트 설계

### 9.1 대역 AI 페르소나 (RAG)

```
[System]
당신은 {professor_name} 교수님의 공식 AI 대리인입니다.
당신의 임무는 제공된 [Knowledge Base] 문서를 바탕으로 학생들의 질문에 답변하는 것입니다.

- 말투: 지적이고 권위 있으면서도 친절한 교수님의 말투.
- 답변 범위: 반드시 제공된 지식 베이스 내에서만 답변하세요.
- 모르는 내용: "해당 부분은 제 지식 베이스에 없네요. 교수님께 직접 연결해 드릴까요?"라고 제안하세요.
- 에스컬레이션: 학생이 '면담', '직접 연락' 등을 언급하면 즉시 직접 연결 버튼을 활성화하세요.
```

---

## 10. 구현 체크리스트

### 필수 기능
- [ ] 교수님 지식 문서(PDF/Text) 업로드 및 텍스트 추출 로직
- [ ] Gemini RAG 시스템 구축 (질문 관련 문서 검색 + 답변 생성)
- [ ] Semantic Scholar 기반 교수님 논문 탭 구현
- [ ] 학생 ↔ AI 대역 실시간 채팅 UI
- [ ] 에스컬레이션 로직 (AI 봇 -> 직접 채팅 전환)

### 선택 기능 (시간 되면)
- [ ] 질문 키워드 시각화 (워드 클라우드)
- [ ] 논문 3줄 요약 AI 가이드

---

## 11. 발표 준비

- **핵심 메시지**: "교수님의 시간을 지켜드리고, 학생의 학습 갈증을 실시간으로 해결합니다."
- **데모 흐름**: 논문 업로드 → AI 학습 → 학생 질문 → 봇의 전문적 답변 → 직접 면담 요청으로 연결.

---

## 12. 미결 사항

| 항목 | 내용 | 결정 시기 |
|------|------|----------|
| Semantic Scholar API 호출량 | 무료 티어 한도 내 구현 가능 여부 확인 | 1일차 오전 회의 |
| AI 봇 학습 데이터 포맷 | PDF 업로드 지원 여부 또는 텍스트 요약본 위주 결정 | 1일차 오전 회의 |
| 졸업 선배 유입 전략 | 앱 가입 유도 방법 | 추후 결정 |
| 채팅 기능 최종 확정 | AI 봇 답변으로 충분지, 실시간 채팅이 꼭 필요한지 | 1일차 오전 회의 |

---

## 13. AI 코딩 에이전트 지침

> **Claude Code / Gemini CLI 공통 적용**  
> 작업 시작 전 반드시 이 섹션을 읽고 모든 규칙을 따를 것

---

### 13.1 매 세션 시작 시 필수 선행 작업

1. `tasks/lessons.md` 읽기 — 없으면 새로 생성 후 진행
2. `RULES.md` 읽기 — 공통 규칙 확인
3. `STRUCTURE.md` 읽기 — 없으면 새로 생성 후 진행
4. 수정할 파일 직접 읽기

---

### 13.2 워크플로우

**비자명한 작업 시작 전**
- 작업 계획을 `tasks/todo.md`에 체크리스트로 먼저 작성
- 구현 시작 전 계획 확인
- 진행하면서 완료 항목 체크

**구현 중**
- 각 단계마다 한 줄 요약으로 진행 상황 설명
- 불필요한 설명 없이 코드 위주로
- 기존 코드 스타일 파악 후 동일하게 유지
- 상대방 AI(Claude ↔ Gemini)가 만든 코드 발견 시 그 패턴을 이어받아 작성

**완료 전 필수 검증**
- 작동한다고 가정하지 말고 실제로 증명할 것
- "시니어 개발자가 이 코드를 승인할까?" 스스로 체크
- 테스트 실행, 로그 확인, 정확성 검증 후 완료 처리

**작업 완료 후**
- `tasks/todo.md`에 결과 요약 추가
- 수정받은 내용이 있으면 `tasks/lessons.md`에 패턴 기록

---

### 13.3 핵심 원칙

| 원칙 | 내용 |
|------|------|
| **단순함 우선** | 가능한 한 단순하게. 최소한의 코드만 건드릴 것 |
| **나태함 금지** | 임시방편 금지. 근본 원인을 찾아 해결 |
| **최소 영향** | 요청한 것만 변경. 불필요한 코드 건드리지 않기 |

---

### 13.4 코드 품질

- 비자명한 변경 시: "더 우아한 방법이 없을까?" 스스로 질문
- hacky하다는 느낌이 들면: 지금 알고 있는 것을 바탕으로 우아한 해법으로 재구현
- 단순·명백한 수정에는 이 과정 생략 (과잉 엔지니어링 금지)

---

### 13.5 버그 수정

- 버그 보고 받으면 추가 설명 요청 없이 바로 수정
- 로그, 에러, 실패 테스트를 직접 확인하고 해결
- 사용자에게 컨텍스트 전환 요구 금지

---

### 13.6 파일 관리

- 파일 전체 재작성 금지 → 필요한 부분만 Edit
- 새 파일 생성 시 `STRUCTURE.md`에 역할 한 줄 추가
- `tasks/` 하위 로그 파일 없으면 자동 생성 후 기록
  - `tasks/lessons.md` — 없으면 생성
  - `tasks/todo.md` — 없으면 생성
  - `tasks/impl_log.md` — 없으면 생성
  - `tasks/error_log.md` — 없으면 생성
  - `tasks/action_log.md` — 없으면 생성

---

### 13.7 자기 개선 루프

수정받은 경우:
1. `tasks/lessons.md`에 실수 패턴 기록
2. 같은 실수 재발 방지 규칙 작성
3. 다음 세션 시작 시 이 파일 먼저 읽기

---

### 13.8 토큰 자동 절약

> 아래 방식을 **기본값**으로 적용. 팀원이 "전체 보여줘"라고 명시할 때만 예외.

**큰 출력은 자동으로 파일 저장**
- 데이터프레임 미리보기: 직접 출력 X → 파일 저장 후 경로만 응답
- 큰 JSON/리스트: 파일 저장 후 경로 전달
- 이미지/플롯: 화면 표시 X → 파일 저장 후 경로
- 50줄 이상 출력 예상되면 → 파일로

**에러 디버깅 자동 압축**
- 전체 스택 트레이스 받아도 → 핵심 에러 + 발생 줄만 응답에 포함
- 같은 에러 반복 발생 시 → "이전과 동일한 에러" 한 줄

**파일 작업**
- 수정은 무조건 Edit (Write로 전체 재작성 금지, 신규 파일 제외)
- 같은 파일 재읽기 금지 (이미 컨텍스트에 있음)
- 큰 파일은 필요한 부분만

**응답 길이**
- 작업 완료 보고: 한 줄 요약 기본
- "어떻게 했어?" 질문 없으면 과정 설명 생략
- 코드 변경 후 변경된 부분만 언급, 전체 파일 재출력 X

**작업 범위**
- 특정 함수/파일 언급하면 그것만 수정 (주변 정리 X)
- "리팩토링해줘" 같은 광범위 요청은 → 범위 좁혀서 확인 질문 1번 후 진행
