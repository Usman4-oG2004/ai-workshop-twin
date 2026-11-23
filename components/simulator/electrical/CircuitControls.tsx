'use client';

import { useCallback } from 'react';
import { cn, formatScore } from '@/lib/utils';
import { useSimulationStore } from '@/lib/store';
import { validateCircuit, ELECTRICAL_SCENARIOS } from '@/lib/simulation-engine/electrical';

// ═══════════════════════════════════════
// CircuitControls — Bottom control bar
// ═══════════════════════════════════════

interface CircuitControlsProps {
  scenarioId?: string;
}

export default function CircuitControls({ scenarioId = 'first-circuit' }: CircuitControlsProps) {
  const {
    components,
    connections,
    score,
    isComplete,
    hintsUsed,
    currentHintIndex,
    setErrors,
    setScore,
    setComplete,
    useHint,
    reset,
  } = useSimulationStore();

  const scenario = ELECTRICAL_SCENARIOS[scenarioId as keyof typeof ELECTRICAL_SCENARIOS];
  const hints = scenario?.hints ?? [];

  // ─── Test circuit ───
  const handleTest = useCallback(() => {
    const result = validateCircuit(components, connections, []);
    setErrors(result.errors);
    setScore(result.score);
    setComplete(result.isValid);
  }, [components, connections, setErrors, setScore, setComplete]);

  // ─── Show hint ───
  const handleHint = useCallback(() => {
    if (currentHintIndex < hints.length) {
      useHint();
    }
  }, [currentHintIndex, hints.length, useHint]);

  // ─── Current hint text ───
  const currentHint =
    currentHintIndex > 0 && currentHintIndex <= hints.length
      ? hints[currentHintIndex - 1]
      : null;

  // ─── Score gauge percentage ───
  const gaugeWidth = `${Math.min(100, Math.max(0, score))}%`;

  return (
    <div className="flex-shrink-0 bg-workshop-surface border-t border-workshop-border">
      {/* Hint banner */}
      {currentHint && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
          <p className="text-xs font-mono text-amber-400">
            <span className="text-amber-600 mr-2">HINT {currentHintIndex}/{hints.length}</span>
            {currentHint}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 px-4 py-3">
        {/* ─── Action Buttons ─── */}
        <div className="flex items-center gap-2">
          {/* Test Circuit */}
          <button
            onClick={handleTest}
            disabled={components.length === 0}
            className={cn(
              'btn-workshop px-4 py-2 font-heading text-sm font-medium tracking-wide',
              'bg-amber-500 text-workshop-bg hover:bg-amber-400',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'rounded-workshop transition-all duration-150',
              'shadow-glow-amber hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]'
            )}
          >
            ⚡ TEST CIRCUIT
          </button>

          {/* Reset */}
          <button
            onClick={reset}
            className={cn(
              'px-4 py-2 font-heading text-sm font-medium tracking-wide',
              'bg-workshop-bg text-chalk-muted hover:text-chalk',
              'border border-workshop-border hover:border-workshop-border-light',
              'rounded-workshop transition-all duration-150'
            )}
          >
            RESET
          </button>

          {/* Hint */}
          <button
            onClick={handleHint}
            disabled={currentHintIndex >= hints.length}
            className={cn(
              'px-4 py-2 font-heading text-sm font-medium tracking-wide',
              'bg-workshop-bg text-amber-500/70 hover:text-amber-400',
              'border border-amber-500/20 hover:border-amber-500/40',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'rounded-workshop transition-all duration-150'
            )}
          >
            HINT {hintsUsed > 0 ? `(${hintsUsed})` : ''}
          </button>
        </div>

        {/* ─── Spacer ─── */}
        <div className="flex-1" />

        {/* ─── Score Gauge ─── */}
        <div className="flex items-center gap-3">
          {/* Volt meter icon */}
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[9px] font-mono text-chalk-faded tracking-widest">SCORE</span>
            <span
              className={cn(
                'text-lg font-display tracking-wider',
                score >= 80 ? 'text-safety-green' :
                score >= 50 ? 'text-amber-400' :
                score > 0 ? 'text-safety-red' :
                'text-chalk-muted'
              )}
            >
              {formatScore(score)}
            </span>
          </div>

          {/* Gauge bar */}
          <div className="w-32 h-6 bg-workshop-bg border border-workshop-border rounded-workshop overflow-hidden relative">
            {/* Tick marks */}
            <div className="absolute inset-0 flex">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-workshop-border/50 last:border-r-0"
                />
              ))}
            </div>
            {/* Fill */}
            <div
              className={cn(
                'h-full transition-all duration-700 ease-out relative z-10',
                score >= 80 ? 'bg-safety-green/80' :
                score >= 50 ? 'bg-amber-500/80' :
                'bg-safety-red/80'
              )}
              style={{
                width: gaugeWidth,
                '--meter-value': gaugeWidth,
              } as React.CSSProperties}
            />
            {/* Scan line */}
            <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none z-20" />
          </div>

          {/* Complete indicator */}
          {isComplete && (
            <div className="pilot-light w-3 h-3 rounded-full bg-safety-green shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse-slow" />
          )}
        </div>
      </div>
    </div>
  );
}
