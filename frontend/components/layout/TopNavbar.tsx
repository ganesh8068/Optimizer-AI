import React from 'react';
import { Search, Flame, Moon, Sun, Menu, Bell } from 'lucide-react';
import { AuthUser } from '../../services/authService';

interface TopNavbarProps {
  user: AuthUser | null;
  handleLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  handleLogout,
  isSidebarOpen,
  setIsSidebarOpen,
  isDarkMode,
  toggleDarkMode
}) => {
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const [currentStreak, setCurrentStreak] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchStreak = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('dsa_sheet_streak') || "{}");
        setCurrentStreak(stored.count || 0);
      } catch {
        setCurrentStreak(0);
      }
    };
    fetchStreak();
    window.addEventListener('dsa_streak_updated', fetchStreak);
    return () => window.removeEventListener('dsa_streak_updated', fetchStreak);
  }, []);
  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b backdrop-blur-md bg-opacity-80 transition-colors
      ${isDarkMode ? 'bg-[#16181D]/80 border-[#2A2D3A]' : 'bg-white/80 border-slate-200'}
    `}>
      {/* Left items */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors
            ${isDarkMode ? 'hover:bg-[#2A2D3A] text-slate-300' : 'hover:bg-slate-100 text-slate-600'}
          `}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 
            ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}
          `} />
          <input
            type="text"
            placeholder="Search problems, topics..."
            className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border outline-none transition-all
              ${isDarkMode 
                ? 'bg-[#0E1117] border-[#2A2D3A] text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 focus:bg-white'}
            `}
          />
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Streak Counter */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold
          ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-orange-50 border-orange-100 text-orange-600'}
        `}>
          <Flame className="w-4 h-4 fill-current" />
          <span>{currentStreak} Day Streak</span>
        </div>

        {/* Action Icons */}
        <button onClick={toggleDarkMode} className={`p-2 rounded-lg transition-colors
          ${isDarkMode ? 'hover:bg-[#2A2D3A] text-slate-400' : 'hover:bg-slate-100 text-slate-500'}
        `}>
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className={`hidden sm:block p-2 rounded-lg transition-colors
          ${isDarkMode ? 'hover:bg-[#2A2D3A] text-slate-400' : 'hover:bg-slate-100 text-slate-500'}
        `}>
          <div className="relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full border border-white dark:border-[#16181D]"></div>
          </div>
        </button>

        {/* Divider */}
        <div className={`w-px h-6 mx-1 ${isDarkMode ? 'bg-[#2A2D3A]' : 'bg-slate-200'}`}></div>

        {/* Profile Avatar */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          title="Sign Out"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-transparent hover:ring-indigo-500/30 transition-all">
            {initials}
          </div>
        </button>

      </div>
    </header>
  );
};

export default TopNavbar;
