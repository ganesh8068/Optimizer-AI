
"use client"

import React from "react"
import { Button } from "./button"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface AboutPageProps {
  achievements?: Array<{ label: string; value: string }>
}

const defaultAchievements = [
  { label: "Profiles Optimized", value: "10,000+" },
  { label: "Career Success Stories", value: "2,500+" },
  { label: "AI Accuracy Rate", value: "99.8%" },
  { label: "Recruiters Reached", value: "500+" },
]

export default function AboutPage({
  achievements = defaultAchievements,
}: AboutPageProps) {
  return (
    <div className="flex flex-col opacity-0 animate-fade-up">

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl space-y-12 px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl">
            <img
              className="object-cover w-full h-[300px] md:h-[500px]"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              alt="Team collaborating on career tech"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 md:p-12">
              <p className="text-white text-lg font-bold tracking-wide uppercase">Our Vision for 2025</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-16 items-start">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              The Optimizer <span className="text-[#4F46E5]">ecosystem</span>{" "}
              <span className="text-slate-400">
                redefining how the world finds work.
              </span>
            </h1>
            <div className="space-y-8 text-slate-600">
              <p className="text-lg leading-relaxed font-medium">
                Optimizer AI is more than just a tool. We are building an intelligent career layer that connects individual talent to global opportunities through the power of Gemini 3.
              </p>
              <Button
                variant="outline"
                className="h-14 px-8 rounded-2xl text-slate-900 border-2 border-slate-100 hover:border-[#4F46E5] transition-all gap-2 font-bold"
                onClick={() => window.open('https://google.com', '_blank')}
              >
                <span>Read our Methodology</span>
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS SECTION ---------------- */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {achievements.map((item, idx) => (
               <div key={idx} className="text-center space-y-2">
                 <p className="text-3xl md:text-4xl font-black text-[#4F46E5]">{item.value}</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* ---------------- MISSION SECTION ---------------- */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl space-y-16 px-6">

          <div className="grid gap-8 text-center md:grid-cols-2 md:gap-16 md:text-left items-center">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
              Our Mission
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              We are a team of engineers and recruiters dedicated to leveling the playing field. In a world of automated screening, we give the power back to the candidates.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mt-16">
            
            {/* LEFT BIG IMAGE */}
            <div className="md:flex-1 relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                alt="Tech innovation"
                className="rounded-[2rem] object-cover w-full h-[400px] md:h-full shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-indigo-600/10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* RIGHT TWO CARDS */}
            <div className="flex flex-col gap-8 md:flex-1">
              {/* FIRST CARD */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-2xl"
              >
                <div className="relative h-48 md:h-56 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    alt="Network"
                    className="h-full w-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black italic tracking-tight">Accelerate Growth</h3>
                  <p className="mt-3 text-slate-400 font-medium leading-relaxed">
                    Our semantic analysis identifies exactly where your profile falls short, helping you bridge the gap in record time.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 border-white/20 text-white hover:bg-white hover:text-slate-900 rounded-xl font-bold"
                  >
                    View Roadmap
                  </Button>
                </div>
              </motion.div>

              {/* SECOND CARD */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative overflow-hidden rounded-[2rem] bg-[#0077B5] shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
                  alt="Career success"
                  className="h-full w-full object-cover min-h-[250px] opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end text-white">
                  <h3 className="text-2xl font-black italic tracking-tight">Identity First</h3>
                  <p className="mt-3 text-slate-100 font-medium leading-relaxed">
                    We don't just fix resumes; we build professional brands that recruiters can't ignore.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
