import { NextResponse } from "next/server"
import { matchStudent } from "@/utils/gemini"

// 임계치: 65점 미만은 부적합으로 판단
const MATCH_THRESHOLD = 65

// 더미 지원자 데이터 (Supabase 연동 전까지 사용)
// Supabase 연동 시:
// const { data, error } = await supabase
//   .from("applications")
//   .select("*, users(*)")
//   .eq("post_id", postId)
const DUMMY_APPLICATIONS = [
  {
    application_id: "a1",
    student_id: "s1",
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
    application_id: "a2",
    student_id: "s2",
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
    application_id: "a3",
    student_id: "s3",
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
  {
    application_id: "a4",
    student_id: "s4",
    name: "최수빈",
    grade: 1,
    gpa: 2.8,
    major: "전자공학",
    skills: ["C"],
    interest: "임베디드",
    career_goal: "취업",
    work_style: "같이 토론",
    strengths: ["추진력"],
    mbti: "ESFP",
  },
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("post_id")

    // post_data는 실제로는 Supabase에서 post_id로 조회
    // 더미: 요청에서 직접 받거나 고정값 사용
    const postData = {
      purpose: "연구실 인턴",
      min_grade: 2,
      min_gpa: 3.0,
      major_req: "컴퓨터공학",
      work_style: "혼자 집중",
      strength_req: ["분석력"],
      interest: "AI/ML",
    }

    // 전체 지원자 AI 점수 계산 (병렬)
    const scored = await Promise.all(
      DUMMY_APPLICATIONS.map(async (applicant) => {
        const match = await matchStudent(postData, applicant)
        return {
          application_id: applicant.application_id,
          student_id: applicant.student_id,
          name: applicant.name,
          score: match.score,
          reason: match.reason,
          feedback: match.feedback,
          // 임계치 기준 적정 여부
          is_qualified: match.score >= MATCH_THRESHOLD,
        }
      })
    )

    // 점수 내림차순 정렬 + 순위 부여
    const ranked = scored
      .sort((a, b) => b.score - a.score)
      .map((applicant, index) => ({ ...applicant, ai_rank: index + 1 }))

    // AI 점수/순위 DB 저장
    // Supabase 연동 시 아래 주석 해제
    // await Promise.all(
    //   ranked.map(({ application_id, ai_rank, score, feedback }) =>
    //     supabase
    //       .from("applications")
    //       .update({ ai_rank, ai_score: score, feedback })
    //       .eq("id", application_id)
    //   )
    // )

    // 더미: 저장 결과 로그로 확인
    console.log("AI 점수 저장 완료 (더미):")
    ranked.forEach(({ name, ai_rank, score }) =>
      console.log(`  ${ai_rank}위 ${name}: ${score}점`)
    )

    const qualified = ranked.filter((a) => a.is_qualified)
    const unqualified = ranked.filter((a) => !a.is_qualified)

    return NextResponse.json({
      post_id: postId,
      threshold: MATCH_THRESHOLD,
      total: ranked.length,
      qualified_count: qualified.length,
      applicants: [...qualified, ...unqualified],
    })
  } catch (error) {
    console.error("지원자 목록 오류:", error.message)
    return NextResponse.json({ error: "지원자 목록 조회 중 오류가 발생했습니다" }, { status: 500 })
  }
}
