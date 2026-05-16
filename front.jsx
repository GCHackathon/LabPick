"use client"
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Home,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

const mockPosts = [
  {
    id: 1,
    purpose: "연구실 인턴",
    title: "AI 서비스 기획 및 데이터 정리 인턴 모집",
    professor: "김도윤 교수님",
    lab: "Human-AI Lab",
    deadline: "2026-05-30",
    headcount: 2,
    duration: "6월 ~ 8월",
    minGrade: 2,
    minGpa: 3.2,
    major: "컴퓨터공학과",
    workStyle: "같이 토론하는 편",
    strengths: ["분석력", "커뮤니케이션", "꼼꼼함"],
    skills: ["Python", "React", "데이터 정리"],
    benefits: "연구 참여 확인서, 프로젝트 포트폴리오",
    description:
      "학과 학생을 대상으로 AI 서비스 기획과 데이터 정리 업무를 함께 진행할 인턴을 모집합니다. 기초적인 개발 경험이 있으면 좋지만, 성실하게 문서를 정리하고 팀과 소통할 수 있는 학생을 우대합니다.",
    matchScore: 92,
  },
  {
    id: 2,
    purpose: "캡스톤 팀원",
    title: "스마트 캠퍼스 앱 캡스톤 팀원 모집",
    professor: "이서연 교수님",
    lab: "Mobile Computing Lab",
    deadline: "2026-06-03",
    headcount: 3,
    duration: "2026-2학기",
    minGrade: 3,
    minGpa: 3.0,
    major: "컴퓨터공학과",
    workStyle: "둘 다 가능",
    strengths: ["추진력", "협업", "창의적"],
    skills: ["React", "Firebase", "UI 설계"],
    benefits: "캡스톤 프로젝트 연계, 발표 멘토링",
    description:
      "스마트 캠퍼스 서비스를 주제로 캡스톤 프로젝트를 진행할 팀원을 모집합니다. 프론트엔드, 백엔드, 기획 역할을 나누어 진행할 예정입니다.",
    matchScore: 86,
  },
  {
    id: 3,
    purpose: "행사 스태프",
    title: "학과 해커톤 운영 스태프 모집",
    professor: "학생회 C:ore",
    lab: "컴퓨터공학과",
    deadline: "2026-05-22",
    headcount: 5,
    duration: "행사 당일 + 사전 준비 1회",
    minGrade: 1,
    minGpa: 0,
    major: "무관",
    workStyle: "같이 토론하는 편",
    strengths: ["추진력", "커뮤니케이션"],
    skills: ["문서 정리", "행사 운영"],
    benefits: "봉사시간 또는 활동 확인서",
    description:
      "학과 해커톤의 접수, 안내, 현장 운영을 도와줄 스태프를 모집합니다. 책임감 있게 일정에 참여할 수 있는 학생을 우대합니다.",
    matchScore: 78,
  },
];

const mockProfessors = [
  {
    id: 1,
    name: "김도윤 교수님",
    lab: "Human-AI Lab",
    field: "인공지능, HCI, 추천 시스템",
    intro: "사람을 돕는 AI 서비스를 연구합니다.",
    topics: ["AI 추천", "사용자 경험", "데이터 기반 서비스"],
    size: 8,
    style: "같이 토론하는 편",
    strengths: ["분석력", "커뮤니케이션", "꼼꼼함"],
    careers: { employment: 62, graduate: 38 },
    current: ["프론트엔드 연구생", "데이터 분석 연구생"],
    rankScore: 4.8,
  },
  {
    id: 2,
    name: "이서연 교수님",
    lab: "Mobile Computing Lab",
    field: "모바일 컴퓨팅, 앱 개발, 클라우드",
    intro: "실제 서비스로 이어지는 모바일 프로젝트를 진행합니다.",
    topics: ["앱 서비스", "Firebase", "클라우드"],
    size: 6,
    style: "둘 다 가능",
    strengths: ["협업", "추진력", "창의적"],
    careers: { employment: 71, graduate: 29 },
    current: ["Flutter 연구생", "백엔드 연구생"],
    rankScore: 4.6,
  },
  {
    id: 3,
    name: "박민재 교수님",
    lab: "Data Intelligence Lab",
    field: "데이터마이닝, 빅데이터, 시각화",
    intro: "데이터에서 의미 있는 패턴을 찾는 연구를 합니다.",
    topics: ["데이터 분석", "시각화", "예측 모델"],
    size: 10,
    style: "혼자 집중하는 편",
    strengths: ["분석력", "꼼꼼함", "추진력"],
    careers: { employment: 55, graduate: 45 },
    current: ["데이터 전처리 연구생", "시각화 연구생"],
    rankScore: 4.5,
  },
];

const mockChats = [
  {
    id: 1,
    name: "김도윤 교수님",
    type: "교수님 ↔ 학생",
    last: "지원서 확인했습니다. 가능하면 이번 주에 면담해요.",
    time: "오후 2:15",
  },
  {
    id: 2,
    name: "Human-AI Lab 연구생",
    type: "연구생 ↔ 후배",
    last: "처음 들어오면 데이터 정리부터 같이 해요.",
    time: "오전 11:40",
  },
  {
    id: 3,
    name: "캡스톤 팀원 모집방",
    type: "이용자 ↔ 이용자",
    last: "프론트엔드 맡을 사람 있나요?",
    time: "어제",
  },
];

const studentProfile = {
  studentId: "202533795",
  grade: 2,
  gpa: 3.72,
  major: "컴퓨터공학과",
  subMajor: "없음",
  skills: ["React", "Python", "Firebase 기초"],
  courses: ["웹프로그래밍", "파이썬", "데이터베이스 기초"],
  interest: "AI 서비스 기획, 프론트엔드 개발",
  careerGoal: "취업",
  workStyle: "같이 토론하는 편",
  strengths: ["추진력", "커뮤니케이션", "꼼꼼함"],
};

const tabs = [
  { id: "home", label: "홈", icon: Home },
  { id: "profile", label: "프로필", icon: UserRound },
  { id: "posts", label: "공고", icon: ClipboardList },
  { id: "labs", label: "연구실", icon: GraduationCap },
  { id: "ranking", label: "랭킹", icon: Trophy },
  { id: "chat", label: "소통", icon: MessageCircle },
];

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [posts, setPosts] = useState(mockPosts); // 초기값: 더미, API 응답 오면 교체
  const [selectedPost, setSelectedPost] = useState(mockPosts[0]);
  const [selectedProfessor, setSelectedProfessor] = useState(mockProfessors[0]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toast, setToast] = useState("");
  const [isMatching, setIsMatching] = useState(false);

  // 마운트 시 실제 API로 매칭 점수 가져오기
  useEffect(() => {
    async function fetchMatchedPosts() {
      setIsMatching(true);
      try {
        const res = await fetch("/api/match/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student: studentProfile }),
        });
        const data = await res.json();
        if (data.posts) {
          setPosts(data.posts);
          setSelectedPost(data.posts[0]);
        }
      } catch (e) {
        console.error("매칭 API 오류:", e);
      } finally {
        setIsMatching(false);
      }
    }
    fetchMatchedPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const target = `${post.title} ${post.professor} ${post.lab} ${(post.skills || post.skills_req || []).join(" ")} ${(post.strengths || post.strength_req || []).join(" ")}`;
      return target.toLowerCase().includes(searchKeyword.toLowerCase());
    });
  }, [searchKeyword]);

  const handleApply = () => {
    setToast("지원이 완료되었습니다. 입력한 프로필이 자동 첨부되었어요.");
    setTimeout(() => setToast(""), 2600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {isMatching && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-slate-900 px-4 py-3 text-sm text-cyan-300 shadow-xl">
          <Sparkles size={16} className="animate-pulse" /> AI 매칭 점수 계산 중...
        </div>
      )}
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/80 px-5 py-6 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-400">학과 AI 매칭</p>
              <h1 className="text-lg font-bold">Bridge Lab</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow-lg"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
            <p className="text-xs text-cyan-200">AI 추천 상태</p>
            <p className="mt-2 text-sm font-semibold">프로필 완성도 82%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[82%] rounded-full bg-cyan-300" />
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="mt-4 w-full rounded-2xl bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950"
            >
              프로필 보완하기
            </button>
          </div>
        </aside>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

          <AnimateView keyName={activeTab}>
            {activeTab === "home" && (
              <HomePage
                setActiveTab={setActiveTab}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
              />
            )}
            {activeTab === "profile" && <ProfilePage setShowProfileModal={setShowProfileModal} />}
            {activeTab === "posts" && (
              <PostsPage
                posts={filteredPosts}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                handleApply={handleApply}
              />
            )}
            {activeTab === "labs" && (
              <LabsPage
                selectedProfessor={selectedProfessor}
                setSelectedProfessor={setSelectedProfessor}
              />
            )}
            {activeTab === "ranking" && <RankingPage />}
            {activeTab === "chat" && <ChatPage />}
          </AnimateView>
        </main>
      </div>

      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function AnimateView({ children, keyName }) {
  return (
    <motion.div
      key={keyName}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function MobileHeader({ activeTab, setActiveTab }) {
  return (
    <div className="mb-5 lg:hidden">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">학과 AI 매칭</p>
            <h1 className="font-bold">Bridge Lab</h1>
          </div>
        </div>
        <Bell className="text-slate-300" size={20} />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm ${
                activeTab === tab.id
                  ? "bg-white text-slate-950"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PageTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="mb-2 text-sm font-medium text-cyan-300">{eyebrow}</p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}

function HomePage({ setActiveTab, selectedPost, setSelectedPost }) {
  return (
    <div>
      <section className="mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-300/20 via-slate-900 to-violet-400/20 p-6 shadow-2xl shadow-black/20 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles size={16} /> AI가 먼저 찾아주는 학과 기회
            </div>
            <h2 className="text-3xl font-bold leading-tight sm:text-5xl">
              학생이 공고를 찾는 대신,
              <br /> 조건에 맞는 기회가 먼저 도착합니다.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              교수님 공고 조건과 학생 프로필을 비교해 연구실 인턴, 캡스톤, 행사 스태프 기회를 추천하는 학과 맞춤형 AI 매칭 플랫폼입니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab("posts")}
                className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-300/20"
              >
                추천 공고 보기
              </button>
              <button
                onClick={() => setActiveTab("labs")}
                className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white"
              >
                연구실 둘러보기
              </button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">오늘의 AI 추천</p>
                <h3 className="text-xl font-bold">매칭 점수 {selectedPost.matchScore}점</h3>
              </div>
              <div className="rounded-2xl bg-cyan-300 p-3 text-slate-950">
                <Sparkles size={22} />
              </div>
            </div>
            <PostMiniCard post={selectedPost} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {mockPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`rounded-2xl px-3 py-2 text-xs ${
                    selectedPost.id === post.id
                      ? "bg-white text-slate-950"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {post.purpose}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={ClipboardList} label="등록 공고" value="18개" />
        <StatCard icon={UsersRound} label="참여 학생" value="126명" />
        <StatCard icon={GraduationCap} label="연구실" value="12곳" />
        <StatCard icon={CheckCircle2} label="매칭 완료" value="34건" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">최근 추천 공고</h3>
            <button onClick={() => setActiveTab("posts")} className="text-sm text-cyan-300">
              전체 보기
            </button>
          </div>
          <div className="space-y-3">
            {mockPosts.map((post) => (
              <PostRow key={post.id} post={post} onClick={() => setSelectedPost(post)} />
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">내 프로필 기반 추천 이유</h3>
            <Sparkles className="text-cyan-300" size={20} />
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <ReasonItem text="React, Python, Firebase 기초 스킬이 공고 조건과 일부 일치합니다." />
            <ReasonItem text="작업 스타일이 ‘같이 토론하는 편’으로 연구실 선호와 잘 맞습니다." />
            <ReasonItem text="강점 키워드 중 커뮤니케이션, 꼼꼼함이 추천 조건에 포함되어 있습니다." />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProfilePage({ setShowProfileModal }) {
  return (
    <div>
      <PageTitle
        eyebrow="Student Profile"
        title="학생 프로필"
        description="공고 지원 시 이 프로필이 자동 첨부됩니다. AI 매칭 정확도를 높이려면 스킬, 관심 분야, 강점 키워드를 채워두는 것이 좋습니다."
        action={
          <button
            onClick={() => setShowProfileModal(true)}
            className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950"
          >
            프로필 수정
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-cyan-300 to-violet-300 text-3xl font-black text-slate-950">
              윤
            </div>
            <h3 className="text-xl font-bold">윤지윤</h3>
            <p className="mt-1 text-sm text-slate-400">{studentProfile.major} · {studentProfile.grade}학년</p>
            <div className="mt-5 w-full rounded-3xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">프로필 완성도</p>
              <p className="mt-1 text-2xl font-bold">82%</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-full w-[82%] rounded-full bg-cyan-300" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-bold">기본 정보</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem label="학번" value={studentProfile.studentId} />
            <InfoItem label="학년" value={`${studentProfile.grade}학년`} />
            <InfoItem label="학점" value={`${studentProfile.gpa}`} />
            <InfoItem label="전공" value={studentProfile.major} />
            <InfoItem label="부전공" value={studentProfile.subMajor} />
            <InfoItem label="진로 방향" value={studentProfile.careerGoal} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <SectionTitle icon={BriefcaseBusiness} title="보유 스킬" />
          <TagList items={studentProfile.skills} />
        </Card>
        <Card>
          <SectionTitle icon={ClipboardList} title="수강 완료 과목" />
          <TagList items={studentProfile.courses} />
        </Card>
        <Card>
          <SectionTitle icon={Star} title="강점 키워드" />
          <TagList items={studentProfile.strengths} />
        </Card>
      </div>
    </div>
  );
}

function PostsPage({
  posts,
  selectedPost,
  setSelectedPost,
  searchKeyword,
  setSearchKeyword,
  handleApply,
}) {
  return (
    <div>
      <PageTitle
        eyebrow="Matching Posts"
        title="공고 목록"
        description="교수님이 등록한 연구실 인턴, 캡스톤, 행사 스태프 공고를 확인하고 내 프로필로 바로 지원할 수 있습니다."
        action={
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="공고, 스킬, 연구실 검색"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
            />
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className={`w-full rounded-[1.75rem] border p-5 text-left transition ${
                selectedPost.id === post.id
                  ? "border-cyan-300/60 bg-cyan-300/10"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/10"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <Badge>{post.purpose}</Badge>
                  <h3 className="mt-3 text-lg font-bold">{post.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{post.professor} · {post.lab}</p>
                </div>
                <div className="rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-950">
                  {post.matchScore}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(post.skills || post.skills_req || []).slice(0, 3).map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </button>
          ))}
        </div>

        <Card className="xl:sticky xl:top-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Badge>{selectedPost.purpose}</Badge>
              <h3 className="mt-3 text-2xl font-bold">{selectedPost.title}</h3>
              <p className="mt-2 text-sm text-slate-400">
                {selectedPost.professor} · {selectedPost.lab}
              </p>
            </div>
            <div className="rounded-3xl bg-cyan-300 p-4 text-center text-slate-950">
              <p className="text-xs font-bold">AI 점수</p>
              <p className="text-2xl font-black">{selectedPost.matchScore}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem label="모집 인원" value={`${selectedPost.headcount}명`} />
            <InfoItem label="마감일" value={selectedPost.deadline} />
            <InfoItem label="활동 기간" value={selectedPost.duration} />
            <InfoItem label="지원 조건" value={`${selectedPost.minGrade}학년 이상 · ${selectedPost.minGpa || "제한 없음"}`} />
          </div>

          <div className="mt-5 rounded-3xl bg-white/5 p-4">
            <h4 className="mb-2 font-bold">상세 설명</h4>
            <p className="text-sm leading-7 text-slate-300">{selectedPost.description}</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-300">필요 스킬</h4>
              <TagList items={selectedPost.skills || selectedPost.skills_req || []} />
            </div>
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-300">원하는 강점</h4>
              <TagList items={selectedPost.strengths || selectedPost.strength_req || []} />
            </div>
          </div>

          <button
            onClick={handleApply}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 font-bold text-slate-950 shadow-lg shadow-cyan-300/20"
          >
            내 프로필로 지원하기 <ChevronRight size={18} />
          </button>
        </Card>
      </div>
    </div>
  );
}

function LabsPage({ selectedProfessor, setSelectedProfessor }) {
  return (
    <div>
      <PageTitle
        eyebrow="Lab Career Tracking"
        title="연구실 정보"
        description="교수님별 연구 분야, 연구실 분위기, 현재 연구생 정보, 졸업 선배 진로 데이터를 확인할 수 있습니다."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          {mockProfessors.map((professor) => (
            <button
              key={professor.id}
              onClick={() => setSelectedProfessor(professor)}
              className={`w-full rounded-[1.75rem] border p-5 text-left transition ${
                selectedProfessor.id === professor.id
                  ? "border-cyan-300/60 bg-cyan-300/10"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/10"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-black text-slate-950">
                  {professor.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{professor.name}</h3>
                  <p className="mt-1 text-sm text-cyan-200">{professor.lab}</p>
                  <p className="mt-2 text-sm text-slate-400">{professor.intro}</p>
                </div>
                <ChevronRight className="text-slate-500" size={18} />
              </div>
            </button>
          ))}
        </div>

        <Card>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm text-cyan-300">{selectedProfessor.field}</p>
              <h3 className="mt-2 text-2xl font-bold">{selectedProfessor.lab}</h3>
              <p className="mt-2 text-sm text-slate-400">{selectedProfessor.name}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 text-center text-slate-950">
              <p className="text-xs font-bold">평점</p>
              <p className="text-2xl font-black">{selectedProfessor.rankScore}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-5">
            <h4 className="mb-2 font-bold">연구실 한줄 소개</h4>
            <p className="text-sm leading-7 text-slate-300">{selectedProfessor.intro}</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoItem label="현재 연구실 인원" value={`${selectedProfessor.size}명`} />
            <InfoItem label="선호 작업 스타일" value={selectedProfessor.style} />
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <div>
              <SectionTitle icon={Sparkles} title="주요 연구 주제" />
              <TagList items={selectedProfessor.topics} />
            </div>
            <div>
              <SectionTitle icon={Star} title="선호 강점" />
              <TagList items={selectedProfessor.strengths} />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <h4 className="mb-4 font-bold">졸업 선배 진로 데이터</h4>
            <div className="space-y-4">
              <Progress label="취업" value={selectedProfessor.careers.employment} />
              <Progress label="대학원" value={selectedProfessor.careers.graduate} />
            </div>
          </div>

          <div className="mt-6">
            <SectionTitle icon={UsersRound} title="현재 연구생 정보" />
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedProfessor.current.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RankingPage() {
  const sorted = [...mockProfessors].sort((a, b) => b.rankScore - a.rankScore);
  return (
    <div>
      <PageTitle
        eyebrow="Professor Ranking"
        title="교수님 랭킹"
        description="학생 투표 기반으로 탑 10을 보여주는 화면입니다. 프로토타입에서는 더미 점수로 표시했습니다."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <div className="space-y-4">
            {sorted.map((professor, index) => (
              <div
                key={professor.id}
                className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black ${index === 0 ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white"}`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{professor.name}</h3>
                  <p className="text-sm text-slate-400">{professor.lab}</p>
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-950">
                  <Star size={15} fill="currentColor" /> {professor.rankScore}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-bold">투표하기</h3>
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">교수님 선택</label>
            <select className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none">
              {mockProfessors.map((professor) => (
                <option key={professor.id}>{professor.name}</option>
              ))}
            </select>
            <label className="block pt-2 text-sm text-slate-400">점수</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button key={score} className="rounded-2xl bg-white/10 py-3 font-bold hover:bg-cyan-300 hover:text-slate-950">
                  {score}
                </button>
              ))}
            </div>
            <button className="mt-4 w-full rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-950">
              투표 제출
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  return (
    <div>
      <PageTitle
        eyebrow="Firebase Chat"
        title="소통"
        description="교수님과 학생, 연구생과 후배, 이용자 간 1:1 채팅을 보여주는 화면입니다. 실제 구현 시 Firebase Firestore와 연결하면 됩니다."
      />

      <div className="grid min-h-[620px] gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-3">
          <div className="space-y-2">
            {mockChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full rounded-3xl p-4 text-left transition ${
                  selectedChat.id === chat.id ? "bg-cyan-300 text-slate-950" : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${selectedChat.id === chat.id ? "bg-slate-950 text-white" : "bg-white/10"}`}>
                    <MessageCircle size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-bold">{chat.name}</h3>
                      <span className="shrink-0 text-xs opacity-70">{chat.time}</span>
                    </div>
                    <p className="mt-1 text-xs opacity-70">{chat.type}</p>
                    <p className="mt-2 truncate text-sm opacity-90">{chat.last}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden p-0">
          <div className="border-b border-white/10 p-5">
            <h3 className="font-bold">{selectedChat.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{selectedChat.type}</p>
          </div>
          <div className="flex-1 space-y-4 p-5">
            <ChatBubble mine={false} text="안녕하세요. 공고 보고 궁금한 점이 있어서 연락드립니다." />
            <ChatBubble mine text="네, 편하게 질문 주세요!" />
            <ChatBubble mine={false} text={selectedChat.last} />
            <ChatBubble mine text="확인했습니다. 가능 일정 정리해서 다시 보내드리겠습니다." />
          </div>
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-3">
              <input
                placeholder="메시지를 입력하세요"
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-500"
              />
              <button className="rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-950">
                전송
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProfileModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-300">Profile Form</p>
            <h3 className="mt-1 text-2xl font-bold">학생 프로필 작성</h3>
            <p className="mt-2 text-sm text-slate-400">프로토타입 화면입니다. 실제 구현 시 저장 API와 연결하면 됩니다.</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 p-3">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="학번" defaultValue={studentProfile.studentId} />
          <FormField label="학년" defaultValue={`${studentProfile.grade}`} />
          <FormField label="학점" defaultValue={`${studentProfile.gpa}`} />
          <FormField label="전공" defaultValue={studentProfile.major} />
          <FormField label="관심 분야" defaultValue={studentProfile.interest} className="sm:col-span-2" />
          <FormField label="작업 스타일" defaultValue={studentProfile.workStyle} className="sm:col-span-2" />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold">
            취소
          </button>
          <button onClick={onClose} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950">
            저장하기
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function FormField({ label, defaultValue, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm text-slate-400">{label}</span>
      <input
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-300/60"
      />
    </label>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 ${className}`}>{children}</div>;
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-black">{value}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3 text-cyan-300">
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}

function PostMiniCard({ post }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <Badge>{post.purpose}</Badge>
      <h3 className="mt-3 font-bold">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-400">{post.professor}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(post.strengths || post.strength_req || []).map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    </div>
  );
}

function PostRow({ post, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 rounded-3xl bg-white/5 p-4 text-left hover:bg-white/10">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
        <ClipboardList size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-bold">{post.title}</h4>
        <p className="mt-1 text-sm text-slate-400">{post.deadline} 마감 · {post.headcount}명 모집</p>
      </div>
      <div className="rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-950">{post.matchScore}</div>
    </button>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="text-cyan-300" size={18} />
      <h3 className="font-bold">{title}</h3>
    </div>
  );
}

function TagList({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </div>
  );
}

function Tag({ children }) {
  return <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{children}</span>;
}

function Badge({ children }) {
  return <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-bold text-cyan-200">{children}</span>;
}

function ReasonItem({ text }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white/5 p-4">
      <CheckCircle2 className="mt-0.5 shrink-0 text-cyan-300" size={18} />
      <p>{text}</p>
    </div>
  );
}

function Progress({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-bold text-cyan-300">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-cyan-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ChatBubble({ mine, text }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-6 ${mine ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-slate-200"}`}>
        {text}
      </div>
    </div>
  );
}

function Toast({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-cyan-300/30 bg-slate-900 px-5 py-4 text-sm text-cyan-100 shadow-2xl"
    >
      {message}
    </motion.div>
  );
}

export default App;
