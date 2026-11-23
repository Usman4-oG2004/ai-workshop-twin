"use client";

import { ShieldAlert, Cpu, UserCheck, BookOpenCheck } from "lucide-react";

export default function SafetySection() {
  const pillars = [
    {
      title: "Deterministic Safety Rules",
      desc: "AI is never used to judge real-time electrical continuity or hydraulic containment. Fixed rule-based simulation engines validate circuits and pipe connections 100% deterministically.",
      icon: Cpu,
      badge: "Non-Hallucinatory",
    },
    {
      title: "Grounded Course Material",
      desc: "The AI Foreman responds strictly using instructor-approved ISA training handouts. Every technical explanation cites its handbook reference module directly.",
      icon: BookOpenCheck,
      badge: "ISA Grounded",
    },
    {
      title: "Human Instructor Gate",
      desc: "Any dangerous action or inquiry about live mains voltages automatically disables simulation power and routes the question into the instructor review queue.",
      icon: ShieldAlert,
      badge: "Mandatory Supervisor",
    },
    {
      title: "Supervised Low-Voltage Physical Kits",
      desc: "Virtual simulation prepares the student for hands-on kits (12V safe DC). Live bench power remains physically interlocked until the instructor checks the build checklist.",
      icon: UserCheck,
      badge: "Zero-Hazard Pilot",
    },
  ];

  return (
    <section className="py-20 bg-workshop-bg border-b border-workshop-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 md:p-10 border-2 border-amber-500/40 bg-workshop-surface/60 rounded-workshop relative overflow-hidden">
          <div className="hazard-stripe absolute top-0 left-0 right-0 h-2" />

          <div className="max-w-2xl mb-12">
            <div className="work-order-tag bg-amber-500/10 border-amber-500 text-amber-400 mb-3">
              <span>SAFETY GOVERNANCE PROTOCOL</span>
            </div>
            <h2 className="font-display uppercase text-3xl sm:text-5xl text-chalk tracking-wide">
              Accuracy &amp; Safety by Design
            </h2>
            <p className="mt-3 text-sm text-chalk-muted font-body leading-relaxed">
              Vocational skilled trades cannot tolerate AI hallucinations. Here is how Imperial Skills Academy maintains complete pedagogical safety and regulatory rigor:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="p-5 bg-workshop-bg border border-workshop-border rounded-workshop">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-workshop bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-workshop bg-workshop-surface border border-workshop-border text-amber-400">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-medium text-sm text-chalk mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-chalk-muted font-body leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
