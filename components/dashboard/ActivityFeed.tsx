"use client";

import { Zap, Wrench, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

interface Activity {
  id: string;
  studentName: string;
  lessonTitle: string;
  category: "electrical" | "plumbing" | string;
  action: string;
  timestamp: string;
  score?: number;
}

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="workshop-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-workshop-border mb-4">
        <div className="text-xs font-mono uppercase tracking-widest text-chalk flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Real-Time Bench Activity Feed</span>
        </div>
        <span className="text-[10px] font-mono text-safety-green flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-safety-green animate-pulse" />
          STREAMING
        </span>
      </div>

      <div className="space-y-3">
        {activities.map((act) => {
          const isElectrical = act.category === "electrical";
          return (
            <div
              key={act.id}
              className="p-3 bg-workshop-bg border border-workshop-border rounded-workshop flex items-start justify-between gap-3 font-mono text-xs hover:border-workshop-border-light transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-workshop flex items-center justify-center shrink-0 mt-0.5 border ${
                    isElectrical
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-arc-500/10 border-arc-500/30 text-arc-400"
                  }`}
                >
                  {isElectrical ? <Zap className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-medium text-chalk truncate">
                      {act.studentName}
                    </span>
                    <span className="text-[10px] text-chalk-faded">&bull; {act.lessonTitle}</span>
                  </div>
                  <div className="text-[11px] text-chalk-muted font-body mt-0.5">
                    {act.action}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                {act.score !== undefined && (
                  <div
                    className={`font-bold ${
                      act.score >= 80 ? "text-safety-green" : "text-safety-yellow"
                    }`}
                  >
                    {act.score}%
                  </div>
                )}
                <div className="text-[10px] text-chalk-faded mt-0.5">{act.timestamp}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
