"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, CheckCircle2, AlertTriangle, Search, Filter } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/instructor")
      .then((res) => res.json())
      .then((d) => {
        setStudents(d.students || []);
        if (d.students?.length > 0) setSelectedStudent(d.students[0]);
      });
  }, []);

  const filtered = students.filter((s) =>
    s.studentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen flex flex-col bg-workshop-bg text-chalk font-body">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Top Header */}
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
                DIAGNOSTIC EVIDENCE LOG
              </h1>
              <div className="text-xs text-chalk-muted font-mono">
                Behavioral observations recorded directly from simulation activity. Zero arbitrary labels.
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-chalk-faded absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search apprentice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-workshop-surface border border-workshop-border rounded-workshop pl-8 pr-3 py-1.5 text-xs text-chalk focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Table / List */}
          <div className="lg:col-span-5 workshop-card overflow-hidden">
            <div className="p-3 bg-workshop-elevated border-b border-workshop-border text-xs font-mono uppercase tracking-wider text-chalk-faded flex justify-between">
              <span>Apprentice Roster</span>
              <span>Mastery</span>
            </div>

            <div className="divide-y divide-workshop-border">
              {filtered.map((st) => {
                const isSelected = selectedStudent?.studentId === st.studentId;
                return (
                  <button
                    key={st.studentId}
                    onClick={() => setSelectedStudent(st)}
                    className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-workshop-elevated border-l-2 border-amber-500"
                        : "hover:bg-workshop-surface"
                    }`}
                  >
                    <div>
                      <div className="font-heading font-medium text-sm text-chalk">
                        {st.studentName}
                      </div>
                      <div className="text-[11px] font-mono text-chalk-faded mt-0.5">
                        Track: <span className="uppercase text-amber-400">{st.category}</span> &bull; {st.lessonsCompleted}/{st.totalLessons} Lessons
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-amber-400">
                        {st.averageScore}%
                      </div>
                      <div className="text-[10px] font-mono text-chalk-faded">
                        Interest: {st.interestLevel}/5
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Detail Pane */}
          <div className="lg:col-span-7">
            {selectedStudent ? (
              <div className="workshop-card-riveted p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-workshop-border pb-4">
                  <div>
                    <h2 className="font-display text-2xl text-chalk tracking-wider">
                      {selectedStudent.studentName}
                    </h2>
                    <div className="text-xs font-mono text-chalk-muted">
                      ID: {selectedStudent.studentId} &bull; Time on Bench: {Math.round(selectedStudent.totalTimeSpent / 60)} minutes
                    </div>
                  </div>
                  <div className="stamp stamp-approved">
                    <span>EVIDENCE VERIFIED</span>
                  </div>
                </div>

                {/* Behavioral Observations */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-chalk-faded mb-3">
                    Concrete Observations (No Labels)
                  </div>
                  <div className="space-y-3">
                    {selectedStudent.observations?.map((obs: any) => (
                      <div
                        key={obs.id}
                        className="p-3 bg-workshop-bg border border-workshop-border rounded-workshop font-mono text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px] text-chalk-faded mb-1">
                          <span className="uppercase text-amber-400">Category: {obs.category}</span>
                          <span>{obs.timestamp}</span>
                        </div>
                        <div className="text-chalk font-heading text-xs font-medium mb-1">
                          {obs.description}
                        </div>
                        <div className="text-[11px] text-chalk-muted border-t border-workshop-border/40 pt-1 mt-1">
                          <span className="text-chalk-dim font-bold">Evidence:</span> {obs.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Development Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-safety-green/5 border border-safety-green/30 rounded-workshop">
                    <div className="text-xs font-mono uppercase tracking-wider text-safety-green mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                    </div>
                    <ul className="text-xs space-y-1.5 text-chalk-dim font-body">
                      {selectedStudent.strengths?.map((s: string, idx: number) => (
                        <li key={idx}>&bull; {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-safety-yellow/5 border border-safety-yellow/30 rounded-workshop">
                    <div className="text-xs font-mono uppercase tracking-wider text-safety-yellow mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Next to Practice
                    </div>
                    <ul className="text-xs space-y-1.5 text-chalk-dim font-body">
                      {selectedStudent.areasToDevelop?.map((a: string, idx: number) => (
                        <li key={idx}>&bull; {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="workshop-card p-12 text-center text-chalk-faded font-mono text-xs">
                Select an apprentice from the roster to inspect observations.
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
