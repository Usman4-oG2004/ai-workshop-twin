"use client";

import { Droplets, RotateCcw, Lightbulb, Gauge, Wrench } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import { playClick } from "@/lib/sound";
import type { SimulationComponent, Connection } from "@/lib/types";

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
  const { reset, score, useHint, hintsUsed, soundEnabled, toggleSound, setPresetCircuit, setScore, setComplete } =
    useSimulationStore();

  const handleAssembleForMe = () => {
    playClick(soundEnabled);
    const faucetId = "demo-faucet";
    const pipe1Id = "demo-pipe1";
    const elbowId = "demo-elbow";
    const trapId = "demo-trap";
    const drainId = "demo-drain";

    const presetComps: SimulationComponent[] = [
      { id: faucetId, type: "faucet", label: "Supply Tap", x: 96, y: 120, rotation: 0, connections: [], properties: { diameter: 15 } },
      { id: pipe1Id, type: "pipe-straight", label: "15mm Copper", x: 240, y: 120, rotation: 0, connections: [], properties: { diameter: 15 } },
      { id: elbowId, type: "pipe-elbow", label: "90° Elbow", x: 408, y: 120, rotation: 0, connections: [], properties: { diameter: 15 } },
      { id: trapId, type: "trap", label: "Sanitary P-Trap", x: 408, y: 264, rotation: 0, connections: [], properties: { diameter: 15 } },
      { id: drainId, type: "drain", label: "Waste Drain", x: 552, y: 264, rotation: 0, connections: [], properties: { diameter: 15 } },
    ];

    const presetConns: Connection[] = [
      { id: "pc1", from: { componentId: faucetId, port: "out" }, to: { componentId: pipe1Id, port: "in" }, isValid: true },
      { id: "pc2", from: { componentId: pipe1Id, port: "out" }, to: { componentId: elbowId, port: "in" }, isValid: true },
      { id: "pc3", from: { componentId: elbowId, port: "out" }, to: { componentId: trapId, port: "in" }, isValid: true },
      { id: "pc4", from: { componentId: trapId, port: "out" }, to: { componentId: drainId, port: "in" }, isValid: true },
    ];

    setPresetCircuit(presetComps, presetConns);
    setScore(100);
    setComplete(true);
  };

  return (
    <div className="w-full bg-workshop-surface border border-workshop-border rounded-workshop p-3.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onTestSystem} className="btn-arc py-2 px-4 text-xs flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5" />
          <span>Pressure Test</span>
        </button>

        <button
          onClick={handleAssembleForMe}
          className="px-3 py-2 rounded-workshop bg-arc-500/15 border border-arc-500/40 text-arc-300 hover:bg-arc-500/25 flex items-center gap-1.5 transition-colors"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Assemble For Me</span>
        </button>

        <button
          onClick={() => {
            onToggleWater();
            playClick(soundEnabled);
          }}
          className={`px-3 py-2 rounded-workshop border text-xs font-mono uppercase tracking-wider transition-colors ${
            isWaterTurnedOn
              ? "bg-arc-500/20 border-arc-500 text-arc-300"
              : "bg-workshop-bg border-workshop-border text-chalk-muted hover:text-chalk"
          }`}
        >
          <span>Water: {isWaterTurnedOn ? "ON" : "OFF"}</span>
        </button>

        <button
          onClick={toggleSound}
          className="px-2.5 py-2 rounded-workshop bg-workshop-bg border border-workshop-border text-chalk-muted hover:text-chalk"
        >
          {soundEnabled ? "🔊 Sound" : "🔇 Muted"}
        </button>

        <button
          onClick={() => {
            reset();
            playClick(soundEnabled);
          }}
          className="p-2 rounded-workshop bg-workshop-bg border border-workshop-border hover:bg-workshop-elevated text-chalk-muted hover:text-safety-red transition-colors"
          title="Clear Bench"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            useHint();
            playClick(soundEnabled);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-workshop bg-workshop-bg border border-workshop-border hover:border-amber-500/50 text-chalk-muted hover:text-amber-400 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Hint ({hintsUsed}/3)</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-workshop bg-workshop-bg border border-workshop-border">
          <Gauge className="w-3.5 h-3.5 text-arc-400" />
          <span className="text-chalk-faded text-[10px]">SEAL:</span>
          <span className="font-bold text-arc-400">{score}%</span>
        </div>
      </div>
    </div>
  );
}
