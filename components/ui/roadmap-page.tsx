
import React, { useState } from "react";
import { BookOpen, ArrowRight, Code2, Database, BrainCircuit, LineChart, CheckCircle2, TrendingUp } from "lucide-react";


type RoadmapTrack = string;

interface CareerPath {
  id: RoadmapTrack;
  label: string;
  icon: React.ReactNode;
  description: string;
  link: string;
  trending?: boolean;
}

const careerPaths: CareerPath[] = [
  {
    id: 'frontend',
    label: 'Frontend Developer',
    icon: <Code2 className="w-5 h-5" />,
    description: 'Create beautiful, responsive, and interactive user interfaces.',
    link: 'https://roadmap.sh/frontend',
  },
  {
    id: 'backend',
    label: 'Backend Developer',
    icon: <Database className="w-5 h-5" />,
    description: 'Build robust servers, databases, and APIs to power applications.',
    link: 'https://roadmap.sh/backend',
  },
  {
    id: 'fullstack',
    label: 'Full Stack Developer',
    icon: <Code2 className="w-5 h-5" />,
    description: 'Master both frontend and backend development for complete web solutions.',
    link: 'https://roadmap.sh/full-stack',
  },
  {
    id: 'devops',
    label: 'DevOps',
    icon: <BrainCircuit className="w-5 h-5" />,
    description: 'Bridge the gap between development and operations for efficient deployment.',
    link: 'https://roadmap.sh/devops',
  },
  {
    id: 'devsecops',
    label: 'DevSecOps',
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: 'Integrate security practices into the DevOps pipeline.',
    link: 'https://roadmap.sh/devsecops',
    trending: true,
  },
  {
    id: 'data-analyst',
    label: 'Data Analyst',
    icon: <LineChart className="w-5 h-5" />,
    description: 'Interpret complex data to help organizations make better decisions.',
    link: 'https://roadmap.sh/data-analyst',
  },
  {
    id: 'ai-engineer',
    label: 'AI Engineer',
    icon: <BrainCircuit className="w-5 h-5" />,
    description: 'Build intelligent systems using LLMs and Neural Networks.',
    link: 'https://roadmap.sh/ai-engineer',
    trending: true,
  },
  {
    id: 'ai-data-scientist',
    label: 'AI and Data Scientist',
    icon: <LineChart className="w-5 h-5" />,
    description: 'Solve complex problems using advanced mathematics and machine learning.',
    link: 'https://roadmap.sh/ai-data-scientist',
    trending: true,
  },
  {
    id: 'data-engineer',
    label: 'Data Engineer',
    icon: <Database className="w-5 h-5" />,
    description: 'Design and build systems for collecting and analyzing raw data.',
    link: 'https://roadmap.sh/data-engineer',
    trending: true,
  },
  {
    id: 'android',
    label: 'Android Developer',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Develop mobile applications for the Android operating system.',
    link: 'https://roadmap.sh/android',
  },
  {
    id: 'machine-learning',
    label: 'Machine Learning',
    icon: <BrainCircuit className="w-5 h-5" />,
    description: 'Teach computers to learn from data and make predictions.',
    link: 'https://roadmap.sh/mlops',
    trending: true,
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    icon: <Database className="w-5 h-5" />,
    description: 'Master the advanced open-source relational database system.',
    link: 'https://roadmap.sh/postgresql-dba',
  },
  {
    id: 'ios',
    label: 'iOS Developer',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Create apps for Apple\'s iPhone and iPad ecosystems.',
    link: 'https://roadmap.sh/ios',
  },
  {
    id: 'blockchain',
    label: 'Blockchain',
    icon: <Code2 className="w-5 h-5" />,
    description: 'Build decentralized applications and smart contracts.',
    link: 'https://roadmap.sh/blockchain',
  },
  {
    id: 'qa',
    label: 'QA Engineer',
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: 'Ensure software quality through automated and manual testing.',
    link: 'https://roadmap.sh/qa',
  },
  {
    id: 'software-architect',
    label: 'Software Architect',
    icon: <Code2 className="w-5 h-5" />,
    description: 'Design high-level structures for software systems.',
    link: 'https://roadmap.sh/software-architect',
  },
  {
    id: 'cyber-security',
    label: 'Cyber Security',
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: 'Protect systems and networks from digital attacks.',
    link: 'https://roadmap.sh/cyber-security',
    trending: true,
  },
  {
    id: 'ux-design',
    label: 'UX Design',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Design intuitive and enjoyable user experiences.',
    link: 'https://roadmap.sh/ux-design',
  },
  {
    id: 'technical-writer',
    label: 'Technical Writer',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Communicate complex technical information clearly.',
    link: 'https://roadmap.sh/technical-writer',
  },
  {
    id: 'game-developer',
    label: 'Game Developer',
    icon: <Code2 className="w-5 h-5" />,
    description: 'Create interactive video games for various platforms.',
    link: 'https://roadmap.sh/game-developer',
  },
  {
    id: 'server-side-game-dev',
    label: 'Server Side Game Dev',
    icon: <Database className="w-5 h-5" />,
    description: 'Build the backend infrastructure for multiplayer games.',
    link: 'https://roadmap.sh/server-side-game-developer',
  },
  {
    id: 'mlops',
    label: 'MLOps',
    icon: <BrainCircuit className="w-5 h-5" />,
    description: 'Deploy and maintain machine learning models in production.',
    link: 'https://roadmap.sh/mlops',
    trending: true,
  },
  {
    id: 'product-manager',
    label: 'Product Manager',
    icon: <LineChart className="w-5 h-5" />,
    description: 'Guide the success of a product and lead the cross-functional team.',
    link: 'https://roadmap.sh/product-manager',
  },
  {
    id: 'engineering-manager',
    label: 'Engineering Manager',
    icon: <Code2 className="w-5 h-5" />,
    description: 'Manage and lead engineering teams to deliver software.',
    link: 'https://roadmap.sh/engineering-manager',
  },
  {
    id: 'developer-relations',
    label: 'Developer Relations',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Connect with developers and build a community around a product.',
    link: 'https://roadmap.sh/developer-relations',
  },
  {
    id: 'bi-analyst',
    label: 'BI Analyst',
    icon: <LineChart className="w-5 h-5" />,
    description: 'Analyze data to discover trends and share insights.',
    link: 'https://roadmap.sh/data-analyst', // Fallback as specific roadmap might not exist
  }
];

const CareerCard: React.FC<{ path: CareerPath }> = ({ path }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <a
      href={path.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col overflow-hidden rounded-xl border-indigo-200 shadow-indigo-100 ring-1 ring-indigo-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(79, 70, 229, 0.15), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(79, 70, 229, 0.4), transparent 40%)`,
          zIndex: -1,
        }}
      />
      
      {/* Trending Badge */}
      {path.trending && (
        <div className="absolute top-3 right-3 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
            <TrendingUp className="w-3 h-3" />
            Trending 2026
          </span>
        </div>
      )}

      {/* Top Section - Icon Area */}
      <div className={`relative h-40 flex items-center justify-center transition-colors duration-300 ${
        path.trending ? 'bg-indigo-50/50 group-hover:bg-[#EEF2FF]' : 'bg-slate-100 group-hover:bg-[#EEF2FF]'
      }`}>
        <div className={`transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 text-[#4F46E5]`}>
          {React.cloneElement(path.icon as React.ReactElement, {
            className: "w-16 h-16 stroke-[1.5]",
          })}
        </div>
      </div>

      {/* Bottom Section - Content */}
      <div className="relative flex flex-col flex-1 p-6 bg-white transition-colors duration-300 group-hover:bg-[#0F172A]">
        <h3 className="text-xl font-bold mb-2 text-slate-900 transition-colors duration-300 group-hover:text-white">
          {path.label}
        </h3>
        <p className="text-sm mb-6 line-clamp-3 text-slate-500 transition-colors duration-300 flex-1 group-hover:text-slate-400">
          {path.description}
        </p>

        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mt-auto text-slate-900 group-hover:text-[#4F46E5]">
          Explore Path
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  );
};

const RoadmapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase">
            Career Learning Paths
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Step-by-step guides to mastering the most in-demand tech roles of 2026.
          </p>
        </div>

        {/* Card Navigation - REFACTORED DESIGN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-up">
          {careerPaths.map((path) => (
            <CareerCard key={path.id} path={path} />
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <div className="inline-block p-8 bg-[#1E293B] rounded-3xl shadow-xl shadow-slate-200 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
             <div className="relative z-10 text-white">
               <BookOpen className="w-8 h-8 mx-auto mb-4 text-[#4F46E5]" />
               <h4 className="text-2xl font-black mb-2">Ready to Start Learning?</h4>
               <p className="opacity-70 font-medium mb-6 max-w-md">Get a personalized curriculum based on your resume and goals using our AI optimizer.</p>
               <button className="px-8 py-3 bg-[#4F46E5] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#4338ca] transition-colors shadow-lg shadow-indigo-900/50">
                 Analyze My Resume Now
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
