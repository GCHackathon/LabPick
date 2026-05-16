import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Upload, FileText, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';

const documents = [
  {
    id: '1',
    name: 'AI_Lab_FAQ.pdf',
    type: 'FAQ',
    uploadDate: '2026.05.16',
    aiEnabled: true,
  },
  {
    id: '2',
    name: '2024_NLP_Paper.pdf',
    type: '논문',
    uploadDate: '2026.05.16',
    aiEnabled: true,
  },
  {
    id: '3',
    name: 'Research_Summary.docx',
    type: '연구 요약',
    uploadDate: '2026.05.15',
    aiEnabled: true,
  },
  {
    id: '4',
    name: 'Curriculum_Guide.pdf',
    type: '커리큘럼',
    uploadDate: '2026.05.14',
    aiEnabled: false,
  },
];

export function KnowledgeBase() {
  const [docs, setDocs] = useState(documents);

  const toggleAI = (id: string) => {
    setDocs(docs.map((doc) => (doc.id === id ? { ...doc, aiEnabled: !doc.aiEnabled } : doc)));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <Link to="/professor/dashboard" className="p-1.5 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold">지식 베이스 관리</h1>
              <p className="text-xs text-muted-foreground">
                AI 대역이 답변할 때 참고하는 자료입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Upload Card */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-5 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">문서 업로드</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              논문 PDF, 연구실 소개 PPT, FAQ 문서, 강의/커리큘럼 자료를 업로드하세요.
            </p>
            <Button className="w-full bg-gradient-to-r from-primary to-secondary">
              <Upload className="w-4 h-4 mr-2" />
              새 문서 업로드
            </Button>
          </div>

          {/* Document List */}
          <div>
            <h3 className="font-semibold mb-3">문서 리스트</h3>
            <div className="space-y-3">
              {docs.map((doc) => (
                <div key={doc.id} className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 truncate">{doc.name}</h4>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                        {doc.aiEnabled && (
                          <Badge className="text-xs bg-success text-success-foreground">
                            AI 학습 사용 중
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">업로드: {doc.uploadDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch checked={doc.aiEnabled} onCheckedChange={() => toggleAI(doc.id)} />
                      <span className="text-sm text-muted-foreground">AI 학습 사용</span>
                    </div>
                    <button className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button className="w-full bg-gradient-to-r from-primary to-secondary h-12">
            변경사항 저장
          </Button>
        </div>
      </div>
    </div>
  );
}
