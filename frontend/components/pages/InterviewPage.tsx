import React, { useState, useRef, useEffect, useCallback } from "react";
import { FileUpload } from "../FileUpload";
import { generateInterviewQuestions, evaluateAnswer } from "../../geminiService";
import {
  InterviewQuestion,
  InterviewMessage,
  InterviewFeedback,
} from "../../types";
import {
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Star,
  Volume2,
  VolumeX,
  Zap,
  MessageSquare,
  Award,
  Target,
  Pause,
} from "lucide-react";

type InterviewPhase = "setup" | "interviewing" | "complete";

// Speech Recognition type for TypeScript
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

const InterviewPage: React.FC = () => {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [canAnswer, setCanAnswer] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimTranscript]);

  // Initialize Speech Synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Text-to-Speech: AI speaks the question
  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a natural-sounding voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes("Google") || v.name.includes("Microsoft") || v.name.includes("Samantha")
    ) || voices.find((v) => v.lang.startsWith("en"));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };

    synthRef.current.speak(utterance);
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  // Speech-to-Text: Start recording
  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    stopSpeaking();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let fullTranscript = transcript;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        fullTranscript += final;
        setTranscript(fullTranscript);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [transcript, stopSpeaking]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimTranscript("");
  }, []);

  // Ask a question (speak it + add to messages)
  const askQuestion = useCallback((question: InterviewQuestion, isFirst: boolean) => {
    const introText = isFirst
      ? `Welcome! I'm your AI interviewer today. I'll be asking you ${questions.length || 5} questions for the ${jobRole} position. Let's begin with the first question. `
      : "";

    const messageContent = question.question;
    const speakContent = introText + messageContent;

    if (isFirst) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "interviewer" as const,
          content: `Welcome! I'll be asking you questions for the **${jobRole}** position. Let's begin!`,
          timestamp: new Date(),
        },
      ]);
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "interviewer" as const,
          content: messageContent,
          question,
          timestamp: new Date(),
        },
      ]);

      // Speak the question, then enable mic
      speakText(speakContent, () => {
        setCanAnswer(true);
      });
    }, isFirst ? 500 : 0);
  }, [jobRole, questions.length, speakText]);

  // Start interview
  const handleStartInterview = async () => {
    if (!resumeFile || !jobRole) {
      setError("Please upload your resume and enter a target role.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const base64 = await fileToBase64(resumeFile);
      const qs = await generateInterviewQuestions(base64, jobRole);
      setQuestions(qs);
      setPhase("interviewing");
      setCurrentQuestionIndex(0);
      setMessages([]);
      setTranscript("");

      // Ask the first question after a short delay
      setTimeout(() => askQuestion(qs[0], true), 300);
    } catch (err: any) {
      setError(err.message || "Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  // Submit the recorded answer
  const handleSubmitAnswer = async () => {
    if (!transcript.trim() || evaluating) return;

    stopRecording();
    setCanAnswer(false);

    const currentQ = questions[currentQuestionIndex];
    const userAnswer = transcript.trim();
    setTranscript("");

    // Add user answer to chat
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "candidate" as const,
        content: userAnswer,
        timestamp: new Date(),
      },
    ]);
    setEvaluating(true);

    try {
      const feedback = await evaluateAnswer(
        currentQ.question,
        currentQ.category,
        userAnswer
      );

      setScores((prev) => [...prev, feedback.score]);

      // Add feedback message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "interviewer" as const,
          content: "",
          feedback,
          timestamp: new Date(),
        },
      ]);

      // Speak the feedback summary
      const feedbackSpeak = `You scored ${feedback.score} out of 10. ${feedback.strengths[0]}. To improve: ${feedback.improvements[0]}.`;

      const nextIndex = currentQuestionIndex + 1;

      speakText(feedbackSpeak, () => {
        if (nextIndex < questions.length) {
          setCurrentQuestionIndex(nextIndex);
          setTimeout(() => askQuestion(questions[nextIndex], false), 800);
        } else {
          setPhase("complete");
        }
      });
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "interviewer" as const,
          content: "Sorry, I had trouble evaluating that. Please try again.",
          timestamp: new Date(),
        },
      ]);
      setCanAnswer(true);
    } finally {
      setEvaluating(false);
    }
  };

  const handleRestart = () => {
    stopSpeaking();
    stopRecording();
    setPhase("setup");
    setQuestions([]);
    setMessages([]);
    setScores([]);
    setCurrentQuestionIndex(0);
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    setCanAnswer(false);
  };

  const averageScore = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : "0";

  const getDifficultyColor = (d: string) => {
    if (d === "Easy") return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (d === "Medium") return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getCategoryIcon = (c: string) => {
    if (c === "Technical") return <Zap className="w-3 h-3" />;
    if (c === "Behavioral") return <MessageSquare className="w-3 h-3" />;
    if (c === "Culture Fit") return <Award className="w-3 h-3" />;
    return <Target className="w-3 h-3" />;
  };

  // ========= SETUP PHASE =========
  if (phase === "setup") {
    return (
      <div className="max-w-3xl mx-auto opacity-0 animate-fade-up px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-5 shadow-lg shadow-emerald-200">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
            AI Voice Interview
          </h2>
          <p className="text-slate-400 mt-3 text-sm font-medium max-w-md mx-auto">
            Upload your resume and I'll conduct a voice-based mock interview.
            I'll speak the questions and you answer with your microphone!
          </p>
        </div>

        <div className="bg-white p-1 rounded-lg">
          <div className="p-6 sm:p-8 md:p-12 space-y-8">
            <FileUpload
              label="Upload Resume (PDF)"
              id="interview-resume-up"
              onFileSelect={(f) => setResumeFile(f)}
              selectedFile={resumeFile}
            />

            <div className="flex flex-col gap-3 group">
              <label className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-emerald-600">
                Target Job Role
              </label>
              <input
                id="interview-job-role"
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Frontend Developer at Google"
                className="w-full px-4 sm:px-7 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-[#f8f9fa] text-slate-800 border-2 border-slate-100 focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-base sm:text-lg placeholder:text-slate-400 shadow-sm tracking-wide"
              />
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <Volume2 className="w-4 h-4" />, text: "AI Speaks Questions", sub: "Listen naturally" },
                { icon: <Mic className="w-4 h-4" />, text: "Voice Answers", sub: "Speak your response" },
                { icon: <Star className="w-4 h-4" />, text: "Instant Feedback", sub: "Score + spoken review" },
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 mb-2">
                    {f.icon}
                  </div>
                  <p className="text-xs font-black text-[#1E293B] uppercase tracking-wide">{f.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="p-6 rounded-[1.5rem] border-2 border-emerald-200 bg-white transition-all hover:border-emerald-400">
                <button
                  id="start-interview-btn"
                  disabled={loading || !resumeFile || !jobRole}
                  onClick={handleStartInterview}
                  className={`w-full py-6 rounded-xl font-black text-xl flex justify-center items-center gap-3 transition-all duration-500 active:scale-[0.98] ${
                    loading
                      ? "bg-slate-800 text-white cursor-wait"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/50 shimmer"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Preparing Interview...
                    </span>
                  ) : (
                    <>
                      <Play className="w-5 h-5" /> Start Voice Interview
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
      </div>
    );
  }

  // ========= INTERVIEW + COMPLETE PHASE =========
  return (
    <div className="max-w-3xl mx-auto px-4 opacity-0 animate-fade-up">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSpeaking ? "bg-gradient-to-br from-emerald-400 to-teal-500 animate-pulse" : "bg-gradient-to-br from-emerald-500 to-teal-600"}`}>
            {isSpeaking ? <Volume2 className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wide">
              AI Interview — {jobRole}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Question {Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}
              {isSpeaking && " • 🔊 Speaking..."}
              {isRecording && " • 🎙️ Listening..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {scores.length > 0 && (
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Score</p>
              <p className="text-lg font-black text-emerald-600">{averageScore}/10</p>
            </div>
          )}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2.5 rounded-xl border-2 border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all hover:scale-105"
              title="Skip speech"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleRestart}
            className="p-2.5 rounded-xl border-2 border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
          style={{
            width: `${((phase === "complete" ? questions.length : currentQuestionIndex) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="h-[50vh] overflow-y-auto p-5 space-y-4" id="chat-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "candidate" ? "flex-row-reverse" : ""} animate-fade-up`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === "interviewer"
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                    : "bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]"
                }`}
              >
                {msg.role === "interviewer" ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] ${msg.role === "candidate" ? "text-right" : ""}`}>
                {/* Question Badge */}
                {msg.question && (
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border inline-flex items-center gap-1 ${getDifficultyColor(msg.question.difficulty)}`}>
                      {msg.question.difficulty}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 inline-flex items-center gap-1">
                      {getCategoryIcon(msg.question.category)} {msg.question.category}
                    </span>
                  </div>
                )}

                {/* Feedback Card */}
                {msg.feedback ? (
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-black ${msg.feedback.score >= 7 ? "text-emerald-600" : msg.feedback.score >= 4 ? "text-amber-500" : "text-rose-500"}`}>
                        {msg.feedback.score}/10
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            msg.feedback.score >= 7 ? "bg-emerald-500" : msg.feedback.score >= 4 ? "bg-amber-400" : "bg-rose-400"
                          }`}
                          style={{ width: `${msg.feedback.score * 10}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Strengths
                      </p>
                      {msg.feedback.strengths.map((s, i) => (
                        <p key={i} className="text-xs text-slate-600 ml-4">• {s}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> To Improve
                      </p>
                      {msg.feedback.improvements.map((s, i) => (
                        <p key={i} className="text-xs text-slate-600 ml-4">• {s}</p>
                      ))}
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                      <p className="text-[9px] font-black text-[#4F46E5] uppercase tracking-widest mb-1">
                        💡 Sample Answer
                      </p>
                      <p className="text-xs text-slate-600 italic">{msg.feedback.sampleAnswer}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                      msg.role === "interviewer"
                        ? "bg-slate-50 text-slate-700 border border-slate-100"
                        : "bg-[#4F46E5] text-white"
                    }`}
                  >
                    {msg.role === "candidate" && (
                      <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest flex items-center gap-1 mb-1 justify-end">
                        <Mic className="w-2.5 h-2.5" /> Voice answer
                      </span>
                    )}
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Live transcription preview */}
          {(isRecording || transcript || interimTranscript) && canAnswer && (
            <div className="flex gap-3 flex-row-reverse animate-fade-up">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[80%] text-right">
                <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-indigo-50 text-slate-600 border-2 border-dashed border-indigo-200">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1 mb-1 justify-end">
                    {isRecording ? (
                      <><span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" /> Recording...</>
                    ) : (
                      "Your answer"
                    )}
                  </span>
                  {transcript}
                  <span className="text-slate-400 italic">{interimTranscript}</span>
                  {!transcript && !interimTranscript && isRecording && (
                    <span className="text-slate-400 italic">Listening...</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {evaluating && (
            <div className="flex gap-3 animate-fade-up">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-50 rounded-2xl px-5 py-3 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Evaluating your answer...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Voice Control Area */}
        {phase === "interviewing" && (
          <div className="border-t border-slate-100 p-6">
            <div className="flex items-center justify-center gap-4">
              {/* Record / Stop Button */}
              {canAnswer && !evaluating && (
                <>
                  {!isRecording ? (
                    <button
                      id="start-recording-btn"
                      onClick={startRecording}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-rose-200/50 hover:scale-110 active:scale-95 transition-all"
                      title="Start speaking"
                    >
                      <Mic className="w-7 h-7" />
                    </button>
                  ) : (
                    <button
                      id="stop-recording-btn"
                      onClick={stopRecording}
                      className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-200/50 animate-pulse hover:scale-110 active:scale-95 transition-all relative"
                      title="Stop recording"
                    >
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-30" />
                      <MicOff className="w-7 h-7" />
                    </button>
                  )}

                  {/* Submit Answer Button */}
                  {transcript.trim() && (
                    <button
                      id="submit-answer-btn"
                      onClick={handleSubmitAnswer}
                      disabled={evaluating}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-200/50 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" /> Submit Answer
                    </button>
                  )}
                </>
              )}

              {/* Speaking indicator */}
              {isSpeaking && (
                <div className="flex items-center gap-3 text-emerald-600">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-emerald-500 rounded-full animate-pulse"
                        style={{
                          height: `${12 + Math.random() * 20}px`,
                          animationDelay: `${i * 100}ms`,
                          animationDuration: "0.5s",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">AI is speaking...</span>
                  <button
                    onClick={() => { stopSpeaking(); setCanAnswer(true); }}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 underline"
                  >
                    Skip
                  </button>
                </div>
              )}

              {/* Waiting for evaluation */}
              {evaluating && (
                <span className="text-xs font-medium text-slate-400">Analyzing your response...</span>
              )}
            </div>

            {/* Help text */}
            {canAnswer && !isRecording && !transcript && (
              <p className="text-center text-[10px] text-slate-300 mt-3 font-medium">
                Click the microphone to start speaking your answer
              </p>
            )}
          </div>
        )}

        {/* Complete Summary */}
        {phase === "complete" && (
          <div className="border-t border-slate-100 p-6 text-center space-y-4 bg-gradient-to-b from-white to-emerald-50/30">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black text-[#1E293B] uppercase tracking-wide">
              Interview Complete!
            </h3>
            <div className="flex items-center justify-center gap-6">
              <div>
                <p className="text-3xl font-black text-emerald-600">{averageScore}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Score</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-3xl font-black text-[#1E293B]">{questions.length}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Questions</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-3xl font-black text-[#4F46E5]">{scores.filter((s) => s >= 7).length}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Strong Answers</p>
              </div>
            </div>
            <button
              onClick={handleRestart}
              className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-200/50 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
