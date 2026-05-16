import { useParams, useSearchParams, Link } from 'react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const paperData = {
  p1: {
    title: 'Efficient Deep Learning for Korean NLP',
    authors: 'Kim C. et al.',
    year: 2024,
    citations: 32,
    keywords: ['NLP', 'Transformer', 'Korean Dataset'],
    summary: [
      '이 논문은 한국어 자연어 처리를 더 효율적으로 수행하는 딥러닝 모델을 제안합니다.',
      '기존 모델보다 적은 연산량으로 비슷한 성능을 내는 것이 핵심입니다.',
      '한국어 데이터셋에 맞춘 실험을 통해 실제 적용 가능성을 보여줍니다.',
    ],
    significance: '한국어 AI 서비스에서 비용을 줄이면서 성능을 유지하는 데 도움이 됩니다.',
    suggestedQuestions: [
      '이 논문을 이해하려면 어떤 개념을 먼저 알아야 하나요?',
      '학부생이 이 논문으로 할 수 있는 프로젝트가 있나요?',
      '이 논문이 교수님 연구실과 어떻게 연결되나요?',
    ],
  },
};

export function PaperGuide() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const professorId = searchParams.get('prof');

  const paper = paperData[id as keyof typeof paperData];

  if (!paper) {
    return <div className="p-5">논문을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Link to={-1 as any} className="p-1.5 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold">AI 논문 가이드</h1>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Paper Info */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h2 className="font-semibold text-lg mb-3 leading-relaxed">{paper.title}</h2>
            <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
              <p>저자: {paper.authors}</p>
              <p>연도: {paper.year}</p>
              <p>인용: {paper.citations}회</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {paper.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">학부생 수준 3줄 요약</h3>
            </div>
            <ol className="space-y-2">
              {paper.summary.map((line, idx) => (
                <li key={idx} className="text-sm text-foreground leading-relaxed">
                  {idx + 1}. {line}
                </li>
              ))}
            </ol>
          </div>

          {/* Significance */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-semibold mb-2">왜 중요한가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{paper.significance}</p>
          </div>

          {/* Suggested Questions */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h3 className="font-semibold mb-3">추천 질문</h3>
            <div className="space-y-2">
              {paper.suggestedQuestions.map((question) => (
                <button
                  key={question}
                  className="w-full text-left text-sm text-muted-foreground p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            asChild
            className="w-full bg-gradient-to-r from-primary to-secondary h-12"
          >
            <Link to={professorId ? `/ai-chat/${professorId}` : '/ai-consultation'}>
              이 논문에 대해 AI 대역에게 질문하기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
