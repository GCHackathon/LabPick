"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Settings, MessageCircle, AlertCircle, LogOut, CheckCircle, Clock, ChevronDown, ChevronUp, SlidersHorizontal, GraduationCap, Plus, Trash2, X } from 'lucide-react'
import { supabase } from '../../../utils/supabase'

const CHECK_QUESTIONS = [
  '교수님의 주요 연구 분야와 연구실을 소개해주세요.',
  '최근 진행 중인 연구나 논문에 대해 설명해주세요.',
  '연구실에 합류하고 싶은 학생이 갖춰야 할 선수지식은 무엇인가요?',
]

export default function ProfessorDashboard() {
  const router = useRouter()
  const [professor, setProfessor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [checkResults, setCheckResults] = useState(null)
  const [lastCheck, setLastCheck] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [members, setMembers] = useState([])
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [memberForm, setMemberForm] = useState({ name: '', role: '', papers: '', employment: '', year: '' })
  const [savingMember, setSavingMember] = useState(false)

  const ROLES = ['학부연구생', '석사재학', '석사졸업', '박사재학', '박사졸업']

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: profs } = await supabase
        .from('professors')
        .select('*')
        .eq('email', data.user.email)
        .single()
      if (!profs) {
        router.push('/professor/setup')
      } else {
        setProfessor(profs)
        loadMembers(profs.id)
        // 마지막 체크 기록 불러오기
        const { data: checks } = await supabase
          .from('bot_checks')
          .select('*')
          .eq('professor_id', profs.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        if (checks) {
          setLastCheck(checks)
          setCheckResults(checks.results)
        }
      }
      setLoading(false)
    })
  }, [])

  const loadMembers = async (profId) => {
    const { data } = await supabase.from('lab_members').select('*').eq('professor_id', profId).order('created_at', { ascending: false })
    if (data) setMembers(data)
  }

  const addMember = async () => {
    if (!memberForm.name || !professor) return
    setSavingMember(true)
    await supabase.from('lab_members').insert({
      professor_id: professor.id,
      name: memberForm.name,
      role: memberForm.role,
      papers: memberForm.papers ? memberForm.papers.split('\n').filter(Boolean) : [],
      employment: memberForm.employment,
      year: memberForm.year,
    })
    setMemberForm({ name: '', role: '', papers: '', employment: '', year: '' })
    setShowMemberForm(false)
    await loadMembers(professor.id)
    setSavingMember(false)
  }

  const deleteMember = async (id) => {
    await supabase.from('lab_members').delete().eq('id', id)
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const runSelfCheck = async () => {
    if (!professor) return
    setChecking(true)
    setShowResults(true)
    setCheckResults(null)

    const results = []
    for (const q of CHECK_QUESTIONS) {
      try {
        const res = await fetch('/api/bot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ professorId: professor.id, question: q }),
        })
        const data = await res.json()
        results.push({ question: q, answer: data.answer || '응답 없음' })
      } catch {
        results.push({ question: q, answer: '오류 발생' })
      }
    }

    // DB 저장
    const { data: saved } = await supabase
      .from('bot_checks')
      .insert([{
        professor_id: professor.id,
        papers_count: 0,
        results,
      }])
      .select()
      .single()

    setCheckResults(results)
    if (saved) setLastCheck(saved)
    setChecking(false)
  }

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000 / 60)
    if (diff < 1) return '방금 전'
    if (diff < 60) return `${diff}분 전`
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`
    return `${Math.floor(diff / 1440)}일 전`
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">불러오는 중...</p>
    </div>
  )

  if (!professor) return null

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">AI 대역 관리</h1>
              <p className="text-sm text-muted-foreground">{professor.name} 교수님</p>
            </div>
            <div className="flex gap-1">
              <Link href="/professor/setup" className="p-2 hover:bg-muted rounded-full">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Link>
              <button onClick={handleLogout} className="p-2 hover:bg-muted rounded-full">
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Status Card */}
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <h2 className="font-semibold text-lg">상태 요약</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/80 text-sm mb-1">AI 대역 상태</p>
                <p className="text-2xl font-bold">{professor.is_bot_active ? '활성화' : '비활성'}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">연구실</p>
                <p className="text-lg font-bold leading-tight">{professor.lab_name}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">소속</p>
                <p className="text-sm font-medium">{professor.department}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">위치</p>
                <p className="text-sm font-medium">{professor.office_location || '-'}</p>
              </div>
            </div>
          </div>

          {/* Professor Info */}
          <div className="bg-card rounded-2xl p-5 border border-border space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              연구실 정보
            </h3>
            {professor.lab_intro && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">연구실 소개</p>
                <p className="text-sm">{professor.lab_intro}</p>
              </div>
            )}
            {professor.research_topic && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">연구 주제</p>
                <p className="text-sm">{professor.research_topic}</p>
              </div>
            )}
            {(professor.keywords || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {professor.keywords.map(k => (
                  <span key={k} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">{k}</span>
                ))}
              </div>
            )}
          </div>

          {/* AI 자가체크 */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  AI 자가체크
                </h3>
                {lastCheck && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo(lastCheck.created_at)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4">AI가 내 연구실 정보를 제대로 알고 있는지 확인합니다.</p>

              <button
                onClick={runSelfCheck}
                disabled={checking}
                className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {checking ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    AI 체크 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {lastCheck ? 'AI 다시 체크하기' : 'AI 자가체크 시작'}
                  </>
                )}
              </button>
            </div>

            {/* 체크 결과 */}
            {(checkResults || checking) && (
              <div className="border-t border-border">
                <button
                  onClick={() => setShowResults(v => !v)}
                  className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium hover:bg-muted"
                >
                  <span>체크 결과 보기</span>
                  {showResults ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showResults && (
                  <div className="px-5 pb-5 space-y-4">
                    {checking && !checkResults && (
                      <p className="text-sm text-muted-foreground animate-pulse">AI에게 질문 중...</p>
                    )}
                    {(checkResults || []).map((r, i) => (
                      <div key={i} className="space-y-1.5">
                        <p className="text-xs font-semibold text-primary">Q{i + 1}. {r.question}</p>
                        <p className="text-xs text-foreground leading-relaxed bg-muted rounded-xl px-3 py-2">{r.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 연구원 관리 */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                연구원 포트폴리오
              </h3>
              <button
                onClick={() => setShowMemberForm(v => !v)}
                className="flex items-center gap-1 text-xs text-primary font-medium px-3 py-1.5 bg-primary/10 rounded-full"
              >
                <Plus className="w-3.5 h-3.5" />
                추가
              </button>
            </div>

            {/* 추가 폼 */}
            {showMemberForm && (
              <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                <input className="w-full h-10 px-3 bg-muted rounded-xl text-sm outline-none" placeholder="이름 *" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} />
                <div className="flex flex-wrap gap-2">
                  {ROLES.map(r => (
                    <button key={r} onClick={() => setMemberForm({...memberForm, role: r})}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${memberForm.role === r ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground'}`}>
                      {r}
                    </button>
                  ))}
                </div>
                <input className="w-full h-10 px-3 bg-muted rounded-xl text-sm outline-none" placeholder="졸업/재직 연도 (예: 2023)" value={memberForm.year} onChange={e => setMemberForm({...memberForm, year: e.target.value})} />
                <textarea className="w-full px-3 py-2 bg-muted rounded-xl text-sm outline-none resize-none" rows={3} placeholder={"참여 논문 (줄바꿈으로 구분)\n예: 딥러닝 기반 X 연구\nTransformer 활용 Y 논문"} value={memberForm.papers} onChange={e => setMemberForm({...memberForm, papers: e.target.value})} />
                <input className="w-full h-10 px-3 bg-muted rounded-xl text-sm outline-none" placeholder="취업처 / 진학 (예: 삼성전자, 박사진학)" value={memberForm.employment} onChange={e => setMemberForm({...memberForm, employment: e.target.value})} />
                <div className="flex gap-2">
                  <button onClick={() => setShowMemberForm(false)} className="flex-1 py-2 border border-border rounded-xl text-sm text-muted-foreground">취소</button>
                  <button onClick={addMember} disabled={savingMember || !memberForm.name} className="flex-1 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-xl disabled:opacity-40">
                    {savingMember ? '저장 중...' : '저장'}
                  </button>
                </div>
              </div>
            )}

            {/* 멤버 목록 */}
            {members.length > 0 && (
              <div className="border-t border-border divide-y divide-border">
                {members.map(m => (
                  <div key={m.id} className="px-5 py-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{m.name}</span>
                        {m.role && <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{m.role}</span>}
                        {m.year && <span className="text-xs text-muted-foreground">{m.year}</span>}
                      </div>
                      {m.employment && <p className="text-xs text-muted-foreground mt-0.5">→ {m.employment}</p>}
                      {(m.papers || []).length > 0 && <p className="text-xs text-muted-foreground mt-0.5">논문 {m.papers.length}편</p>}
                    </div>
                    <button onClick={() => deleteMember(m.id)} className="p-1.5 hover:bg-muted rounded-full shrink-0">
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {members.length === 0 && !showMemberForm && (
              <p className="text-xs text-muted-foreground text-center pb-5">등록된 연구원이 없습니다.</p>
            )}
          </div>

          {/* AI 튜닝 바로가기 */}
          <Link
            href="/professor/tuning"
            className="flex items-center justify-between w-full p-4 bg-card border border-border rounded-2xl hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI 튜닝</p>
                <p className="text-xs text-muted-foreground">지시사항 · FAQ 직접 설정</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
          </Link>

          {/* Notice */}
          <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-2xl border border-primary/20">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-primary">학생들이 AI 대역을 통해 연구실에 질문할 수 있습니다.</p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full h-12 border border-border bg-card text-muted-foreground text-sm font-medium rounded-xl hover:bg-muted flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}
