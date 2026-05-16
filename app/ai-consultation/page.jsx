"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, FileText, BookOpen, User, MessageCircle } from 'lucide-react'

export default function AIConsultation() {
  const [professors, setProfessors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/professors')
      .then(r => r.json())
      .then(d => { setProfessors(d.professors || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = professors.filter(p => {
    if (!searchQuery) return p.is_bot_active
    const q = searchQuery.toLowerCase()
    return p.is_bot_active && (
      p.name?.toLowerCase().includes(q) ||
      p.lab_name?.toLowerCase().includes(q) ||
      p.research_field?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        <div className="bg-card border-b border-border px-5 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">AI 상담</h1>
          <p className="text-sm text-muted-foreground">교수님께 직접 연락하기 전, AI 봇에게 먼저 질문해보세요.</p>
        </div>

        <div className="px-5 py-4">
          <input
            type="text"
            placeholder="교수님 이름 또는 연구 분야 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-12 px-4 bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="px-5 space-y-3">
          {loading && <p className="text-sm text-muted-foreground text-center py-8">불러오는 중...</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">AI 봇이 활성화된 연구실이 없습니다.</p>
          )}
          {filtered.map(prof => (
            <div key={prof.id} className="bg-card rounded-2xl p-5 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{prof.name} 교수님 AI 봇</h3>
                  <p className="text-sm text-muted-foreground">{prof.lab_name}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">답변 가능</span>
              </div>

              <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>논문 자동 연동</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI 봇 활성화</span>
                </div>
              </div>

              {(prof.keywords || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {prof.keywords.map(k => (
                    <span key={k} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">{k}</span>
                  ))}
                </div>
              )}

              <Link
                href={`/ai-chat/${prof.id}`}
                className="block w-full text-center py-2.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl"
              >
                질문하기
              </Link>
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-[393px] mx-auto flex items-center justify-around h-20 px-4">
          <Link href="/" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">연구실</span>
          </Link>
          <Link href="/openchat" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">오픈챗</span>
          </Link>
          <Link href="/ai-consultation" className="flex flex-col items-center gap-1 flex-1 text-primary">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs font-medium">AI상담</span>
          </Link>
          <Link href="/my-info" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <User className="w-6 h-6" />
            <span className="text-xs">내정보</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
