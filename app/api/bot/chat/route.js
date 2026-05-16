import { NextResponse } from "next/server"
import OpenAI from "openai"
import { supabase } from "../../../../utils/supabase"
import { fetchProfessorPapers, papersToContext } from "../../../../utils/scholar"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// 논문 컨텍스트 메모리 캐시 (교수 ID → 논문 텍스트)
const paperCache = new Map()

export async function POST(request) {
  try {
    const { professorId, question } = await request.json()

    if (!professorId || !question) {
      return NextResponse.json({ error: "professorId와 question이 필요합니다" }, { status: 400 })
    }

    const { data: professor, error } = await supabase
      .from("professors")
      .select("*")
      .eq("id", professorId)
      .single()

    if (error || !professor) {
      return NextResponse.json({ error: "교수님 정보를 찾을 수 없습니다" }, { status: 404 })
    }

    // 논문 캐시 확인 → 없으면 fetch
    let paperContext = ""
    if (professor.scholar_link) {
      if (paperCache.has(professorId)) {
        paperContext = paperCache.get(professorId)
      } else {
        try {
          const { papers } = await fetchProfessorPapers(professor.scholar_link)
          if (papers.length > 0) {
            paperContext = papersToContext(papers)
            paperCache.set(professorId, paperContext)
          }
        } catch (e) {
          console.error("논문 조회 실패:", e.message)
        }
      }
    }

    // FAQ 텍스트 변환
    const faqContext = (professor.faq || []).length > 0
      ? '\n[교수님이 직접 작성한 FAQ]\n' +
        professor.faq.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
      : ''

    const systemPrompt = `당신은 ${professor.name} 교수님의 공식 AI 대리인입니다.
학생들의 연구실 관련 질문에 친절하고 전문적으로 답변하세요.

[교수님 정보]
- 이름: ${professor.name}
- 소속: ${professor.department}
- 연구실: ${professor.lab_name}
- 연구 분야: ${professor.research_field || ""}
- 연구 주제: ${professor.research_topic || ""}
- 연구실 소개: ${professor.lab_intro || ""}
- 위치: ${professor.office_location || ""}
${paperContext ? `\n[교수님 논문 목록 (Semantic Scholar 기반)]\n${paperContext}` : ""}
${faqContext}
${professor.custom_instructions ? `\n[교수님 추가 지시사항 - 반드시 반영]\n${professor.custom_instructions}` : ""}

[답변 규칙]
- 위 정보를 기반으로 답변하세요
- FAQ에 해당 질문이 있으면 FAQ 답변을 우선 사용하세요
- 논문 관련 질문 시 위 논문 목록에서 관련 논문을 찾아 설명하세요
- 논문의 선수지식은 연구 분야와 논문 제목/초록을 바탕으로 추론하세요
- 모르는 내용은 "해당 부분은 교수님께 직접 문의해 주세요"라고 안내하세요
- 학생이 '면담', '직접 연락', '이메일', '만나고 싶다' 등을 언급하면 suggest_escalation: true 반환

반드시 JSON 형식 {"answer": "답변 내용", "suggest_escalation": true 또는 false} 으로만 반환하세요.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const text = completion.choices[0].message.content
    try {
      const parsed = JSON.parse(text)
      return NextResponse.json({ ...parsed, papersUsed: paperContext ? 1 : 0 })
    } catch (e) {
      return NextResponse.json({ answer: text, suggest_escalation: false, papersUsed: 0 })
    }

  } catch (error) {
    console.error("봇 챗 오류:", error.message, error.stack)
    return NextResponse.json({
      error: "답변 생성 중 오류가 발생했습니다",
      detail: error.message,
    }, { status: 500 })
  }
}
