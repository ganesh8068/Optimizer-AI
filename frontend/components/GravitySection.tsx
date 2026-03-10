import React from "react";
import { Gravity, MatterBody } from "./ui/gravity";

export const GravitySection: React.FC = () => {
  return (
    <div className="w-full h-auto min-h-[500px] sm:h-[600px] flex flex-col relative font-sans overflow-hidden border-2 border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 mt-12 mb-20 animate-fade-up stagger-5 rounded-lg mx-auto max-w-7xl px-4 sm:px-0">
      <div className="pt-8 sm:pt-20 text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-800 w-full text-center font-black tracking-tighter italic px-4">
        The Building Blocks
      </div>
      <p className="pt-2 sm:pt-4 text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 w-full text-center font-bold uppercase tracking-widest px-4">
        of a High-Performance Profile
      </p>

      <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.4 }}
          x="20%"
          y="10%"
          angle={15}
        >
          <div className="text-sm sm:text-lg bg-[#4F46E5] text-white rounded-full hover:cursor-grab px-8 py-4 font-black uppercase tracking-widest shadow-xl shadow-indigo-100">
            ATS Optimization
          </div>
        </MatterBody>

        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.3 }}
          x="40%"
          y="20%"
          angle={-10}
        >
          <div className="text-sm sm:text-lg bg-[#0077B5] text-white rounded-full hover:cursor-grab px-8 py-4 font-black uppercase tracking-widest shadow-xl shadow-blue-100">
            LinkedIn SEO
          </div>
        </MatterBody>

        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.5 }}
          x="60%"
          y="15%"
          angle={45}
        >
          <div className="text-sm sm:text-lg bg-[#10B981] text-white rounded-full hover:cursor-grab px-8 py-4 font-black uppercase tracking-widest shadow-xl shadow-emerald-100">
            STAR Bullets
          </div>
        </MatterBody>

        <MatterBody matterBodyOptions={{ friction: 0.4, restitution: 0.2 }} x="80%" y="30%">
          <div className="text-sm sm:text-lg bg-slate-900 text-white rounded-full hover:cursor-grab px-8 py-4 font-black uppercase tracking-widest shadow-xl shadow-slate-200">
            AI Scoring
          </div>
        </MatterBody>

        <MatterBody
          matterBodyOptions={{ friction: 0.5, restitution: 0.6 }}
          x="30%"
          y="40%"
          angle={-30}
        >
          <div className="text-sm sm:text-lg bg-[#F97316] text-white rounded-full hover:cursor-grab px-8 py-4 font-black uppercase tracking-widest shadow-xl shadow-orange-100">
            Keyword Gap
          </div>
        </MatterBody>

        <MatterBody matterBodyOptions={{ friction: 0.6, restitution: 0.1 }} x="70%" y="45%">
          <div className="text-sm sm:text-lg bg-indigo-50 text-indigo-600 border-2 border-indigo-200 rounded-full hover:cursor-grab px-8 py-4 font-black uppercase tracking-widest">
            Personal Branding
          </div>
        </MatterBody>
      </Gravity>
    </div>
  );
};
