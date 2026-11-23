'use client';

import { useCallback } from 'react';
import { cn, generateId } from '@/lib/utils';
import { useSimulationStore } from '@/lib/store';
import type { ComponentType } from '@/lib/types';

// ═══════════════════════════════════════
// Component Definitions
// ═══════════════════════════════════════

interface ShelfItem {
  type: ComponentType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const ELECTRICAL_COMPONENTS: ShelfItem[] = [
  {
    type: 'battery',
    label: 'Battery',
    description: '12V DC power source',
    icon: (
      <svg viewBox="0 0 40 28" className="w-10 h-7">
        <line x1="10" y1="4" x2="10" y2="24" stroke="currentColor" strokeWidth="3" />
        <line x1="16" y1="8" x2="16" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="22" y1="4" x2="22" y2="24" stroke="currentColor" strokeWidth="3" />
        <line x1="28" y1="8" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="28" y1="14" x2="40" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    type: 'switch',
    label: 'Switch',
    description: 'Single-pole toggle',
    icon: (
      <svg viewBox="0 0 40 24" className="w-10 h-6">
        <line x1="0" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="10" cy="14" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="12" x2="28" y2="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="14" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="14" x2="40" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    type: 'bulb',
    label: 'Bulb',
    description: 'Incandescent lamp',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="22" y2="22" stroke="currentColor" strokeWidth="1" />
        <line x1="22" y1="10" x2="10" y2="22" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    type: 'resistor',
    label: 'Resistor',
    description: '100Ω carbon film',
    icon: (
      <svg viewBox="0 0 44 20" className="w-11 h-5">
        <line x1="0" y1="10" x2="8" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <polyline
          points="8,10 12,2 18,18 24,2 30,18 36,10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="36" y1="10" x2="44" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    type: 'fuse',
    label: 'Fuse',
    description: '5A cartridge fuse',
    icon: (
      <svg viewBox="0 0 40 18" className="w-10 h-[18px]">
        <line x1="0" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <rect x="8" y="2" width="24" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="14" y1="9" x2="26" y2="9" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="32" y1="9" x2="40" y2="9" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    type: 'wire',
    label: 'Wire',
    description: 'Conductor link',
    icon: (
      <svg viewBox="0 0 40 8" className="w-10 h-2">
        <line x1="0" y1="4" x2="40" y2="4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

// ═══════════════════════════════════════
// ComponentShelf
// ═══════════════════════════════════════

export default function ComponentShelf() {
  const addComponent = useSimulationStore((s) => s.addComponent);

  const handleAdd = useCallback(
    (item: ShelfItem) => {
      addComponent({
        id: `${item.type}-${generateId()}`,
        type: item.type,
        label: item.label,
        x: 360 + Math.random() * 120,
        y: 240 + Math.random() * 80,
        rotation: 0,
        connections: [],
        properties: {},
      });
    },
    [addComponent]
  );

  return (
    <div className="w-56 flex-shrink-0 h-full bg-workshop-surface border-r border-workshop-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-workshop-border">
        <h2 className="font-display text-lg text-chalk tracking-wider">
          COMPONENTS
        </h2>
        <p className="text-[10px] font-mono text-chalk-muted mt-0.5 tracking-wider">
          CLICK TO ADD TO WORKBENCH
        </p>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {ELECTRICAL_COMPONENTS.map((item) => (
          <button
            key={item.type}
            onClick={() => handleAdd(item)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5',
              'bg-workshop-bg hover:bg-workshop-elevated',
              'border border-workshop-border hover:border-amber-500/30',
              'rounded-workshop transition-all duration-150',
              'group text-left'
            )}
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-10 flex items-center justify-center text-chalk-muted group-hover:text-amber-500 transition-colors">
              {item.icon}
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p className="text-xs font-heading font-medium text-chalk-dim group-hover:text-chalk transition-colors truncate">
                {item.label}
              </p>
              <p className="text-[10px] font-mono text-chalk-faded truncate">
                {item.description}
              </p>
            </div>

            {/* Add indicator */}
            <div className="ml-auto flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-workshop bg-workshop-border/50 group-hover:bg-amber-500/20 transition-colors">
              <svg viewBox="0 0 12 12" className="w-3 h-3 text-chalk-faded group-hover:text-amber-400 transition-colors">
                <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1.5" />
                <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-workshop-border">
        <p className="text-[9px] font-mono text-chalk-faded tracking-wider leading-relaxed">
          ESC — DESELECT<br />
          CLICK PORTS TO WIRE
        </p>
      </div>
    </div>
  );
}
