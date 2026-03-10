import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Filter,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Flame,
  Trophy,
  CheckCircle2,
  Circle,
  Sparkles,
  BarChart3,
  Code2,
  Layers,
  GitBranch,
  Binary,
  TreePine,
  Share2,
  Boxes,
  Braces,
  ListTree,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProblemList } from "../ui/ProblemList";

import { DSA_SECTIONS, TOTAL_PROBLEMS, type Problem, type Section } from "../../constants/dsaData";
const LS_KEY = "dsa_sheet_progress";
const LS_DARK = "dsa_sheet_dark";
const LS_STREAK = "dsa_sheet_streak";
const LS_GRAPH = "dsa_sheet_graph_data";

// ─── CONFETTI ───
function launchConfetti() {
  const colors = ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(container);
  for (let i = 0; i < 120; i++) {
    const c = document.createElement("div");
    const size = Math.random() * 8 + 4;
    c.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.5 ? "50%" : "2px"};left:${Math.random() * 100}%;top:-10px;opacity:1;`;
    const dur = Math.random() * 2 + 1.5;
    const drift = (Math.random() - 0.5) * 200;
    c.animate([
      { transform: "translateY(0) rotate(0deg)", opacity: 1 },
      { transform: `translateY(${window.innerHeight + 50}px) translateX(${drift}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
    ], { duration: dur * 1000, easing: "cubic-bezier(0.25,0.46,0.45,0.94)" });
    container.appendChild(c);
  }
  setTimeout(() => container.remove(), 4000);
}

const DSASheetPage: React.FC = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]")); } catch { return new Set(); }
  });
  const [dark, setDark] = useState(() => localStorage.getItem(LS_DARK) === "true");
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [streak, setStreak] = useState<number>(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_STREAK) || "{}"); return d.count || 0; } catch { return 0; }
  });
  const [lastSolved, setLastSolved] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Save state
  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify([...completed])); }, [completed]);
  useEffect(() => { localStorage.setItem(LS_DARK, String(dark)); }, [dark]);

  // Streak tracking
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem(LS_STREAK) || "{}");
    if (stored.date === today) {
      setStreak(stored.count || 0);
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newCount = stored.date === yesterday ? (stored.count || 0) + 1 : 1;
      localStorage.setItem(LS_STREAK, JSON.stringify({ date: today, count: newCount }));
      setStreak(newCount);
      window.dispatchEvent(new Event('dsa_streak_updated'));
    }
  }, []);

  const toggleProblem = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      const today = new Date().toISOString().split('T')[0];
      
      if (next.has(id)) { 
        next.delete(id);
        
        // Remove from today's graph count
        try {
          const graphData = JSON.parse(localStorage.getItem(LS_GRAPH) || "{}");
          if (graphData[today]) {
            graphData[today] = Math.max(0, graphData[today] - 1);
            localStorage.setItem(LS_GRAPH, JSON.stringify(graphData));
          }
        } catch {}
      } else {
        next.add(id);
        setLastSolved(id);
        updateStreak();
        
        // Add to today's graph count
        try {
          const graphData = JSON.parse(localStorage.getItem(LS_GRAPH) || "{}");
          graphData[today] = (graphData[today] || 0) + 1;
          localStorage.setItem(LS_GRAPH, JSON.stringify(graphData));
        } catch {}
        
        // Check if all done
        if (next.size === TOTAL_PROBLEMS) {
          setTimeout(() => launchConfetti(), 300);
        }
      }
      return next;
    });
  }, [updateStreak]);

  const openDrawer = useCallback((s: Section) => {
    setSelectedSection(s);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeDrawer = useCallback(() => {
    setSelectedSection(null);
    document.body.style.overflow = 'auto';
  }, []);

  // Filtered data
  const filteredSections = useMemo(() => {
    return DSA_SECTIONS.map((section) => ({
      ...section,
      problems: section.problems.filter((p) => {
        if (diffFilter !== "All" && p.difficulty !== diffFilter) return false;
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    })).filter((s) => s.problems.length > 0);
  }, [search, diffFilter]);

  const solvedCount = completed.size;
  const pct = Math.round((solvedCount / TOTAL_PROBLEMS) * 100);

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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-[#0F172A] text-white" : "bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"}`}>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ──── HEADER ──── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl sm:text-4xl font-black tracking-tight ${dark ? "text-white" : "text-[#1E293B]"}`}>
              DSA <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">Sheet</span>
            </h1>
            <p className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              Master {TOTAL_PROBLEMS} curated problems across 9 topics
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${dark ? "bg-orange-900/30 border border-orange-800/40" : "bg-orange-50 border border-orange-200"}`}>
              <Flame className="w-4 h-4 text-orange-500" />
              <span className={`text-sm font-black ${dark ? "text-orange-400" : "text-orange-600"}`}>{streak}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? "text-orange-500/60" : "text-orange-400"}`}>Streak</span>
            </div>
            {/* Dark Toggle */}
            <button onClick={() => setDark(!dark)}
              className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 ${dark ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ──── STATS ROW ──── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className={`rounded-2xl p-4 ${dark ? "bg-slate-800/80 border border-slate-700" : "bg-white border border-slate-100 shadow-sm"}`}>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-slate-400" : "text-slate-400"}`}>Solved</span>
            </div>
            <p className={`text-2xl font-black ${dark ? "text-white" : "text-[#1E293B]"}`}>{solvedCount}<span className="text-sm font-bold text-slate-400">/{TOTAL_PROBLEMS}</span></p>
          </div>
          <div className={`rounded-2xl p-4 ${dark ? "bg-slate-800/80 border border-slate-700" : "bg-white border border-slate-100 shadow-sm"}`}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-slate-400" : "text-slate-400"}`}>Progress</span>
            </div>
            <p className={`text-2xl font-black ${dark ? "text-white" : "text-[#1E293B]"}`}>{pct}<span className="text-sm font-bold text-slate-400">%</span></p>
          </div>
          <div className={`rounded-2xl p-4 ${dark ? "bg-slate-800/80 border border-slate-700" : "bg-white border border-slate-100 shadow-sm"}`}>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-slate-400" : "text-slate-400"}`}>Streak</span>
            </div>
            <p className={`text-2xl font-black ${dark ? "text-white" : "text-[#1E293B]"}`}>{streak} <span className="text-sm font-bold text-slate-400">days</span></p>
          </div>
          <div className={`rounded-2xl p-4 ${dark ? "bg-slate-800/80 border border-slate-700" : "bg-white border border-slate-100 shadow-sm"}`}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-slate-400" : "text-slate-400"}`}>Topics</span>
            </div>
            <p className={`text-2xl font-black ${dark ? "text-white" : "text-[#1E293B]"}`}>9</p>
          </div>
        </div>

        {/* ──── PROGRESS BAR ──── */}
        <div className={`rounded-2xl p-5 mb-6 ${dark ? "bg-slate-800/80 border border-slate-700" : "bg-white border border-slate-100 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-black uppercase tracking-widest ${dark ? "text-slate-400" : "text-slate-400"}`}>Overall Progress</span>
            <span className={`text-sm font-black ${dark ? "text-indigo-400" : "text-[#4F46E5]"}`}>{pct}%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-100"}`}>
            <div className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#EC4899] transition-all duration-700 ease-out relative"
              style={{ width: `${pct}%` }}>
              {pct > 5 && <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />}
            </div>
          </div>
        </div>

        {/* ──── SEARCH & FILTER ──── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className={`flex-1 flex items-center gap-3 rounded-2xl px-4 py-3 ${dark ? "bg-slate-800/80 border border-slate-700" : "bg-white border border-slate-100 shadow-sm"}`}>
            <Search className={`w-4 h-4 flex-shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`} />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-transparent outline-none text-sm font-medium ${dark ? "text-white placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"}`}
              placeholder="Search problems..."
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-4 h-4" /></button>
            )}
          </div>
          <div className="flex gap-2">
            {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
              <button key={d} onClick={() => setDiffFilter(d)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${
                  diffFilter === d
                    ? d === "Easy" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200/40"
                      : d === "Medium" ? "bg-amber-500 text-white shadow-lg shadow-amber-200/40"
                      : d === "Hard" ? "bg-rose-500 text-white shadow-lg shadow-rose-200/40"
                      : "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-200/40"
                    : dark ? "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* ──── TOPIC CARDS GRID ──── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSections.map((section) => {
            const sectionSolved = section.problems.filter((p) => completed.has(p.id)).length;
            const sectionTotal = section.problems.length;
            const sectionPct = sectionTotal > 0 ? Math.round((sectionSolved / sectionTotal) * 100) : 0;
            
            const easyTotal = section.problems.filter(p => p.difficulty === "Easy").length;
            const medTotal = section.problems.filter(p => p.difficulty === "Medium").length;
            const hardTotal = section.problems.filter(p => p.difficulty === "Hard").length;

            return (
              <motion.button 
                key={section.id} 
                whileHover={{ y: -4 }}
                onClick={() => openDrawer(section)}
                className={`flex flex-col text-left group rounded-2xl p-5 overflow-hidden transition-all ${dark ? "bg-slate-800/80 border border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/40" : "bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"}`}
              >
                {/* Card Icon & Title */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                    {section.icon}
                  </div>
                  <div>
                    <h3 className={`font-black text-lg ${dark ? "text-white" : "text-[#1E293B]"}`}>{section.title}</h3>
                    <p className={`text-xs font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>{sectionTotal} problems</p>
                  </div>
                </div>

                {/* Card Progress */}
                <div className="mt-auto">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                    <span className={dark ? "text-slate-400" : "text-slate-500"}>Completion</span>
                    <span className={dark ? "text-slate-300" : "text-slate-700"}>{sectionPct}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-100"}`}>
                    <div className={`h-full bg-gradient-to-r ${section.gradient} transition-all duration-1000`} style={{ width: `${sectionPct}%` }} />
                  </div>
                </div>

                {/* Card Difficulty Footer */}
                <div className={`flex justify-between items-center mt-5 pt-4 border-t ${dark ? "border-slate-700/50" : "border-slate-100"}`}>
                   <div className="flex gap-2">
                     {easyTotal > 0 && <span className={`w-2 h-2 rounded-full bg-emerald-500`} title={`${easyTotal} Easy`} />}
                     {medTotal > 0 && <span className={`w-2 h-2 rounded-full bg-amber-500`} title={`${medTotal} Medium`} />}
                     {hardTotal > 0 && <span className={`w-2 h-2 rounded-full bg-rose-500`} title={`${hardTotal} Hard`} />}
                   </div>
                   <div className={`text-[10px] font-bold ${dark ? "text-slate-500" : "text-slate-400"} flex items-center gap-1 group-hover:text-indigo-400 transition-colors`}>
                     View Topics <ChevronRight className="w-3 h-3" />
                   </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ──── EMPTY STATE ──── */}
        {filteredSections.length === 0 && (
          <div className="text-center py-16">
            <Search className={`w-12 h-12 mx-auto mb-4 ${dark ? "text-slate-700" : "text-slate-200"}`} />
            <p className={`text-lg font-bold ${dark ? "text-slate-500" : "text-slate-300"}`}>No problems found</p>
            <p className={`text-sm mt-1 ${dark ? "text-slate-600" : "text-slate-400"}`}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* ──── ALL DONE ──── */}
        {pct === 100 && (
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white text-center shadow-xl shadow-emerald-200/40">
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-2xl font-black">🎉 Congratulations!</h2>
            <p className="text-sm mt-2 opacity-90">You've completed all {TOTAL_PROBLEMS} problems. You are DSA ready!</p>
          </div>
        )}
      </div>
      {/* ──── SLIDE-OVER PANEL ──── */}
      <AnimatePresence>
        {selectedSection && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 bottom-0 w-full max-w-xl z-50 flex flex-col shadow-2xl ${dark ? "bg-[#0F172A] border-l border-slate-800" : "bg-white border-l border-slate-200"}`}
            >
              {/* Drawer Header */}
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${dark ? "border-slate-800 bg-[#0F172A]/90 backdrop-blur" : "border-slate-100 bg-white/90 backdrop-blur"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedSection.gradient} flex items-center justify-center text-white shadow-sm`}>
                    {selectedSection.icon}
                  </div>
                  <div>
                    <h2 className={`text-xl font-black ${dark ? "text-white" : "text-slate-900"}`}>{selectedSection.title}</h2>
                    <p className={`text-xs font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>{selectedSection.problems.length} challenges</p>
                  </div>
                </div>
                <button 
                  onClick={closeDrawer}
                  className={`p-2 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content - ProblemList */}
              <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                <ProblemList 
                  section={selectedSection}
                  completed={completed}
                  toggleProblem={toggleProblem}
                  dark={dark}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DSASheetPage;
