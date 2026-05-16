"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronRight, ArrowLeft } from 'lucide-react'
import { supabase } from '../../../utils/supabase'

export default function ProfessorSetup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEdit, setIsEdit] = useState(false) // 수정 모드 여부
  const [professorId, setProfessorId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    lab_name: '',
    office_location: '',
    research_field: '',
    research_topic: '',
    lab_intro: '',
    scholar_link: '',
    keywords: '',
    homepage: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }

      const email = data.user.email
      const { data: existing } = await supabase
        .from('professors')
        .select('*')
        .eq('email', email)
        .single()

      if (existing) {
        // 기존 데이터 불러와서 폼에 채우기
        setIsEdit(true)
        setProfessorId(existing.id)
        setForm({
          name: existing.name || '',
          email: existing.email || email,
          department: existing.department || '',
          lab_name: existing.lab_name || '',
          office_location: existing.office_location || '',
          research_field: existing.research_field || '',
          research_topic: existing.research_topic || '',
          lab_intro: existing.lab_intro || '',
          scholar_link: existing.scholar_link || '',
          keywords: (existing.keywords || []).join(', '),
          homepage: existing.homepage || '',
        })
      } else {
        setForm(f => ({ ...f, email }))
      }
      setPageLoading(false)
    })
  }, [])

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    const payload = {
      name: form.name,
      email: form.email,
      department: form.department,
      lab_name: form.lab_name,
      office_location: form.office_location,
      research_field: form.research_field,
      research_topic: form.research_topic,
      lab_intro: form.lab_intro,
      scholar_link: form.scholar_link,
      homepage: form.homepage,
      keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      is_bot_active: true,
    }
    try {
      let err
      if (isEdit) {
        const res = await supabase.from('professors').update(payload).eq('id', professorId)
        err = res.error
      } else {
        const res = await supabase.from('professors').insert([payload])
        err = res.error
      }
      if (err) throw err
      setStep(3)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
  const textareaClass = "w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"

  if (pageLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">불러오는 중...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-secondary text-white px-5 py-6">
          <div className="flex items-center gap-3 mb-4">
            {isEdit && (
              <button onClick={() => router.push('/professor/dashboard')} className="p-1 hover:bg-white/20 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">{isEdit ? '프로필 수정' : '교수님 프로필 설정'}</h1>
              <p className="text-white/80 text-xs">{isEdit ? '정보를 수정하고 저장하세요' : 'AI 봇 활성화를 위한 정보를 입력해주세요'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-white/70">기본 정보</span>
            <span className="text-xs text-white/70">연구실 정보</span>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="px-5 py-6 space-y-4">
            <h2 className="font-semibold text-foreground">기본 정보</h2>
            <div>
              <p className="text-sm font-medium mb-2">이름 <span className="text-destructive">*</span></p>
              <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="홍길동" className={inputClass} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">이메일</p>
              <input value={form.email} disabled className={inputClass + ' opacity-60'} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">소속 학과 <span className="text-destructive">*</span></p>
              <input value={form.department} onChange={e => update('department', e.target.value)} placeholder="컴퓨터공학과" className={inputClass} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">연구실 위치</p>
              <input value={form.office_location} onChange={e => update('office_location', e.target.value)} placeholder="IT관 501호" className={inputClass} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">개인 홈페이지 URL</p>
              <input value={form.homepage} onChange={e => update('homepage', e.target.value)} placeholder="https://example.com" className={inputClass} />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <button
              onClick={() => {
                if (!form.name || !form.department) { setError('이름과 학과는 필수입니다'); return }
                setError(''); setStep(2)
              }}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              다음 <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="px-5 py-6 space-y-4">
            <h2 className="font-semibold text-foreground">연구실 정보</h2>
            <div>
              <p className="text-sm font-medium mb-2">연구실 이름 <span className="text-destructive">*</span></p>
              <input value={form.lab_name} onChange={e => update('lab_name', e.target.value)} placeholder="지능시스템 연구실" className={inputClass} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">연구 분야</p>
              <input value={form.research_field} onChange={e => update('research_field', e.target.value)} placeholder="인공지능, 머신러닝" className={inputClass} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">연구실 소개</p>
              <textarea value={form.lab_intro} onChange={e => update('lab_intro', e.target.value)} placeholder="연구실 소개를 입력해주세요..." rows={3} className={textareaClass} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">주요 연구 주제</p>
              <textarea value={form.research_topic} onChange={e => update('research_topic', e.target.value)} placeholder="RAG, 멀티모달 AI, 자연어처리 등" rows={2} className={textareaClass} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">검색 키워드 <span className="text-xs text-muted-foreground">(쉼표로 구분)</span></p>
              <input value={form.keywords} onChange={e => update('keywords', e.target.value)} placeholder="AI, 딥러닝, 강화학습" className={inputClass} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Semantic Scholar 프로필 URL <span className="text-xs text-muted-foreground">(논문 자동 연동)</span></p>
              <input value={form.scholar_link} onChange={e => update('scholar_link', e.target.value)} placeholder="https://www.semanticscholar.org/author/이름/숫자ID" className={inputClass} />
              <p className="text-xs text-muted-foreground mt-1">semanticscholar.org에서 본인 프로필 찾아 URL 붙여넣기</p>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-xl">{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 h-12 border border-border bg-card text-foreground font-medium rounded-xl hover:bg-muted">
                이전
              </button>
              <button
                onClick={() => {
                  if (!form.lab_name) { setError('연구실 이름은 필수입니다'); return }
                  handleSubmit()
                }}
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl disabled:opacity-50"
              >
                {loading ? '저장 중...' : isEdit ? '수정 완료' : '등록 완료'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 완료 */}
        {step === 3 && (
          <div className="px-5 py-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{isEdit ? '수정 완료!' : '등록 완료!'}</h2>
            <p className="text-muted-foreground mb-8">
              {form.name} 교수님의 정보가 {isEdit ? '업데이트' : '등록'}되었습니다.
            </p>
            <button
              onClick={() => router.push('/professor/dashboard')}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl"
            >
              대시보드로 이동
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
