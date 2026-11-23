"use client";

import { Droplets, RotateCcw, Lightbulb, Gauge, ShieldAlert } from "lucide-react";
import { useSimulationStore } from "@/lib/store";

interface PlumbingControlsProps {
  onTestSystem: () => void;
  isWaterTurnedOn: boolean;
  onToggleWater: () => void;
}

export default function PlumbingControls({
  onTestSystem,
  isWaterTurnedOn,
  onToggleWater,
}: PlumbingControlsProps) {
  const { reset, score, useHint, hintsUsed } = useSimulationStore();

  return (
    <div className="w-full bg-workshop-surface border border-workshop-border rounded-workshop p-3.5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onTestSystem}
          className="btn-arc py-2.5 px-4 text-xs flex items-center gap-1.5"
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Pressure Test System</span>
        </button>

        <button
          onClick={onToggleWater}
          className={`px-3 py-2.5 rounded-workshop border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
            isWaterTurnedOn
              ? "bg-arc-500/20 border-arc-500 text-arc-300"
              : "bg-workshop-bg border-workshop-border text-chalk-muted hover:text-chalk"
          }`}
        >
          <span>Main Water Feed: {isWaterTurnedOn ? "ON (Flowing)" : "OFF"}</span>
        </button>

        <button
          onClick={reset}
          className="p-2.5 rounded-workshop bg-workshop-bg border border-workshop-border hover:bg-workshop-elevated text-chalk-muted hover:text-chalk transition-colors"
          title="Clear Bench"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Meter & Hints */}
      <div className="flex items-center gap-4">
        <button
          onClick={useHint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-workshop bg-workshop-bg border border-workshop-border hover:border-amber-500/50 text-chalk-muted hover:text-amber-400 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Hint ({hintsUsed}/3)</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-workshop bg-workshop-bg border border-workshop-border">
          <Gauge className="w-3.5 h-3.5 text-arc-400" />
          <span className="text-chalk-faded text-[10px]">PRESSURE SEAL:</span>
          <span className="font-bold text-arc-400">{score}%</span>
        </div>
      </div>
    </div>
  );
}
