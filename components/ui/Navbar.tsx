"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Wrench, Shield, LayoutDashboard, BookOpen, HardHat, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/learn", label: "Work Orders (Curriculum)", icon: BookOpen },
    { href: "/workshop/electrical", label: "Electrical Bench", icon: Zap, highlight: "amber" },
    { href: "/workshop/plumbing", label: "Plumbing Bench", icon: Wrench, highlight: "arc" },
    { href: "/instructor", label: "Instructor Control Room", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-workshop-surface/90 backdrop-blur-md border-b border-workshop-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-workshop bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-500 group-hover:bg-amber-500/20 group-hover:border-amber-500 transition-all">
            <Zap className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display tracking-wider text-xl text-chalk font-normal">
                AI WORKSHOP TWIN
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-workshop bg-workshop-elevated border border-workshop-border text-amber-400">
                ISA v2.6
              </span>
            </div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-chalk-faded -mt-1">
              Imperial Skills Academy
            </div>
          </div>
        </Link>

        {/* Navigation Rack */}
        <nav className="hidden md:flex items-center gap-1 bg-workshop-bg p-1 border border-workshop-border rounded-workshop">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-workshop text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all",
                  isActive
                    ? "bg-workshop-elevated text-chalk border border-workshop-border-light shadow-sm"
                    : "text-chalk-muted hover:text-chalk hover:bg-workshop-surface",
                  item.highlight === "amber" && isActive && "text-amber-400 border-amber-500/30",
                  item.highlight === "arc" && isActive && "text-arc-400 border-arc-500/30"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-amber-400" : "text-chalk-faded")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Status & Auth Action */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-workshop bg-workshop-bg border border-workshop-border text-[11px] font-mono text-chalk-muted">
            <div className="w-2 h-2 rounded-full bg-safety-green animate-pulse" />
            <span>TWIN ENGINE: ONLINE</span>
          </div>

          <Link
            href="/workshop/electrical"
            className="btn-workshop text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Launch Twin</span>
          </Link>
        </div>
      </div>

      {/* Industrial Hazard Stripe on bottom */}
      <div className="hazard-stripe w-full" />
    </header>
  );
}
