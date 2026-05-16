import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Info, Send, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const professors = {
  '1': {
    name: '김철수 교수님',
    lab: '인공지능 연구실',
  },
  '2': {
    name: '이영희 교수님',
    lab: '데이터사이언스 연구실',
  },
  '3': {
    name: '정보보 교수님',
    lab: '보안 연구실',
  },
};

const initialMessages = [
  {
    role: 'ai',
    content:
      '안녕하세요. 김철수 교수님의 AI 대역입니다. 인공지능 연구실과 교수님의 연구에 대해 궁금한 점을 질문해주세요.',
  },
];

const suggestedQuestions = [
  '최근 논문',
  '필요한 선수지식',
  '연구실 분위기',
  '면담 준비',
  '직접 연결',
];

export function AIChat() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const professor = professors[id as keyof typeof professors];

  if (!professor) {
    return <div className="p-5">교수님을 찾을 수 없습니다.</div>;
  }

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { role: 'user', content: input },
      {
        role: 'ai',
        content:
          '인공지능 연구실은 딥러닝, 자연어 처리, 컴퓨터 비전을 중심으로 연구합니다. 특히 최근에는 한국어 NLP 모델과 멀티모달 AI 시스템 연구에 집중하고 있습니다.',
      },
    ]);
    setInput('');
  };

  return (
    <div className="h-screen bg-background flex flex-col pb-20">
      <div className="max-w-[393px] mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/ai-consultation" className="p-1.5 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{professor.name} AI 대역</h1>
              <Badge variant="secondary" className="text-xs">
                문서 기반 답변
              </Badge>
            </div>
            <button className="p-2 hover:bg-muted rounded-full">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="px-5 py-4">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">공식 AI 대리인</h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {professor.name}이 제공한 논문, 연구 요약, FAQ를 기반으로 답변합니다.
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>주의:</strong> 문서에 없는 내용은 교수님 직접 연결을 안내합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}
              >
                {message.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">AI 대역</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        <div className="px-5 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggestedQuestions.map((question) => (
              <Badge
                key={question}
                variant="outline"
                className="cursor-pointer whitespace-nowrap hover:bg-muted"
                onClick={() => setInput(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>

        {/* Direct Contact */}
        <div className="px-5 pb-3">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to={`/escalation/${id}`}>교수님께 직접 연결 요청</Link>
          </Button>
        </div>

        {/* Input */}
        <div className="px-5 pb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="질문을 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 h-12 px-4 bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleSend}
              className="w-12 h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center hover:opacity-90"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
