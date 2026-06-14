import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, PenTool, LogOut, LogIn, User } from 'lucide-react';

/**
 * Dynamic navigation bar.
 * This is a React component that displays our brand header and interactive layout toggle actions.
 */

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { isAuthenticated, user, logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    setView('home');
  };

  return (
    <header className="border-b border-zinc-200 bg-white/85 backdrop-blur-md sticky top-0 z-50 shadow-xs">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Link Button - Sets state back to 'home' on click */}
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-zinc-900 font-sans font-bold tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-zinc-800" />
          <span>Chronicle</span>
        </button>

        {/* Action Items List */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Feed Navigation Toggle */}
          <button
            onClick={() => setView('home')}
            className={`text-xs font-semibold tracking-wider uppercase px-2 py-1 transition-colors cursor-pointer ${
              currentView === 'home' 
                ? 'text-zinc-950 border-b-2 border-zinc-950' 
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Feed
          </button>

          {/* Create Post Page Toggle */}
          <button
            onClick={() => setView('create-post')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'create-post'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Story</span>
            <span className="inline sm:hidden">New</span>
          </button>

          {/* User Sign In State Dynamic section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 border-l border-zinc-200 pl-2 sm:pl-4">
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-650 font-sans">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span className="max-w-[100px] truncate">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 text-zinc-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 border-l border-zinc-200 pl-2 sm:pl-4">
              <button
                onClick={() => setView('login')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

