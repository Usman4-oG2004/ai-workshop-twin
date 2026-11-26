"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function InstructorSection() {
  return (
    <section className="py-16 bg-paper-hi border-b border-workshop-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faded">
              03 &mdash; INSTRUCTOR OBSERVATION MODEL
            </div>
            <h2 className="font-serif text-3xl font-semibold text-ink leading-tight">
              Factual workshop observations. Never premature aptitude labels.
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              A beginner seeing a consumer unit or compression fitting for the first time should never be ranked or labeled as a &quot;good&quot; or &quot;poor&quot; fit. The system logs objective, timestamped actions so instructors can coach technique directly.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 bg-paper border border-workshop-border rounded-workshop text-xs">
                <div className="font-mono text-[10px] text-safety-green uppercase mb-1">Recorded Evidence</div>
                <div className="font-medium text-ink">&quot;Verified dead circuit with GS38 voltage indicator before opening switch plate.&quot;</div>
              </div>
              <div className="p-3.5 bg-paper border border-workshop-border rounded-workshop text-xs">
                <div className="font-mono text-[10px] text-trade-electrical uppercase mb-1">Coaching Cue</div>
                <div className="font-medium text-ink">&quot;Replaced both the 6A MCB and lamp simultaneously during fault isolation.&quot;</div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/instructor" className="btn-workshop-secondary py-2.5 px-5 inline-flex items-center gap-2">
                <span>Open Instructor Control Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="workshop-card p-6 bg-paper space-y-4">
              <div className="flex items-center justify-between border-b border-workshop-border pb-3 text-[11px] font-mono">
                <span className="text-ink-muted uppercase tracking-wider">Assessor Ledger &bull; Cohort A</span>
                <span className="text-safety-green">LIVE TELEMETRY</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 bg-paper-hi border border-workshop-border rounded-workshop">
                  <div className="flex justify-between text-[10px] text-ink-faded mb-1">
                    <span>LEARNER: MARCUS VANCE</span>
                    <span>BS 7671 MODULE 1</span>
                  </div>
                  <div className="font-sans font-medium text-ink">
                    Completed Safe Isolation &amp; 1-Way Lighting Circuit
                  </div>
                  <div className="mt-1.5 text-[11px] text-safety-green">
                    0 Dead Shorts &bull; Polarity Verified &bull; R1+R2: 0.34 Ω
                  </div>
                </div>

                <div className="p-3 bg-paper-hi border border-workshop-border rounded-workshop">
                  <div className="flex justify-between text-[10px] text-ink-faded mb-1">
                    <span>LEARNER: ELENA ROSTOVA</span>
                    <span>WRAS MODULE 1</span>
                  </div>
                  <div className="font-sans font-medium text-ink">
                    Basin Supply &amp; 32mm P-Trap Commissioning
                  </div>
                  <div className="mt-1.5 text-[11px] text-trade-plumbing">
                    3.0 Bar Held (15m) &bull; 0 Weeping Joints &bull; 50mm Trap Seal OK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
