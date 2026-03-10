import React, { useEffect, useState } from 'react';
import { Target, Trophy, Flame, TrendingUp, Code2, CheckCircle2 } from 'lucide-react';
import { DSA_SECTIONS, TOTAL_PROBLEMS } from '../../constants/dsaData';
import ContributionGraph from '../ui/contribution-graph';

const DashboardPage: React.FC = () => {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load local storage data
    const savedProgress = localStorage.getItem('dsa_sheet_progress');
    if (savedProgress) setProgress(JSON.parse(savedProgress));

    const savedStreak = localStorage.getItem('dsa_sheet_streak');
    if (savedStreak) setStreak(Number(savedStreak));
  }, []);

  const solvedIds = new Set(Object.keys(progress).filter(id => progress[id]));
  const totalSolved = solvedIds.size;
  const completionPercentage = Math.round((totalSolved / TOTAL_PROBLEMS) * 100) || 0;

  // Calculate difficulty stats
  let totalEasy=0, totalMedium=0, totalHard=0;
  let solvedEasy=0, solvedMedium=0, solvedHard=0;

  DSA_SECTIONS.forEach(section => {
    section.problems.forEach(p => {
      if (p.difficulty === 'Easy') {
        totalEasy++;
        if (solvedIds.has(p.id)) solvedEasy++;
      } else if (p.difficulty === 'Medium') {
        totalMedium++;
        if (solvedIds.has(p.id)) solvedMedium++;
      } else if (p.difficulty === 'Hard') {
        totalHard++;
        if (solvedIds.has(p.id)) solvedHard++;
      }
    });
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your progress and stay consistent.</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress Ring Card */}
        <div className="col-span-1 border border-slate-200 dark:border-[#2A2D3A] rounded-2xl p-6 bg-white dark:bg-[#16181D] shadow-sm flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-slate-100 dark:text-slate-800 stroke-current"
                strokeWidth="8"
                cx="50" cy="50" r="40"
                fill="transparent"
              ></circle>
              <circle
                className="text-indigo-500 stroke-current drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeLinecap="round"
                cx="50" cy="50" r="40"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{completionPercentage}%</span>
            </div>
          </div>
          <p className="mt-4 font-bold text-slate-700 dark:text-slate-200">Overall Completion</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{totalSolved} of {TOTAL_PROBLEMS} problems</p>
        </div>

        {/* Quick Stats Column */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-[#2A2D3A] rounded-2xl p-5 bg-white dark:bg-[#16181D] shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{streak}</h3>
              <p className="font-medium text-slate-500 dark:text-slate-400 text-sm">Day Streak</p>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-[#2A2D3A] rounded-2xl p-5 bg-white dark:bg-[#16181D] shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{totalSolved}</h3>
              <p className="font-medium text-slate-500 dark:text-slate-400 text-sm">Problems Solved</p>
            </div>
          </div>

          <div className="col-span-2 border border-slate-200 dark:border-[#2A2D3A] rounded-2xl p-6 bg-white dark:bg-[#16181D] shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              Difficulty Breakdown
            </h3>
            
            <div className="space-y-4">
              {/* Easy */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">Easy</span>
                  <span className="text-slate-600 dark:text-slate-400">{solvedEasy} / {totalEasy}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${(solvedEasy/totalEasy)*100 || 0}%` }} />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-amber-500">Medium</span>
                  <span className="text-slate-600 dark:text-slate-400">{solvedMedium} / {totalMedium}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${(solvedMedium/totalMedium)*100 || 0}%` }} />
                </div>
              </div>

              {/* Hard */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-rose-500">Hard</span>
                  <span className="text-slate-600 dark:text-slate-400">{solvedHard} / {totalHard}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${(solvedHard/totalHard)*100 || 0}%` }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="border border-slate-200 dark:border-[#2A2D3A] rounded-2xl bg-white dark:bg-[#16181D] shadow-sm p-6 overflow-hidden">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          Activity & Contributions
        </h3>
        
        <div className="flex justify-center w-full">
          <ContributionGraph />
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
