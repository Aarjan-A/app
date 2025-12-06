import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Zap, Users, Plus } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Zap, label: 'Automations', path: '/automations' },
    { icon: Plus, label: 'Add Task', path: '/add-task' },
    { icon: Users, label: 'Helpers', path: '/helpers' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}