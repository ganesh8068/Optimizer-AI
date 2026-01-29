
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

export type AppView = 'home' | 'resume' | 'linkedin' | 'about' | 'roadmap';
