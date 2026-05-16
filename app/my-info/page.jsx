"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, BookOpen, Sparkles, LogOut, ChevronRight, GraduationCap } from 'lucide-react'
import { supabase } from '../../utils/supabase'

const INTERESTS = ['AI/ML', '웹개발', '보안', '데이터', '로보틱스', '네트워크', '컴퓨터비전', 'NLP', '기타']
const GRADES = [1, 2, 3, 4]
const MAJORS = ['컴퓨터공학과', '소프트웨어학과', '인공지능학과', '정보보안학과', '전자공학과']

export default function MyInfo() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [student, setStudent] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', grade: 1, major: '', interests: []
  })
  const [customInterest, setCustomInterest] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      setUser(data.user)
      const { data: s } = await supabase
        .from('students')
        .select('*')
        .eq('email', data.user.email)
        .single()
      if (s) {
        setStudent(s)
        setForm({ name: s.name, grade: s.grade, major: s.major, interests: s.interests || [] })
      }
      setLoading(false)
    })
  }, [])

  const toggleInterest = (i) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i)
        ? f.interests.filter(x => x !== i)
        : [...f.interests, i]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    if (student) {
      await supabase.from('students').update(form).eq('email', user.email)
    } else {
      await supabase.from('students').insert([{ ...form, email: user.email }])
    }
    const { data: s } = await supabase.from('students').select('*').eq('email', user.email).single()
    if (s) setStudent(s)
    else setStudent({ ...form, email: user.email }) // fallback: 테이블 없을 때 로컬 데이터 사용
    setEditing(false)
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const inputClass = "w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">불러오는 중...</p>
    </div>
  )

  // 비로그인
  if (!user) return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto px-5 py-10 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">로그인이 필요해요</h2>
        <p className="text-sm text-muted-foreground mb-8">로그인하면 내 정보를 저장하고<br />맞춤 연구실을 탐색할 수 있어요.</p>
        <Link href="/login" className="block w-full py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl text-center">
          로그인하기
        </Link>
      </div>
      <BottomNav active="my-info" />
    </div>
  )

  // 정보 입력/수정 폼
  if (editing) return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        <div className="bg-card border-b border-border px-5 py-4">
          <h1 className="text-xl font-bold text-foreground">내 정보 {student ? '수정' : '입력'}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="px-5 py-4 space-y-5">
          <div>
            <p className="text-sm font-medium mb-2">이름</p>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="홍길동" className={inputClass} />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">학년</p>
            <div className="flex gap-2">
              {GRADES.map(g => (
                <button
                  key={g}
                  onClick={() => setForm(f => ({ ...f, grade: g }))}
                  className={`flex-1 py-2.5 text-sm rounded-xl border transition-colors ${
                    form.grade === g
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">전공</p>
            <div className="space-y-2">
              {MAJORS.map(m => (
                <button
                  key={m}
                  onClick={() => setForm(f => ({ ...f, major: m }))}
                  className={`w-full py-3 px-4 text-sm rounded-xl border text-left transition-colors ${
                    form.major === m
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">관심 분야 <span className="text-muted-foreground text-xs">(복수 선택)</span></p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    i !== '기타' && form.interests.includes(i)
                      ? 'border-primary bg-primary text-white'
                      : i === '기타'
                      ? 'border-border bg-muted text-muted-foreground'
                      : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            {/* 기타 직접 입력 */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customInterest}
                onChange={e => setCustomInterest(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customInterest.trim()) {
                    if (!form.interests.includes(customInterest.trim())) {
                      setForm(f => ({ ...f, interests: [...f.interests, customInterest.trim()] }))
                    }
                    setCustomInterest('')
                  }
                }}
                placeholder="기타 직접 입력 후 Enter"
                className="flex-1 h-10 px-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={() => {
                  if (customInterest.trim() && !form.interests.includes(customInterest.trim())) {
                    setForm(f => ({ ...f, interests: [...f.interests, customInterest.trim()] }))
                    setCustomInterest('')
                  }
                }}
                className="px-3 h-10 bg-primary text-white text-sm rounded-xl"
              >
                추가
              </button>
            </div>
            {/* 선택된 관심분야 태그 */}
            {form.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.interests.map(i => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm rounded-full"
                  >
                    {i}
                    <button onClick={() => toggleInterest(i)} className="ml-1 text-white/70 hover:text-white">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {student && (
              <button onClick={() => setEditing(false)} className="flex-1 h-12 border border-border bg-card text-foreground text-sm font-medium rounded-xl">
                취소
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.major}
              className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      </div>
      <BottomNav active="my-info" />
    </div>
  )

  // 내 정보 보기
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        <div className="bg-card border-b border-border px-5 py-4">
          <h1 className="text-xl font-bold text-foreground">내 정보</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* 프로필 카드 */}
          {student ? (
            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xl font-bold">{student.name}</p>
                  <p className="text-white/80 text-sm">{student.major} · {student.grade}학년</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(student.interests || []).map(i => (
                  <span key={i} className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">{i}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-2xl p-5 text-center border border-border">
              <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">아직 정보가 없어요</p>
              <p className="text-xs text-muted-foreground">내 정보를 입력하면 맞춤 연구실을 탐색할 수 있어요.</p>
            </div>
          )}

          {/* 정보 수정 */}
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-card border border-border rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">내 정보 수정</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <Link
            href="/"
            className="w-full bg-card border border-border rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">연구실 탐색하기</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="w-full h-12 border border-border bg-card text-muted-foreground text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-muted"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </div>
      <BottomNav active="my-info" />
    </div>
  )
}

function BottomNav({ active }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-[393px] mx-auto flex items-center justify-around h-20 px-4">
        <Link href="/" className={`flex flex-col items-center gap-1 flex-1 ${active === 'home' ? 'text-primary' : 'text-muted-foreground'}`}>
          <BookOpen className="w-6 h-6" />
          <span className="text-xs">연구실</span>
        </Link>
        <Link href="/ai-consultation" className={`flex flex-col items-center gap-1 flex-1 ${active === 'ai' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Sparkles className="w-6 h-6" />
          <span className="text-xs">AI상담</span>
        </Link>
        <Link href="/my-info" className={`flex flex-col items-center gap-1 flex-1 ${active === 'my-info' ? 'text-primary' : 'text-muted-foreground'}`}>
          <User className="w-6 h-6" />
          <span className="text-xs">내정보</span>
        </Link>
      </div>
    </nav>
  )
}
