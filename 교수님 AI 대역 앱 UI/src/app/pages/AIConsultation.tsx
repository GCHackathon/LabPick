import { useState } from 'react';
import { Link } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import { Sparkles, FileText, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const aiProxies = [
  {
    id: '1',
    professor: '김철수 교수님',
    lab: '인공지능 연구실',
    documentCount: 16,
    paperCount: 24,
    lastUpdate: '2026.05.16',
    available: true,
  },
  {
    id: '2',
    professor: '이영희 교수님',
    lab: '데이터사이언스 연구실',
    documentCount: 9,
    paperCount: 18,
    lastUpdate: '2026.05.15',
    available: true,
  },
  {
    id: '3',
    professor: '정보보 교수님',
    lab: '보안 연구실',
    documentCount: 7,
    paperCount: 12,
    lastUpdate: '2026.05.14',
    available: true,
  },
];

const recentQuestions = [
  '학부생 인턴은 어떤 일을 하나요?',
  '논문을 읽기 전에 뭘 공부해야 하나요?',
  '연구실 면담 전에 준비할 것이 있나요?',
];

export function AIConsultation() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">AI상담</h1>
          <p className="text-sm text-muted-foreground">
            교수님께 직접 연락하기 전, AI 대역에게 먼저 질문해보세요.
          </p>
        </div>

        {/* Search */}
        <div className="px-5 py-4">
          <SearchBar
            placeholder="교수님 이름 또는 연구 분야 검색..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* AI Proxies */}
        <div className="px-5 mb-6">
          <h2 className="font-semibold mb-3">추천 AI 대역</h2>
          <div className="space-y-3">
            {aiProxies.map((proxy) => (
              <div key={proxy.id} className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{proxy.professor} AI 대역</h3>
                    <p className="text-sm text-muted-foreground">{proxy.lab}</p>
                  </div>
                  {proxy.available && (
                    <Badge className="bg-success text-success-foreground">답변 가능</Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>문서 {proxy.documentCount}개 학습</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>논문 {proxy.paperCount}편 연동</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                  최근 업데이트 {proxy.lastUpdate}
                </p>

                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  <Link to={`/ai-chat/${proxy.id}`}>질문하기</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Questions */}
        <div className="px-5">
          <h2 className="font-semibold mb-3">최근 질문</h2>
          <div className="space-y-2">
            {recentQuestions.map((question) => (
              <button
                key={question}
                className="w-full text-left bg-card rounded-xl p-4 border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{question}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
