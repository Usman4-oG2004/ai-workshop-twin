"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookCheck, ShieldAlert, Plus, CheckCircle2, Clock } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function ContentManagementPage() {
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/lessons")
      .then((res) => res.json())
      .then((d) => setLessons(d.lessons || []));
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-workshop-bg text-chalk font-body">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <div className="flex items-center justify-between pb-4 border-b border-workshop-border mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/instructor"
              className="p-2 rounded-workshop bg-workshop-surface border border-workshop-border hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display tracking-wider text-2xl text-chalk">
                CURRICULUM &amp; APPROVED MATERIALS
              </h1>
              <div className="text-xs text-chalk-muted font-mono">
                Only instructor-approved course notes feed the AI Workshop Foreman RAG pipeline.
              </div>
            </div>
          </div>

          <button className="btn-workshop text-xs py-2 px-3 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Module</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((l) => (
            <div key={l.id} className="workshop-card-riveted p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-workshop border uppercase ${
                      l.category === "electrical"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-arc-500/10 text-arc-400 border-arc-500/30"
                    }`}
                  >
                    {l.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-safety-green">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ISA APPROVED</span>
                  </div>
                </div>

                <h3 className="font-heading font-medium text-base text-chalk mb-2">
                  {l.title}
                </h3>
                <p className="text-xs text-chalk-muted font-body leading-relaxed mb-4">
                  {l.description}
                </p>
              </div>

              <div className="pt-3 border-t border-workshop-border flex items-center justify-between text-[11px] font-mono text-chalk-faded">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {l.duration} mins
                </span>
                <span className="text-amber-400">Level: {l.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
