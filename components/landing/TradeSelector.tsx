"use client";

import Link from "next/link";
import { Zap, Wrench, ArrowRight, ShieldCheck, Check } from "lucide-react";

export default function TradeSelector() {
  const trades = [
    {
      id: "electrical",
      title: "Electrical Bench",
      subtitle: "Low Voltage DC & AC Circuitry",
      accent: "amber",
      icon: Zap,
      href: "/workshop/electrical",
      desc: "Learn current loops, switches, incandescent loads, resistors, and fuses. Experiment with short-circuit thermal protections safely.",
      curriculum: [
        "Your First Circuit: Switch & Load Mechanics",
        "Fault Finder: Diagnosing Blown Fuses",
        "Two-Way Switching: Staircase & Hallway Logic",
      ],
      badge: "12V Supervised DC",
      buttonClass: "btn-workshop",
    },
    {
      id: "plumbing",
      title: "Plumbing Bench",
      subtitle: "Pipe Assembly, Traps & Hydraulics",
      accent: "arc",
      icon: Wrench,
      href: "/workshop/plumbing",
      desc: "Master pipe sizing, compression elbows, tee joints, fixture valves, and sewer-gas water seal P-traps with instant hydrostatic leak detection.",
      curriculum: [
        "Pipe Run Assembly: Couplings & 90° Direction Changes",
        "P-Trap Installation & Sewer Gas Containment",
        "Flow Distribution: Sizing Branch Tees & Isolation Valves",
      ],
      badge: "WRAS Aligned",
      buttonClass: "btn-arc",
    },
  ];

  return (
    <section className="py-20 bg-workshop-bg border-b border-workshop-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-chalk-faded mb-2">
            Dual Skilled Trade Tracks
          </div>
          <h2 className="font-display uppercase text-4xl sm:text-5xl text-chalk tracking-wide">
            Choose Your Workshop Lab
          </h2>
          <p className="mt-3 text-sm text-chalk-muted font-body">
            Beginners can explore both disciplines to discover genuine vocational affinity before committing to formal qualifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {trades.map((t) => {
            const Icon = t.icon;
            const isAmber = t.accent === "amber";

            return (
              <div
                key={t.id}
                className={`workshop-card-riveted p-8 relative flex flex-col justify-between group hover:border-${t.accent}-500 transition-all`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-workshop flex items-center justify-center border ${
                          isAmber
                            ? "bg-amber-500/10 border-amber-500/40 text-amber-400 group-hover:bg-amber-500/20"
                            : "bg-arc-500/10 border-arc-500/40 text-arc-400 group-hover:bg-arc-500/20"
                        } transition-colors`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl uppercase tracking-wider text-chalk">
                          {t.title}
                        </h3>
                        <div className="text-xs font-mono text-chalk-faded">{t.subtitle}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-1 rounded-workshop border ${
                        isAmber
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-arc-500/10 text-arc-400 border-arc-500/30"
                      }`}
                    >
                      {t.badge}
                    </span>
                  </div>

                  <p className="text-sm text-chalk-muted font-body mb-6 leading-relaxed">
                    {t.desc}
                  </p>

                  {/* Modules checklist */}
                  <div className="space-y-2 mb-8">
                    <div className="text-xs font-mono uppercase tracking-wider text-chalk-faded">
                      Core Apprentice Modules:
                    </div>
                    {t.curriculum.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-mono text-chalk">
                        <Check className={`w-3.5 h-3.5 ${isAmber ? "text-amber-400" : "text-arc-400"}`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href={t.href} className={`${t.buttonClass} w-full flex items-center justify-center gap-2 text-xs py-3.5`}>
                  <span>Enter {t.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
