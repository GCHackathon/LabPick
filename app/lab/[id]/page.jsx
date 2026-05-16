"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { X, Sparkles, MapPin, Mail, BookOpen, ArrowLeft } from 'lucide-react'
import { supabase } from '../../../utils/supabase'
import { buildContactMailto } from '../../../utils/mail'

export default function LabDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('info')
  const [professor, setProfessor] = useState(null)
  const [papers, setPapers] = useState([])
  const [summaries, setSummaries] = useState({})
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)

  useEffect(() => {
    fetch('/api/professors')
      .then(r => r.json())
      .then(d => {
        const prof = (d.professors || []).find(p => p.id === id)
        setProfessor(prof || null)
        setLoading(false)
      })

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

  const fetchPapers = () => {
    const query = professor?.scholar_link || professor?.name
    if (!query) return
    fetch(`/api/papers?name=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(d => setPapers(d.papers || []))
  }

  useEffect(() => {
    if (professor && activeTab === 'papers') fetchPapers()
  }, [professor, activeTab])

  const summarizePaper = async (paper) => {
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

  if (loading) return <div className="p-5 text-muted-foreground">불러오는 중...</div>
  if (!professor) return <div className="p-5">연구실을 찾을 수 없습니다.</div>

  const tabs = [
    { id: 'info', label: '연구실 정보' },
    { id: 'papers', label: '논문' },
    { id: 'ai', label: 'AI 대역' },
    { id: 'contact', label: '직접 연결' },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary to-secondary text-white p-6 relative">
          <Link href="/" className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </Link>
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <img src="/vibecoding/img/icon.png" alt="랩픽" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{professor.lab_name}</h1>
          <p className="text-white/90 mb-4">{professor.name} 교수</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {professor.is_bot_active && (
              <span className="shrink-0 bg-white/20 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">AI 대역 활성화</span>
            )}
            {(professor.keywords || []).map(k => (
              <span key={k} className="shrink-0 bg-white/20 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">{k}</span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 bg-card border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: 연구실 정보 */}
        {activeTab === 'info' && (
          <div className="px-5 py-4 space-y-4">
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-semibold mb-2">연구실 소개</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{professor.lab_intro || '소개 없음'}</p>
            </div>
            {professor.research_topic && (
              <div className="bg-card rounded-2xl p-5 border border-border">
                <h3 className="font-semibold mb-2">연구 주제</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{professor.research_topic}</p>
              </div>
            )}
            <div className="bg-card rounded-2xl p-5 border border-border space-y-2 text-sm">
              <h3 className="font-semibold mb-3">연구실 정보</h3>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-16">소속:</span>
                <span>{professor.department}</span>
              </div>
              {professor.office_location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{professor.office_location}</span>
                </div>
              )}
              {professor.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{professor.email}</span>
                </div>
              )}
            </div>

            <div className="fixed bottom-24 left-0 right-0 bg-background border-t border-border p-4">
              <div className="max-w-[393px] mx-auto flex gap-2">
                <Link href={`/ai-chat/${id}`} className="flex-1 text-center py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-xl">
                  AI 대역에게 질문하기
                </Link>
                <button onClick={() => setActiveTab('papers')} className="flex-1 py-3 border border-border bg-card text-foreground text-sm font-medium rounded-xl hover:bg-muted">
                  논문 보기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: 논문 */}
        {activeTab === 'papers' && (
          <div className="px-5 py-4 space-y-3">
            <div className="bg-card rounded-2xl p-4 border border-border">
              <p className="text-xs text-muted-foreground">Semantic Scholar 기준으로 불러온 논문 목록입니다.</p>
            </div>
            {papers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">논문을 불러오는 중...</p>
            )}
            {papers.map(paper => (
              <div key={paper.paperId} className="bg-card rounded-2xl p-4 border border-border space-y-2">
                <p className="text-sm font-semibold leading-snug">{paper.title}</p>
                <p className="text-xs text-muted-foreground">{paper.year} · 인용 {paper.citationCount}회</p>
                {paper.abstract && (
                  <button onClick={() => summarizePaper(paper)} className="text-xs text-primary underline">
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
        )}

        {/* Tab: AI 대역 */}
        {activeTab === 'ai' && (
          <div className="px-5 py-4">
            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">교수님 AI 대역</h3>
              <p className="text-sm text-white/90 mb-6">
                {professor.name} 교수님의 논문, 연구 요약, FAQ를 기반으로 24시간 답변합니다.
              </p>
              <Link href={`/ai-chat/${id}`} className="block w-full py-3 bg-white text-primary text-sm font-semibold rounded-xl">
                AI 대역과 상담 시작하기
              </Link>
            </div>
          </div>
        )}

        {/* Tab: 직접 연결 */}
        {activeTab === 'contact' && (
          <div className="px-5 py-4">
            <div className="bg-card rounded-2xl p-5 border border-border text-center">
              <h3 className="font-semibold mb-2">직접 연결</h3>
              <p className="text-sm text-muted-foreground mb-6">
                AI 대역이 답변할 수 없는 질문이나 면담이 필요한 경우 교수님께 직접 연결을 요청할 수 있습니다.
              </p>
              {professor.email && (
                <a href={buildContactMailto(professor, student)} className="block w-full py-3 border border-border bg-card text-foreground text-sm font-medium rounded-xl hover:bg-muted">
                  이메일 보내기 ({professor.email})
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-[393px] mx-auto flex items-center justify-around h-20 px-4">
          <Link href="/" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">연구실</span>
          </Link>
          <Link href="/ai-consultation" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">AI상담</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
