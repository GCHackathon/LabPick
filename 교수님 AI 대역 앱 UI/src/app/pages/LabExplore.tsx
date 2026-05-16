import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { LabCard } from '../components/LabCard';
import { Badge } from '../components/ui/badge';
import { Bell } from 'lucide-react';

const filters = [
  '전체',
  '인공지능',
  '보안',
  '데이터',
  '로보틱스',
  '웹/앱',
  'AI 봇 가능',
  '논문 있음',
];

const labs = [
  {
    id: '1',
    name: '인공지능 연구실',
    professor: '김철수 교수',
    tags: ['딥러닝', '자연어처리', '컴퓨터 비전'],
    aiEnabled: true,
    documentCount: 16,
    paperCount: 24,
    lastUpdate: '2026.05.16',
  },
  {
    id: '2',
    name: '데이터사이언스 연구실',
    professor: '이영희 교수',
    tags: ['데이터 분석', '머신러닝', '빅데이터'],
    aiEnabled: true,
    documentCount: 9,
    paperCount: 18,
    lastUpdate: '2026.05.15',
  },
  {
    id: '3',
    name: '보안 연구실',
    professor: '정보보 교수',
    tags: ['네트워크 보안', '암호학', '시스템'],
    aiEnabled: true,
    documentCount: 7,
    paperCount: 12,
    lastUpdate: '2026.05.14',
  },
  {
    id: '4',
    name: '로보틱스 연구실',
    professor: '최수진 교수',
    tags: ['자율주행', '제어시스템', '로봇공학'],
    aiEnabled: false,
    documentCount: 3,
    paperCount: 15,
    lastUpdate: '2026.05.10',
  },
];

export function LabExplore() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[393px] mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-2xl font-bold text-foreground">랩픽</h1>
            </div>
            <button className="p-2 hover:bg-muted rounded-full">
              <Bell className="w-6 h-6 text-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">연구실 탐색</p>
        </div>

        {/* Search */}
        <div className="px-5 py-4">
          <SearchBar
            placeholder="교수님, 연구실명, 연구분야로 검색..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Filters */}
        <div className="px-5 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                className={`cursor-pointer whitespace-nowrap ${
                  selectedFilter === filter
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Lab Count */}
        <div className="px-5 mb-4">
          <p className="text-sm font-medium text-foreground">총 {labs.length}개의 연구실</p>
        </div>

        {/* Lab List */}
        <div className="px-5 space-y-4">
          {labs.map((lab) => (
            <LabCard key={lab.id} {...lab} />
          ))}
        </div>
      </div>
    </div>
  );
}
