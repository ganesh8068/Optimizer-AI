
import React from 'react';

interface ScoreCardProps {
  label: string;
  score: number;
  color: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ label, score, color }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getStatus = (s: number) => {
    if (s >= 85) return 'Excellent';
    if (s >= 70) return 'Good';
    return 'Average';
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] flex items-center gap-5 w-full h-full min-h-[110px] hover:scale-[1.02] transition-transform duration-300">
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="5"
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <span className="absolute text-xs font-black text-slate-800">{score}%</span>
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</h3>
        <p className="text-lg font-bold text-slate-800 leading-none">
          {getStatus(score)}
        </p>
      </div>
    </div>
  );
};
