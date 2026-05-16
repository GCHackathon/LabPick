import { Link } from 'react-router';
import { Bell, Edit, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const notifications = [
  '김철수 교수님 AI 대역이 새 문서로 업데이트됐어요.',
  '이영희 교수님의 논문 2건이 추가됐어요.',
  '정보보 교수님 직접 연결 요청이 대기 중이에요.',
];

const recentConsultations = [
  {
    id: '1',
    professor: '김철수 교수님 AI 대역',
    question: '학부생 인턴은 어떤 일을 하나요?',
    status: 'completed',
  },
  {
    id: '2',
    professor: '이영희 교수님 AI 대역',
    question: '데이터 분석 연구실 선수지식',
    status: 'completed',
  },
];

const savedLabs = ['인공지능 연구실', '데이터사이언스 연구실', '보안 연구실'];

const recentPapers = [
  'Efficient Deep Learning for Korean NLP',
  'Multimodal Vision-Language Representation',
];

export function MyInfo() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">랩픽</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">민수 님이 접속중이에요</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">김민수</h2>
                <p className="text-sm text-muted-foreground mb-1">컴퓨터공학과</p>
                <p className="text-sm text-muted-foreground mb-3">2021320001</p>

                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">관심 분야</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary">인공지능</Badge>
                    <Badge variant="secondary">웹 개발</Badge>
                    <Badge variant="secondary">데이터 분석</Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">최근 수정: 3일 전</p>
              </div>

              <button className="p-2 hover:bg-muted rounded-full">
                <Edit className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Today's Notifications */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">오늘의 알림</h3>
            </div>
            <div className="space-y-2">
              {notifications.map((notification, idx) => (
                <div
                  key={idx}
                  className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded-lg hover:bg-muted"
                >
                  <span className="mt-1">•</span>
                  <span>{notification}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent AI Consultations */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-semibold mb-3">최근 AI 상담</h3>
            <div className="space-y-3">
              {recentConsultations.map((consultation) => (
                <Link
                  key={consultation.id}
                  to={`/ai-chat/${consultation.id}`}
                  className="block p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium flex-1">{consultation.professor}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{consultation.question}</p>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span className="text-xs text-success">답변 완료</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Saved Labs */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-semibold mb-3">저장한 연구실</h3>
            <div className="space-y-2">
              {savedLabs.map((lab) => (
                <Link
                  key={lab}
                  to="/lab/1"
                  className="block text-sm text-muted-foreground p-2 rounded-lg hover:bg-muted"
                >
                  • {lab}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Papers */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-semibold mb-3">최근 본 논문</h3>
            <div className="space-y-2">
              {recentPapers.map((paper) => (
                <Link
                  key={paper}
                  to="/paper/p1"
                  className="block text-sm text-muted-foreground p-2 rounded-lg hover:bg-muted"
                >
                  • {paper}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
