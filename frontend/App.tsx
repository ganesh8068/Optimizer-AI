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
import { Menu, X, User, LogOut, Bot, Code } from "lucide-react";
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
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E293B] dark:text-white mb-8 sm:mb-12 text-center tracking-tight uppercase">
                  ATS Resume Optimization
                </h2>
                <div className="bg-white dark:bg-slate-900 p-1 relative overflow-hidden rounded-lg">
                  <div className="p-6 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
                    <FileUpload
                      label="Upload Resume (PDF)"
                      id="res-up"
                      onFileSelect={(f) => setFiles((prev) => ({ ...prev, resume: f }))}
                      selectedFile={files.resume}
                    />

                    <div className="space-y-10">
                      <div className="flex flex-col gap-3 group">
                        <label className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-[#4F46E5]">
                          Target Job Title
                        </label>
                        <input
                          type="text"
                          value={jobRole}
                          onChange={(e) => setJobRole(e.target.value)}
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full px-4 sm:px-7 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-[#f8f9fa] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-100 dark:border-slate-700 focus:border-[#4F46E5] focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-base sm:text-lg placeholder:text-slate-400 shadow-sm tracking-wide"
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          Experience Level
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {Object.values(ExperienceLevel).map((l, i) => (
                            <button
                              key={l}
                              onClick={() => setExpLevel(l)}
                              className={`px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 ${expLevel === l ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20" : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 text-slate-400 hover:border-slate-200 dark:hover:border-slate-600"}`}
                            >
                              {l.split(" / ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 px-2">
                      <div className="p-6 rounded-[1.5rem] border-2 border-[#BFDBFE] dark:border-blue-900/50 bg-white dark:bg-slate-900 transition-all hover:border-[#4F46E5]/30">
                        <button
                          disabled={loading || !files.resume || !jobRole}
                          onClick={handleResumeOptimize}
                          className={`w-full py-6 rounded-xl font-black text-xl flex justify-center items-center gap-3 transition-all duration-500 active:scale-[0.98] ${loading ? "bg-slate-800 text-white cursor-wait" : "bg-[#4F46E5] text-white hover:bg-[#3730A3] shadow-lg shadow-indigo-100/50 hover:shadow-indigo-300/50 shimmer dark:shadow-indigo-900/20 dark:hover:shadow-indigo-800/20"} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Analyzing Profile...
                            </span>
                          ) : (
                            "Generate Resume Report"
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
              </div>
            ) : <ResultsView data={resumeResult} />
          } />

          <Route path="/linkedin" element={
            !linkedinResult ? (
              <div className="max-w-5xl mx-auto opacity-0 animate-fade-up mt-8">
                <h2 className="text-5xl font-black text-[#1E293B] dark:text-white mb-12 text-center tracking-tight uppercase">
                  LinkedIn Profile Optimizer
                </h2>
                <div className="bg-white dark:bg-slate-900 p-1">
                  <div className="p-8 md:p-12 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="opacity-0 animate-fade-up stagger-1">
                        <FileUpload
                          label="Upload Latest Resume (PDF)"
                          id="li-resume-up"
                          onFileSelect={(f) => setFiles((prev) => ({ ...prev, resume: f }))}
                          selectedFile={files.resume}
                        />
                      </div>
                      <div className="opacity-0 animate-fade-up stagger-2">
                        <FileUpload
                          label="Current LinkedIn Profile (PDF)"
                          id="li-profile-up"
                          onFileSelect={(f) => setFiles((prev) => ({ ...prev, linkedinProfile: f }))}
                          selectedFile={files.linkedinProfile}
                        />
                      </div>
                    </div>

                    <div className="space-y-10 opacity-0 animate-fade-up stagger-3">
                      <div className="flex flex-col gap-3 group">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-[#0077B5]">
                          Desired Professional Identity
                        </label>
                        <input
                          type="text"
                          value={jobRole}
                          onChange={(e) => setJobRole(e.target.value)}
                          placeholder="e.g. Marketing Executive & Content Strategist"
                          className="w-full px-7 py-5 rounded-2xl bg-[#f8f9fa] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-100 dark:border-slate-700 focus:border-[#0077B5] focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-lg placeholder:text-slate-400 shadow-sm tracking-wide"
                        />
                      </div>
                    </div>

                    <div className="pt-8 px-2 opacity-0 animate-fade-up stagger-4">
                      <div className="p-6 rounded-[1.5rem] border-2 border-[#BFDBFE] dark:border-blue-900/50 bg-white dark:bg-slate-900 transition-all hover:border-[#0077B5]/30">
                        <button
                          disabled={loading || !files.resume || !files.linkedinProfile || !jobRole}
                          onClick={handleLinkedInOptimize}
                          className={`w-full py-6 rounded-xl font-black text-xl flex justify-center items-center gap-3 transition-all duration-500 active:scale-[0.98] ${loading ? "bg-slate-800 text-white cursor-wait" : "bg-[#0077B5] text-white hover:bg-[#005E93] shadow-lg shadow-blue-100/50 hover:shadow-blue-300/50 shimmer dark:shadow-blue-900/20"} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Refining Profile...
                            </span>
                          ) : (
                            "Optimize LinkedIn Identity"
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
              </div>
            ) : <LinkedInResultsView data={linkedinResult} />
          } />
        </Routes>
      </div>
    </AppLayout>
  );
};

export default App;
