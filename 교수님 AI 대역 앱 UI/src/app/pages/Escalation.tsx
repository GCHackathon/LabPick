import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';

const professors = {
  '1': {
    name: '김철수 교수님',
    lab: '인공지능 연구실',
  },
};

export function Escalation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const professor = professors[id as keyof typeof professors];

  if (!professor) {
    return <div className="p-5">교수님을 찾을 수 없습니다.</div>;
  }

  const handleSubmit = () => {
    // Navigate to communication page
    navigate('/communication');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <Link to={-1 as any} className="p-1.5 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold">직접 연결 요청</h1>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* AI Message */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground leading-relaxed">
                  해당 내용은 제 지식 베이스에 없네요. 교수님께 직접 연결해드릴까요?
                </p>
              </div>
            </div>
          </div>

          {/* Request Form */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-semibold mb-4">연결 정보</h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm text-muted-foreground">연결 대상</label>
                <p className="font-medium">{professor.name}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">연구실</label>
                <p className="font-medium">{professor.lab}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">요청 사유</label>
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">•</span>
                    <span className="text-sm">AI 답변 범위 초과</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">•</span>
                    <span className="text-sm">면담 또는 직접 상담 필요</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">요청 메시지</label>
              <textarea
                placeholder="교수님께 전달할 내용을 간단히 작성해주세요."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-primary to-secondary h-12"
            >
              직접 연결 요청 보내기
            </Button>
            <Button asChild variant="outline" className="w-full h-12">
              <Link to={`/ai-chat/${id}`}>AI에게 계속 질문하기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
