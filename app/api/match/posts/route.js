import { NextResponse } from "next/server"
import { matchStudent } from "@/utils/gemini"

// 더미 공고 데이터 (Supabase 연동 전까지 사용)
const DUMMY_POSTS = [
  {
    id: 1,
    purpose: "연구실 인턴",
    title: "AI 서비스 기획 및 데이터 정리 인턴 모집",
    professor: "김도윤 교수님",
    lab: "Human-AI Lab",
    deadline: "2026-05-30",
    headcount: 2,
    duration: "6월 ~ 8월",
    min_grade: 2,
    min_gpa: 3.2,
    major_req: "컴퓨터공학과",
    work_style: "같이 토론하는 편",
    strength_req: ["분석력", "커뮤니케이션", "꼼꼼함"],
    skills_req: ["Python", "React", "데이터 정리"],
    benefits: "연구 참여 확인서, 프로젝트 포트폴리오",
    description: "학과 학생을 대상으로 AI 서비스 기획과 데이터 정리 업무를 함께 진행할 인턴을 모집합니다.",
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
    min_grade: 3,
    min_gpa: 3.0,
    major_req: "컴퓨터공학과",
    work_style: "둘 다 가능",
    strength_req: ["추진력", "협업", "창의적"],
    skills_req: ["React", "Firebase", "UI 설계"],
    benefits: "캡스톤 프로젝트 연계, 발표 멘토링",
    description: "스마트 캠퍼스 서비스를 주제로 캡스톤 프로젝트를 진행할 팀원을 모집합니다.",
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
    min_grade: 1,
    min_gpa: 0,
    major_req: "무관",
    work_style: "같이 토론하는 편",
    strength_req: ["추진력", "커뮤니케이션"],
    skills_req: ["문서 정리", "행사 운영"],
    benefits: "봉사시간 또는 활동 확인서",
    description: "학과 해커톤의 접수, 안내, 현장 운영을 도와줄 스태프를 모집합니다.",
  },
]

// POST /api/match/posts
// body: { student } — 학생 프로필
// return: 공고 목록 + 각 AI 매칭 점수
export async function POST(request) {
  try {
    const { student } = await request.json()

    if (!student) {
      return NextResponse.json({ error: "student 프로필이 필요합니다" }, { status: 400 })
    }

    // 각 공고에 대해 학생 매칭 점수 계산 (병렬)
    const scored = await Promise.all(
      DUMMY_POSTS.map(async (post) => {
        // 하드 필터: 학년/학점 미달이면 Gemini 호출 없이 바로 낮은 점수
        if (post.min_grade && student.grade < post.min_grade) {
          return { ...post, matchScore: 20, reason: "학년 조건 미달", feedback: "해당 공고는 더 높은 학년을 요구합니다." }
        }
        if (post.min_gpa && student.gpa < post.min_gpa) {
          return { ...post, matchScore: 25, reason: "학점 조건 미달", feedback: "학점을 높인 후 재지원을 권장합니다." }
        }

        const match = await matchStudent(post, student)
        return {
          ...post,
          matchScore: match.score,
          reason: match.reason,
          feedback: match.feedback,
        }
      })
    )

    // 점수 내림차순 정렬
    const ranked = scored.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({ posts: ranked })
  } catch (error) {
    console.error("공고 매칭 오류:", error.message)
    return NextResponse.json({ error: "공고 매칭 중 오류가 발생했습니다" }, { status: 500 })
  }
}
