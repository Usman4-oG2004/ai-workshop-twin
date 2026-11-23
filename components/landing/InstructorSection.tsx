"use client";

import Link from "next/link";
import { Gauge, CheckCircle2, AlertTriangle, Eye, ArrowRight, ShieldCheck } from "lucide-react";

export default function InstructorSection() {
  return (
    <section className="py-20 bg-workshop-surface/30 border-b border-workshop-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="work-order-tag bg-arc-500/10 border-arc-500/30 text-arc-400">
              <span>INSTRUCTOR SUPERVISION CONTROL</span>
            </div>

            <h2 className="font-display uppercase text-4xl sm:text-5xl text-chalk tracking-wide leading-tight">
              Actionable Observations.
              <br />
              <span className="text-chalk-muted">Never Arbitrary Labels.</span>
            </h2>

            <p className="text-sm text-chalk-muted font-body leading-relaxed">
              In vocational training, judging a beginner as &quot;good&quot; or &quot;poor&quot; from a single introductory circuit destroys morale.
              The AI Workshop Twin captures specific, evidence-backed diagnostics so instructors can coach individual technical habits.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-workshop bg-workshop-surface border border-workshop-border">
                <CheckCircle2 className="w-4 h-4 text-safety-green mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-heading font-medium text-chalk">
                    &quot;Checked 4 of 4 connections before energizing switch&quot;
                  </div>
                  <div className="text-[11px] font-mono text-chalk-faded">
                    Demonstrates systematic safety discipline without rushing
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-workshop bg-workshop-surface border border-workshop-border">
                <AlertTriangle className="w-4 h-4 text-safety-yellow mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-heading font-medium text-chalk">
                    &quot;Changed switch and bulb simultaneously during fault diagnosis&quot;
                  </div>
                  <div className="text-[11px] font-mono text-chalk-faded">
                    Targeted coaching cue: teach single-variable fault isolation
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-workshop bg-workshop-surface border border-workshop-border">
                <ShieldCheck className="w-4 h-4 text-arc-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-heading font-medium text-chalk">
                    &quot;Selected fault diagnosis track 3x in a row&quot;
                  </div>
                  <div className="text-[11px] font-mono text-chalk-faded">
                    Surfaces genuine personal interest in diagnostics vs construction
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/instructor"
                className="btn-workshop-secondary text-xs py-3 px-5 inline-flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Explore Instructor Control Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Mock Visual Panel */}
          <div className="lg:col-span-6">
            <div className="blueprint-card p-6 border-arc-500/30">
              <div className="flex items-center justify-between border-b border-workshop-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-safety-green animate-pulse" />
                  <span className="font-mono text-xs text-chalk uppercase tracking-wider">
                    APPRENTICE DIAGNOSTIC MONITOR
                  </span>
                </div>
                <span className="text-[10px] font-mono text-arc-400">ISA BENCH 04</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-workshop-bg/80 border border-workshop-border rounded-workshop">
                  <div className="flex justify-between text-chalk-faded text-[10px] mb-1">
                    <span>APPRENTICE: MARCUS V.</span>
                    <span>10:42:15 AM</span>
                  </div>
                  <div className="text-chalk font-heading text-xs">
                    Completed 12V Series Circuit Assembly
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-safety-green">0 Short Circuit Attempts</span>
                    <span className="text-amber-400 font-bold">Score: 100%</span>
                  </div>
                </div>

                <div className="p-3 bg-workshop-bg/80 border border-workshop-border rounded-workshop">
                  <div className="flex justify-between text-chalk-faded text-[10px] mb-1">
                    <span>APPRENTICE: ELENA R.</span>
                    <span>10:39:04 AM</span>
                  </div>
                  <div className="text-chalk font-heading text-xs">
                    Hydrostatic Pipe Joint Leak Test
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-safety-green">Sealed All 3 Fitting Openings</span>
                    <span className="text-arc-400 font-bold">Score: 95%</span>
                  </div>
                </div>

                <div className="p-3 bg-workshop-bg/80 border border-workshop-border rounded-workshop">
                  <div className="flex justify-between text-chalk-faded text-[10px] mb-1">
                    <span>AI FOREMAN ALERT</span>
                    <span className="text-safety-yellow">LOW CONFIDENCE FLAG</span>
                  </div>
                  <div className="text-safety-yellow text-[11px]">
                    Question regarding 230V mains isolation deferred to instructor review queue.
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
