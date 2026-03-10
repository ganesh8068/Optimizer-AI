
export enum ExperienceLevel {
  STUDENT = 'Student / Entry Level',
  MID_LEVEL = 'Mid-Level Professional',
  SENIOR = 'Senior / Executive'
}

export interface AnalysisResult {
  scores: {
    resume: number;
    atsCompatibility: number;
    readability: number;
  };
  resumeAnalysis: {
    feedback: string[];
    rewrittenContent: string;
    starBullets: string[];
  };
  suggestedKeywords: string[];
  roleGaps: string[];
}

export interface LinkedInAnalysisResult {
  headline: string;
  about: string;
  experienceOptimizations: {
    title: string;
    description: string;
  }[];
  skills: string[];
  networkingAdvice: string;
}

export interface UploadedFiles {
  resume: File | null;
  linkedinProfile: File | null;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
}

export interface InterviewMessage {
  id: number;
  role: 'interviewer' | 'candidate';
  content: string;
  feedback?: InterviewFeedback;
  question?: InterviewQuestion;
  timestamp: Date;
}

export type AppView = 'home' | 'dashboard' | 'resume' | 'linkedin' | 'about' | 'roadmap' | 'login' | 'signup' | 'profile' | 'interview' | 'dsa-sheet';
