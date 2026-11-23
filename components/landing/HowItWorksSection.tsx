"use client";

import { BookOpen, Cpu, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Meet The Circuit / Fitting",
      desc: "The multimodal Foreman explains core components (battery, switch, bulb, P-trap) using approved ISA course materials in plain, beginner-friendly terms.",
      tag: "Grounding",
    },
    {
      num: "02",
      title: "Build It Virtually",
      desc: "Assemble components on the interactive workbench. Deterministic simulation engines catch gaps, short circuits, or leaking pipe joints instantly.",
      tag: "Deterministic Rules",
    },
    {
      num: "03",
      title: "Progressive AI Hints",
      desc: "If you get stuck, the AI does not just give away the answer. It asks a leading question first, then offers targeted pointers so you do the thinking.",
      tag: "Guided Discovery",
    },
    {
      num: "04",
      title: "Supervised Real Build",
      desc: "Armed with virtual muscle memory, proceed to the physical low-voltage kit. Power remains locked until the instructor reviews your checklist.",
      tag: "Zero-Hazard Gate",
    },
  ];

  return (
    <section className="py-20 bg-workshop-surface/40 border-b border-workshop-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500 mb-2">
              Structured Pedagogy Flow
            </div>
            <h2 className="font-display uppercase text-3xl sm:text-5xl text-chalk tracking-wide">
              How The Workshop Twin Works
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-sm text-chalk-muted font-body max-w-md">
            Built to address Imperial Skills Academy&apos;s exact brief: bridging the gap from total novice to confident, hands-on apprentice.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={s.num} className="workshop-card-riveted p-6 flex flex-col justify-between group hover:border-amber-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-4xl text-amber-500/80 font-bold group-hover:text-amber-400 transition-colors">
                    {s.num}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-workshop bg-workshop-elevated border border-workshop-border text-chalk-faded">
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-heading font-medium text-base text-chalk mb-2 group-hover:text-amber-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-chalk-muted font-body leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-workshop-border flex items-center justify-between text-[11px] font-mono text-chalk-faded">
                <span>Phase {idx + 1} of 4</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500/60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
