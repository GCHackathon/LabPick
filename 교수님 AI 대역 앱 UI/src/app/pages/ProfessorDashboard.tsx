import { Link } from 'react-router';
import { Settings, Sparkles, FileText, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const stats = {
  aiStatus: '활성화',
  documents: 16,
  weeklyQuestions: 28,
  directRequests: 5,
};

const topKeywords = [
  { keyword: '학부생 인턴', count: 8 },
  { keyword: '논문 읽기', count: 6 },
  { keyword: 'Python', count: 5 },
  { keyword: '면담 준비', count: 4 },
];

const recentLogs = [
  {
    id: '1',
    question: '학부생 인턴은 주로 어떤 일을 하나요?',
    status: 'bot-completed',
  },
  {
    id: '2',
    question: '연구실 야근이 많은가요?',
    status: 'escalated',
  },
  {
    id: '3',
    question: '최근 NLP 논문을 쉽게 설명해주세요.',
    status: 'bot-completed',
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
};

export function ProfessorDashboard() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI 대역 관리</h1>
              <p className="text-sm text-muted-foreground">김철수 교수님</p>
            </div>
            <button className="p-2 hover:bg-muted rounded-full">
              <Settings className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Status Summary */}
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <h2 className="font-semibold text-lg">상태 요약</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/80 text-sm mb-1">AI 대역 상태</p>
                <p className="text-2xl font-bold">{stats.aiStatus}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">학습 문서</p>
                <p className="text-2xl font-bold">{stats.documents}개</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">이번 주 학생 질문</p>
                <p className="text-2xl font-bold">{stats.weeklyQuestions}개</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">직접 연결 요청</p>
                <p className="text-2xl font-bold">{stats.directRequests}건</p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              인사이트
            </h3>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">많이 묻는 키워드</p>
              <div className="space-y-2">
                {topKeywords.map((item) => (
                  <div key={item.keyword} className="flex items-center justify-between">
                    <Badge variant="secondary">{item.keyword}</Badge>
                    <span className="text-sm text-muted-foreground">{item.count}회</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-xl border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <span className="text-sm text-foreground">확인 필요 질문: 3건</span>
            </div>
          </div>

          {/* Recent Conversation Logs */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-semibold mb-3">최근 대화 로그</h3>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl border border-border">
                  <p className="text-sm text-foreground mb-2 line-clamp-2">질문: {log.question}</p>
                  <Badge
                    className={statusConfig[log.status as keyof typeof statusConfig].color}
                  >
                    {statusConfig[log.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary h-12">
              <Link to="/professor/knowledge-base">
                <FileText className="w-5 h-5 mr-2" />
                지식 문서 관리
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-12">
              <Link to="/professor/bot-logs">대화 로그 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
