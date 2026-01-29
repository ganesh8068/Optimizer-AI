
import OpenAI from "openai";
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

const cleanJson = (text: string): string => {
  return text.replace(/```json\n?|\n?```/g, "").trim();
}

export async function analyzeResume(
  resumeBase64: string,
  jobRole: string,
  expLevel: ExperienceLevel
): Promise<AnalysisResult> {
  const client = new OpenAI({
    apiKey: (import.meta.env as any).VITE_OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "",
      "X-Title": "Optimizer AI",
    }
  });

  const response = await client.chat.completions.create({
    model: "google/gemma-3-12b-it:free",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: RESUME_PROMPT(jobRole, expLevel)
          },
          {
            type: "image_url",
            image_url: {
              url: `data:application/pdf;base64,${resumeBase64}`,
              detail: "high"
            }
          }
        ]
      }
    ],
    temperature: 1
  });

   console.log("OpenAI API Response:", JSON.stringify(response, null, 2));

  if (!response.choices || response.choices.length === 0) {
    throw new Error("API returned no choices. Please try again.");
  }

  const textContent = response.choices[0]?.message?.content;
  if (textContent) {
    try {
      return JSON.parse(cleanJson(textContent));
    } catch (e) {
      console.error("JSON Parse Error:", e, textContent);
      throw new Error("Failed to parse resume analysis result");
    }
  }
  throw new Error("Failed to generate resume analysis");
}

export async function analyzeLinkedIn(
  resumeBase64: string,
  linkedinBase64: string,
  jobRole: string
): Promise<LinkedInAnalysisResult> {
  const client = new OpenAI({
    apiKey: (import.meta.env as any).VITE_OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "",
      "X-Title": "Optimizer AI",
    }
  });

  const response = await client.chat.completions.create({
    model: "google/gemma-3-12b-it:free",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: LINKEDIN_PROMPT(jobRole)
          },
          {
            type: "image_url",
            image_url: {
              url: `data:application/pdf;base64,${resumeBase64}`,
              detail: "high"
            }
          },
          {
            type: "image_url",
            image_url: {
              url: `data:application/pdf;base64,${linkedinBase64}`,
              detail: "high"
            }
          }
        ]
      }
    ],
    temperature: 1
  });

  console.log("OpenAI API Response:", JSON.stringify(response, null, 2));

  if (!response.choices || response.choices.length === 0) {
    throw new Error("API returned no choices. Please try again.");
  }

  const textContent = response.choices[0]?.message?.content;
  if (textContent) {
    try {
      return JSON.parse(cleanJson(textContent));
    } catch (e) {
      console.error("JSON Parse Error:", e, textContent);
      throw new Error("Failed to parse LinkedIn analysis result");
    }
  }
  throw new Error("Failed to generate LinkedIn analysis");
}
