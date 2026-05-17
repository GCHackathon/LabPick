"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Eye, EyeOff, GraduationCap, BookOpen } from 'lucide-react'
import { supabase } from '../../utils/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState(null) // null | 'student' | 'professor'
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', name: '', major: '', status: '' })

  const STUDENT_STATUSES = [
    { id: '관련없음', label: '관련 없음', desc: '연구실과 무관하게 탐색 중' },
    { id: '학부연구생', label: '학부 연구생', desc: '학부생으로 연구실 참여 중' },
    { id: '석사재학', label: '석사 재학', desc: '석사과정 재학 중' },
    { id: '석사졸업', label: '석사 졸업', desc: '석사 졸업 후 구직/진학' },
    { id: '박사재학', label: '박사 재학', desc: '박사과정 재학 중' },
    { id: '박사졸업', label: '박사 졸업', desc: '박사 졸업 후 취업/연구' },
  ]
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        router.push(role === 'professor' ? '/professor/dashboard' : '/')
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { role, name: form.name } },
        })
        if (error) throw error
        if (role === 'student') {
          await supabase.from('students').insert({
            email: form.email,
            name: form.name,
            major: form.major,
            grade: form.status,
            interests: '',
          })
        }
        router.push(role === 'professor' ? '/professor/setup' : '/')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"

  // Step 1: 역할 선택
  if (!role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center mb-0">
              <img src="/vibecoding/img/icon.png" alt="logo" className="w-40 h-40 object-contain" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary -mt-4 mb-1" style={{ transform: 'skewX(-10deg)' }}>LabPick</h1>
            <p className="text-sm text-muted-foreground">교수님 AI 봇 플랫폼</p>
          </div>

          <p className="text-center text-sm font-medium text-muted-foreground mb-4">어떤 역할로 로그인하시나요?</p>

          <div className="space-y-3">
            <button
              onClick={() => setRole('student')}
              className="w-full bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">학생</p>
                <p className="text-sm text-muted-foreground">연구실 탐색 및 AI 상담</p>
              </div>
            </button>

            <button
              onClick={() => setRole('professor')}
              className="w-full bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">교수님</p>
                <p className="text-sm text-muted-foreground">AI 봇 관리 및 대시보드</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: 로그인 / 회원가입
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center mb-0">
              <img src="/vibecoding/img/icon.png" alt="logo" className="w-40 h-40 object-contain" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary -mt-4 mb-1" style={{ transform: 'skewX(-10deg)' }}>LabPick</h1>
            <p className="text-sm text-muted-foreground">
              {role === 'professor' ? '교수님' : '학생'} {mode === 'login' ? '로그인' : '회원가입'}
            </p>
          </div>

        {/* 로그인/회원가입 탭 */}
        <div className="flex bg-muted rounded-2xl p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              mode === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              mode === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            회원가입
          </button>
        </div>

        <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
          {mode === 'signup' && role === 'student' && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">이름</p>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="홍길동"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-foreground mb-2">이메일</p>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="example@gachon.ac.kr"
              className={inputClass}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">비밀번호</p>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className={inputClass + ' pr-12'}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && role === 'student' && (
            <>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">전공</p>
                <input
                  type="text"
                  value={form.major}
                  onChange={e => setForm({ ...form, major: e.target.value })}
                  placeholder="컴퓨터공학과"
                  className={inputClass}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">현재 신분</p>
                <div className="space-y-2">
                  {STUDENT_STATUSES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setForm({ ...form, status: s.id })}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                        form.status === s.id
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="font-medium text-foreground">{s.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || (mode === 'signup' && role === 'student' && !form.status)}
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </div>

        <div className="mt-4 flex justify-start text-sm">
          <button onClick={() => setRole(null)} className="text-muted-foreground">← 역할 변경</button>
        </div>
      </div>
    </div>
  )
}
