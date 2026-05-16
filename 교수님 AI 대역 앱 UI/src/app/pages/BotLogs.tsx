import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Search } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { SearchBar } from '../components/SearchBar';

const filters = ['전체', '봇 처리 완료', '직접 연결 요청', '확인 필요'];

const logs = [
  {
    id: '1',
    question: '학부생 인턴은 주로 어떤 일을 하나요?',
    answerSummary: '데이터 전처리, 모델 실험 보조, 논문 리뷰를 수행한다고 답변',
    status: 'bot-completed',
    timestamp: '2026.05.16 10:30',
  },
  {
    id: '2',
    question: '교수님 연구실은 야근이 많나요?',
    answerSummary: '지식 베이스에 없어 직접 연결을 안내함',
    status: 'escalated',
    timestamp: '2026.05.16 09:15',
  },
  {
    id: '3',
    question: '최근 NLP 논문을 쉽게 설명해주세요.',
    answerSummary: '업로드된 논문 기반으로 3줄 요약 제공',
    status: 'bot-completed',
    timestamp: '2026.05.15 16:45',
  },
  {
    id: '4',
    question: '인턴 기간은 보통 얼마나 되나요?',
    answerSummary: '답변 내용 확인 필요',
    status: 'needs-review',
    timestamp: '2026.05.15 14:20',
  },
];

const statusConfig = {
  'bot-completed': {
    label: '봇 처리 완료',
    color: 'bg-success text-success-foreground',
  },
  escalated: {
    label: '직접 연결 요청',
    color: 'bg-destructive text-destructive-foreground',
  },
  'needs-review': {
    label: '확인 필요',
    color: 'bg-muted-foreground text-white',
  },
};

export function BotLogs() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/professor/dashboard" className="p-1.5 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold">봇 대화 로그</h1>
          </div>

          <SearchBar
            placeholder="학생 질문 검색..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Filters */}
        <div className="px-5 py-3 border-b border-border">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                className={`cursor-pointer whitespace-nowrap ${
                  selectedFilter === filter
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Logs List */}
        <div className="px-5 py-4 space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-card rounded-2xl p-4 border border-border">
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">{log.timestamp}</p>
                <h3 className="font-medium text-sm mb-2">학생 질문:</h3>
                <p className="text-sm text-foreground mb-3">{log.question}</p>

                <h4 className="text-xs text-muted-foreground mb-1">AI 답변 요약:</h4>
                <p className="text-xs text-muted-foreground">{log.answerSummary}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Badge className={statusConfig[log.status as keyof typeof statusConfig].color}>
                  {statusConfig[log.status as keyof typeof statusConfig].label}
                </Badge>
                <Button size="sm" variant="ghost">
                  상세보기
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-4 left-0 right-0 px-5">
          <div className="max-w-[393px] mx-auto flex gap-2">
            <Button variant="outline" className="flex-1">
              확인 필요 로그만 보기
            </Button>
            <Button variant="outline" className="flex-1">
              보완 문서 업로드
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
