"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Plus, Trash2, Save } from 'lucide-react'
import { supabase } from '../../../utils/supabase'

export default function ProfessorTuning() {
  const router = useRouter()
  const [professor, setProfessor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [instructions, setInstructions] = useState('')
  const [faq, setFaq] = useState([]) // [{question, answer}]
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: prof } = await supabase
        .from('professors')
        .select('*')
        .eq('email', data.user.email)
        .single()
      if (!prof) { router.push('/professor/setup'); return }
      setProfessor(prof)
      setInstructions(prof.custom_instructions || '')
      setFaq(prof.faq || [])
      setLoading(false)
    })
  }, [])

  const addFaq = () => {
    if (!newQ.trim() || !newA.trim()) return
    setFaq(prev => [...prev, { question: newQ.trim(), answer: newA.trim() }])
    setNewQ('')
    setNewA('')
  }

  const removeFaq = (i) => setFaq(prev => prev.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('professors')
      .update({ custom_instructions: instructions, faq })
      .eq('id', professor.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputClass = "w-full h-11 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
  const textareaClass = "w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm"

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">불러오는 중...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-secondary text-white px-5 py-5">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/professor/dashboard')} className="p-1.5 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base">AI 튜닝</h1>
              <p className="text-white/80 text-xs">AI 봇의 답변 방식을 직접 설정하세요</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">

          {/* 추가 지시사항 */}
          <div className="bg-card rounded-2xl p-5 border border-border space-y-3">
            <div>
              <h3 className="font-semibold text-sm mb-0.5">추가 지시사항</h3>
              <p className="text-xs text-muted-foreground">AI가 답변할 때 항상 반영할 내용을 입력하세요.</p>
            </div>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder={`예시:\n- 면담은 화요일, 목요일 오후 2~5시만 가능합니다.\n- 현재 석사 과정 연구생을 모집 중입니다.\n- 학부 연구생은 GPA 3.5 이상 우대합니다.`}
              rows={6}
              className={textareaClass}
            />
            <p className="text-xs text-muted-foreground">{instructions.length}자 · AI 시스템 프롬프트에 직접 반영됩니다.</p>
          </div>

          {/* FAQ */}
          <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-0.5">자주 묻는 질문 (FAQ)</h3>
              <p className="text-xs text-muted-foreground">학생들이 자주 묻는 질문과 교수님의 답변을 등록하면 AI가 우선 참고합니다.</p>
            </div>

            {/* 기존 FAQ 목록 */}
            {faq.length > 0 && (
              <div className="space-y-3">
                {faq.map((item, i) => (
                  <div key={i} className="bg-muted rounded-xl p-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-primary flex-1">Q. {item.question}</p>
                      <button onClick={() => removeFaq(i)} className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">A. {item.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 새 FAQ 추가 */}
            <div className="space-y-2 pt-1 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground pt-1">새 질문 추가</p>
              <input
                value={newQ}
                onChange={e => setNewQ(e.target.value)}
                placeholder="질문 (예: 면담 신청은 어떻게 하나요?)"
                className={inputClass}
              />
              <textarea
                value={newA}
                onChange={e => setNewA(e.target.value)}
                placeholder="답변 (예: 이메일로 희망 일정 3개를 보내주세요.)"
                rows={3}
                className={textareaClass}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.metaKey) addFaq()
                }}
              />
              <button
                onClick={addFaq}
                disabled={!newQ.trim() || !newA.trim()}
                className="w-full h-10 border border-primary text-primary text-sm font-medium rounded-xl hover:bg-primary/10 disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                FAQ 추가
              </button>
            </div>
          </div>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full h-12 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              saved
                ? 'bg-green-500'
                : 'bg-gradient-to-r from-primary to-secondary'
            } disabled:opacity-60`}
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />저장 중...</>
            ) : saved ? (
              <><Sparkles className="w-4 h-4" />저장 완료!</>
            ) : (
              <><Save className="w-4 h-4" />AI 튜닝 저장하기</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
