
import React from 'react';
import { AnalysisResult } from '../types';
import { ScoreCard } from './ScoreCard';
import { Icons } from '../constants';

interface ResultsViewProps {
  data: AnalysisResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ data }) => {
  return (
    <div className="space-y-10 pb-20">
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="opacity-0 animate-fade-up stagger-1">
          <ScoreCard label="RESUME SCORE" score={data.scores.resume} color="text-[#4F46E5]" />
        </div>
        <div className="opacity-0 animate-fade-up stagger-2">
          <ScoreCard label="ATS MATCH" score={data.scores.atsCompatibility} color="text-[#10B981]" />
        </div>
        <div className="opacity-0 animate-fade-up stagger-3">
          <ScoreCard label="READABILITY" score={data.scores.readability} color="text-[#F97316]" />
        </div>
      </div>

      {/* Main Optimized Content Section */}
      <div className="opacity-0 animate-fade-up stagger-4 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/30 border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-indigo-200/40">
        <div className="bg-[#4F46E5] px-8 py-5 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <h4 className="text-white font-bold text-sm tracking-tight relative z-10">
            Optimized Resume Content
          </h4>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(data.resumeAnalysis.rewrittenContent);
              alert("Copied to clipboard!");
            }}
            className="text-[10px] font-black bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all uppercase border border-white/20 hover:scale-105 active:scale-95 relative z-10"
          >
            COPY TEXT
          </button>
        </div>
        
        <div className="p-10 space-y-12 bg-white">
          <div className="bg-slate-50/50 rounded-2xl p-10 text-slate-700 font-mono text-xs overflow-auto max-h-[800px] border border-slate-200 leading-relaxed shadow-inner hover:bg-white transition-colors duration-300">
            <pre className="whitespace-pre-wrap">{data.resumeAnalysis.rewrittenContent}</pre>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                Impact Highlights
              </h3>
              <div className="space-y-5">
                {data.resumeAnalysis.starBullets.map((bullet, i) => (
                  <div key={i} className={`p-6 bg-white border-l-4 border-[#10B981] rounded-r-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] text-sm text-slate-700 leading-relaxed border-y border-r border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-up stagger-${(i % 5) + 1}`}>
                    {bullet}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse"></span>
                Recruiter Feedback
              </h3>
              <ul className="space-y-4">
                {data.resumeAnalysis.feedback.map((f, i) => (
                  <li key={i} className={`flex gap-5 p-5 bg-slate-50 rounded-2xl text-slate-700 text-sm leading-relaxed border border-slate-100 group hover:bg-white hover:border-[#4F46E5]/30 transition-all duration-300 opacity-0 animate-fade-up stagger-${(i % 5) + 1}`}>
                    <span className="text-[#4F46E5] font-black text-base transition-transform group-hover:scale-125">{i + 1}</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gaps and Keywords Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="opacity-0 animate-fade-up stagger-5 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] hover:-rotate-1">
          <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Experience Gaps</h3>
          <div className="space-y-4">
            {data.roleGaps.map((gap, i) => (
              <div key={i} className="flex gap-4 text-slate-300 text-sm font-medium hover:text-white transition-colors cursor-default">
                <span className="text-indigo-500 shrink-0 text-lg leading-none">•</span> {gap}
              </div>
            ))}
          </div>
        </div>
        <div className="opacity-0 animate-fade-up stagger-5 bg-[#4F46E5] rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] hover:rotate-1">
          <h3 className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.3em] mb-6">Job-Specific Keywords</h3>
          <div className="flex flex-wrap gap-2.5">
            {data.suggestedKeywords.map((kw, i) => (
              <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl text-[11px] font-black tracking-tight hover:bg-white hover:text-[#4F46E5] transition-all duration-300 cursor-default hover:scale-110">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
