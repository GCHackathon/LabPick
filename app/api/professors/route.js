import { NextResponse } from "next/server"
import { supabase } from "../../../utils/supabase"

// GET /api/professors → 전체 교수님 목록
export async function GET() {
  const { data, error } = await supabase
    .from("professors")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ professors: data })
}

// POST /api/professors → 교수님 등록 (테스트용 — 실제는 auth 연동)
export async function POST(request) {
  const body = await request.json()
  const { name, email, lab_name, department, scholar_link, lab_intro, research_topic, office_location, keywords } = body

  const { data, error } = await supabase
    .from("professors")
    .insert([{
      name,
      email,
      lab_name,
      department,
      scholar_link,
      lab_intro,
      research_topic,
      office_location,
      keywords: keywords ?? [],
      is_bot_active: true,
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ professor: data })
}
