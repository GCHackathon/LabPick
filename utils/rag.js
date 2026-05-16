import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// 교수님 대역 AI 페르소나 생성
function buildSystemPrompt(professorName, labIntro, knowledgeContext) {
  return `
당신은 ${professorName} 교수님의 공식 AI 대리인입니다.
학생들의 질문에 교수님을 대신하여 답변하는 역할을 합니다.

[교수님 연구실 소개]
${labIntro || "정보 없음"}

[학습된 지식 베이스 — 논문 및 연구 자료]
${knowledgeContext || "아직 등록된 자료가 없습니다."}

답변 원칙:
1. 반드시 위 지식 베이스 내용을 근거로 답변하세요.
2. 말투는 지적이고 친절한 교수님 말투로 작성하세요. (예: "~입니다", "~하시면 됩니다")
3. 지식 베이스에 없는 내용은 추측하지 말고 아래 형식으로 답변하세요:
   "해당 내용은 제 학습 자료에 없네요. 교수님께 직접 여쭤보시겠어요? [직접 연결 요청] 버튼을 누르시면 됩니다."
4. 학생이 '면담', '직접 만나', '연락' 등을 언급하면 반드시 에스컬레이션 플래그를 활성화하세요.
5. 답변은 3~5문장으로 간결하게 작성하세요.
`.trim()
}

// RAG 기반 챗봇 답변 생성
export async function getBotResponse({ professorName, labIntro, knowledgeContext, chatHistory, userMessage }) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: buildSystemPrompt(professorName, labIntro, knowledgeContext),
  })

  // 대화 히스토리 포맷 변환 (Gemini 형식)
  const history = (chatHistory || []).map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }))

  const chat = model.startChat({ history })
  const result = await chat.sendMessage(userMessage)
  const text = result.response.text()

  // 에스컬레이션 키워드 감지
  const escalationKeywords = ["직접 연결", "면담", "직접 만나", "연락", "교수님께 직접"]
  const shouldEscalate = escalationKeywords.some((kw) => text.includes(kw) || userMessage.includes(kw))

  return { text, shouldEscalate }
}

// 논문 3줄 요약 (학부생 수준)
export async function summarizePaper(title, abstract) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  const prompt = `
다음 논문을 컴퓨터공학과 학부 2학년 학생이 이해할 수 있도록 설명해주세요.

논문 제목: ${title}
초록: ${abstract}

다음 형식으로 한국어로 작성하세요:
1. 한 줄 요약: (이 논문이 무엇을 한 건지 한 문장)
2. 핵심 아이디어: (어떻게 했는지 2~3문장)
3. 왜 중요한가: (이 연구의 의의 1~2문장)
`.trim()

  const result = await model.generateContent(prompt)
  return result.response.text()
}
