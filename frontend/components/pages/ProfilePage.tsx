import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Briefcase,
  FileText,
  Linkedin,
  LogOut,
  Edit3,
  Save,
  X,
  Shield,
  Calendar,
  Sparkles,
  Github,
  Code,
  ExternalLink,
  GraduationCap,
  Building2,
  Wrench,
  Plus,
  Trash2,
  MapPin,
  Award,
  TrendingUp,
  ChevronRight,
  Flame,
  Code2,
} from "lucide-react";
import AuthService, { AuthUser, Education, Experience } from "../../services/authService";
import ContributionGraph from "../ui/contribution-graph";

interface ProfilePageProps {
  onAuthChange: () => void;
}

const emptyEducation: Education = { institution: "", degree: "", field: "", startYear: "", endYear: "" };
const emptyExperience: Experience = { company: "", role: "", startDate: "", endDate: "", description: "" };

type Tab = "overview" | "education" | "experience" | "account";

const ProfilePage: React.FC<ProfilePageProps> = ({ onAuthChange }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(AuthService.getUser());
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editLinkedinUrl, setEditLinkedinUrl] = useState("");
  const [editGithubUrl, setEditGithubUrl] = useState("");
  const [editCodingPlatformUrl, setEditCodingPlatformUrl] = useState("");
  const [editEducation, setEditEducation] = useState<Education[]>([]);
  const [editExperience, setEditExperience] = useState<Experience[]>([]);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dsaStreak, setDsaStreak] = useState(0);
  const [dsaSolved, setDsaSolved] = useState(0);
  const [graphData, setGraphData] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      navigate("/login");
      return;
    }
    AuthService.getProfile()
      .then((u) => {
        setUser(u);
        if (u.dsaProgress) {
          setDsaStreak(u.dsaProgress.streak.count || 0);
          setDsaSolved(u.dsaProgress.completedProblems?.length || 0);
          setGraphData(u.dsaProgress.activityGraph || {});
          
          // Legacy check/migration if needed can go here
        } else {
          // Fallback to local storage if not in DB yet
          try {
            const storedStreak = JSON.parse(localStorage.getItem("dsa_sheet_streak") || "{}");
            setDsaStreak(storedStreak.count || 0);
            const storedSolved = JSON.parse(localStorage.getItem("dsa_sheet_progress") || "[]");
            setDsaSolved(storedSolved.length || 0);
            const storedGraph = JSON.parse(localStorage.getItem("dsa_sheet_graph_data") || "{}");
            setGraphData(storedGraph);
          } catch {}
        }
      })
      .catch(() => {});
  }, [navigate]);

  const startEditing = () => {
    if (!user) return;
    setEditName(user.name);
    setEditBio(user.bio || "");
    setEditJobTitle(user.jobTitle || "");
    setEditLinkedinUrl(user.linkedinUrl || "");
    setEditGithubUrl(user.githubUrl || "");
    setEditCodingPlatformUrl(user.codingPlatformUrl || "");
    setEditEducation(user.education?.length ? user.education.map(e => ({...e})) : []);
    setEditExperience(user.experience?.length ? user.experience.map(e => ({...e})) : []);
    setEditSkills(user.skills?.length ? [...user.skills] : []);
    setEditing(true);
    setError(null);
    setSuccess(null);
  };

  const cancelEditing = () => { setEditing(false); setError(null); };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const updated = await AuthService.updateProfile({
        name: editName, bio: editBio, jobTitle: editJobTitle,
        linkedinUrl: editLinkedinUrl, githubUrl: editGithubUrl,
        codingPlatformUrl: editCodingPlatformUrl,
        education: editEducation.filter((e) => e.institution && e.degree),
        experience: editExperience.filter((e) => e.company && e.role),
        skills: editSkills.filter((s) => s.trim()),
      });
      setUser(updated);
      setEditing(false);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally { setLoading(false); }
  };

  const handleLogout = () => { AuthService.logout(); onAuthChange(); navigate("/"); };

  // Helpers
  const addEducation = () => setEditEducation([...editEducation, { ...emptyEducation }]);
  const removeEducation = (i: number) => setEditEducation(editEducation.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, f: keyof Education, v: string) => {
    const u = [...editEducation]; u[i] = { ...u[i], [f]: v }; setEditEducation(u);
  };
  const addExperience = () => setEditExperience([...editExperience, { ...emptyExperience }]);
  const removeExperience = (i: number) => setEditExperience(editExperience.filter((_, idx) => idx !== i));
  const updateExperience = (i: number, f: keyof Experience, v: string) => {
    const u = [...editExperience]; u[i] = { ...u[i], [f]: v }; setEditExperience(u);
  };
  const addSkill = () => {
    if (newSkill.trim() && !editSkills.includes(newSkill.trim())) {
      setEditSkills([...editSkills, newSkill.trim()]); setNewSkill("");
    }
  };
  const removeSkill = (i: number) => setEditSkills(editSkills.filter((_, idx) => idx !== i));

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const inp = "w-full px-4 py-2.5 rounded-xl bg-white/80 text-slate-800 border border-slate-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all outline-none font-medium text-sm backdrop-blur";

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" />, count: user.education?.length || 0 },
    { id: "experience", label: "Experience", icon: <Building2 className="w-4 h-4" />, count: user.experience?.length || 0 },
    { id: "account", label: "Account", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16 opacity-0 animate-fade-up">

      {/* ──── HERO SECTION ──── */}
      <div className="relative mb-8">
        {/* Banner with animated gradient */}
        <div className="h-48 rounded-3xl overflow-hidden relative" style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 30%, #A855F7 50%, #EC4899 80%, #F43F5E 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite"
        }}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
          
          {/* Edit/Save buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {editing ? (
              <>
                <button onClick={cancelEditing} className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/25 transition-all border border-white/20 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button onClick={handleSave} disabled={loading} className="px-5 py-2 rounded-xl bg-white text-[#4F46E5] font-black text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-white/30 transition-all flex items-center gap-1.5 disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" /> {loading ? "Saving..." : "Save All"}
                </button>
              </>
            ) : (
              <button onClick={startEditing} className="px-5 py-2 rounded-xl bg-white/15 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/25 transition-all border border-white/20 flex items-center gap-1.5 hover:scale-105 active:scale-95">
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-8">
          <div className="flex items-end gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-4xl font-black text-white border-4 border-white shadow-2xl shadow-indigo-500/30 transition-transform group-hover:scale-105">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* Name + Title */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-xl shadow-slate-200/60 border border-white/80 flex-1 mb-2">
              {editing ? (
                <div className="flex gap-3">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className={`${inp} font-bold text-lg`} placeholder="Full Name" />
                  <input value={editJobTitle} onChange={(e) => setEditJobTitle(e.target.value)} className={inp} placeholder="Job Title" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-[#1E293B] leading-tight">{user.name}</h1>
                    <p className="text-sm font-bold text-[#4F46E5]">{user.jobTitle || "Add your job title"}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-medium">Joined {joinDate}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for the overlay */}
      <div className="h-20" />

      {/* ──── MESSAGES ──── */}
      {error && (
        <div className="mb-6 bg-rose-50 text-rose-600 text-sm font-bold px-5 py-3 rounded-2xl border border-rose-200 flex items-center gap-2 animate-fade-up">
          <X className="w-4 h-4" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-emerald-50 text-emerald-600 text-sm font-bold px-5 py-3 rounded-2xl border border-emerald-200 flex items-center gap-2 animate-fade-up">
          <Sparkles className="w-4 h-4" /> {success}
        </div>
      )}
      {/* Contribution Graph */}
      <div className="w-full mb-12 animate-fade-in relative z-10">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
           <div className="flex items-center gap-2 mb-4">
             <Flame className="w-5 h-5 text-emerald-500" />
             <h3 className="text-white font-black text-sm uppercase tracking-wider">DSA Problem Activity</h3>
           </div>
           <ContributionGraph data={graphData} />
        </div>
      </div>

      {/* ──── TWO COLUMN LAYOUT ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">

        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-1 space-y-6">

          {/* Bio Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">About</h3>
            {editing ? (
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={300} rows={4} className={`${inp} resize-none`} placeholder="Tell the world about yourself..." />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">{user.bio || "No bio yet — click Edit Profile to add one!"}</p>
            )}
          </div>

          {/* Social Links Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Links</h3>
            {editing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0077B5]/10 flex items-center justify-center flex-shrink-0"><Linkedin className="w-4 h-4 text-[#0077B5]" /></div>
                  <input value={editLinkedinUrl} onChange={(e) => setEditLinkedinUrl(e.target.value)} className={inp} placeholder="LinkedIn URL" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0"><Github className="w-4 h-4 text-slate-700" /></div>
                  <input value={editGithubUrl} onChange={(e) => setEditGithubUrl(e.target.value)} className={inp} placeholder="GitHub URL" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"><Code className="w-4 h-4 text-emerald-600" /></div>
                  <input value={editCodingPlatformUrl} onChange={(e) => setEditCodingPlatformUrl(e.target.value)} className={inp} placeholder="Coding Platform" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  { url: user.linkedinUrl, icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", color: "text-[#0077B5]", bg: "bg-[#0077B5]/10", hoverBg: "hover:bg-[#0077B5]/20" },
                  { url: user.githubUrl, icon: <Github className="w-4 h-4" />, label: "GitHub", color: "text-slate-700", bg: "bg-slate-100", hoverBg: "hover:bg-slate-200" },
                  { url: user.codingPlatformUrl, icon: <Code className="w-4 h-4" />, label: "Coding", color: "text-emerald-600", bg: "bg-emerald-50", hoverBg: "hover:bg-emerald-100" },
                ].map((link, i) => (
                  link.url ? (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-xl ${link.bg} ${link.hoverBg} transition-all group`}>
                      <span className={link.color}>{link.icon}</span>
                      <span className={`text-xs font-bold ${link.color} truncate flex-1`}>{link.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </a>
                  ) : (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <span className="text-slate-300">{link.icon}</span>
                      <span className="text-xs font-medium text-slate-300 italic">{link.label} — Not added</span>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Skills Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-amber-500" /> Skills
              {!editing && user.skills?.length ? <span className="ml-auto bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">{user.skills.length}</span> : null}
            </h3>
            {editing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className={inp} placeholder="Add skill + Enter" />
                  <button onClick={addSkill} className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-amber-200 transition-all flex-shrink-0 hover:scale-105 active:scale-95">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editSkills.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 text-xs font-bold group hover:border-rose-300 transition-all">
                      {s}
                      <button onClick={() => removeSkill(i)} className="text-amber-300 hover:text-rose-500 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {!editSkills.length && <p className="text-xs text-slate-300 italic">No skills yet</p>}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skills?.length ? user.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 text-xs font-bold hover:scale-105 hover:shadow-sm transition-all cursor-default">{s}</span>
                )) : <p className="text-xs text-slate-300 italic">No skills added yet</p>}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white hover:shadow-xl hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -m-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" />
              <FileText className="w-5 h-5 mb-2 opacity-80" />
              <p className="text-2xl font-black">{user.resumeCount}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">Resumes</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white hover:shadow-xl hover:shadow-blue-200 transition-all hover:-translate-y-0.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -m-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" />
              <Linkedin className="w-5 h-5 mb-2 opacity-80" />
              <p className="text-2xl font-black">{user.linkedinCount}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">LinkedIn</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white hover:shadow-xl hover:shadow-orange-200 transition-all hover:-translate-y-0.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -m-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" />
              <Flame className="w-5 h-5 mb-2 opacity-80" />
              <p className="text-2xl font-black">{dsaStreak}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">Day Streak</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white hover:shadow-xl hover:shadow-emerald-200 transition-all hover:-translate-y-0.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -m-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" />
              <Code2 className="w-5 h-5 mb-2 opacity-80" />
              <p className="text-2xl font-black">{dsaSolved}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">Solved</p>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-200"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}>
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* TAB: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-up">
              {/* Education Preview */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-500" /> Education
                  </h3>
                  <button onClick={() => setActiveTab("education")} className="text-[10px] font-bold text-[#4F46E5] hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {user.education?.length ? (
                  <div className="space-y-3">
                    {user.education.slice(0, 2).map((edu, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 hover:shadow-sm transition-all">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1E293B] truncate">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                          <p className="text-xs text-slate-500 truncate">{edu.institution}</p>
                        </div>
                        {(edu.startYear || edu.endYear) && (
                          <span className="text-[10px] font-medium text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 flex-shrink-0">
                            {edu.startYear} – {edu.endYear || "Present"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-xs text-slate-300 font-medium">No education added yet</p>
                  </div>
                )}
              </div>

              {/* Experience Preview */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-violet-500" /> Experience
                  </h3>
                  <button onClick={() => setActiveTab("experience")} className="text-[10px] font-bold text-[#4F46E5] hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {user.experience?.length ? (
                  <div className="space-y-3">
                    {user.experience.slice(0, 2).map((exp, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-violet-50/50 to-purple-50/50 border border-violet-100/50 hover:shadow-sm transition-all">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-sm">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1E293B] truncate">{exp.role}</p>
                          <p className="text-xs text-slate-500 truncate">{exp.company}</p>
                        </div>
                        {(exp.startDate || exp.endDate) && (
                          <span className="text-[10px] font-medium text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 flex-shrink-0">
                            {exp.startDate} – {exp.endDate || "Present"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-xs text-slate-300 font-medium">No experience added yet</p>
                  </div>
                )}
              </div>

              {/* Profile Strength */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200/40 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Profile Strength</h3>
                </div>
                {(() => {
                  let filled = 0;
                  if (user.name) filled++;
                  if (user.bio) filled++;
                  if (user.jobTitle) filled++;
                  if (user.skills?.length) filled++;
                  if (user.education?.length) filled++;
                  if (user.experience?.length) filled++;
                  if (user.linkedinUrl || user.githubUrl) filled++;
                  const pct = Math.round((filled / 7) * 100);
                  return (
                    <>
                      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-80">
                        <span>{pct}% Complete</span>
                        <span>{filled}/7 Sections</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB: Education (Full) */}
          {activeTab === "education" && (
            <div className="space-y-4 animate-fade-up">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2 mb-5">
                  <GraduationCap className="w-4 h-4 text-blue-500" /> Education
                </h3>
                {editing ? (
                  <div className="space-y-4">
                    {editEducation.map((edu, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 space-y-3 relative group">
                        <button onClick={() => removeEducation(i)} className="absolute top-3 right-3 p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} className={inp} placeholder="Institution *" />
                          <input value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} className={inp} placeholder="Degree *" />
                          <input value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} className={inp} placeholder="Field of Study" />
                          <div className="flex gap-2">
                            <input value={edu.startYear} onChange={(e) => updateEducation(i, "startYear", e.target.value)} className={inp} placeholder="Start" />
                            <input value={edu.endYear} onChange={(e) => updateEducation(i, "endYear", e.target.value)} className={inp} placeholder="End" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={addEducation} className="w-full py-4 rounded-2xl border-2 border-dashed border-blue-200 text-blue-500 font-bold text-xs uppercase tracking-widest hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]">
                      <Plus className="w-4 h-4" /> Add Education
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.education?.length ? user.education.map((edu, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#1E293B]">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">{edu.institution}</p>
                          {(edu.startYear || edu.endYear) && (
                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> {edu.startYear} – {edu.endYear || "Present"}</p>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-300 font-bold">No education added yet</p>
                        <p className="text-xs text-slate-300 mt-1">Click Edit Profile to add your education</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Experience (Full) */}
          {activeTab === "experience" && (
            <div className="space-y-4 animate-fade-up">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2 mb-5">
                  <Building2 className="w-4 h-4 text-violet-500" /> Experience
                </h3>
                {editing ? (
                  <div className="space-y-4">
                    {editExperience.map((exp, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-gradient-to-r from-violet-50/50 to-purple-50/50 border border-violet-100 space-y-3 relative group">
                        <button onClick={() => removeExperience(i)} className="absolute top-3 right-3 p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} className={inp} placeholder="Company *" />
                          <input value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} className={inp} placeholder="Role *" />
                          <input value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} className={inp} placeholder="Start Date" />
                          <input value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} className={inp} placeholder="End Date" />
                        </div>
                        <textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} className={`${inp} resize-none`} rows={2} placeholder="Describe your role..." />
                      </div>
                    ))}
                    <button onClick={addExperience} className="w-full py-4 rounded-2xl border-2 border-dashed border-violet-200 text-violet-500 font-bold text-xs uppercase tracking-widest hover:bg-violet-50 hover:border-violet-400 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]">
                      <Plus className="w-4 h-4" /> Add Experience
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.experience?.length ? user.experience.map((exp, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-50/50 to-purple-50/50 border border-violet-100/50 hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md flex-shrink-0">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#1E293B]">{exp.role}</p>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">{exp.company}</p>
                          {(exp.startDate || exp.endDate) && (
                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.startDate} – {exp.endDate || "Present"}</p>
                          )}
                          {exp.description && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exp.description}</p>}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-300 font-bold">No experience added yet</p>
                        <p className="text-xs text-slate-300 mt-1">Click Edit Profile to add your experience</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Account */}
          {activeTab === "account" && (
            <div className="space-y-6 animate-fade-up">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2 mb-5">
                  <Sparkles className="w-4 h-4 text-[#4F46E5]" /> Account Details
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: <User className="w-4 h-4" />, label: "Name", value: user.name, color: "text-slate-700" },
                    { icon: <Mail className="w-4 h-4" />, label: "Email", value: user.email, color: "text-slate-700" },
                    { icon: <Briefcase className="w-4 h-4" />, label: "Job Title", value: user.jobTitle, color: "text-slate-700" },
                    { icon: <Calendar className="w-4 h-4" />, label: "Member Since", value: joinDate, color: "text-slate-700" },
                    { icon: <Shield className="w-4 h-4" />, label: "Status", value: "Active", color: "text-emerald-600" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-slate-100 hover:bg-slate-50 transition-colors">
                      <span className="text-slate-400">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                        <p className={`text-sm font-bold ${item.value ? item.color : "text-slate-300 italic"}`}>
                          {item.value || "Not added yet"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-4">Danger Zone</h3>
                <button onClick={handleLogout}
                  className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-rose-200 text-rose-400 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-500 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
