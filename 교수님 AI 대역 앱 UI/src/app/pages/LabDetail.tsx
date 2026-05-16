import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { X, Sparkles, FileText, BookOpen, MapPin, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PaperCard } from '../components/PaperCard';
import { SearchBar } from '../components/SearchBar';

const labData = {
  '1': {
    name: '인공지능 연구실',
    professor: '김철수 교수',
    aiEnabled: true,
    documentCount: 16,
    paperCount: 24,
    lastUpdate: '2026.05.16',
    intro: 'AI 기술을 기반으로 인간의 언어와 시각을 이해하는 지능형 시스템을 연구합니다. 최신 딥러닝 모델과 실제 서비스를 연결하는 프로젝트를 진행하고 있습니다.',
    researchAreas: ['딥러닝', '자연어 처리', '컴퓨터 비전'],
    researchTopics: ['대규모 언어 모델 연구', '이미지 인식 및 생성 모델', '멀티모달 AI 시스템'],
    department: '컴퓨터공학과',
    location: '공학관 5층 512호',
    email: 'cs.kim@university.ac.kr',
    preferredStudents: [
      '논문을 읽어보려는 태도',
      'Python 기초 이해',
      '꾸준히 질문하는 학생',
      '팀원과 토론 가능한 학생',
    ],
    papers: [
      {
        id: 'p1',
        title: 'Efficient Deep Learning for Korean NLP',
        year: 2024,
        citations: 32,
        keywords: ['NLP', 'Transformer', 'Korean Dataset'],
      },
      {
        id: 'p2',
        title: 'Multimodal Vision-Language Representation',
        year: 2023,
        citations: 58,
        keywords: ['Multimodal', 'Computer Vision'],
      },
      {
        id: 'p3',
        title: 'Lightweight Neural Network for Edge AI',
        year: 2022,
        citations: 41,
        keywords: ['Edge AI', 'Optimization'],
      },
      {
        id: 'p4',
        title: 'Survey on Deep Learning Applications',
        year: 2021,
        citations: 76,
        keywords: ['Deep Learning', 'Survey'],
      },
    ],
  },
};

export function LabDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('info');
  const [paperSearch, setPaperSearch] = useState('');

  const lab = labData[id as keyof typeof labData];

  if (!lab) {
    return <div className="p-5">연구실을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-secondary text-white p-6 relative">
          <Link to="/" className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </Link>

          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold mb-2">{lab.name}</h1>
          <p className="text-white/90 mb-4">{lab.professor}</p>

          <div className="flex flex-wrap gap-2">
            {lab.aiEnabled && (
              <Badge className="bg-white/20 text-white border-0">AI 대역 활성화</Badge>
            )}
            <Badge className="bg-white/20 text-white border-0">문서 {lab.documentCount}개 학습</Badge>
            <Badge className="bg-white/20 text-white border-0">논문 {lab.paperCount}편</Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-card border-b border-border rounded-none h-12">
            <TabsTrigger value="info" className="text-sm">
              연구실 정보
            </TabsTrigger>
            <TabsTrigger value="papers" className="text-sm">
              논문
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-sm">
              AI 대역
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-sm">
              직접 연결
            </TabsTrigger>
          </TabsList>

          {/* Tab: 연구실 정보 */}
          <TabsContent value="info" className="px-5 py-4 space-y-4">
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-semibold mb-2">연구실 소개</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{lab.intro}</p>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-semibold mb-3">주요 연구 분야</h3>
              <div className="flex flex-wrap gap-2">
                {lab.researchAreas.map((area) => (
                  <Badge key={area} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-semibold mb-3">주요 연구 주제</h3>
              <ul className="space-y-2">
                {lab.researchTopics.map((topic) => (
                  <li key={topic} className="text-sm text-muted-foreground flex items-start">
                    <span className="mr-2">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-semibold mb-3">연구실 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-20">소속:</span>
                  <span className="text-foreground">{lab.department}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-foreground">{lab.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-foreground">{lab.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-20">AI 봇 업데이트:</span>
                  <span className="text-foreground">{lab.lastUpdate}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border">
              <h3 className="font-semibold mb-3">선호 학생상</h3>
              <ul className="space-y-2">
                {lab.preferredStudents.map((pref) => (
                  <li key={pref} className="text-sm text-muted-foreground flex items-start">
                    <span className="mr-2">•</span>
                    <span>{pref}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="fixed bottom-24 left-0 right-0 bg-background border-t border-border p-4">
              <div className="max-w-[393px] mx-auto flex gap-2">
                <Button asChild className="flex-1 bg-gradient-to-r from-primary to-secondary">
                  <Link to={`/ai-chat/${id}`}>AI 대역에게 질문하기</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <button onClick={() => setActiveTab('papers')}>논문 보기</button>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab: 논문 */}
          <TabsContent value="papers" className="px-5 py-4 space-y-4">
            <div className="bg-card rounded-2xl p-4 border border-border">
              <h3 className="font-semibold mb-1">{lab.professor} 논문</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Semantic Scholar 기준으로 불러온 논문 목록입니다.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  자동 연동
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  AI 논문 가이드 가능
                </Badge>
              </div>
            </div>

            <SearchBar
              placeholder="논문 제목, 키워드로 검색..."
              value={paperSearch}
              onChange={setPaperSearch}
            />

            <div className="space-y-3">
              {lab.papers.map((paper) => (
                <PaperCard key={paper.id} {...paper} professorId={id} />
              ))}
            </div>

            <div className="pt-4">
              <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
                <Link to={`/ai-chat/${id}`}>논문 기반으로 AI에게 질문하기</Link>
              </Button>
            </div>
          </TabsContent>

          {/* Tab: AI 대역 */}
          <TabsContent value="ai" className="px-5 py-4">
            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">교수님 AI 대역</h3>
              <p className="text-sm text-white/90 mb-6">
                {lab.professor}님이 제공한 논문, 연구 요약, FAQ를 기반으로 24시간 답변합니다.
              </p>
              <Button asChild variant="secondary" className="w-full">
                <Link to={`/ai-chat/${id}`}>AI 대역과 상담 시작하기</Link>
              </Button>
            </div>
          </TabsContent>

          {/* Tab: 직접 연결 */}
          <TabsContent value="contact" className="px-5 py-4">
            <div className="bg-card rounded-2xl p-5 border border-border text-center">
              <h3 className="font-semibold mb-2">직접 연결</h3>
              <p className="text-sm text-muted-foreground mb-6">
                AI 대역이 답변할 수 없는 질문이나 면담이 필요한 경우 교수님께 직접 연결을 요청할 수
                있습니다.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to={`/escalation/${id}`}>교수님께 직접 연결 요청</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
