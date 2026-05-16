import { useState } from 'react';
import { Link } from 'react-router';
import { Badge } from '../components/ui/badge';
import { Sparkles } from 'lucide-react';

const tabs = ['전체', '직접 연결', '대기 중', '완료'];

const conversations = [
  {
    id: '1',
    professor: '김철수 교수님',
    lab: '인공지능 연구실',
    status: 'connected',
    lastMessage: '화요일 오후 2시에 면담 가능합니다.',
    time: '오전 10:40',
  },
  {
    id: '2',
    professor: '정보보 교수님',
    lab: '보안 연구실',
    status: 'pending',
    lastMessage: '직접 연결 요청을 보냈습니다.',
    time: '어제',
  },
  {
    id: '3',
    professor: '이영희 교수님 AI 대역',
    lab: '데이터사이언스 연구실',
    status: 'ai-completed',
    lastMessage: '논문 기반 답변을 확인했습니다.',
    time: '5월 14일',
  },
];

const statusConfig = {
  connected: {
    label: '직접 연결됨',
    color: 'bg-success text-success-foreground',
  },
  pending: {
    label: '요청 대기 중',
    color: 'bg-muted-foreground text-white',
  },
  'ai-completed': {
    label: 'AI 상담 완료',
    color: 'bg-primary text-primary-foreground',
  },
};

export function Communication() {
  const [activeTab, setActiveTab] = useState('전체');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">소통</h1>
          <p className="text-sm text-muted-foreground">
            AI 상담 후 필요한 경우 교수님과 직접 연결됩니다.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-card border-b border-border px-5 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <Badge
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                className={`cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Badge>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="px-5 py-4 space-y-3">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              to={conv.status === 'connected' ? `/direct-chat/${conv.id}` : '#'}
              className="block"
            >
              <div className="bg-card rounded-2xl p-4 border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{conv.professor}</h3>
                      {conv.status === 'ai-completed' && (
                        <Sparkles className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{conv.lab}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{conv.time}</span>
                </div>

                <Badge
                  className={`${
                    statusConfig[conv.status as keyof typeof statusConfig].color
                  } mb-2`}
                >
                  {statusConfig[conv.status as keyof typeof statusConfig].label}
                </Badge>

                <p className="text-sm text-muted-foreground line-clamp-1">{conv.lastMessage}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
