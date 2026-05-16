"use client"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { supabase } from '../../../utils/supabase'

const ADJECTIVES = ['귀여운', '용감한', '슬픈', '행복한', '졸린', '배고픈', '신나는', '수줍은', '당당한', '느긋한', '엉뚱한', '영리한', '따뜻한', '차가운', '활발한']
const ANIMALS = ['고양이', '강아지', '토끼', '여우', '곰', '펭귄', '다람쥐', '햄스터', '판다', '너구리', '수달', '코알라', '부엉이', '고슴도치', '라쿠다']

function randomNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const ani = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  return `${adj} ${ani}`
}

export default function OpenChatRoom() {
  const { id } = useParams()
  const [professor, setProfessor] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [userName, setUserName] = useState('')
  const [nameSet, setNameSet] = useState(false)
  const [suggested, setSuggested] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    fetch('/api/professors')
      .then(r => r.json())
      .then(d => {
        const prof = (d.professors || []).find(p => p.id === id)
        setProfessor(prof || null)
      })

    const initNickname = async () => {
      // 로그인 유저: DB 닉네임 확인
      const { data: authData } = await supabase.auth.getUser()
      if (authData.user) {
        const { data: s } = await supabase
          .from('students')
          .select('nickname')
          .eq('email', authData.user.email)
          .single()

        if (s?.nickname) {
          // 이미 닉네임 있으면 그대로 사용
          setUserName(s.nickname)
          setNameSet(true)
          // 기존 메시지 중 실명으로 된 것도 닉네임으로 업데이트
          await supabase
            .from('lab_chats')
            .update({ user_name: s.nickname })
            .eq('user_name', s.email?.split('@')[0] || '')
        } else {
          // 닉네임 없으면 랜덤 생성 후 DB 저장
          const newNick = randomNickname()
          await supabase
            .from('students')
            .update({ nickname: newNick })
            .eq('email', authData.user.email)
          // 기존에 실명(이름)으로 보낸 메시지도 닉네임으로 변경
          if (s?.name) {
            await supabase
              .from('lab_chats')
              .update({ user_name: newNick })
              .eq('user_name', s.name)
          }
          setUserName(newNick)
          setNameSet(true)
        }
        return
      }

      // 비로그인: localStorage 확인
      const saved = localStorage.getItem('openchat_nickname_guest')
      if (saved) {
        setUserName(saved)
        setNameSet(true)
      } else {
        setSuggested(randomNickname())
      }
    }

    initNickname()
    loadMessages()

    // 3초마다 새 메시지 폴링
    intervalRef.current = setInterval(loadMessages, 3000)
    return () => clearInterval(intervalRef.current)
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('lab_chats')
      .select('*')
      .eq('professor_id', id)
      .order('created_at', { ascending: true })
      .limit(100)
    if (!error && data) {
      setMessages(data)
    }
    setLoading(false)
  }

  const sendMessage = async () => {
    const text = input.trim()
    const name = userName.trim() || '익명'
    if (!text) return
    setSending(true)
    setInput('')

    const { error } = await supabase.from('lab_chats').insert({
      professor_id: id,
      user_name: name,
      message: text,
    })

    if (error) {
      console.error('전송 오류:', error)
      alert('전송 실패: ' + error.message)
      setInput(text)
    } else {
      await loadMessages()
    }
    setSending(false)
  }

  const formatTime = (ts) => {
    const d = new Date(ts)
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  // 닉네임 미설정 시 입력 화면
  if (!nameSet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-[393px] w-full px-5">
          <div className="bg-card rounded-3xl p-8 border border-border text-center space-y-5">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">오픈챗 입장</h2>
              <p className="text-sm text-muted-foreground">익명으로 참여합니다</p>
            </div>

            {/* 랜덤 닉네임 표시 */}
            <div className="bg-muted rounded-2xl p-4 space-y-2">
              <p className="text-xs text-muted-foreground">배정된 닉네임</p>
              <p className="text-xl font-bold text-foreground">{suggested}</p>
              <button
                onClick={() => setSuggested(randomNickname())}
                className="text-xs text-primary underline"
              >
                다른 닉네임 받기
              </button>
            </div>

            <button
              onClick={() => {
                localStorage.setItem('openchat_nickname_guest', suggested)
                setUserName(suggested)
                setNameSet(true)
              }}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl"
            >
              이 닉네임으로 입장하기
            </button>
            <Link href="/openchat" className="block text-xs text-muted-foreground">← 채팅방 목록으로</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-[393px] mx-auto w-full flex flex-col h-screen">
        {/* 헤더 */}
        <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
          <Link href="/openchat" className="p-1.5 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{professor?.lab_name || '연구실 오픈챗'}</p>
            <p className="text-xs text-muted-foreground">{professor?.name} 교수 · 누구나 참여 가능</p>
          </div>
          <Link href={`/lab/${id}`} className="text-xs text-primary shrink-0">연구실 보기</Link>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ paddingBottom: '80px' }}>
          {loading && <p className="text-xs text-muted-foreground text-center py-4">불러오는 중...</p>}
          {!loading && messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">아직 메시지가 없습니다.</p>
              <p className="text-xs text-muted-foreground">첫 번째로 말을 걸어보세요!</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.user_name === userName
            return (
              <div key={msg.id || i} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{msg.user_name?.[0] || '?'}</span>
                  </div>
                )}
                <div className={`max-w-[70%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-xs text-muted-foreground px-1">{msg.user_name}</span>}
                  <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm'
                      : 'bg-card border border-border text-foreground rounded-tl-sm'
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">{formatTime(msg.created_at)}</span>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 z-10">
          <div className="max-w-[393px] mx-auto flex gap-2">
            <input
              className="flex-1 h-10 px-4 bg-muted rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="w-10 h-10 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
