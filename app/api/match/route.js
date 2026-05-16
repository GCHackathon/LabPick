import { NextResponse } from "next/server"
import { matchStudent } from "@/utils/gemini"

// ─────────────────────────────────────────
// Supabase 연동 시 아래 주석 해제 후 사용
// ─────────────────────────────────────────
// import { createClient } from "@supabase/supabase-js"
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// )
//
// async function getStudents(postData) {
//   const { data, error } = await supabase
//     .from("users")
//     .select("*")
//     .eq("role", "student")
//     .gte("grade", postData.min_grade ?? 1)
//     .lte("grade", postData.max_grade ?? 4)
//     .gte("gpa",   postData.min_gpa   ?? 0)
//   if (error) throw new Error(error.message)
//   return data
// }
// ─────────────────────────────────────────

// 더미 학생 데이터 (Supabase 연동 전까지 사용)
const DUMMY_STUDENTS = [
  {
    id: "s1",
    name: "김철수",
    grade: 3,
    gpa: 3.8,
    major: "컴퓨터공학",
    skills: ["Python", "PyTorch"],
    interest: "AI/ML",
    career_goal: "대학원",
    work_style: "혼자 집중",
    strengths: ["분석력", "꼼꼼함"],
    mbti: "INTJ",
  },
  {
    id: "s2",
    name: "이영희",
    grade: 2,
    gpa: 3.2,
    major: "컴퓨터공학",
    skills: ["Java", "React"],
    interest: "웹개발",
    career_goal: "취업",
    work_style: "같이 토론",
    strengths: ["협업", "커뮤니케이션"],
    mbti: "ENFP",
  },
  {
    id: "s3",
    name: "박민준",
    grade: 4,
    gpa: 4.1,
    major: "컴퓨터공학",
    skills: ["Python", "TensorFlow", "C++"],
    interest: "컴퓨터 비전",
    career_goal: "대학원",
    work_style: "혼자 집중",
    strengths: ["분석력", "추진력", "꼼꼼함"],
    mbti: "ISTJ",
  },
]

export async function POST(request) {
  try {
    const { post_id, post_data } = await request.json()

    if (!post_data) {
      return NextResponse.json({ error: "post_data가 필요합니다" }, { status: 400 })
    }

    // 학생 목록 가져오기
    // Supabase 연동 시: const students = await getStudents(post_data)
    // 더미 데이터 사용 시: 아래 하드 필터링으로 대체
    const filtered = DUMMY_STUDENTS.filter((s) => {
      if (post_data.min_grade && s.grade < post_data.min_grade) return false
      if (post_data.max_grade && s.grade > post_data.max_grade) return false
      if (post_data.min_gpa && s.gpa < post_data.min_gpa) return false
      return true
    })

    if (filtered.length === 0) {
      return NextResponse.json({ matched_students: [], ai_feedback: "조건에 맞는 학생이 없습니다." })
    }

    // Gemini로 각 학생 매칭 점수 계산 (병렬 처리)
    const results = await Promise.all(
      filtered.map(async (student) => {
        const match = await matchStudent(post_data, student)
        return {
          student_id: student.id,
          name: student.name,
          score: match.score,
          reason: match.reason,
          feedback: match.feedback,
        }
      })
    )

    // 점수 내림차순 정렬
    const ranked = results.sort((a, b) => b.score - a.score)

    return NextResponse.json({
      matched_students: ranked,
      ai_feedback: `총 ${ranked.length}명 분석 완료. 최고 적합도: ${ranked[0]?.score}점`,
    })
  } catch (error) {
    console.error("매칭 오류:", error.message)
    return NextResponse.json({ error: "매칭 처리 중 오류가 발생했습니다" }, { status: 500 })
  }
}
