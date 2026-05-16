import { NextResponse } from "next/server"
import { fetchProfessorPapers } from "../../../utils/scholar"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// GET /api/papers?name=교수님이름또는URL
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")

    if (!name) {
      return NextResponse.json({ error: "name 파라미터가 필요합니다" }, { status: 400 })
    }

    const { author, papers } = await fetchProfessorPapers(name)

    if (!author) {
      return NextResponse.json({ author: null, papers: [] })
    }

    return NextResponse.json({ author, papers })
  } catch (error) {
    console.error("논문 조회 오류:", error.message)
    return NextResponse.json({ error: "논문 조회 중 오류가 발생했습니다" }, { status: 500 })
  }
}

// POST /api/papers — 논문 3줄 요약
export async function POST(request) {
  try {
    const { title, abstract } = await request.json()

    if (!abstract) {
      return NextResponse.json({ summary: "초록 정보가 없습니다." })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `다음 논문을 학부 2학년 수준에서 이해할 수 있도록 한국어로 3줄로 요약해주세요.\n\n제목: ${title}\n초록: ${abstract}\n\n형식: 1. ... 2. ... 3. ...`,
        },
      ],
      temperature: 0.7,
    })

    const summary = completion.choices[0].message.content
    return NextResponse.json({ summary })
  } catch (error) {
    console.error("논문 요약 오류:", error.message)
    return NextResponse.json({ error: "요약 중 오류가 발생했습니다" }, { status: 500 })
  }
}
