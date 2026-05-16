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
  const [form, setForm] = useState({ email: '', password: '' })
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
          options: { data: { role } },
        })
        if (error) throw error
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
            <p className="text-sm text-muted-foreground -mt-4">교수님 AI 대역 플랫폼</p>
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
                <p className="text-sm text-muted-foreground">AI 대역 관리 및 대시보드</p>
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
            <p className="text-sm text-muted-foreground -mt-4">
              {role === 'professor' ? '교수님' : '학생'} 로그인
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

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
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
