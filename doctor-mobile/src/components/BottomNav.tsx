import React from 'react';
import { Home, History, Activity, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { key: 'home', icon: Home, label: 'Trang chủ' },
    { key: 'history', icon: History, label: 'Lịch sử' },
    { key: 'doctor', icon: Activity, label: 'Bác sỹ AI' },
    { key: 'settings', icon: Settings, label: 'Cài đặt' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
      <div className="h-16 px-6 flex items-center justify-between">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${
              activeTab === item.key ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[12px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
