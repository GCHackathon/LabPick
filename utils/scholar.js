// Semantic Scholar 무료 API — 키 없이 사용 가능
const BASE_URL = "https://api.semanticscholar.org/graph/v1"

const PAPER_FIELDS = "title,abstract,year,citationCount,externalIds,url,openAccessPdf"
const AUTHOR_FIELDS = "name,affiliations,paperCount,citationCount,papers"

// Semantic Scholar URL에서 저자 ID 추출
// 예: https://www.semanticscholar.org/author/Yoshua-Bengio/1741101 → "1741101"
export function extractAuthorId(urlOrId) {
  if (!urlOrId) return null
  const match = urlOrId.match(/semanticscholar\.org\/author\/[^/]+\/(\d+)/)
  if (match) return match[1]
  if (/^\d+$/.test(urlOrId.trim())) return urlOrId.trim()
  return null // 이름인 경우
}

// 교수님 이름으로 저자 검색 → 첫 번째 결과 반환 (폴백용)
export async function searchAuthor(name) {
  const res = await fetch(
    `${BASE_URL}/author/search?query=${encodeURIComponent(name)}&fields=${AUTHOR_FIELDS}&limit=1`
  )
  const data = await res.json()
  return data.data?.[0] ?? null
}

// 저자 ID로 논문 목록 조회 (피인용수 상위 10편)
export async function fetchPapersByAuthorId(authorId) {
  const res = await fetch(
    `${BASE_URL}/author/${authorId}/papers?fields=${PAPER_FIELDS}&limit=10&sort=citationCount`
  )
  const data = await res.json()
  return data.data ?? []
}

// scholar_link = Semantic Scholar URL 또는 저자 ID → 논문 목록 가져오기
// URL/ID 있으면 정확하게, 없으면 이름 검색(폴백)
export async function fetchProfessorPapers(urlOrName) {
  const authorId = extractAuthorId(urlOrName)
  if (authorId) {
    const papers = await fetchPapersByAuthorId(authorId)
    return { author: { authorId }, papers }
  }
  // 폴백: 이름 검색 (동명이인 문제 있음)
  const author = await searchAuthor(urlOrName)
  if (!author) return { author: null, papers: [] }
  const papers = await fetchPapersByAuthorId(author.authorId)
  return { author, papers }
}

// 논문 초록들을 RAG context 텍스트로 변환
export function papersToContext(papers) {
  if (!papers.length) return ""
  return papers
    .filter((p) => p.abstract) // 초록 있는 것만
    .map((p) => `[논문] ${p.title} (${p.year})\n${p.abstract}`)
    .join("\n\n")
}
