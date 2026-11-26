"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/workshop/electrical", label: "Electrical Bay (BS 7671)" },
    { href: "/workshop/plumbing", label: "Plumbing Rig (WRAS)" },
    { href: "/learn", label: "Curriculum" },
    { href: "/instructor", label: "Instructor Log" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-paper/95 backdrop-blur-md border-b border-workshop-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-workshop bg-ink text-paper-hi flex items-center justify-center font-mono text-xs font-semibold tracking-tighter">
            ISA
          </div>
          <div className="leading-tight">
            <div className="font-serif text-base font-semibold text-ink tracking-tight">
              Imperial Skills Academy
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-ink-faded">
              Virtual Trade Bench
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 h-full">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "h-full flex items-center text-xs font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-ink text-ink font-semibold"
                    : "border-transparent text-ink-muted hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-safety-green" />
            3D Rig Ready
          </span>
          <Link href="/workshop/electrical" className="btn-workshop py-1.5 px-3.5 text-xs">
            Open Workbench
          </Link>
        </div>
      </div>
    </header>
  );
}
