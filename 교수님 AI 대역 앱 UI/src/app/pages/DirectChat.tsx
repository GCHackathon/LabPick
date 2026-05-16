import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, MoreVertical, Send, Paperclip } from 'lucide-react';

const professors = {
  '1': {
    name: '김철수 교수님',
    lab: '인공지능 연구실',
  },
};

const initialMessages = [
  {
    role: 'student',
    content: '안녕하세요 교수님. AI 대역 상담 후 직접 질문드리고 싶은 부분이 있어 연락드립니다.',
  },
  {
    role: 'professor',
    content: '네, 확인했습니다. 어떤 부분이 궁금한가요?',
  },
  {
    role: 'student',
    content: '논문 리뷰를 처음 해보는데 면담 전에 어떤 논문을 읽으면 좋을까요?',
  },
  {
    role: 'professor',
    content: '먼저 최근 연구실 논문 중 Korean NLP 관련 논문을 읽어보면 좋겠습니다.',
  },
];

export function DirectChat() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const professor = professors[id as keyof typeof professors];

  if (!professor) {
    return <div className="p-5">교수님을 찾을 수 없습니다.</div>;
  }

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'student', content: input }]);
    setInput('');
  };

  return (
    <div className="h-screen bg-background flex flex-col pb-20">
      <div className="max-w-[393px] mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <Link to="/communication" className="p-1.5 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{professor.name}</h1>
              <p className="text-xs text-muted-foreground">{professor.lab}</p>
            </div>
            <button className="p-2 hover:bg-muted rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'student'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 pb-4">
          <div className="flex gap-2">
            <button className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
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
