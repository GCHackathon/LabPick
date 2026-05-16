import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, FileText, BookOpen } from 'lucide-react';
import { Link } from 'react-router';

interface LabCardProps {
  id: string;
  name: string;
  professor: string;
  tags: string[];
  aiEnabled: boolean;
  documentCount: number;
  paperCount: number;
  lastUpdate?: string;
}

export function LabCard({
  id,
  name,
  professor,
  tags,
  aiEnabled,
  documentCount,
  paperCount,
  lastUpdate,
}: LabCardProps) {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground">{professor}</p>
        </div>
        {aiEnabled && (
          <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">AI 대역</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          <span>지식 문서 {documentCount}개</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>논문 {paperCount}편</span>
        </div>
      </div>

      {lastUpdate && (
        <p className="text-xs text-muted-foreground mb-4">
          최근 업데이트: {lastUpdate}
        </p>
      )}

      <div className="flex gap-2">
        {aiEnabled && (
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Link to={`/ai-chat/${id}`}>AI에게 질문하기</Link>
          </Button>
        )}
        <Button asChild variant="outline" className={aiEnabled ? 'flex-1' : 'w-full'}>
          <Link to={`/lab/${id}`}>연구실 보기</Link>
        </Button>
      </div>
    </div>
  );
}
