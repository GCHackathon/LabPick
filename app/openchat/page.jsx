"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, MessageCircle, Sparkles, User } from 'lucide-react'
import { supabase } from '../../utils/supabase'

export default function OpenChatList() {
  const [professors, setProfessors] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    fetch('/api/professors')
      .then(r => r.json())
      .then(d => {
        setProfessors(d.professors || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        <div className="bg-card border-b border-border px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/vibecoding/img/icon.png" alt="랩픽" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary leading-tight" style={{ transform: 'skewX(-10deg)' }}>
                  오픈챗
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold -mt-0.5">Open Chat</p>
              </div>
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

        <div className="px-5 py-4 space-y-3">
          {loading && <p className="text-sm text-muted-foreground text-center py-8">불러오는 중...</p>}
          {!loading && professors.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">등록된 연구실이 없습니다.</p>
          )}
          {professors.map(prof => (
            <Link key={prof.id} href={`/openchat/${prof.id}`}>
              <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-4 hover:bg-muted transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{prof.lab_name || prof.name + ' 연구실'}</p>
                  <p className="text-xs text-muted-foreground">{prof.name} 교수 · {prof.department}</p>
                </div>
                <div className="text-xs text-primary font-medium">입장 →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-[393px] mx-auto flex items-center justify-around h-20 px-4">
          <Link href="/" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">연구실</span>
          </Link>
          <Link href="/openchat" className="flex flex-col items-center gap-1 flex-1 text-primary">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">오픈챗</span>
          </Link>
          <Link href="/ai-consultation" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">AI상담</span>
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
