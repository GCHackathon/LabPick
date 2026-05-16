import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// JSON 출력 스키마 고정 (additionalProperties 차단)
const MATCH_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    score:    { type: SchemaType.INTEGER, description: "0~100 적합도 점수" },
    reason:   { type: SchemaType.STRING,  description: "점수 근거 (한국어, 2~3문장)" },
    feedback: { type: SchemaType.STRING,  description: "학생 개선 제안 (한국어, 실행 가능한 것만)" },
  },
  required: ["score", "reason", "feedback"],
}

// 평가 규칙을 고정하는 시스템 프롬프트 (페르소나)
const SYSTEM_PROMPT = `
너는 학과 연구실 매칭 평가 엔진이다.
목표는 교수 연구실 공고와 학생 프로필을 비교하여 적합도를 점수화하는 것이다.

평가 원칙:
1. 하드 조건(학년, 학점, 전공)을 먼저 평가한다.
2. 하드 조건 중 하나라도 명백히 미달하면 score는 반드시 40 이하로 제한한다.
3. 소프트 조건(작업 스타일, MBTI, 강점 키워드, 관심 분야, 진로 방향)은 하드 조건 통과 후에만 보조 점수로 반영한다.
4. 누락되거나 불명확한 정보는 일치로 추정하지 말고 중립적으로 처리한다.
5. 반드시 입력에 있는 근거만 사용하고 과장하지 않는다.

점수 기준:
- score는 0~100의 정수
- 하드 조건 70점 비중: 학년 20점, 학점 25점, 전공 25점
- 소프트 조건 30점 비중: 작업 스타일 10점, MBTI 5점, 강점 키워드 5점, 관심 분야 5점, 진로 방향 5점
- 하드 조건 미달 시 score 상한 40점

출력 규칙:
- reason: 한국어, 2~3문장, 점수 근거만
- feedback: 한국어, 학생이 다음에 보완할 점만, 실행 가능한 제안
- JSON 외 텍스트 절대 출력 금지
`.trim()

// 공고 조건 + 학생 프로필 매칭 점수 반환
export async function matchStudent(postData, studentData) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: MATCH_SCHEMA,
    },
  })

  const userPrompt = `
[교수 연구실 공고]
${JSON.stringify(postData, null, 2)}

[학생 프로필]
${JSON.stringify(studentData, null, 2)}

위 정보를 바탕으로 score, reason, feedback을 JSON으로만 출력하라.
`.trim()

  const result = await model.generateContent(userPrompt)
  const text = result.response.text()
  return JSON.parse(text)
}

// 탈락 학생에게 개선 피드백 반환
export async function generateFeedback(postData, studentData) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
너는 학과 연구실 매칭 평가 엔진이다.
학생이 지원에서 탈락했을 때 부족한 부분과 다음 지원을 위한 개선 방향을 안내한다.
- 한국어로 작성
- 2~3문장으로 간결하게
- 실행 가능한 제안만 포함
- 위로나 감성적 표현 없이 실무적으로
    `.trim(),
  })

  const userPrompt = `
[교수 연구실 공고]
${JSON.stringify(postData, null, 2)}

[학생 프로필]
${JSON.stringify(studentData, null, 2)}
`.trim()

  const result = await model.generateContent(userPrompt)
  return result.response.text()
}
