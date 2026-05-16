"use client"
import { useState } from "react"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })

  const handleLogin = () => {
    // 더미: localStorage user 있으면 통과
    // Supabase 연동 시: API 호출로 교체
    localStorage.setItem("user", JSON.stringify({ email: form.email, role: "student" }))
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 mb-4">
            <img src="/vibecoding/img/icon.png" alt="icon" className="w-5 h-5 object-contain" /> Bridge Lab
          </div>
          <h1 className="text-3xl font-bold">로그인</h1>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">이메일</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              placeholder="example@gachon.ac.kr"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">비밀번호</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
            />
          </label>
          <button
            onClick={handleLogin}
            className="w-full rounded-2xl bg-cyan-300 py-3 font-bold text-slate-950 mt-2"
          >
            로그인
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          계정이 없으신가요?{" "}
          <button onClick={() => router.push("/auth/signup")} className="text-cyan-300">회원가입</button>
        </p>
      </div>
    </div>
  )
}
