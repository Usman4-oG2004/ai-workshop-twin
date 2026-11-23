"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Wrench, Clock, Shield, ArrowRight, Search, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import TutorAvatar from "@/components/ai-tutor/TutorAvatar";
import TutorPanel from "@/components/ai-tutor/TutorPanel";

export default function LearnPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "electrical" | "plumbing">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/lessons")
      .then((res) => res.json())
      .then((d) => setLessons(d.lessons || []));
  }, []);

  const filtered = lessons.filter((l) => {
    const matchesFilter = filter === "all" || l.category === filter;
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
                          l.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen flex flex-col bg-workshop-bg text-chalk font-body">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-workshop-border mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display tracking-wider text-3xl sm:text-4xl text-chalk">
                WORK ORDERS &bull; CURRICULUM
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-workshop bg-amber-500/10 text-amber-400 border border-amber-500/30">
                APPRENTICE TRACK
              </span>
            </div>
            <p className="text-xs text-chalk-muted font-mono">
              Complete each hands-on simulation challenge. The AI Foreman guides you through mistakes without judgment.
            </p>
          </div>

          {/* Filter toggle buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-workshop text-xs font-mono uppercase tracking-wider border transition-colors ${
                filter === "all"
                  ? "bg-workshop-elevated text-chalk border-workshop-border-light"
                  : "bg-workshop-bg text-chalk-muted border-workshop-border hover:text-chalk"
              }`}
            >
              All Trades
            </button>
            <button
              onClick={() => setFilter("electrical")}
              className={`px-3 py-1.5 rounded-workshop text-xs font-mono uppercase tracking-wider border transition-colors ${
                filter === "electrical"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500"
                  : "bg-workshop-bg text-chalk-muted border-workshop-border hover:text-amber-400"
              }`}
            >
              ⚡ Electrical
            </button>
            <button
              onClick={() => setFilter("plumbing")}
              className={`px-3 py-1.5 rounded-workshop text-xs font-mono uppercase tracking-wider border transition-colors ${
                filter === "plumbing"
                  ? "bg-arc-500/20 text-arc-300 border-arc-500"
                  : "bg-workshop-bg text-chalk-muted border-workshop-border hover:text-arc-400"
              }`}
            >
              🔧 Plumbing
            </button>
          </div>
        </div>

        {/* Work Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lesson) => {
            const isElectrical = lesson.category === "electrical";
            const targetUrl = isElectrical ? "/workshop/electrical" : "/workshop/plumbing";

            return (
              <div
                key={lesson.id}
                className="workshop-card-riveted p-6 flex flex-col justify-between group hover:border-workshop-border-light transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-workshop border uppercase tracking-wider ${
                        isElectrical
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-arc-500/10 text-arc-400 border-arc-500/30"
                      }`}
                    >
                      {isElectrical ? "⚡ Electrical" : "🔧 Plumbing"}
                    </span>
                    <span className="text-[10px] font-mono text-chalk-faded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.duration}m
                    </span>
                  </div>

                  <h3 className="font-heading font-medium text-base text-chalk mb-2 group-hover:text-amber-300 transition-colors">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-chalk-muted font-body leading-relaxed mb-4">
                    {lesson.description}
                  </p>

                  {/* Objectives summary */}
                  <div className="space-y-1 mb-6">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-chalk-faded">
                      Learning Objectives:
                    </div>
                    {lesson.objectives?.slice(0, 2).map((obj: string, idx: number) => (
                      <div key={idx} className="text-xs font-mono text-chalk-dim flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-safety-green mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={targetUrl}
                  className={`w-full py-3 px-4 rounded-workshop border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isElectrical
                      ? "bg-amber-500 text-workshop-bg border-amber-400 hover:bg-amber-400 font-bold"
                      : "bg-arc-600 text-white border-arc-500 hover:bg-arc-500 font-bold"
                  }`}
                >
                  <span>Launch Workshop Bench</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
      <TutorAvatar />
      <TutorPanel />
    </main>
  );
}
