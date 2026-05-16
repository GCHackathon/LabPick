# 학과 AI 매칭 플랫폼 명세서

> **프로토타입 기준** | 2026 학과 해커톤  
> 마지막 업데이트: 2026-05-16

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
10. [Firebase 채팅 구조](#10-firebase-채팅-구조)
11. [구현 체크리스트](#11-구현-체크리스트)
12. [개발 일정](#12-개발-일정)
13. [발표 준비](#13-발표-준비)
14. [미결 사항](#14-미결-사항)
15. [AI 코딩 에이전트 지침](#15-ai-코딩-에이전트-지침)

---

## 1. 프로젝트 개요

### 1.1 핵심 컨셉

> 학생이 기회를 찾아다니는 것이 아니라, **기회가 먼저 학생을 찾아오는 구조**이자  
> **교수님의 AI 대리인(Bot)**이 학생의 궁금증을 24시간 해결해주는 효율적인 학과 매칭 플랫폼

### 1.2 기획 배경

- 교수님 연구실 인턴/캡스톤 공고가 단톡에 묻혀서 학생이 기회를 놓침
- 연구실 선택 시 선배들의 커리어 정보를 알 수 없음
- **학생들이 교수님의 연구 분야를 제대로 이해하지 못한 채 컨택하여 교수님과 학생 모두의 시간 낭비 발생**
- **논문 읽기가 어려운 학부생들을 위해 교수님의 연구 내용을 쉽게 설명해줄 창구 필요**

### 1.3 차별점

| 기능 | 에브리타임 | 학교 포털 | 우리 앱 |
|------|-----------|----------|--------|
| 학과 맞춤 공고 | ❌ | ❌ | ✅ |
| AI 조건 매칭 | ❌ | ❌ | ✅ |
| 커리어 트래킹 | ❌ | ❌ | ✅ |
| 교수님 AI 봇 | ❌ | ❌ | ✅ |
| 논문 데이터 연동 | ❌ | ❌ | ✅ |

### 1.4 주요 기능 요약

| 기능 | 설명 |
|------|------|
| 교수님 공고 매칭 | 교수님 공고 등록 → AI가 조건 맞는 학생 자동 알림 → 지원/선별 |
| 연구실 커리어 트래킹 | 출신 선배 익명 포트폴리오 + 취업/대학원 진로 데이터 제공 |
| 교수님 AI 봇 | **RAG(Retrieval-Augmented Generation)** 기반: 교수님 문서 학습 → 학생 질문 자동 응답 |
| 교수님 탐색 | 키워드(AI, 보안 등) 기반 교수님 및 연구실 검색 |
| 논문 탭 | **Semantic Scholar API** 연동으로 교수님별 최신 논문 목록 자동 표시 |

---

## 2. 기술 스택

| 분류 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | Next.js | 상태관리: useState / 스타일: Tailwind CSS |
| 백엔드 | API route | REST API, JWT 인증 |
| 메인 DB | Supabase (PostgreSQL) | 회원/공고/지원/봇 데이터 |
| 채팅 DB | Firebase Firestore | 실시간 채팅 (사람 ↔ 사람) |
| AI API | Gemini 2.5 Flash | 무료 플랜 (1,500 req/day) |

### 2.1 Gemini 무료 플랜 한도

| 모델 | RPM | RPD |
|------|-----|-----|
| Gemini 2.5 Flash | 15 | 1,500 |

> 6명 팀 기준 해커톤 2일 테스트 충분히 가능

---

## 3. 권한 구조

| 권한 | 가능한 기능 |
|------|------------|
| 관리자 (학생회) | 교수님 프로필 등록/수정, 공고 대신 등록, 전체 데이터 관리 |
| 교수님 | 본인 프로필 수정, 공고 직접 등록, 지원자 확인/수락/거절, 채팅 |
| 학생 | 프로필 입력, 공고 열람/지원, 커리어 트래킹 조회, 채팅, 랭킹 투표 |

> ※ 권한은 가입 시 역할 선택으로 분리 (프로토타입 기준 별도 인증 없음)

---

## 4. 회원가입 및 프로필

> ※ 프로토타입 기준: 별도 인증 없이 폼 입력만으로 가입

### 4.1 학생 프로필

**필수 항목**
- 학번
- 학년
- 학점
- 전공/부전공

**선택 항목**
- 보유 스킬
- 수강 완료 과목
- 어학 성적
- 관심 분야
- 진로 방향 (취업/대학원)
- 희망 연구 분야
- MBTI
- 작업 스타일 (혼자 집중 / 같이 토론 / 둘 다)
- 강점 키워드 (꼼꼼함 / 창의적 / 추진력 / 협업 / 분석력 / 커뮤니케이션 중 최대 3개)

### 4.2 교수님 프로필

**필수 항목**
- 이름
- 소속 학과
- 연구실 이름
- 학교 이메일
- 구글 스칼라 ID 또는 프로필 링크 (논문 자동 연동용)
- 연구 분야 키워드 (검색용)
- 연구실 한줄 소개
- 주요 연구 주제 요약 (AI 봇 학습용 데이터)
- 현재 연구실 인원
- 선호 작업 스타일
- 원하는 강점 키워드 (최대 3개)

**선택 항목**
- 연구실 사진
- 추가 연구 문서/요약본 업로드 (AI 봇 추가 학습용)

---

## 5. 기능 상세

### 5.1 교수님 AI 대리인 (Bot)

**배경**
교수님이 학생과 긴 시간 상담했으나 학생이 나중에 단순 변심하는 상황을 방지하기 위해, 교수님의 연구 데이터를 학습한 AI가 1차적으로 학생의 궁금증을 해결하고 연구실 적합성을 자가 진단하게 합니다.

**구조 (RAG 기반)**
- **학습 흐름**: 교수님이 문서 업로드 (논문 PDF, 연구 요약, FAQ 등) → Gemini API가 문서 내용을 기반으로 벡터 인덱싱 → 검색 기반 응답 생성
- **학생 이용 흐름**: 프로필 내 'AI 봇에게 질문하기' 클릭 → 봇과 대화 → 필요한 경우 '교수님께 직접 연결' 요청
- **교수님 관리**: 주기적으로 봇 대화 로그를 확인하고, 잘못된 답변 발견 시 문서 재업로드로 재학습(Feedback)

### 5.2 교수님 탐색 (키워드 검색)

- 관심 키워드 기반 검색 제공 (AI, 머신러닝, 보안 등)
- 해당 키워드와 연관된 교수님 및 연구실 목록 출력
- 검색 결과 상단에는 현재 활발히 모집 중인(공고 있음) 연구실 우선 노출

### 5.3 논문 탭 (Semantic Scholar 연동)

- **Semantic Scholar API**를 연동하여 교수님의 최신 논문 목록, 인용 수 등을 자동 표시
- 논문 제목 클릭 시 원문 링크 연결 또는 AI 요약 제공
- 교수님이 직접 논문 PDF 업로드 시 AI 봇 학습 데이터로 자동 연동 가능

### 5.4 교수님 공고 매칭

**매칭 흐름**
```
1단계  학생이 키워드로 교수님 탐색 (AI, 보안 등)
   ↓
2단계  관심 교수님 프로필 및 논문 탭 확인
   ↓
3단계  교수님 AI 봇에게 연구실 생활이나 연구 내용 질문 (1차 필터링)
   ↓
4단계  충분한 정보 파악 후 현재 올라온 공고에 지원
   ↓
5단계  교수님 지원자 카드 비교 + AI 추천 순위 확인
   ↓
6단계  수락/거절 → 결과 알림 + (필요 시) 교수님과 직접 채팅 연결 (2차)
```

### 5.5 채팅 레이어 구조

> 학생이 교수님을 직접 만나기 전에 AI 봇이 1차 필터링 역할을 수행합니다.

| 채팅 유형 | 조건 | 설명 |
|----------|------|------|
| 학생 ↔ 교수님 AI 봇 | 상시 가능 | 교수님 문서 기반 AI 자동 응대 (Supabase 저장) |
| 학생 ↔ 교수님 (직접) | 지원 수락 후 | 최종 매칭을 위한 실시간 소통 (Firebase 사용) |
| 현재 연구생 ↔ 후배 | 연구생 등록 시 | 연구실 실시간 정보 제공 |
| 이용자 ↔ 이용자 | 앱 이용자 | 밥약속 등 자유로운 소통 창구 |

---

## 6. DB 스키마

> ※ 프로토타입 기준 간략화된 스키마

### users (학생)
```sql
id            UUID PRIMARY KEY
student_id    VARCHAR   -- 학번
grade         INT       -- 학년
gpa           FLOAT     -- 학점
major         VARCHAR   -- 전공
sub_major     VARCHAR   -- 부전공 (선택)
skills        TEXT[]    -- 보유 스킬 (선택)
courses       TEXT[]    -- 수강 완료 과목 (선택)
language      VARCHAR   -- 어학 성적 (선택)
interest      VARCHAR   -- 관심 분야 (선택)
career_goal   VARCHAR   -- 진로 방향 (선택)
research_hope VARCHAR   -- 희망 연구 분야 (선택)
mbti          VARCHAR   -- MBTI (선택)
work_style    VARCHAR   -- 작업 스타일 (선택)
strengths     TEXT[]    -- 강점 키워드 최대 3개 (선택)
role          VARCHAR   -- 'student' | 'professor' | 'admin'
created_at    TIMESTAMP
```

### professors (교수님)
```sql
id            UUID PRIMARY KEY
name          VARCHAR
department    VARCHAR
lab_name      VARCHAR
email         VARCHAR
scholar_link  VARCHAR   -- Semantic Scholar 프로필 링크
keywords      TEXT[]    -- 검색용 키워드 (AI, 보안 등)
lab_intro     VARCHAR
research_summary TEXT   -- AI 봇 학습용 연구 요약
lab_size      INT
pref_style    VARCHAR   -- 선호 작업 스타일
pref_strength TEXT[]    -- 원하는 강점 키워드
lab_photo     VARCHAR   -- 사진 URL (선택)
created_at    TIMESTAMP
```

### professor_docs (봇 학습 데이터)
```sql
id            UUID PRIMARY KEY
professor_id  UUID REFERENCES professors(id)
file_name     VARCHAR
file_url      VARCHAR   -- Supabase Storage 경로
doc_type      VARCHAR   -- 'paper' | 'summary' | 'faq'
is_active     BOOLEAN   -- 봇 학습 활성화 여부
created_at    TIMESTAMP
```

### bot_conversations (봇 대화 로그)
```sql
id            UUID PRIMARY KEY
professor_id  UUID REFERENCES professors(id)
student_id    UUID REFERENCES users(id)
question      TEXT
answer        TEXT
is_escalated  BOOLEAN   -- 직접 채팅으로 전환 요청 여부
created_at    TIMESTAMP
```

### posts (공고)
```sql
id            UUID PRIMARY KEY
professor_id  UUID REFERENCES professors(id)
purpose       VARCHAR   -- 모집 목적
headcount     INT       -- 모집 인원
deadline      DATE
duration      VARCHAR   -- 활동 기간
min_grade     INT       -- 최소 학년
max_grade     INT       -- 최대 학년
min_gpa       FLOAT     -- 최소 학점
major_req     VARCHAR   -- 전공 조건
work_style    VARCHAR   -- 원하는 작업 스타일
strength_req  TEXT[]    -- 원하는 강점 키워드
skills_req    TEXT[]    -- 필요 스킬 (선택)
preferred     TEXT      -- 우대 사항 (선택)
mbti_pref     VARCHAR   -- 선호 MBTI (선택)
hours         VARCHAR   -- 활동 시간 (선택)
benefits      TEXT      -- 혜택 (선택)
interview     BOOLEAN   -- 면담 여부 (선택)
description   TEXT      -- 상세 설명 (선택)
is_active     BOOLEAN
created_at    TIMESTAMP
```

### applications (지원)
```sql
id            UUID PRIMARY KEY
post_id       UUID REFERENCES posts(id)
student_id    UUID REFERENCES users(id)
status        VARCHAR   -- 'pending' | 'accepted' | 'rejected'
ai_rank       INT       -- AI 추천 순위
feedback      TEXT      -- AI 피드백
created_at    TIMESTAMP
```

### search_logs (검색 로그)
```sql
id            UUID PRIMARY KEY
student_id    UUID REFERENCES users(id)
keyword       VARCHAR
created_at    TIMESTAMP
```

### careers (커리어 트래킹)
```sql
id            UUID PRIMARY KEY
professor_id  UUID REFERENCES professors(id)
career_type   VARCHAR   -- '취업' | '대학원'
company       VARCHAR   -- 익명화된 회사/학교명
year          INT       -- 졸업 연도
is_current    BOOLEAN   -- 현재 연구생 여부
created_at    TIMESTAMP
```

---

## 7. API 명세

> ※ 팀 내부 연동용 / 발표 시 불필요

### 인증
```
POST /api/auth/signup       회원가입
POST /api/auth/login        로그인
GET  /api/auth/me           내 정보 조회
```

### 학생
```
GET    /api/students/:id        학생 프로필 조회
PUT    /api/students/:id        학생 프로필 수정
```

### 교수님 & 논문
```
GET    /api/professors          교수님 목록 (검색 지원)
GET    /api/professors/:id      교수님 상세
PUT    /api/professors/:id      교수님 수정
GET    /api/professors/:id/career  커리어 트래킹 조회
GET    /api/professors/:id/papers  Semantic Scholar 기반 논문 조회
```

### AI 봇 관리
```
POST   /api/bot/:id/chat        학생 → AI 봇 질문 (RAG 답변)
GET    /api/bot/:id/logs        봇 대화 로그 조회 (교수님)
POST   /api/bot/:id/docs        학습 문서 업로드 (교수님)
DELETE /api/bot/:id/docs/:docId 학습 문서 삭제
PUT    /api/bot/:id/docs/:docId 학습 문서 활성화/비활성화
```

### 공고
```
GET    /api/posts               공고 목록
GET    /api/posts/:id           공고 상세
POST   /api/posts               공고 등록
PUT    /api/posts/:id           공고 수정
DELETE /api/posts/:id           공고 삭제
```

### 지원
```
POST   /api/applications        지원하기
GET    /api/applications/my     내 지원 목록
GET    /api/posts/:id/applications  지원자 목록 (교수님)
PUT    /api/applications/:id    수락/거절 (교수님)
```

### AI 매칭
```
POST   /api/match               공고 기반 학생 매칭 요청
  body: { post_id }
  return: { matched_students: [], ai_feedback: "" }
```

---

## 8. 컴포넌트 구조

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.jsx
│   │   └── signup/page.jsx
│   ├── student/
│   │   ├── profile/page.jsx
│   │   ├── search/page.jsx      -- 교수님 키워드 검색
│   │   ├── professors/[id]/page.jsx -- 봇 질문 및 논문 탭 포함
│   │   ├── posts/page.jsx
│   │   └── applications/page.jsx
│   ├── professor/
│   │   ├── profile/page.jsx
│   │   ├── bot/page.jsx         -- 봇 문서 및 로그 관리
│   │   ├── posts/create/page.jsx
│   │   └── applicants/[postId]/page.jsx
│   ├── career/page.jsx
│   ├── chat/
│   │   ├── page.jsx
│   │   └── [roomId]/page.jsx
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   ├── PostCard.jsx
│   ├── ApplicantCard.jsx
│   ├── ProfessorCard.jsx
│   ├── PaperTab.jsx          -- 논문 목록 (Semantic Scholar)
│   ├── BotChatWindow.jsx     -- AI 봇 채팅 UI
│   └── Navbar.jsx
└── utils/
    ├── supabase.js
    ├── firebase.js
    ├── gemini.js
    └── semanticScholar.js    -- Semantic Scholar API 호출
```

---

## 9. Gemini 프롬프트 설계

### 9.1 조건 매칭 프롬프트

```
[시스템]
당신은 학과 연구실 매칭 AI입니다.
교수님의 공고 조건과 학생 프로필을 비교하여
적합도를 0~100점으로 평가하고 이유를 한국어로 설명하세요.
반드시 JSON 형식으로만 응답하세요.

[입력]
공고 조건: {post_data}
학생 프로필: {student_data}

[출력 형식]
{
  "score": 85,
  "reason": "학점과 전공 조건 충족, 작업 스타일 일치",
  "feedback": "Python 스킬을 보완하면 더 좋을 것 같아요"
}
```

### 9.2 피드백 프롬프트 (불합격 시)

```
[시스템]
당신은 학과 연구실 매칭 AI입니다.
학생이 지원에서 탈락했을 때 부족한 부분과
다음 지원을 위한 개선 방향을 친절하게 안내하세요.
2~3문장으로 간결하게 작성하세요.

[입력]
공고 조건: {post_data}
학생 프로필: {student_data}
```

### 9.3 교수님 AI 대리인 봇 프롬프트 (RAG)

```
[시스템]
당신은 {professor_name} 교수님의 AI 대리인입니다.
제공된 연구실 문서 내용을 기반으로만 답변하세요.
문서에 없는 내용은 "교수님께 직접 문의해 주세요"라고 안내하세요.
답변은 친절하고 간결하게, 한국어로 작성하세요.

[교수님 제공 문서]
{professor_docs}

[학생 질문]
{student_question}

[출력 형식]
{
  "answer": "답변 내용",
  "suggest_escalation": true | false
}
```

---

## 10. Firebase 채팅 구조

```
chatRooms/
├── {roomId}/
│   ├── type: "professor_student" | "lab_junior" | "user_user"
│   ├── participants: [userId1, userId2]
│   ├── createdAt: timestamp
│   └── messages/
│       └── {messageId}/
│           ├── senderId: string
│           ├── text: string
│           └── createdAt: timestamp
```

> 채팅방 생성 조건
> - professor_student: 지원 수락 시 자동 생성
> - lab_junior: 연구생 등록 시 생성
> - user_user: 이용자가 직접 개설

> ※ AI 봇 대화는 Supabase에, 사람 간 실시간 채팅은 Firebase에 분리 저장함.

---

## 11. 구현 체크리스트

### 필수 기능
- [ ] 학생 회원가입 + 프로필 입력
- [ ] 교수님 회원가입 + 프로필 입력 (Semantic Scholar 링크 포함)
- [ ] 관리자 계정 + 권한별 로그인 분리
- [ ] 교수님 AI 봇 학습 데이터 업로드 및 설정 화면
- [ ] Gemini AI 기반 교수님 대리인 봇 (RAG 질문/답변)
- [ ] 키워드 기반 교수님 및 연구실 탐색 (검색 기능)
- [ ] Semantic Scholar 연동 논문 탭 (목록 표시)
- [ ] 교수님 공고 작성 및 목록 상세 화면
- [ ] 학생 공고 지원 + AI 조건 분석 매칭
- [ ] 수락/거절 + 결과 알림

### 선택 기능 (시간 되면)
- [ ] 연구실 커리어 트래킹 (졸업생 진로 시각화)
- [ ] 봇 답변에 대한 교수님 피드백 및 재학습 로직
- [ ] 성향 매칭 (MBTI 및 작업 스타일)
- [ ] 실시간 채팅 (Firebase 연동)
- [ ] AI 봇 → 교수님 직접 채팅 전환 버튼

---

## 12. 개발 일정 (2일)

| 시간 | UI팀 (2명) | 백엔드팀 (2명) | AI팀 (1명) | 기획/발표 (1명) |
|------|-----------|--------------|-----------|--------------|
| 1일차 오전 | 회원가입/프로필 화면, 공고 목록/상세 화면 | DB 설계, 회원가입/공고 API | Gemini API 연동, 조건 분석 로직 | 발표자료 초안, 데모 시나리오 |
| 1일차 오후 | 지원자 카드 화면, UI 더미데이터 연동 | 지원 API, API 연동 시작 | 매칭 알림 로직, AI 연동 테스트 | 팀 진행상황 조율 |
| 2일차 오전 | 버그 수정, 선택기능 UI | 선택기능 API, 버그 수정 | 성향 매칭 추가, 최적화 | 발표자료 완성 |
| 2일차 오후 | 최종 UI 점검 | 최종 연동 점검 | 최종 테스트 | 데모 영상 촬영 |

---

## 13. 발표 준비

### 13.1 발표 구성 (5분)

```
00:00 - 01:00  문제 제시 (왜 만들었는지, 기존 서비스 한계)
01:00 - 03:00  데모 영상 (공고 등록 → AI 매칭 → 지원 흐름)
03:00 - 04:00  바이브코딩 과정 소개 (AI 활용 개발 프로세스)
04:00 - 05:00  팀원 역할 + 마무리
```

### 13.2 평가 항목 대응

| 평가 항목 | 대응 내용 |
|----------|----------|
| 목적 부합도 & 창의성 | 에타/포털 없는 기능, 기회가 학생을 찾아오는 구조 강조 |
| 바이브코딩 과정 | 기획→명세→AI 코드 생성→디버깅 흐름 소개 |
| 완성도 | 핵심 매칭 흐름 데모 영상으로 시연 |
| 참여도 | 팀원별 역할 분담 명확히 발표 |

### 13.3 예상 질문 대비

- "에브리타임이랑 뭐가 달라요?" → 학과 맞춤 + AI 매칭 + 커리어 트래킹 차별점
- "교수님이 실제로 앱 쓸까요?" → 관리자가 대신 올릴 수 있는 구조 설명
- "데이터는 어떻게 모아요?" → 프로토타입 기준 더미데이터, 실제 서비스 시 학생회 협력

---

## 14. 미결 사항

| 항목 | 내용 | 결정 시기 |
|------|------|----------|
| Semantic Scholar API 호출량 | 무료 티어 한도 내 구현 가능 여부 확인 | 1일차 오전 회의 |
| AI 봇 학습 데이터 포맷 | PDF 업로드 지원 여부 또는 텍스트 요약본 위주 결정 | 1일차 오전 회의 |
| 졸업 선배 유입 전략 | 앱 가입 유도 방법 | 추후 결정 |
| 채팅 기능 최종 확정 | AI 봇 답변으로 충분한지, 실시간 채팅이 꼭 필요한지 | 1일차 오전 회의 |

---

## 15. AI 코딩 에이전트 지침

> **Claude Code / Gemini CLI 공통 적용**  
> 작업 시작 전 반드시 이 섹션을 읽고 모든 규칙을 따를 것

---

### 15.1 매 세션 시작 시 필수 선행 작업

1. `tasks/lessons.md` 읽기 — 없으면 새로 생성 후 진행
2. `RULES.md` 읽기 — 공통 규칙 확인
3. `STRUCTURE.md` 읽기 — 없으면 새로 생성 후 진행
4. 수정할 파일 직접 읽기

---

### 15.2 워크플로우

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

### 15.3 핵심 원칙

| 원칙 | 내용 |
|------|------|
| **단순함 우선** | 가능한 한 단순하게. 최소한의 코드만 건드릴 것 |
| **나태함 금지** | 임시방편 금지. 근본 원인을 찾아 해결 |
| **최소 영향** | 요청한 것만 변경. 불필요한 코드 건드리지 않기 |

---

### 15.4 코드 품질

- 비자명한 변경 시: "더 우아한 방법이 없을까?" 스스로 질문
- hacky하다는 느낌이 들면: 지금 알고 있는 것을 바탕으로 우아한 해법으로 재구현
- 단순·명백한 수정에는 이 과정 생략 (과잉 엔지니어링 금지)

---

### 15.5 버그 수정

- 버그 보고 받으면 추가 설명 요청 없이 바로 수정
- 로그, 에러, 실패 테스트를 직접 확인하고 해결
- 사용자에게 컨텍스트 전환 요구 금지

---

### 15.6 파일 관리

- 파일 전체 재작성 금지 → 필요한 부분만 Edit
- 새 파일 생성 시 `STRUCTURE.md`에 역할 한 줄 추가
- `tasks/` 하위 로그 파일 없으면 자동 생성 후 기록
  - `tasks/lessons.md` — 없으면 생성
  - `tasks/todo.md` — 없으면 생성
  - `tasks/impl_log.md` — 없으면 생성
  - `tasks/error_log.md` — 없으면 생성
  - `tasks/action_log.md` — 없으면 생성

---

### 15.7 자기 개선 루프

수정받은 경우:
1. `tasks/lessons.md`에 실수 패턴 기록
2. 같은 실수 재발 방지 규칙 작성
3. 다음 세션 시작 시 이 파일 먼저 읽기

---

### 15.8 토큰 자동 절약

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
