import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Code2, LineChart, BookOpen, Settings, ChevronLeft, ChevronRight, Zap, FileText, Linkedin, Bot, Info, Map, User } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  currentView: string;
  navigateTo: (view: any) => void;
  isDarkMode: boolean;
}

const navItems = [
  { id: 'resume', label: 'Resume AI', icon: FileText },
  { id: 'linkedin', label: 'LinkedIn AI', icon: Linkedin },
  { id: 'interview', label: 'AI Interview', icon: Bot },
  { id: 'dsa-sheet', label: 'DSA Sheet', icon: Code2 },
  { id: 'analytics', label: 'Analytics', icon: LineChart },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'about', label: 'About', icon: Info },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentView, navigateTo, isDarkMode }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 240 : 80 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`relative z-40 hidden md:flex flex-col border-r h-full ${
        isDarkMode 
          ? 'bg-[#16181D] border-[#2A2D3A]' 
          : 'bg-[#F9FAFB] border-slate-200'
      }`}
    >
      {/* Logo Area */}
      <button 
        onClick={() => navigateTo('home')}
        className="flex items-center h-16 px-4 mt-2 w-full text-left hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center justify-center min-w-[48px] text-indigo-500">
          <Zap className="w-8 h-8" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className={`ml-2 font-bold tracking-tight whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            >
              Optimizer AI
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center h-10 px-3 rounded-lg transition-all duration-200 group relative
                ${isActive 
                  ? (isDarkMode ? 'bg-[#2A2D3A] text-white' : 'bg-white shadow-sm border border-slate-200 text-indigo-600') 
                  : (isDarkMode ? 'text-slate-400 hover:bg-[#20232B] hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900')
                }
              `}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-500' : 'group-hover:text-indigo-400'}`} />
              </div>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-3 text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className={`absolute left-full ml-4 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50
                  ${isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'}
                `}>
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-[#2A2D3A]' : 'border-slate-200'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-[#2A2D3A] text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
