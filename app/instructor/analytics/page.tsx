"use client";

import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function AnalyticsPage() {
  const chartData = [
    { name: "First Circuit", score: 94, attempts: 42 },
    { name: "Fault Finder", score: 78, attempts: 38 },
    { name: "Two-Way Switch", score: 82, attempts: 26 },
    { name: "Pipe Assembly", score: 91, attempts: 35 },
    { name: "P-Trap Install", score: 86, attempts: 31 },
    { name: "Tee Branching", score: 76, attempts: 22 },
  ];

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
                SKILL MASTERY MATRIX
              </h1>
              <div className="text-xs text-chalk-muted font-mono">
                Cohort performance trends and difficulty bottlenecks across electrical and plumbing simulations.
              </div>
            </div>
          </div>
        </div>

        {/* Bar chart breakdown */}
        <div className="workshop-card-riveted p-6 mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-chalk-faded mb-6">
            Average Task Score By Module (%)
          </div>

          <div className="space-y-4">
            {chartData.map((d) => (
              <div key={d.name} className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-chalk">
                  <span>{d.name}</span>
                  <span className="text-amber-400 font-bold">{d.score}%</span>
                </div>
                <div className="w-full h-3 bg-workshop-bg border border-workshop-border rounded-workshop overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000"
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
