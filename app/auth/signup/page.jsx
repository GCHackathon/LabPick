"use client"
import { useState } from "react"
import { Sparkles, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

const ROLES = [
  { id: "student", label: "학생", desc: "공고 열람, 지원, 연구실 정보 조회" },
  { id: "professor", label: "교수님", desc: "공고 등록, 지원자 확인, 매칭 결과 조회" },
  { id: "admin", label: "관리자", desc: "교수님 프로필 등록, 전체 데이터 관리" },
]

const STRENGTHS = ["꼼꼼함", "창의적", "추진력", "협업", "분석력", "커뮤니케이션"]
const WORK_STYLES = ["혼자 집중하는 편", "같이 토론하는 편", "둘 다 가능"]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: 역할선택, 2: 기본정보, 3: 상세정보
  const [role, setRole] = useState("")
  const [form, setForm] = useState({
    name: "", studentId: "", grade: "", gpa: "", major: "",
    email: "", password: "",
    skills: "", interest: "", careerGoal: "취업",
    workStyle: "", strengths: [],
    // 교수님 전용
    labName: "", researchField: "", labIntro: "",
  })

  const toggleStrength = (s) => {
    setForm((prev) => ({
      ...prev,
      strengths: prev.strengths.includes(s)
        ? prev.strengths.filter((x) => x !== s)
        : prev.strengths.length < 3
        ? [...prev.strengths, s]
        : prev.strengths,
    }))
  }

  const handleSubmit = () => {
    // 더미: localStorage에 저장 후 홈으로
    // Supabase 연동 시: API 호출로 교체
    localStorage.setItem("user", JSON.stringify({ ...form, role }))
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 mb-4">
            <img src="/vibecoding/img/icon.png" alt="icon" className="w-5 h-5 object-contain" /> Bridge Lab
          </div>
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="mt-2 text-slate-400 text-sm">
            {step === 1 ? "역할을 선택하세요" : step === 2 ? "기본 정보를 입력하세요" : "상세 정보를 입력하세요"}
          </p>
          {/* 진행 바 */}
          <div className="mt-4 flex gap-2 justify-center">
            {[1,2,3].map((s) => (
              <div key={s} className={`h-1.5 w-16 rounded-full transition-all ${s <= step ? "bg-cyan-300" : "bg-white/10"}`} />
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl">

          {/* Step 1: 역할 선택 */}
          {step === 1 && (
            <div className="space-y-3">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    role === r.id
                      ? "border-cyan-300/60 bg-cyan-300/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p className="font-bold">{r.label}</p>
                  <p className="mt-1 text-sm text-slate-400">{r.desc}</p>
                </button>
              ))}
              <button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-40"
              >
                다음 <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: 기본 정보 */}
          {step === 2 && (
            <div className="space-y-4">
              <Field label="이름" value={form.name} onChange={(v) => setForm({...form, name: v})} placeholder="홍길동" />
              <Field label="이메일" value={form.email} onChange={(v) => setForm({...form, email: v})} placeholder="example@gachon.ac.kr" />
              <Field label="비밀번호" type="password" value={form.password} onChange={(v) => setForm({...form, password: v})} placeholder="••••••••" />
              {role === "student" && (
                <>
                  <Field label="학번" value={form.studentId} onChange={(v) => setForm({...form, studentId: v})} placeholder="202512345" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="학년" value={form.grade} onChange={(v) => setForm({...form, grade: v})} placeholder="2" />
                    <Field label="학점" value={form.gpa} onChange={(v) => setForm({...form, gpa: v})} placeholder="3.5" />
                  </div>
                  <Field label="전공" value={form.major} onChange={(v) => setForm({...form, major: v})} placeholder="컴퓨터공학과" />
                </>
              )}
              {role === "professor" && (
                <>
                  <Field label="연구실 이름" value={form.labName} onChange={(v) => setForm({...form, labName: v})} placeholder="Human-AI Lab" />
                  <Field label="연구 분야" value={form.researchField} onChange={(v) => setForm({...form, researchField: v})} placeholder="인공지능, HCI" />
                </>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 rounded-2xl border border-white/10 py-3 text-sm font-bold">이전</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!form.name || !form.email}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 py-3 text-sm font-bold text-slate-950 disabled:opacity-40"
                >
                  다음 <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 상세 정보 */}
          {step === 3 && (
            <div className="space-y-4">
              {role === "student" && (
                <>
                  <Field label="보유 스킬 (쉼표로 구분)" value={form.skills} onChange={(v) => setForm({...form, skills: v})} placeholder="Python, React, PyTorch" />
                  <Field label="관심 분야" value={form.interest} onChange={(v) => setForm({...form, interest: v})} placeholder="AI/ML, 웹개발" />
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">진로 방향</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["취업", "대학원"].map((g) => (
                        <button
                          key={g}
                          onClick={() => setForm({...form, careerGoal: g})}
                          className={`rounded-2xl py-3 text-sm font-bold transition ${form.careerGoal === g ? "bg-cyan-300 text-slate-950" : "bg-white/10"}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">작업 스타일</label>
                    <div className="space-y-2">
                      {WORK_STYLES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setForm({...form, workStyle: s})}
                          className={`w-full rounded-2xl py-3 text-sm font-bold transition ${form.workStyle === s ? "bg-cyan-300 text-slate-950" : "bg-white/10"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">강점 키워드 (최대 3개)</label>
                    <div className="flex flex-wrap gap-2">
                      {STRENGTHS.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleStrength(s)}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition ${form.strengths.includes(s) ? "bg-cyan-300 text-slate-950" : "bg-white/10"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {role === "professor" && (
                <Field label="연구실 한줄 소개" value={form.labIntro} onChange={(v) => setForm({...form, labIntro: v})} placeholder="사람을 돕는 AI 서비스를 연구합니다." />
              )}
              {role === "admin" && (
                <p className="text-sm text-slate-400 text-center py-4">관리자 계정은 추가 정보가 필요하지 않습니다.</p>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="flex-1 rounded-2xl border border-white/10 py-3 text-sm font-bold">이전</button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-2xl bg-cyan-300 py-3 text-sm font-bold text-slate-950"
                >
                  가입 완료
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{" "}
          <button onClick={() => router.push("/auth/login")} className="text-cyan-300">로그인</button>
        </p>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
      />
    </label>
  )
}
