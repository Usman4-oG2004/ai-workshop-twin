"use client";

import Link from "next/link";
import { Zap, Wrench, Shield, ArrowRight, Gauge, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden bg-workshop-bg border-b border-workshop-border">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 bg-workshop-grid opacity-40 pointer-events-none" />

      {/* Decorative Blueprint Corner Markings */}
      <div className="absolute top-6 left-6 text-chalk-faded/20 font-mono text-[10px] select-none hidden lg:block">
        [SYS_COORD: 51.5074° N, 0.1278° W &bull; ISA LAB SCALE 1:1]
      </div>
      <div className="absolute top-6 right-6 text-chalk-faded/20 font-mono text-[10px] select-none hidden lg:block">
        [SPEC_STD: BS 7671 (18th Ed) &bull; WRAS APPROVED]
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Tag */}
        <div className="flex items-center justify-center mb-6">
          <div className="work-order-tag bg-amber-500/10 border-amber-500/30 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>IMPERIAL SKILLS ACADEMY &bull; AI WORKSHOP TWIN</span>
          </div>
        </div>

        {/* Main Stencil Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-display uppercase text-5xl sm:text-7xl lg:text-hero leading-tight tracking-wider text-chalk">
            Make <span className="text-amber-500 underline decoration-amber-500/40 decoration-4 underline-offset-8">20 Mistakes</span> Here
            <br />
            Before One Out There.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-chalk-muted font-body max-w-2xl mx-auto leading-relaxed">
            The interactive AI training twin built for beginner electricians and plumbers.
            Safely test wiring loops, identify short circuits, assemble pipe systems, and master technical intuition before touching live equipment.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/workshop/electrical"
              className="btn-workshop w-full sm:w-auto text-sm py-4 px-8 flex items-center justify-center gap-2 group shadow-glow-amber"
            >
              <Zap className="w-4 h-4 fill-workshop-bg group-hover:scale-110 transition-transform" />
              <span>Launch Electrical Lab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/workshop/plumbing"
              className="btn-arc w-full sm:w-auto text-sm py-4 px-8 flex items-center justify-center gap-2 group shadow-glow-arc"
            >
              <Wrench className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Launch Plumbing Lab</span>
            </Link>

            <Link
              href="/instructor"
              className="btn-workshop-secondary w-full sm:w-auto text-sm py-4 px-6 flex items-center justify-center gap-2"
            >
              <Gauge className="w-4 h-4 text-chalk-muted" />
              <span>Instructor View</span>
            </Link>
          </div>
        </div>

        {/* Technical Gauge Meter Stats Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="workshop-card-riveted p-4">
            <div className="text-[10px] font-mono text-chalk-faded uppercase tracking-widest">Pre-Bench Errors</div>
            <div className="mt-1 text-2xl font-mono text-amber-400 font-bold">5,420+</div>
            <div className="text-[11px] text-chalk-muted mt-1">Virtual faults caught without physical kit damage</div>
          </div>

          <div className="workshop-card-riveted p-4">
            <div className="text-[10px] font-mono text-chalk-faded uppercase tracking-widest">Physical Safety Rating</div>
            <div className="mt-1 text-2xl font-mono text-safety-green font-bold">100%</div>
            <div className="text-[11px] text-chalk-muted mt-1">Zero live shocks &bull; Supervisor gate isolation</div>
          </div>

          <div className="workshop-card-riveted p-4">
            <div className="text-[10px] font-mono text-chalk-faded uppercase tracking-widest">AI Tutor Grounding</div>
            <div className="mt-1 text-2xl font-mono text-arc-400 font-bold">ISA Verified</div>
            <div className="text-[11px] text-chalk-muted mt-1">Grounded exclusively in approved course notes</div>
          </div>

          <div className="workshop-card-riveted p-4">
            <div className="text-[10px] font-mono text-chalk-faded uppercase tracking-widest">Evaluation Model</div>
            <div className="mt-1 text-2xl font-mono text-chalk font-bold">Evidence-Only</div>
            <div className="text-[11px] text-chalk-muted mt-1">No aptitude labels &bull; Concrete behavioral log</div>
          </div>
        </div>
      </div>
    </section>
  );
}
