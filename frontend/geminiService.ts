
import OpenAI from "openai";
import { AnalysisResult, LinkedInAnalysisResult, ExperienceLevel, InterviewQuestion, InterviewFeedback } from "./types";

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

const INTERVIEW_QUESTIONS_PROMPT = (jobRole: string) => `
You are an expert technical interviewer conducting a mock interview for the role: "${jobRole}".
Based on the uploaded resume PDF, generate 5 interview questions that are personalized to the candidate's background and the target role.

Mix the questions across these categories:
- Technical (role-specific knowledge)
- Behavioral (STAR method situations)
- Situational (hypothetical scenarios)
- Culture Fit (values and motivation)

Return a JSON array of objects:
[
  { "id": 1, "question": "...", "category": "Technical", "difficulty": "Medium" },
  ...
]

Make the questions specific to the candidate's resume — reference their projects, skills, or experience directly.
`;

const EVALUATE_ANSWER_PROMPT = (question: string, category: string) => `
You are an expert interviewer evaluating a candidate's answer to a mock interview question.

Question: "${question}"
Category: ${category}

Evaluate the candidate's answer below and return a JSON object:
{
  "score": (1-10 rating),
  "strengths": ["what they did well" (2-3 points)],
  "improvements": ["what they could improve" (2-3 points)],
  "sampleAnswer": "A brief ideal answer for comparison (2-3 sentences)"
}

Be encouraging but honest. Focus on structure (STAR method for behavioral), depth, and relevance.
`;

const cleanJson = (text: string): string => {
  return text.replace(/```json\n?|\n?```/g, "").trim();
}

const VISION_MODELS = [
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-4-scout:free",
];

const TEXT_MODELS = [
  "openai/gpt-oss-120b:free",
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-4-scout:free",
];

const getClient = () => new OpenAI({
  apiKey: (import.meta.env as any).VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "",
    "X-Title": "Optimizer AI",
  }
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callWithRetry(params: any, models: string[], maxRetries = 3): Promise<string> {
  const client = getClient();

  for (let modelIdx = 0; modelIdx < models.length; modelIdx++) {
    const model = models[modelIdx];
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await client.chat.completions.create({
          ...params,
          model,
        });

        if (!response.choices || response.choices.length === 0) {
          throw new Error("API returned no choices. Please try again.");
        }

        const textContent = response.choices[0]?.message?.content;
        if (textContent) return textContent;
        throw new Error("Empty response from API");
      } catch (err: any) {
        const is429 = err?.status === 429 || err?.message?.includes("429");
        const is404 = err?.status === 404 || err?.message?.includes("404");
        if ((is429 || is404) && attempt < maxRetries - 1 && !is404) {
          console.warn(`Rate limited on ${model}, retrying in ${(attempt + 1) * 2}s...`);
          await sleep((attempt + 1) * 2000);
          continue;
        }
        if ((is429 || is404) && modelIdx < models.length - 1) {
          console.warn(`Switching from ${model} to ${models[modelIdx + 1]}`);
          break;
        }
        throw err;
      }
    }
  }
  throw new Error("All models failed. Please wait a moment and try again.");
}

export async function analyzeResume(
  resumeBase64: string,
  jobRole: string,
  expLevel: ExperienceLevel
): Promise<AnalysisResult> {
  const text = await callWithRetry({
    messages: [{
      role: "user",
      content: [
        { type: "text", text: RESUME_PROMPT(jobRole, expLevel) },
        { type: "image_url", image_url: { url: `data:application/pdf;base64,${resumeBase64}`, detail: "high" } }
      ]
    }],
    temperature: 1
  }, VISION_MODELS);
  try { return JSON.parse(cleanJson(text)); }
  catch (e) { console.error("JSON Parse Error:", e, text); throw new Error("Failed to parse resume analysis result"); }
}

export async function analyzeLinkedIn(
  resumeBase64: string,
  linkedinBase64: string,
  jobRole: string
): Promise<LinkedInAnalysisResult> {
  const text = await callWithRetry({
    messages: [{
      role: "user",
      content: [
        { type: "text", text: LINKEDIN_PROMPT(jobRole) },
        { type: "image_url", image_url: { url: `data:application/pdf;base64,${resumeBase64}`, detail: "high" } },
        { type: "image_url", image_url: { url: `data:application/pdf;base64,${linkedinBase64}`, detail: "high" } }
      ]
    }],
    temperature: 1
  }, VISION_MODELS);
  try { return JSON.parse(cleanJson(text)); }
  catch (e) { console.error("JSON Parse Error:", e, text); throw new Error("Failed to parse LinkedIn analysis result"); }
}

export async function generateInterviewQuestions(
  resumeBase64: string,
  jobRole: string
): Promise<InterviewQuestion[]> {
  const text = await callWithRetry({
    messages: [{
      role: "user",
      content: [
        { type: "text", text: INTERVIEW_QUESTIONS_PROMPT(jobRole) },
        { type: "image_url", image_url: { url: `data:application/pdf;base64,${resumeBase64}`, detail: "high" } }
      ]
    }],
    temperature: 0.8
  }, VISION_MODELS);
  try { return JSON.parse(cleanJson(text)); }
  catch (e) { console.error("JSON Parse Error:", e, text); throw new Error("Failed to parse interview questions"); }
}

export async function evaluateAnswer(
  question: string,
  category: string,
  answer: string
): Promise<InterviewFeedback> {
  const text = await callWithRetry({
    messages: [
      { role: "system", content: EVALUATE_ANSWER_PROMPT(question, category) },
      { role: "user", content: answer }
    ],
    temperature: 0.7
  }, TEXT_MODELS);
  try { return JSON.parse(cleanJson(text)); }
  catch (e) { console.error("JSON Parse Error:", e, text); throw new Error("Failed to parse interview feedback"); }
}
