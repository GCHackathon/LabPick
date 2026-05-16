"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { X, Sparkles, MapPin, Mail, BookOpen, MessageCircle, User, GraduationCap, Briefcase, Globe } from 'lucide-react'
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
  const [members, setMembers] = useState([])

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

    supabase
      .from('lab_members')
      .select('*')
      .eq('professor_id', id)
      .order('year', { ascending: false })
      .then(({ data }) => { if (data) setMembers(data) })
  }, [id])

  const fetchPapers = () => {
    if (!professor?.scholar_link) return
    fetch(`/api/papers?name=${encodeURIComponent(professor.scholar_link)}`)
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
    { id: 'members', label: '연구원' },
    { id: 'contact', label: '직접 연결' },
  ]

  const maskName2 = (name) => {
    if (!name || name.length < 2) return name
    if (name.length === 2) return name[0] + '○'
    return name[0] + '○' + name[name.length - 1]
  }

  const roleColor = (role) => {
    if (role?.includes('박사')) return 'bg-purple-100 text-purple-700'
    if (role?.includes('석사')) return 'bg-blue-100 text-blue-700'
    if (role?.includes('졸업')) return 'bg-green-100 text-green-700'
    return 'bg-muted text-muted-foreground'
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="max-w-[393px] mx-auto w-full flex flex-col flex-1 overflow-hidden">
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

        {/* 스크롤 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto pb-36">

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
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">소속:</span>
                <span>{professor.department?.trim()}</span>
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
              {professor.homepage && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href={professor.homepage} target="_blank" rel="noreferrer" className="text-primary underline truncate">
                    개인 홈페이지
                  </a>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab: 논문 */}
        {activeTab === 'papers' && (
          <div className="px-5 py-4 space-y-3">
            <div className="bg-card rounded-2xl p-4 border border-border">
              <p className="text-xs text-muted-foreground">Semantic Scholar 기준으로 불러온 논문 목록입니다.</p>
            </div>
            {!professor.scholar_link ? (
              <p className="text-sm text-muted-foreground text-center py-8">등록된 논문 정보가 없습니다.</p>
            ) : papers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">논문을 불러오는 중...</p>
            ) : null}
            {professor.scholar_link && papers.map(paper => (
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

        {/* Tab: 연구원 포트폴리오 */}
        {activeTab === 'members' && (
          <div className="px-5 py-4 space-y-4">
            <div className="bg-card rounded-2xl p-4 border border-border">
              <p className="text-xs text-muted-foreground">이 연구실을 거쳐간 연구원들의 포트폴리오입니다.</p>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-10">
                <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">아직 등록된 연구원이 없습니다.</p>
              </div>
            ) : (
              members.map(member => (
                <div key={member.id} className="bg-card rounded-2xl p-5 border border-border space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold">{member.name?.[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{maskName2(member.name)}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {member.role && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor(member.role)}`}>{member.role}</span>
                        )}
                        {member.year && (
                          <span className="text-xs text-muted-foreground">{member.year}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {member.papers && member.papers.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> 참여 논문
                      </p>
                      <div className="space-y-1">
                        {member.papers.map((p, i) => (
                          <p key={i} className="text-xs text-foreground leading-snug pl-2 border-l-2 border-primary/30">{p}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.employment && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span>{member.employment}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: 직접 연결 */}
        {activeTab === 'contact' && (
          <div className="px-5 py-4 pb-32">
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

        </div>{/* 스크롤 콘텐츠 영역 끝 */}
      </div>

      {/* 항상 고정 버튼 */}
      <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border p-3">
        <div className="max-w-[393px] mx-auto flex gap-2">
          <Link href={`/ai-chat/${id}`} className="flex-1 text-center py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-xl">
            AI 대역에게 질문하기
          </Link>
          <Link href={`/openchat/${id}`} className="flex-1 py-3 border border-border bg-card text-foreground text-sm font-medium rounded-xl hover:bg-muted text-center">
            오픈챗 참여
          </Link>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-[393px] mx-auto flex items-center justify-around h-20 px-4">
          <Link href="/" className="flex flex-col items-center gap-1 flex-1 text-primary">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">연구실</span>
          </Link>
          <Link href="/openchat" className="flex flex-col items-center gap-1 flex-1 text-muted-foreground">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">오픈챗</span>
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
