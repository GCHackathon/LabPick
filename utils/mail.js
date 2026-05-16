// 교수님 컨택용 메일 양식 생성
// professor: { name, email, lab_name, research_field, research_topic }
// student: { name, major, grade, interests[] } | null
export function buildContactMailto(professor, student) {
  if (!professor?.email) return ""

  const subject = `[랩픽] ${professor.lab_name} 면담 및 연구실 관련 문의`

  const studentLine = student
    ? `저는 ${student.major || ""} ${student.grade ? student.grade + "학년" : ""} ${student.name || ""}입니다.`
        .replace(/\s+/g, " ")
        .trim()
    : "저는 (소속 학과/학년/이름을 입력해 주세요)입니다."

  const interestLine = student?.interests?.length
    ? `평소 ${student.interests.join(", ")} 분야에 관심을 가지고 공부해 왔습니다.`
    : "평소 관심 분야는 (관심 분야를 입력해 주세요)입니다."

  const skillLine = student?.skills
    ? `현재 보유하고 있는 주력 기술 및 스택은 ${student.skills}입니다.`
    : ""

  const body = `${professor.name} 교수님께,

안녕하세요. 랩픽(LabPick)을 통해 연락드리는 학생입니다.

${studentLine}
${interestLine}
${skillLine}

교수님의 ${professor.research_field || "연구 분야"}와 ${professor.lab_name} 연구실의 연구 주제(${professor.research_topic || "연구 주제"})에 큰 흥미를 느껴, 더 깊이 알아보고 싶어 메일 드립니다.

다음과 같은 부분이 궁금합니다:
1. (예) 학부 연구생 / 대학원 진학을 위한 선수지식이나 준비 사항이 궁금합니다.
2. (예) 현재 진행 중이신 연구 중 학생이 참여 가능한 주제가 있을지 여쭙고 싶습니다.
3. (구체적인 질문을 자유롭게 추가해 주세요)

가능하시다면 짧게라도 면담 시간을 가질 수 있을지 여쭙고 싶습니다. 교수님의 일정에 맞추어 방문 또는 줌(Zoom) 면담 모두 좋습니다.

번거로우시겠지만 검토 후 회신 부탁드립니다.
감사합니다.

${student?.name || "(이름)"} 드림
`

  return `mailto:${professor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
