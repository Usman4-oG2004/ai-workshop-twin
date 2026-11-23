"use client";

import { Wrench, Plus, CircleDot, Droplets } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import type { ComponentType } from "@/lib/types";

export default function FittingsShelf() {
  const { addComponent } = useSimulationStore();

  const fittings: Array<{
    type: ComponentType;
    label: string;
    desc: string;
    icon: any;
  }> = [
    {
      type: "faucet",
      label: "Supply Tap / Faucet",
      desc: "Water pressure inlet source",
      icon: Droplets,
    },
    {
      type: "pipe-straight",
      label: "Straight 15mm Pipe",
      desc: "Rigid copper conduit run",
      icon: Wrench,
    },
    {
      type: "pipe-elbow",
      label: "90° Direction Elbow",
      desc: "Right-angle directional joint",
      icon: CircleDot,
    },
    {
      type: "pipe-tee",
      label: "T-Junction Splitter",
      desc: "Three-way dual outlet fixture",
      icon: Plus,
    },
    {
      type: "trap",
      label: "Sanitary P-Trap",
      desc: "Water-seal sewer gas barrier",
      icon: Droplets,
    },
    {
      type: "drain",
      label: "Waste Drain Grate",
      desc: "Effluent collection exit",
      icon: CircleDot,
    },
    {
      type: "valve",
      label: "Isolation Ball Valve",
      desc: "Manual quarter-turn stopcock",
      icon: Wrench,
    },
  ];

  const handleSpawn = (f: typeof fittings[0]) => {
    const offset = Math.floor(Math.random() * 80) + 40;
    addComponent({
      id: `pipe-${Date.now()}-${Math.random().toString(36).substring(5)}`,
      type: f.type,
      label: f.label,
      x: 100 + offset,
      y: 80 + offset,
      rotation: 0,
      connections: [],
      properties: { diameter: 15 },
    });
  };

  return (
    <div className="w-full md:w-64 bg-workshop-surface border border-workshop-border rounded-workshop p-4 flex flex-col font-body">
      <div className="flex items-center justify-between pb-3 border-b border-workshop-border mb-3">
        <div className="text-xs font-mono uppercase tracking-widest text-chalk flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-arc-400" />
          <span>Fittings Bin</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-workshop bg-workshop-elevated border border-workshop-border text-arc-400">
          WRAS Spec
        </span>
      </div>

      <div className="text-[11px] text-chalk-muted font-body mb-3">
        Click to stage pipe fittings onto the hydrostatic test bench:
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {fittings.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              onClick={() => handleSpawn(item)}
              className="w-full text-left p-2.5 rounded-workshop bg-workshop-bg hover:bg-workshop-elevated border border-workshop-border hover:border-arc-400/50 transition-all flex items-start gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-workshop bg-workshop-surface border border-workshop-border flex items-center justify-center shrink-0 group-hover:border-arc-400/40 text-arc-400">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-heading font-medium text-chalk group-hover:text-arc-300 truncate">
                  {item.label}
                </div>
                <div className="text-[10px] text-chalk-faded truncate font-mono">
                  {item.desc}
                </div>
              </div>
              <Plus className="w-3.5 h-3.5 text-chalk-faded group-hover:text-arc-400 shrink-0 mt-1" />
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-workshop-border text-[10px] font-mono text-chalk-faded">
        Critical Rule: Every waste drain requires an upstream P-trap seal.
      </div>
    </div>
  );
}
