
"use client";

import React, { useEffect } from "react";
import { Plus } from "lucide-react"; 
import { renderCanvas, ShineBorder, TypeWriter } from "./ui/hero-designali";
import { GravitySection } from "./GravitySection";
import { FeaturesSectionWithBentoGrid } from "./ui/feature-section-with-bento-grid";
import { Button } from "./ui/button"; 
import { AppView } from "../types";

interface HeroProps {
  onNavigate: (view: AppView) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const talkAbout = [
    "ATS Optimization",
    "Resume Scoring",
    "Brand Strategy",
    "Career Coaching",
    "LinkedIn Presence",
    "Interview Prep",
  ];

  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <main className="overflow-hidden relative">
      <section id="home" className="min-h-[85vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 max-md:hidden top-[200px] -z-10 h-[400px] w-full bg-transparent bg-[linear-gradient(to_right,#4F46E5_1px,transparent_1px),linear-gradient(to_bottom,#4F46E5_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        <div className="flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 mt-10 sm:justify-center animate-fade-up">
            <div className="relative flex items-center rounded-full border bg-white/50 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
              Powered by Gemini 3 Flash
              <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="relative mx-auto h-full bg-background/20 border border-slate-100 rounded-[3rem] py-12 p-8 shadow-2xl backdrop-blur-sm [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] animate-fade-up stagger-1">
              <h1 className="flex flex-col text-center text-5xl font-black leading-none tracking-tight md:text-8xl lg:text-8xl text-slate-900">
                <Plus strokeWidth={4} className="text-[#4F46E5] absolute -left-5 -top-5 h-10 w-10" />
                <Plus strokeWidth={4} className="text-[#4F46E5] absolute -bottom-5 -left-5 h-10 w-10" />
                <Plus strokeWidth={4} className="text-[#4F46E5] absolute -right-5 -top-5 h-10 w-10" />
                <Plus strokeWidth={4} className="text-[#4F46E5] absolute -bottom-5 -right-5 h-10 w-10" />
                <span>
                  Your complete platform for <br/>
                  <span className="text-[#4F46E5] italic">Career Excellence.</span>
                </span>
              </h1>
            </div>

            <h1 className="mt-12 text-2xl md:text-3xl font-bold text-slate-800 animate-fade-up stagger-2">
              Transform your professional <span className="text-[#4F46E5]">Identity.</span>
            </h1>

            <p className="text-slate-500 py-6 max-w-2xl mx-auto text-lg font-medium animate-fade-up stagger-3">
              I craft high-impact profiles for top-tier talent, leveraging Gemini AI to power your{" "}
              <span className="text-[#0077B5] font-bold">
                <TypeWriter strings={talkAbout} />
              </span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 animate-fade-up stagger-4">
              <div onClick={() => onNavigate('resume')}>
                <ShineBorder
                  borderWidth={3}
                  borderRadius={16}
                  className="border cursor-pointer h-auto w-auto p-1 bg-white/5 backdrop-blur-md"
                  color={["#4F46E5", "#0077B5", "#10B981"]}
                >
                  <Button className="w-48 h-14 rounded-xl text-lg font-black uppercase tracking-widest shadow-xl shadow-indigo-100">
                    Optimize Resume
                  </Button>
                </ShineBorder>
              </div>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('linkedin')}
                className="w-48 h-14 rounded-xl text-lg font-black uppercase tracking-widest border-2 hover:bg-slate-50 transition-all"
              >
                LinkedIn Brand
              </Button>
            </div>
          </div>
        </div>
        <canvas
          className="pointer-events-none absolute inset-0 mx-auto"
          id="canvas"
        ></canvas>
      </section>

      {/* Integrated Gravity Section */}
      <GravitySection />

      {/* NEW: Features Section with Bento Grid */}
      <FeaturesSectionWithBentoGrid />

      <img
        width={1512}
        height={550}
        className="absolute left-1/2 top-0 -z-20 -translate-x-1/2 opacity-30"
        src="https://raw.githubusercontent.com/designali-in/designali/refs/heads/main/apps/www/public/images/gradient-background-top.png"
        alt=""
        role="presentation"
      />
    </main>
  );
};
