import React from 'react';
import { Menu } from 'lucide-react';
import gnixyLogo from '../assets/gnixy_logo.png';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 pt-[env(safe-area-inset-top)]">
      <div className="h-16 px-6 flex items-center justify-between">
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-primary" />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <img src={gnixyLogo} alt="Gnixy" className="h-8 w-auto" />
        </div>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop"
            alt="User avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
};
