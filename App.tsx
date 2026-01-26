
import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsView } from './components/ResultsView';
import { LinkedInResultsView } from './components/LinkedInResultsView';
import { Hero } from './components/Hero';
import AboutPage from './components/ui/about-page';
import { ExperienceLevel, UploadedFiles, AnalysisResult, LinkedInAnalysisResult, AppView } from './types';
import { analyzeResume, analyzeLinkedIn } from './geminiService';
import { Footer } from './components/ui/modem-animated-footer';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { Icons } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [files, setFiles] = useState<UploadedFiles>({ resume: null, linkedinProfile: null });
  const [jobRole, setJobRole] = useState('');
  const [expLevel, setExpLevel] = useState<ExperienceLevel>(ExperienceLevel.STUDENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeResult, setResumeResult] = useState<AnalysisResult | null>(null);
  const [linkedinResult, setLinkedInResult] = useState<LinkedInAnalysisResult | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleResumeOptimize = async () => {
    if (!files.resume || !jobRole) {
      setError("Please upload your resume and enter a target role.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const base64 = await fileToBase64(files.resume);
      const res = await analyzeResume(base64, jobRole, expLevel);
      setResumeResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInOptimize = async () => {
    if (!files.resume || !files.linkedinProfile || !jobRole) {
      setError("Please upload both your latest resume and current LinkedIn profile PDF.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resumeBase64 = await fileToBase64(files.resume);
      const linkedinBase64 = await fileToBase64(files.linkedinProfile);
      const res = await analyzeLinkedIn(resumeBase64, linkedinBase64, jobRole);
      setLinkedInResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze LinkedIn.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setResumeResult(null);
    setLinkedInResult(null);
    setFiles({ resume: null, linkedinProfile: null });
    setError(null);
  };

  const navigateTo = (view: AppView) => {
    resetState();
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSocials = [
    { icon: <Twitter />, href: "#", label: "Twitter" },
    { icon: <Linkedin />, href: "#", label: "LinkedIn" },
    { icon: <Github />, href: "#", label: "GitHub" },
    { icon: <Mail />, href: "mailto:hello@optimizer.ai", label: "Email" },
  ];

  const footerNav = [
    { label: "Pricing", href: "#" },
    { label: "Methodology", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 antialiased font-sans">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md px-8 py-4 sticky top-0 z-50 border-b border-slate-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className="flex items-center justify-center text-[#4F46E5] group-hover:rotate-45 transition-transform duration-500">
              <Icons.Logo className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-black text-[#1E293B] tracking-tight group-hover:text-[#4F46E5] transition-colors">Optimizer AI</h1>
          </div>
          <div className="flex gap-4 md:gap-6 items-center">
            <button 
              onClick={() => navigateTo('resume')}
              className={`px-4 md:px-6 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ${currentView === 'resume' ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-indigo-600'}`}
            >
              Resume
            </button>
            <button 
              onClick={() => navigateTo('linkedin')}
              className={`px-4 md:px-6 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ${currentView === 'linkedin' ? 'bg-[#0077B5] text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-[#0077B5]'}`}
            >
              LinkedIn
            </button>
            <button 
              onClick={() => navigateTo('about')}
              className={`px-4 md:px-6 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ${currentView === 'about' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
            >
              About
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10 overflow-hidden min-h-[80vh]">
        
        {/* HOME PAGE */}
        {currentView === 'home' && (
          <Hero onNavigate={navigateTo} />
        )}

        {/* ABOUT PAGE */}
        {currentView === 'about' && (
          <AboutPage />
        )}

        {/* RESUME VIEW */}
        {currentView === 'resume' && !resumeResult && (
          <div className="max-w-5xl mx-auto opacity-0 animate-fade-up">
            <h2 className="text-5xl font-black text-[#1E293B] mb-12 text-center tracking-tight uppercase">ATS Resume Optimization</h2>
            <div className="bg-white p-1 relative overflow-hidden">
              <div className="p-8 md:p-12 space-y-12">
                <FileUpload label="Upload Resume (PDF)" id="res-up" onFileSelect={(f) => setFiles(prev => ({...prev, resume: f}))} selectedFile={files.resume} />
                
                <div className="space-y-10">
                  <div className="flex flex-col gap-3 group">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-[#4F46E5]">Target Job Title</label>
                    <input 
                      type="text" 
                      value={jobRole} 
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full px-7 py-5 rounded-2xl bg-[#f8f9fa] text-slate-800 border-2 border-slate-100 focus:border-[#4F46E5] focus:bg-white transition-all outline-none font-bold text-lg placeholder:text-slate-400 shadow-sm tracking-wide"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Experience Level</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Object.values(ExperienceLevel).map((l, i) => (
                        <button 
                          key={l}
                          onClick={() => setExpLevel(l)}
                          className={`px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 ${expLevel === l ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-lg shadow-indigo-100' : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200'}`}
                        >
                          {l.split(' / ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 px-2">
                  <div className="p-6 rounded-[1.5rem] border-2 border-[#BFDBFE] bg-white transition-all hover:border-[#4F46E5]/30">
                    <button 
                      disabled={loading || !files.resume || !jobRole}
                      onClick={handleResumeOptimize}
                      className={`w-full py-6 rounded-xl font-black text-xl flex justify-center items-center gap-3 transition-all duration-500 active:scale-[0.98] ${loading ? 'bg-slate-800 text-white cursor-wait' : 'bg-[#4F46E5] text-white hover:bg-[#3730A3] shadow-lg shadow-indigo-100/50 hover:shadow-indigo-300/50 shimmer'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing Profile...
                        </span>
                      ) : (
                        'Generate Resume Report'
                      )}
                    </button>
                  </div>
                  {error && <p className="mt-4 text-center text-rose-500 text-xs font-bold animate-pulse">{error}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
        {resumeResult && currentView === 'resume' && <ResultsView data={resumeResult} />}

        {/* LINKEDIN VIEW */}
        {currentView === 'linkedin' && !linkedinResult && (
          <div className="max-w-5xl mx-auto opacity-0 animate-fade-up">
            <h2 className="text-5xl font-black text-[#1E293B] mb-12 text-center tracking-tight uppercase">LinkedIn Profile Optimizer</h2>
            <div className="bg-white p-1">
              <div className="p-8 md:p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="opacity-0 animate-fade-up stagger-1">
                    <FileUpload label="Upload Latest Resume (PDF)" id="li-resume-up" onFileSelect={(f) => setFiles(prev => ({...prev, resume: f}))} selectedFile={files.resume} />
                  </div>
                  <div className="opacity-0 animate-fade-up stagger-2">
                    <FileUpload label="Current LinkedIn Profile (PDF)" id="li-profile-up" onFileSelect={(f) => setFiles(prev => ({...prev, linkedinProfile: f}))} selectedFile={files.linkedinProfile} />
                  </div>
                </div>
                
                <div className="space-y-10 opacity-0 animate-fade-up stagger-3">
                  <div className="flex flex-col gap-3 group">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-[#0077B5]">Desired Professional Identity</label>
                    <input 
                      type="text" 
                      value={jobRole} 
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="e.g. Marketing Executive & Content Strategist"
                      className="w-full px-7 py-5 rounded-2xl bg-[#f8f9fa] text-slate-800 border-2 border-slate-100 focus:border-[#0077B5] focus:bg-white transition-all outline-none font-bold text-lg placeholder:text-slate-400 shadow-sm tracking-wide"
                    />
                  </div>
                </div>

                <div className="pt-8 px-2 opacity-0 animate-fade-up stagger-4">
                  <div className="p-6 rounded-[1.5rem] border-2 border-[#BFDBFE] bg-white transition-all hover:border-[#0077B5]/30">
                    <button 
                      disabled={loading || !files.resume || !files.linkedinProfile || !jobRole}
                      onClick={handleLinkedInOptimize}
                      className={`w-full py-6 rounded-xl font-black text-xl flex justify-center items-center gap-3 transition-all duration-500 active:scale-[0.98] ${loading ? 'bg-slate-800 text-white cursor-wait' : 'bg-[#0077B5] text-white hover:bg-[#005E93] shadow-lg shadow-blue-100/50 hover:shadow-blue-300/50 shimmer'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Refining Profile...
                        </span>
                      ) : (
                        'Optimize LinkedIn Identity'
                      )}
                    </button>
                  </div>
                  {error && <p className="mt-4 text-center text-rose-500 text-xs font-bold animate-pulse">{error}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
        {linkedinResult && currentView === 'linkedin' && <LinkedInResultsView data={linkedinResult} />}

      </main>

      <Footer 
        brandName="Optimizer AI"
        brandDescription="The world's most advanced Gemini-powered platform for modern career transformation. Build your high-impact brand in seconds."
        socialLinks={footerSocials}
        navLinks={footerNav}
      />
    </div>
  );
};

export default App;
