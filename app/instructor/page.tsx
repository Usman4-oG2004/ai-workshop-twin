"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gauge, Users, BookCheck, ShieldAlert, ArrowRight, Eye, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import StatsGauge from "@/components/dashboard/StatsGauge";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function InstructorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructor")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-workshop-bg text-chalk font-body">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Top Control Room Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-workshop-border mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display tracking-wider text-3xl sm:text-4xl text-chalk">
                INSTRUCTOR CONTROL ROOM
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-workshop bg-amber-500/10 text-amber-400 border border-amber-500/30">
                SUPERVISOR MODE
              </span>
            </div>
            <p className="text-xs text-chalk-muted font-mono">
              Imperial Skills Academy &bull; Real-time apprentice diagnostics, safety review queue, and grounding approvals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/instructor/students"
              className="btn-workshop text-xs py-2.5 px-4 flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Evidence Ledger</span>
            </Link>

            <Link
              href="/instructor/content"
              className="btn-workshop-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
            >
              <BookCheck className="w-3.5 h-3.5" />
              <span>Review Queue ({data?.contentReviews?.length || 2})</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats Gauge Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsGauge
            value={data?.stats?.averageScore || 85}
            label="Average Task Mastery"
            sublabel="Based on 142 completed circuit & pipe runs"
            color="amber"
          />
          <StatsGauge
            value={data?.stats?.activeToday || 14}
            unit=" active"
            label="Apprentices On Bench"
            sublabel="Live virtual workshop sessions today"
            color="arc"
          />
          <StatsGauge
            value={100}
            label="Safety Protocol Compliance"
            sublabel="Zero live equipment incidents across cohort"
            color="green"
          />
          <StatsGauge
            value={data?.stats?.pendingReviews || 2}
            unit=" alerts"
            label="Instructor Review Queue"
            sublabel="Questions flagged for supervisor checkoff"
            color="amber"
          />
        </div>

        {/* Split Grid: Activity & Supervision Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Real-time Activity Feed */}
          <div className="lg:col-span-7">
            <ActivityFeed
              activities={
                data?.recentActivity || [
                  {
                    id: "act-1",
                    studentName: "Marcus Vance",
                    lessonTitle: "Your First Circuit",
                    category: "electrical",
                    action: "Completed virtual circuit simulation with 100% score",
                    timestamp: "12 mins ago",
                    score: 100,
                  },
                ]
              }
            />
          </div>

          {/* Right Column: Pedagogical Philosophy & Review Flags */}
          <div className="lg:col-span-5 space-y-6">
            {/* Non-Labeling Philosophy Banner */}
            <div className="workshop-card p-5 border-amber-500/40 bg-amber-500/5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>ISA Ground Rule: Observation Over Labels</span>
              </div>
              <p className="text-xs text-chalk-dim leading-relaxed font-body">
                We never label a beginner as &quot;good fit&quot; or &quot;poor fit&quot; after 1 lesson.
                The AI records raw behavioral observations (e.g. &quot;checked 4 of 4 connections before testing&quot;).
                Instructors interpret this data in 1-on-1 coaching.
              </p>
              <div className="mt-4 pt-3 border-t border-workshop-border flex items-center justify-between text-xs font-mono">
                <Link
                  href="/instructor/students"
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>View Student Observations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pending AI Safety Flags */}
            <div className="workshop-card p-5">
              <div className="text-xs font-mono uppercase tracking-widest text-chalk mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-safety-yellow" />
                <span>Pending Safety / Course Review ({data?.contentReviews?.length || 2})</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                {(data?.contentReviews || []).map((rev: any) => (
                  <div
                    key={rev.id}
                    className="p-3 bg-workshop-bg border border-workshop-border rounded-workshop"
                  >
                    <div className="flex items-center justify-between text-[10px] text-safety-yellow mb-1">
                      <span>{rev.type.toUpperCase()}</span>
                      <span>{rev.createdAt}</span>
                    </div>
                    <div className="text-chalk-muted text-[11px] leading-relaxed mb-2">
                      {rev.content}
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-workshop-border">
                      <button className="px-2 py-1 bg-safety-green/20 text-safety-green border border-safety-green/40 rounded-workshop text-[10px]">
                        Approve Answer
                      </button>
                      <button className="px-2 py-1 bg-safety-red/20 text-safety-red border border-safety-red/40 rounded-workshop text-[10px]">
                        Modify Rule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
