import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';

interface PaperCardProps {
  id: string;
  title: string;
  year: number;
  citations: number;
  keywords: string[];
  professorId?: string;
}

export function PaperCard({ id, title, year, citations, keywords, professorId }: PaperCardProps) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <h4 className="font-semibold text-base text-foreground mb-2 line-clamp-2">
        {title}
      </h4>

      <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
        <span>{year}</span>
        <span>·</span>
        <span>인용 {citations}회</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {keywords.map((keyword) => (
          <Badge key={keyword} variant="outline" className="text-xs">
            {keyword}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline" className="flex-1">
          <Link to={`/paper/${id}${professorId ? `?prof=${professorId}` : ''}`}>
            <Sparkles className="w-4 h-4 mr-1.5" />
            AI 3줄 요약
          </Link>
        </Button>
        <Button size="sm" variant="ghost" className="flex-1">
          <ExternalLink className="w-4 h-4 mr-1.5" />
          원문 보기
        </Button>
      </div>
    </div>
  );
}
