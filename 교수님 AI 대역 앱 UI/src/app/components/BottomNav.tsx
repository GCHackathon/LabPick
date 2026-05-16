import { Link, useLocation } from 'react-router';
import { Lightbulb, MessageCircle, User, MessageSquare } from 'lucide-react';

const navItems = [
  { path: '/', label: '연구실', icon: Lightbulb },
  { path: '/ai-consultation', label: 'AI상담', icon: MessageCircle },
  { path: '/my-info', label: '내정보', icon: User },
  { path: '/communication', label: '소통', icon: MessageSquare },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-[393px] mx-auto flex items-center justify-around h-20 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 flex-1"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-xs ${
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
