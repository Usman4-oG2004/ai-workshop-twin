"use client";

import { AlertOctagon, AlertTriangle, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useSimulationStore } from "@/lib/store";

interface ValidationPanelProps {
  onClose: () => void;
}

export default function ValidationPanel({ onClose }: ValidationPanelProps) {
  const { errors, score, isComplete } = useSimulationStore();

  const criticalErrors = errors.filter((e) => e.severity === "critical");
  const regularErrors = errors.filter((e) => e.severity === "error");
  const warnings = errors.filter((e) => e.severity === "warning");

  const isApproved = errors.length === 0 && score >= 90;

  return (
    <div className="w-full bg-workshop-elevated border border-workshop-border rounded-workshop p-4 shadow-xl font-body relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-chalk-faded hover:text-chalk"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Status Header */}
      <div className="flex items-center gap-3 mb-4">
        {isApproved ? (
          <div className="stamp stamp-approved">
            <CheckCircle2 className="w-4 h-4" />
            <span>HYDROSTATICALLY SEALED &bull; 0 LEAKS</span>
          </div>
        ) : (
          <div className="stamp stamp-rejected">
            <AlertOctagon className="w-4 h-4" />
            <span>PRESSURE TEST FAILED</span>
          </div>
        )}

        <div className="text-xs font-mono text-chalk-muted">
          Score: <span className="font-bold text-chalk">{score}/100</span>
        </div>
      </div>

      {/* Errors list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {errors.map((err, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-workshop border text-xs font-mono leading-relaxed ${
              err.severity === "critical"
                ? "bg-safety-red/10 border-safety-red/40 text-safety-red"
                : err.severity === "error"
                ? "bg-safety-orange/10 border-safety-orange/40 text-safety-orange"
                : "bg-safety-yellow/10 border-safety-yellow/40 text-safety-yellow"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {err.severity === "critical" ? (
                <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="uppercase">{err.severity} Fault:</span>
            </div>
            <div>{err.message}</div>
            {err.hint && (
              <div className="mt-1.5 text-[11px] text-chalk-muted pt-1 border-t border-workshop-border/40">
                💡 <span className="text-chalk-dim">Tutor Tip:</span> {err.hint}
              </div>
            )}
          </div>
        ))}

        {isApproved && (
          <div className="p-3 bg-safety-green/10 border border-safety-green/40 rounded-workshop text-safety-green text-xs font-mono">
            🎉 Excellent assembly! Continuous water path verified from faucet to waste drain, with active P-trap gas barrier and 0 unsealed joints.
          </div>
        )}
      </div>
    </div>
  );
}
