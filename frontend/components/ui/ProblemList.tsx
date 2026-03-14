import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ExternalLink, ChevronDown, ChevronUp, StickyNote } from 'lucide-react';
import { Problem, Section } from '../../constants/dsaData';

interface ProblemListProps {
  section: Section;
  completed: Set<string>;
  toggleProblem: (id: string) => void;
  dark: boolean;
}

const diffBadge = (d: string) => {
  switch (d) {
    case "Easy": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
    case "Medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
    case "Hard": return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400";
    default: return "";
  }
};

const platformBadge = (p: string) => {
  switch (p) {
    case "LeetCode": return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400";
    case "GFG": return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
    case "CodeStudio": return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400";
    default: return "";
  }
};

export const ProblemList: React.FC<ProblemListProps> = ({ section, completed, toggleProblem, dark }) => {
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const toggleNotes = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNotes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNoteChange = (id: string, value: string) => {
    localStorage.setItem(`dsa_note_${id}`, value);
    // Proactively save to DB if logged in
    import('../../services/authService').then(m => {
      if (m.default.isLoggedIn()) {
        m.default.updateDSANote(id, value);
      }
    });
  };

  const getNote = (id: string) => {
    return localStorage.getItem(`dsa_note_${id}`) || '';
  };

  return (
    <div className="space-y-2 mt-4">
      {section.problems.map((problem, idx) => {
        const isDone = completed.has(problem.id);
        const hasNotes = expandedNotes.has(problem.id);
        
        return (
          <div key={problem.id} className="flex flex-col">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group cursor-pointer ${
                isDone
                  ? dark ? "bg-emerald-900/20 border border-emerald-800/30" : "bg-emerald-50/80 border border-emerald-100"
                  : dark ? "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50" : "bg-white hover:bg-slate-50 border border-slate-100"
              }`}
              onClick={() => toggleProblem(problem.id)}
            >
              {/* Animated Checkbox */}
              <button 
                className={`flex-shrink-0 transition-colors ${
                  isDone 
                    ? "text-emerald-500" 
                    : dark ? "text-slate-600 group-hover:text-indigo-400" : "text-slate-300 group-hover:text-indigo-500"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isDone ? (
                    <motion.div
                      key="checked"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unchecked"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -180 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Circle className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Number */}
              <span className={`text-[10px] font-bold w-5 text-center ${dark ? "text-slate-500" : "text-slate-400"}`}>
                {idx + 1}
              </span>

              {/* Title */}
              <span className={`flex-1 text-sm font-medium transition-all ${
                isDone 
                  ? (dark ? "text-emerald-400/70 line-through" : "text-emerald-700/70 line-through") 
                  : dark ? "text-slate-200" : "text-slate-700"
              }`}>
                {problem.title}
              </span>

              {/* Badges */}
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${diffBadge(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider hidden sm:inline ${platformBadge(problem.platform)}`}>
                {problem.platform}
              </span>

              {/* Notes Toggle */}
              <button 
                onClick={(e) => toggleNotes(problem.id, e)}
                className={`p-1.5 rounded-lg transition-all ${
                  hasNotes || getNote(problem.id)
                    ? (dark ? "text-yellow-500 bg-yellow-500/10" : "text-amber-500 bg-amber-50")
                    : (dark ? "text-slate-600 hover:text-slate-300 hover:bg-slate-700" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100")
                }`}
                title="Notes"
              >
                <StickyNote className="w-3.5 h-3.5" />
              </button>

              {/* Link */}
              <a 
                href={problem.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                  dark ? "text-slate-500 hover:text-indigo-400 hover:bg-slate-700" : "text-slate-400 hover:text-indigo-500 hover:bg-indigo-50"
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            {/* Notes Section Expandable */}
            <AnimatePresence>
              {hasNotes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`mt-2 ml-12 mr-4 mb-2 p-3 rounded-xl border ${
                    dark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}>
                    <textarea
                      defaultValue={getNote(problem.id)}
                      onChange={(e) => handleNoteChange(problem.id, e.target.value)}
                      placeholder="Add your notes, approach, or time complexity here..."
                      className={`w-full min-h-[80px] bg-transparent outline-none text-sm resize-y ${
                        dark ? "text-slate-300 placeholder:text-slate-600" : "text-slate-700 placeholder:text-slate-400"
                      }`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
