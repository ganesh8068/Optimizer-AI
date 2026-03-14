import React, { useState, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FileUpload } from "./components/FileUpload";
import { ResultsView } from "./components/ResultsView";
import { LinkedInResultsView } from "./components/LinkedInResultsView";
import { Hero } from "./components/Hero";
import AboutPage from "./components/ui/about-page";
import RoadmapPage from "./components/ui/roadmap-page";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import ProfilePage from "./components/pages/ProfilePage";
import InterviewPage from "./components/pages/InterviewPage";
import DSASheetPage from "./components/pages/DSASheetPage";
import DashboardPage from "./components/pages/DashboardPage";
import AuthService from "./services/authService";
import {
  ExperienceLevel,
  UploadedFiles,
  AnalysisResult,
  LinkedInAnalysisResult,
  AppView,
} from "./types";
import { analyzeResume, analyzeLinkedIn } from "./geminiService";
import { Menu, X, User, LogOut, Bot, Code, ChevronRight } from "lucide-react";
import { Icons } from "./constants";
import AppLayout from "./components/layout/AppLayout";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname === "/" ? "home" : location.pathname.substring(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isLoggedIn());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleAuthChange = useCallback(() => {
    setIsLoggedIn(AuthService.isLoggedIn());
  }, []);
  const [files, setFiles] = useState<UploadedFiles>({ resume: null, linkedinProfile: null });
  const [jobRole, setJobRole] = useState("");
  const [expLevel, setExpLevel] = useState<ExperienceLevel>(ExperienceLevel.STUDENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeResult, setResumeResult] = useState<AnalysisResult | null>(null);
  const [linkedinResult, setLinkedInResult] = useState<LinkedInAnalysisResult | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
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
    navigate(view === 'home' ? '/' : `/${view}`);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentUser = AuthService.getUser();

  return (
    <AppLayout 
      currentView={currentView} 
      navigateTo={navigateTo} 
      user={currentUser as any}
      handleLogout={() => {
        AuthService.logout();
        handleAuthChange();
        navigate("/login");
      }}
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
    >
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Hero onNavigate={navigateTo} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/login" element={<LoginPage onAuthChange={handleAuthChange} />} />
          <Route path="/signup" element={<SignupPage onAuthChange={handleAuthChange} />} />
          <Route path="/profile" element={<ProfilePage onAuthChange={handleAuthChange} />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/dsa-sheet" element={<DSASheetPage />} />
          <Route path="/resume" element={
            !resumeResult ? (
              <div className="max-w-5xl mx-auto opacity-0 animate-fade-up px-4 sm:px-0 mt-8">
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 mb-8 sm:mb-12 text-center tracking-tighter uppercase italic leading-none">
                  Resume <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Power-Up</span>
                </h2>
                <div className="bg-white p-1 relative overflow-hidden rounded-[3rem] border-8 border-slate-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                  <div className="p-8 sm:p-12 md:p-20 space-y-12 sm:space-y-16">
                    <FileUpload
                      label="Upload Resume (PDF)"
                      id="res-up"
                      onFileSelect={(f) => setFiles((prev) => ({ ...prev, resume: f }))}
                      selectedFile={files.resume}
                    />

                    <div className="space-y-10">
                      <div className="flex flex-col gap-4 group">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] transition-colors group-focus-within:text-indigo-600">
                          Target Job Title
                        </label>
                        <div className="relative group/input">
                          <input
                            type="text"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full px-8 py-6 rounded-2xl bg-slate-50 text-slate-900 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white transition-all outline-none font-bold text-xl placeholder:text-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                          />
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          Experience Level
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {Object.values(ExperienceLevel).map((l, i) => (
                            <button
                              key={l}
                              onClick={() => setExpLevel(l)}
                              className={`px-5 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-500 hover:scale-[1.02] active:scale-95 ${expLevel === l ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/30 ring-4 ring-indigo-500/10" : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 text-slate-400 hover:border-slate-200 dark:hover:border-slate-600"}`}
                            >
                              {l.split(" / ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-10">
                        <button
                          disabled={loading || !files.resume || !jobRole}
                          onClick={handleResumeOptimize}
                          className={`w-full py-8 rounded-3xl font-black text-2xl flex justify-center items-center gap-4 transition-all duration-500 active:scale-[0.98] relative overflow-hidden group/btn shadow-[0_20px_40px_-12px_rgba(79,70,229,0.3)] ${loading ? "bg-slate-900 text-white cursor-wait" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                        >
                          {loading ? (
                            <span className="flex items-center gap-3">
                              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                              Analyzing Profile...
                            </span>
                          ) : (
                            <>
                              Optimize My Resume
                              <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                            </>
                          )}
                        </button>
                    </div>
                      {error && (
                        <p className="mt-4 text-center text-rose-500 text-xs font-bold animate-pulse">
                          {error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
            ) : <ResultsView data={resumeResult} />
          } />

          <Route path="/linkedin" element={
            !linkedinResult ? (
              <div className="max-w-5xl mx-auto opacity-0 animate-fade-up mt-8 px-4 sm:px-0">
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 mb-8 sm:mb-12 text-center tracking-tighter uppercase italic leading-none">
                  LinkedIn <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Optimization</span>
                </h2>
                <div className="bg-white p-1 relative overflow-hidden rounded-[3rem] border-8 border-slate-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                  <div className="p-8 sm:p-12 md:p-20 space-y-12 sm:space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FileUpload
                        label="Upload Latest Resume (PDF)"
                        id="li-resume-up"
                        onFileSelect={(f) => setFiles((prev) => ({ ...prev, resume: f }))}
                        selectedFile={files.resume}
                      />
                      <FileUpload
                        label="Current LinkedIn Profile (PDF)"
                        id="li-profile-up"
                        onFileSelect={(f) => setFiles((prev) => ({ ...prev, linkedinProfile: f }))}
                        selectedFile={files.linkedinProfile}
                      />
                    </div>

                    <div className="space-y-10">
                      <div className="flex flex-col gap-4 group">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] transition-colors group-focus-within:text-blue-600">
                          Professional Identity
                        </label>
                        <div className="relative group/input">
                          <input
                            type="text"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                            placeholder="e.g. Marketing Executive & Content Strategist"
                            className="w-full px-8 py-6 rounded-2xl bg-slate-50 text-slate-900 border-2 border-transparent focus:border-blue-500/20 focus:bg-white transition-all outline-none font-bold text-xl placeholder:text-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                          />
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-10">
                        <button
                          disabled={loading || !files.resume || !files.linkedinProfile || !jobRole}
                          onClick={handleLinkedInOptimize}
                          className={`w-full py-8 rounded-3xl font-black text-2xl flex justify-center items-center gap-4 transition-all duration-500 active:scale-[0.98] relative overflow-hidden group/btn shadow-[0_20px_40px_-12px_rgba(0,119,181,0.3)] ${loading ? "bg-slate-900 text-white cursor-wait" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        >
                          {loading ? (
                            <span className="flex items-center gap-3">
                              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                              Refining Profile...
                            </span>
                          ) : (
                            <>
                              Optimize Profile
                              <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                            </>
                          )}
                        </button>
                    </div>
                      {error && (
                        <p className="mt-4 text-center text-rose-500 text-xs font-bold animate-pulse">
                          {error}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            ) : <LinkedInResultsView data={linkedinResult} />
          } />
        </Routes>
      </div>
    </AppLayout>
  );
};

export default App;
