"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-14 pb-16 bg-paper border-b border-workshop-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Kicker */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-trade-electrical font-semibold">
            00 &mdash; IMPERIAL SKILLS ACADEMY
          </span>
          <span className="text-[11px] font-mono text-ink-faded">
            BS 7671 &bull; WRAS LEVEL 1 PRE-BENCH
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Editorial Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold text-ink leading-[1.1] tracking-tight">
              Practice real electrical &amp; plumbing installations before stepping onto the live bay.
            </h1>

            <p className="text-base text-ink-secondary max-w-2xl leading-relaxed">
              A sober, standards-aligned 3D training bench for adult learners and trade apprentices. Wire a 230V domestic consumer unit, execute safe isolation lock-off, tighten 15mm copper compression fittings, and commission a 3.0 bar hydrostatic test under instructor supervision.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/workshop/electrical"
                className="btn-workshop py-3 px-6 text-xs flex items-center gap-2"
              >
                <span>Open 3D Electrical Bay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/workshop/plumbing"
                className="btn-arc py-3 px-6 text-xs flex items-center gap-2"
              >
                <span>Open 3D Plumbing Rig</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/instructor"
                className="btn-workshop-secondary py-3 px-5 text-xs"
              >
                Instructor Observation Log
              </Link>
            </div>
          </div>

          {/* Right Specification Table Card */}
          <div className="lg:col-span-5">
            <div className="workshop-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-workshop-border pb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  Training Rig Specification
                </span>
                <span className="font-mono text-[11px] text-safety-green font-semibold">
                  ONLINE
                </span>
              </div>

              <dl className="divide-y divide-rule-soft text-xs">
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="font-mono text-ink-faded">ELECTRICAL BAY</dt>
                  <dd className="text-right font-medium text-ink">230V AC Consumer Unit, MCBs, Wall Switch &amp; Batten</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="font-mono text-ink-faded">PLUMBING RIG</dt>
                  <dd className="text-right font-medium text-ink">15mm Copper, Brass Compression, P-Trap &amp; 3.0 Bar Test</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="font-mono text-ink-faded">SAFETY ENGINE</dt>
                  <dd className="text-right font-medium text-ink">Deterministic Circuit &amp; Hydraulic Graph Rules</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="font-mono text-ink-faded">AI TUTOR</dt>
                  <dd className="text-right font-medium text-ink">Grounded in ISA Instructor Notes Only</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="font-mono text-ink-faded">ASSESSMENT</dt>
                  <dd className="text-right font-medium text-ink">Behavioral Evidence Log (No Aptitude Labels)</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
