
import React from 'react';
import { LinkedInAnalysisResult } from '../types';

interface Props {
  data: LinkedInAnalysisResult;
}

export const LinkedInResultsView: React.FC<Props> = ({ data }) => {
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Card */}
      <div className="opacity-0 animate-fade-up stagger-1 bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-10 transition-all hover:shadow-blue-100">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xs font-black text-[#0077B5] uppercase tracking-widest">LinkedIn Headline</h3>
          <button onClick={() => copy(data.headline)} className="text-[10px] font-black bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-400 px-4 py-2 rounded-lg transition-all duration-300 uppercase">COPY</button>
        </div>
        <p className="text-xl md:text-3xl font-black text-slate-800 leading-tight tracking-tight">
          {data.headline}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* About Me */}
        <div className="opacity-0 animate-fade-up stagger-2 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden group">
          <div className="bg-[#0077B5] px-8 py-5 flex justify-between items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="text-white font-bold text-sm relative z-10">About Summary</h4>
            <button onClick={() => copy(data.about)} className="text-[10px] font-bold bg-white/20 hover:bg-white/40 text-white px-3 py-1 rounded relative z-10 transition-all duration-300">COPY</button>
          </div>
          <div className="p-8">
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm font-medium italic">
              {data.about}
            </p>
          </div>
        </div>

        {/* Skills & Advice */}
        <div className="space-y-8">
          <div className="opacity-0 animate-fade-up stagger-3 bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl transition-all hover:scale-[1.01]">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Top Keywords & Skills</h4>
            <div className="flex flex-wrap gap-2.5">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-[11px] font-bold hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-default hover:scale-105">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="opacity-0 animate-fade-up stagger-4 bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100 transition-all hover:bg-white hover:shadow-lg">
            <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-4">Strategic Advice</h4>
            <p className="text-sm text-indigo-900 font-medium leading-relaxed italic border-l-4 border-indigo-400 pl-4 py-1">
              "{data.networkingAdvice}"
            </p>
          </div>
        </div>
      </div>

      {/* Experience Breakdown */}
      <div className="opacity-0 animate-fade-up stagger-5 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="bg-slate-800 px-8 py-5">
          <h4 className="text-white font-bold text-sm uppercase tracking-widest">Optimized Experience Sections</h4>
        </div>
        <div className="p-8 space-y-6">
          {data.experienceOptimizations.map((exp, i) => (
            <div key={i} className={`group p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all duration-300 opacity-0 animate-fade-up stagger-${(i % 5) + 1}`}>
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-black text-slate-800 tracking-tight">{exp.title}</h5>
                <button onClick={() => copy(exp.description)} className="text-[10px] font-black text-slate-300 group-hover:text-indigo-600 transition-colors uppercase">COPY DESC</button>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
