"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, FileText, BookOpen, User, Bell } from 'lucide-react'
import { supabase } from '../utils/supabase'

export default function LabExplore() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [professors, setProfessors] = useState([])
  const [filters, setFilters] = useState(['전체'])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    })
    fetch('/api/professors')
      .then(r => r.json())
      .then(d => {
        const profs = d.professors || []
        setProfessors(profs)
        const allKeywords = profs.flatMap(p => p.keywords || [])
        setFilters(['전체', ...new Set(allKeywords)])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const filtered = professors.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.name?.toLowerCase().includes(q) || p.lab_name?.toLowerCase().includes(q) || p.research_field?.toLowerCase().includes(q)
    }
    if (selectedFilter === '전체') return true
    return p.keywords?.some(k => k.includes(selectedFilter)) || p.research_field?.includes(selectedFilter)
  })

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        <div className="bg-card border-b border-border px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/vibecoding/img/icon.png" alt="랩픽" className="w-10 h-10 object-contain" />
              <h1 className="text-2xl font-bold text-foreground">랩픽</h1>
            </div>
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                로그아웃
              </button>
            ) : (
              <Link href="/login" className="text-xs px-3 py-1.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-medium">
                로그인
              </Link>
            )}
          </div>
        </div>

        <div className="px-5 py-4">
          <input
            type="text"
            placeholder="교수님, 연구실명, 연구분야로 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-12 px-4 bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="px-5 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${
                  selectedFilter === filter
                    ? 'bg-primary text-white border-primary'
                    : 'bg-card text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 mb-4">
          <p className="text-sm font-medium text-foreground">총 {filtered.length}개의 연구실</p>
        </div>

        <div className="px-5 space-y-4">
          {loading && <p className="text-sm text-muted-foreground text-center py-8">불러오는 중...</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">연구실이 없습니다.</p>
          )}
          {filtered.map(prof => (
            <div key={prof.id} className="bg-card rounded-3xl p-6 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{prof.lab_name || '연구실'}</h3>
                  <p className="text-sm text-muted-foreground">{prof.name} 교수</p>
                </div>
                {prof.is_bot_active && (
                  <div className="shrink-0 bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium">AI 대역</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(prof.keywords || []).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">{tag}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>지식 문서</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>논문 자동 연동</span>
                </div>
              </div>

              <div className="flex gap-2">
                {prof.is_bot_active && (
                  <Link href={`/ai-chat/${prof.id}`} className="flex-1 text-center py-2.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-xl hover:opacity-90">
                    AI에게 질문하기
                  </Link>
                )}
                <Link href={`/lab/${prof.id}`} className={`text-center py-2.5 border border-border bg-card text-foreground text-sm font-medium rounded-xl hover:bg-muted ${prof.is_bot_active ? 'flex-1' : 'w-full'}`}>
                  연구실 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-[393px] mx-auto flex items-center justify-around h-20 px-4">
          <Link href="/" className="flex flex-col items-center gap-1 flex-1 text-primary">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">연구실</span>
          </Link>
          <Link href="/ai-consultation" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">AI상담</span>
          </Link>
          <Link href="/my-info" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <Bell className="w-6 h-6" />
            <span className="text-xs">내정보</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
