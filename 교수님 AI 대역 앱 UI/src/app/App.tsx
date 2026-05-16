import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { BottomNav } from './components/BottomNav';

// Student Pages
import { LabExplore } from './pages/LabExplore';
import { LabDetail } from './pages/LabDetail';
import { PaperGuide } from './pages/PaperGuide';
import { AIConsultation } from './pages/AIConsultation';
import { AIChat } from './pages/AIChat';
import { Escalation } from './pages/Escalation';
import { Communication } from './pages/Communication';
import { DirectChat } from './pages/DirectChat';
import { MyInfo } from './pages/MyInfo';

// Professor Pages
import { ProfessorDashboard } from './pages/ProfessorDashboard';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { BotLogs } from './pages/BotLogs';

function AppContent() {
  const location = useLocation();

  // Hide bottom nav on professor pages
  const hiddenNavPaths = [
    '/professor/dashboard',
    '/professor/knowledge-base',
    '/professor/bot-logs',
  ];
  const showBottomNav = !hiddenNavPaths.includes(location.pathname);

  return (
    <div className="size-full bg-background">
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<LabExplore />} />
        <Route path="/lab/:id" element={<LabDetail />} />
        <Route path="/paper/:id" element={<PaperGuide />} />
        <Route path="/ai-consultation" element={<AIConsultation />} />
        <Route path="/ai-chat/:id" element={<AIChat />} />
        <Route path="/escalation/:id" element={<Escalation />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/direct-chat/:id" element={<DirectChat />} />
        <Route path="/my-info" element={<MyInfo />} />

        {/* Professor Routes */}
        <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
        <Route path="/professor/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/professor/bot-logs" element={<BotLogs />} />
      </Routes>

      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}