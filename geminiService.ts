
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, LinkedInAnalysisResult, ExperienceLevel } from "./types";

const RESUME_PROMPT = (jobRole: string, expLevel: string) => `
You are a world-class professional resume writer and recruiter. 
Analyze the uploaded Resume PDF to optimize it for the target role: "${jobRole}" at the "${expLevel}" experience level.

Return a JSON object:
- scores: { resume: number, atsCompatibility: number, readability: number }
- resumeAnalysis: { feedback: string[], rewrittenContent: string (Markdown), starBullets: string[] (STAR method) }
- suggestedKeywords: string[]
- roleGaps: string[]
`;

const LINKEDIN_PROMPT = (jobRole: string) => `
You are a personal branding expert specialized in LinkedIn profiles. 
I have uploaded TWO documents:
1. A Resume (the primary source of truth for achievements and facts).
2. A Current LinkedIn Profile Export (the target for optimization).

Your task is to analyze BOTH and transform the profile into a high-impact LinkedIn identity for a "${jobRole}" role. 
Ensure you bridge any gaps found in the LinkedIn profile based on the data in the resume.

The output must be JSON with:
- headline: (A punchy, keyword-rich headline under 220 chars)
- about: (A compelling first-person professional summary that expands on the resume achievements for a social audience)
- experienceOptimizations: (Array of {title: string, description: string} optimized for LinkedIn engagement, using information from the resume that might be missing from the current profile)
- skills: (Top 15 skills to list)
- networkingAdvice: (Short advice on how to bridge the gap between their current brand and the target identity)
`;

export async function analyzeResume(
  resumeBase64: string,
  jobRole: string,
  expLevel: ExperienceLevel
): Promise<AnalysisResult> {
  // Use gemini-1.5-flash for complex reasoning tasks like resume optimization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'application/pdf', data: resumeBase64 } },
        { text: RESUME_PROMPT(jobRole, expLevel) }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.OBJECT,
            properties: {
              resume: { type: Type.NUMBER },
              atsCompatibility: { type: Type.NUMBER },
              readability: { type: Type.NUMBER }
            },
            required: ['resume', 'atsCompatibility', 'readability']
          },
          resumeAnalysis: {
            type: Type.OBJECT,
            properties: {
              feedback: { type: Type.ARRAY, items: { type: Type.STRING } },
              rewrittenContent: { type: Type.STRING },
              starBullets: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['feedback', 'rewrittenContent', 'starBullets']
          },
          suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          roleGaps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['scores', 'resumeAnalysis', 'suggestedKeywords', 'roleGaps']
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function analyzeLinkedIn(
  resumeBase64: string,
  linkedinBase64: string,
  jobRole: string
): Promise<LinkedInAnalysisResult> {
  // Use gemini-1.5-flash for complex branding and multi-file analysis tasks
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'application/pdf', data: resumeBase64 } },
        { inlineData: { mimeType: 'application/pdf', data: linkedinBase64 } },
        { text: LINKEDIN_PROMPT(jobRole) }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          about: { type: Type.STRING },
          experienceOptimizations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ['title', 'description']
            }
          },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          networkingAdvice: { type: Type.STRING }
        },
        required: ['headline', 'about', 'experienceOptimizations', 'skills', 'networkingAdvice']
      }
    }
  });
  return JSON.parse(response.text || "{}");
}
