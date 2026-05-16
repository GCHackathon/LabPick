"use client"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Send, Sparkles, Info } from 'lucide-react'
import { supabase } from '../../../utils/supabase'
import { buildContactMailto } from '../../../utils/mail'

const suggestedQuestions = ['필요한 선수지식', '연구실 분위기', '면담 준비', '연구실 합류 조건']

function PaperCards({ papers }) {
  const [summaries, setSummaries] = useState({})

  const summarize = async (paper) => {
    if (summaries[paper.paperId]) return
    setSummaries(prev => ({ ...prev, [paper.paperId]: '요약 중...' }))
    const res = await fetch('/api/papers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: paper.title, abstract: paper.abstract }),
    })
    const data = await res.json()
    setSummaries(prev => ({ ...prev, [paper.paperId]: data.summary }))
  }

  if (!papers.length) return <p className="text-xs text-muted-foreground">논문 정보가 없습니다.</p>

  return (
    <div className="space-y-3 w-full">
      {papers.map(paper => (
        <div key={paper.paperId} className="bg-background border border-border rounded-xl p-3 space-y-1.5">
          <p className="text-xs font-semibold leading-snug">{paper.title}</p>
          <p className="text-xs text-muted-foreground">{paper.year} · 인용 {paper.citationCount}회</p>
          {paper.abstract && (
            <button onClick={() => summarize(paper)} className="text-xs text-primary underline">
              {summaries[paper.paperId] ? '요약 완료 ▼' : '한국어 3줄 요약'}
            </button>
          )}
          {summaries[paper.paperId] && (
            <p className="text-xs text-foreground leading-5 whitespace-pre-line border-t border-border pt-2">
              {summaries[paper.paperId]}
            </p>
          )}
          <div className="flex gap-3">
            {paper.openAccessPdf?.url && (
              <a href={paper.openAccessPdf.url} target="_blank" rel="noreferrer" className="text-xs text-green-600 underline">PDF →</a>
            )}
            {paper.url && (
              <a href={paper.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground underline">원문 →</a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AIChat() {
  const { id } = useParams()
  const [professor, setProfessor] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [student, setStudent] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch('/api/professors')
      .then(r => r.json())
      .then(d => {
        const prof = (d.professors || []).find(p => p.id === id)
        if (prof) {
          setProfessor(prof)
          setMessages([{
            role: 'ai',
            content: `안녕하세요. ${prof.name} 교수님의 AI 대역입니다. 연구실과 교수님의 연구에 대해 궁금한 점을 질문해주세요.`,
          }])
        }
      })

    // 로그인한 학생 정보 fetch (메일 양식 자동 채움용)
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase
        .from('students')
        .select('*')
        .eq('email', data.user.email)
        .single()
        .then(({ data: s }) => { if (s) setStudent(s) })
    })
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const showPapers = async () => {
    if (!professor) return
    setMessages(prev => [...prev, { role: 'user', content: '최근 논문 목록 보여줘' }])
    setLoading(true)
    const query = professor.scholar_link || professor.name
    const res = await fetch(`/api/papers?name=${encodeURIComponent(query)}`)
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'ai', content: '', papers: data.papers || [] }])
    setLoading(false)
  }

  const sendMessage = async (text) => {
    const msg = text || input
    if (!msg.trim() || loading || !professor) return
    const userMsg = { role: 'user', content: msg }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professorId: id, question: msg }),
      })
      const data = await res.json()
      const errorText = data.detail ? `${data.error}\n(${data.detail})` : data.error
      setMessages([...newHistory, {
        role: 'ai',
        content: data.answer || errorText || '답변을 가져오지 못했습니다.',
        shouldEscalate: data.suggest_escalation,
      }])
    } catch (e) {
      setMessages([...newHistory, {
        role: 'ai',
        content: '일시적인 오류가 발생했습니다. 다시 시도해주세요.',
      }])
    } finally {
      setLoading(false)
    }
  }

  if (!professor) return <div className="p-5 text-muted-foreground">불러오는 중...</div>

  const InfoModal = () => (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowInfo(false)}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-card w-full max-w-[393px] rounded-t-3xl p-6 space-y-4 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-lg">{professor.name} 교수님</h2>
          <button onClick={() => setShowInfo(false)} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground text-xl leading-none">✕</button>
        </div>
        <div className="space-y-3 text-sm">
          <div><span className="text-muted-foreground">소속</span><p className="font-medium mt-0.5">{professor.department}</p></div>
          <div><span className="text-muted-foreground">연구실</span><p className="font-medium mt-0.5">{professor.lab_name}</p></div>
          {professor.research_field && <div><span className="text-muted-foreground">연구 분야</span><p className="font-medium mt-0.5">{professor.research_field}</p></div>}
          {professor.lab_intro && <div><span className="text-muted-foreground">연구실 소개</span><p className="text-foreground leading-relaxed mt-0.5">{professor.lab_intro}</p></div>}
          {professor.office_location && <div><span className="text-muted-foreground">위치</span><p className="font-medium mt-0.5">{professor.office_location}</p></div>}
          {professor.email && <div><span className="text-muted-foreground">이메일</span><p className="font-medium mt-0.5">{professor.email}</p></div>}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {(professor.keywords || []).map(k => (
            <span key={k} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{k}</span>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-background flex flex-col">
      {showInfo && <InfoModal />}
      <div className="max-w-[393px] mx-auto w-full flex flex-col h-full">

        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <Link href={`/lab/${id}`} className="p-1.5 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{professor.name} 교수님 AI 대역</h1>
              <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">문서 기반 답변</span>
            </div>
            <button onClick={() => setShowInfo(true)} className="p-2 hover:bg-muted rounded-full">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="px-5 py-4">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">공식 AI 대리인</h3>
                <p className="text-xs text-muted-foreground">교수님의 논문, 연구 요약, FAQ를 기반으로 답변합니다.</p>
                <p className="text-xs text-muted-foreground mt-1"><strong>주의:</strong> 문서에 없는 내용은 교수님 직접 연결을 안내합니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages 영역 + 누끼 이미지 래퍼 */}
        <div className="flex-1 relative overflow-hidden">
          {/* 누끼 이미지 - 채팅창 정중앙 고정 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 1 }}>
            <img
              src="/vibecoding/img/icon.png"
              alt=""
              className="w-96 opacity-25 object-contain"
              draggable={false}
            />          </div>

        {/* Messages */}
        <div className="h-full overflow-y-auto px-5 space-y-4 relative" style={{ zIndex: 2 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`relative z-10 flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <img src="/profile-avatar.png" alt="AI" className="w-12 h-12 flex-shrink-0 mb-0.5 object-contain" />
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border'
              } ${msg.papers ? 'w-full max-w-[90%]' : ''}`}>
                {msg.papers ? <PaperCards papers={msg.papers} /> : <p className="text-sm leading-relaxed">{msg.content}</p>}
                {msg.shouldEscalate && professor.email && (
                  <a
                    href={buildContactMailto(professor, student)}
                    className="mt-2 block w-full text-center py-2 bg-primary text-white text-xs font-semibold rounded-xl"
                  >
                    교수님께 메일 보내기
                  </a>
                )}
                {msg.papersUsed > 0 && (
                  <p className="mt-1 text-xs opacity-50">논문 {msg.papersUsed}편 참고</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="relative z-10 flex items-end gap-2 justify-start">
              <img src="/profile-avatar.png" alt="AI" className="w-12 h-12 flex-shrink-0 object-contain" />
              <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">답변 생성 중</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        </div>{/* 래퍼 끝 */}

        {/* Suggested Questions */}
        <div className="px-5 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={showPapers}
              disabled={loading}
              className="px-3 py-1.5 border border-border bg-card text-muted-foreground text-xs rounded-full whitespace-nowrap hover:bg-muted active:bg-primary active:text-white disabled:opacity-40"
            >
              📄 논문 목록 보기
            </button>
            {suggestedQuestions.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="px-3 py-1.5 border border-border bg-card text-muted-foreground text-xs rounded-full whitespace-nowrap hover:bg-muted active:bg-primary active:text-white disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Contact */}
        <div className="px-5 pb-3">
          {professor.email ? (
            <a
              href={buildContactMailto(professor, student)}
              className="block w-full text-center py-2.5 border border-border bg-card text-foreground text-sm font-medium rounded-xl hover:bg-muted"
            >
              교수님께 직접 연결 요청 ({professor.email})
            </a>
          ) : (
            <button disabled className="block w-full text-center py-2.5 border border-border bg-card text-muted-foreground text-sm font-medium rounded-xl opacity-50">
              이메일 정보 없음
            </button>
          )}
        </div>

        {/* Input */}
        <div className="px-5 pb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="질문을 입력하세요..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 h-12 px-4 bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="w-12 h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center hover:opacity-90 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
