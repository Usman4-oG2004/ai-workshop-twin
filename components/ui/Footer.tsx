import Link from "next/link";
import { Shield, Zap, Wrench, Terminal, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-workshop-border bg-workshop-surface/60 relative overflow-hidden">
      <div className="hazard-stripe w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl text-chalk">AI WORKSHOP TWIN</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-workshop bg-amber-500/10 text-amber-400 border border-amber-500/30">
                ISA PILOT EDITION
              </span>
            </div>
            <p className="text-sm text-chalk-muted max-w-md font-body leading-relaxed">
              &quot;Make 20 mistakes in a virtual workshop before making one in a real workshop.&quot;
              Multimodal AI tutoring and deterministic simulation rules built specifically for Imperial Skills Academy beginners.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-chalk-faded">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-safety-green" /> 100% Supervised Safety Gate
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-arc-400" /> Deterministic Rule Verification
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-chalk mb-3">Simulation Labs</div>
            <ul className="space-y-2 text-xs font-mono text-chalk-muted">
              <li>
                <Link href="/workshop/electrical" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-500" /> Electrical Circuit Lab
                </Link>
              </li>
              <li>
                <Link href="/workshop/plumbing" className="hover:text-arc-400 transition-colors flex items-center gap-1.5">
                  <Wrench className="w-3 h-3 text-arc-400" /> Pipe Assembly Lab
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-chalk transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-chalk-faded" /> Work Order Modules
                </Link>
              </li>
            </ul>
          </div>

          {/* Instructor & Governance */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-chalk mb-3">Instructor Supervision</div>
            <ul className="space-y-2 text-xs font-mono text-chalk-muted">
              <li>
                <Link href="/instructor" className="hover:text-chalk transition-colors">
                  Instructor Control Room
                </Link>
              </li>
              <li>
                <Link href="/instructor/students" className="hover:text-chalk transition-colors">
                  Diagnostic Evidence Log
                </Link>
              </li>
              <li>
                <Link href="/instructor/content" className="hover:text-chalk transition-colors">
                  Curriculum & Safety Approvals
                </Link>
              </li>
              <li>
                <Link href="/instructor/analytics" className="hover:text-chalk transition-colors">
                  Skill Assessment Matrix
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-workshop-border flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-chalk-faded gap-3">
          <div>
            Built for Ahsan Naeem portfolio demonstration &bull; Imperial Skills Academy (ISA) trade training.
          </div>
          <div className="flex items-center gap-4">
            <span>Deterministic Circuit Engine</span>
            <span>&bull;</span>
            <span>Gemini Multimodal RAG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
