"use client"
import { useState } from "react"
import { Sparkles, Send, ChevronDown, ChevronUp } from "lucide-react"

export default function TestPage() {
  // 교수님 설정
  const [professorName, setProfessorName] = useState("홍길동")         // 한글 이름 (화면 표시용)
  const [professorNameEn, setProfessorNameEn] = useState("Yoshua Bengio") // 영어 이름 (논문 검색용)
  const [labIntro, setLabIntro] = useState("딥러닝과 AI 안전성을 연구합니다.")
  const [faq, setFaq] = useState("Q: 지원 조건은?\nA: 머신러닝 기초 지식이 있으면 됩니다.")
  const [showConfig, setShowConfig] = useState(true)

  // 채팅
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // 논문
  const [papers, setPapers] = useState([])
  const [papersLoading, setPapersLoading] = useState(false)
  const [summaries, setSummaries] = useState({})   // paperId: summary
  const [expandedAbstracts, setExpandedAbstracts] = useState({}) // paperId: bool

  const fetchPapers = async () => {
    setPapersLoading(true)
    const res = await fetch(`/api/papers?name=${encodeURIComponent(professorNameEn)}`)
    const data = await res.json()
    setPapers(data.papers || [])
    setPapersLoading(false)
  }

  const summarizePaper = async (paper) => {
    if (summaries[paper.paperId]) return
    setSummaries((prev) => ({ ...prev, [paper.paperId]: "요약 중..." }))
    const res = await fetch("/api/papers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: paper.title, abstract: paper.abstract }),
    })
    const data = await res.json()
    setSummaries((prev) => ({ ...prev, [paper.paperId]: data.summary }))
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: "user", content: input }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput("")
    setLoading(true)

    const res = await fetch("/api/bot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        professorName,
        professorNameEn,
        labIntro,
        faq,
        chatHistory: messages,
        userMessage: input,
      }),
    })
    const data = await res.json()
    setMessages([...newHistory, {
      role: "bot",
      content: data.answer,
      shouldEscalate: data.shouldEscalate,
      papersUsed: data.papersUsed,
    }])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="mx-auto max-w-4xl">

        {/* 헤더 */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-bold">교수님 대역 AI — 테스트</h1>
            <p className="text-xs text-slate-400">API 연동 테스트 페이지</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">

          {/* 왼쪽: 교수님 설정 + 논문 */}
          <div className="space-y-4">

            {/* 교수님 설정 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="flex w-full items-center justify-between font-bold"
              >
                교수님 설정
                {showConfig ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showConfig && (
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-xs text-slate-400">교수님 이름 (한글 — 화면 표시용)</span>
                    <input
                      value={professorName}
                      onChange={(e) => setProfessorName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">교수님 이름 (영어 — 논문 검색용)</span>
                    <input
                      value={professorNameEn}
                      onChange={(e) => setProfessorNameEn(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">연구실 소개</span>
                    <textarea
                      value={labIntro}
                      onChange={(e) => setLabIntro(e.target.value)}
                      rows={2}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">FAQ (Q: A: 형식)</span>
                    <textarea
                      value={faq}
                      onChange={(e) => setFaq(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* 논문 조회 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold">논문 목록</h3>
                <button
                  onClick={fetchPapers}
                  disabled={papersLoading}
                  className="rounded-xl bg-cyan-300 px-3 py-1.5 text-xs font-bold text-slate-950 disabled:opacity-50"
                >
                  {papersLoading ? "조회 중..." : "논문 가져오기"}
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {papers.length === 0 && (
                  <p className="text-xs text-slate-500">논문 가져오기 버튼을 눌러주세요.</p>
                )}
                {papers.map((paper) => (
                  <div key={paper.paperId} className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                    <p className="text-sm font-bold leading-snug">{paper.title}</p>
                    <p className="text-xs text-slate-400">{paper.year} · 인용 {paper.citationCount}회</p>

                    {/* 초록 토글 */}
                    {paper.abstract && (
                      <>
                        <button
                          onClick={() => setExpandedAbstracts((prev) => ({ ...prev, [paper.paperId]: !prev[paper.paperId] }))}
                          className="text-xs text-slate-400 underline"
                        >
                          {expandedAbstracts[paper.paperId] ? "초록 닫기 ▲" : "초록 보기 ▼"}
                        </button>
                        {expandedAbstracts[paper.paperId] && (
                          <p className="text-xs text-slate-300 leading-5 border-t border-white/10 pt-2">
                            {paper.abstract}
                          </p>
                        )}
                      </>
                    )}

                    {/* 한국어 3줄 요약 */}
                    {paper.abstract && (
                      <button
                        onClick={() => summarizePaper(paper)}
                        className="text-xs text-cyan-300 underline"
                      >
                        {summaries[paper.paperId] ? "한국어 요약 ▼" : "한국어 3줄 요약"}
                      </button>
                    )}
                    {summaries[paper.paperId] && (
                      <p className="text-xs text-slate-200 whitespace-pre-line border-t border-white/10 pt-2">
                        {summaries[paper.paperId]}
                      </p>
                    )}

                    {/* 링크 */}
                    <div className="flex gap-3 pt-1">
                      {paper.openAccessPdf?.url && (
                        <a href={paper.openAccessPdf.url} target="_blank" rel="noreferrer" className="text-xs text-green-400 underline">
                          PDF 보기 →
                        </a>
                      )}
                      {paper.url && (
                        <a href={paper.url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 underline">
                          원문 보기 →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 채팅 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col h-[700px]">
            <h3 className="mb-3 font-bold">AI 채팅 테스트</h3>

            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {messages.length === 0 && (
                <p className="text-xs text-slate-500 text-center mt-8">
                  질문을 입력해보세요.
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    msg.role === "user"
                      ? "bg-cyan-300 text-slate-950"
                      : "bg-white/10 text-slate-200"
                  }`}>
                    {msg.content}
                    {msg.shouldEscalate && (
                      <button className="mt-2 block w-full rounded-xl bg-cyan-300 py-2 text-xs font-bold text-slate-950">
                        교수님께 직접 연결 요청
                      </button>
                    )}
                    {msg.papersUsed !== undefined && (
                      <p className="mt-1 text-xs opacity-50">논문 {msg.papersUsed}편 참고</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-400 animate-pulse">
                    답변 생성 중...
                  </div>
                </div>
              )}
            </div>

            {/* 입력 */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="질문을 입력하세요"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="rounded-xl bg-cyan-300 px-4 py-2.5 text-slate-950 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
