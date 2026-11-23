'use client';

import { cn, formatScore } from '@/lib/utils';
import { useSimulationStore } from '@/lib/store';

// ═══════════════════════════════════════
// ValidationPanel — Results after testing
// ═══════════════════════════════════════

const SEVERITY_CONFIG = {
  critical: {
    icon: '🔴',
    label: 'CRITICAL',
    textColor: 'text-safety-red',
    bgColor: 'bg-safety-red/10',
    borderColor: 'border-safety-red/30',
  },
  error: {
    icon: '🟠',
    label: 'ERROR',
    textColor: 'text-safety-orange',
    bgColor: 'bg-safety-orange/10',
    borderColor: 'border-safety-orange/30',
  },
  warning: {
    icon: '🟡',
    label: 'WARNING',
    textColor: 'text-safety-yellow',
    bgColor: 'bg-safety-yellow/10',
    borderColor: 'border-safety-yellow/30',
  },
};

export default function ValidationPanel() {
  const { errors, score, isComplete } = useSimulationStore();

  // Don't show until testing has happened (score > 0 or errors present)
  const hasResults = errors.length > 0 || isComplete;

  if (!hasResults) {
    return (
      <div className="w-72 flex-shrink-0 h-full bg-workshop-surface border-l border-workshop-border flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-workshop bg-workshop-bg border border-workshop-border flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-chalk-faded">
              <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            </svg>
          </div>
          <p className="text-xs font-mono text-chalk-faded tracking-wider">
            TEST YOUR CIRCUIT<br />TO SEE RESULTS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 flex-shrink-0 h-full bg-workshop-surface border-l border-workshop-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-workshop-border">
        <h2 className="font-display text-lg text-chalk tracking-wider">
          VALIDATION
        </h2>
        <p className="text-[10px] font-mono text-chalk-muted mt-0.5 tracking-wider">
          {errors.length === 0 ? 'NO ISSUES FOUND' : `${errors.length} ISSUE${errors.length > 1 ? 'S' : ''} DETECTED`}
        </p>
      </div>

      {/* Score meter */}
      <div className="px-4 py-3 border-b border-workshop-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-chalk-faded tracking-widest">SCORE</span>
          <span
            className={cn(
              'text-sm font-display tracking-wider',
              score >= 80 ? 'text-safety-green' :
              score >= 50 ? 'text-amber-400' :
              'text-safety-red'
            )}
          >
            {formatScore(score)}
          </span>
        </div>
        {/* Meter bar */}
        <div className="h-3 bg-workshop-bg border border-workshop-border rounded-workshop overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-700 ease-out',
              score >= 80 ? 'bg-safety-green' :
              score >= 50 ? 'bg-amber-500' :
              'bg-safety-red'
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Error list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {errors.map((error, i) => {
          const config = SEVERITY_CONFIG[error.severity];
          return (
            <div
              key={i}
              className={cn(
                'p-3 rounded-workshop border',
                config.bgColor,
                config.borderColor
              )}
            >
              {/* Severity badge */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs">{config.icon}</span>
                <span className={cn('text-[9px] font-mono font-bold tracking-widest', config.textColor)}>
                  {config.label}
                </span>
                {error.type && (
                  <span className="ml-auto text-[8px] font-mono text-chalk-faded bg-workshop-bg/50 px-1.5 py-0.5 rounded-workshop">
                    {error.type.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Message */}
              <p className="text-xs font-body text-chalk-dim leading-relaxed">
                {error.message}
              </p>

              {/* Hint */}
              {error.hint && (
                <p className="mt-1.5 text-[10px] font-mono text-chalk-faded leading-relaxed">
                  💡 {error.hint}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Success stamp */}
      {isComplete && (
        <div className="p-4 border-t border-workshop-border">
          <div
            className={cn(
              'relative p-4 border-2 border-safety-green rounded-workshop',
              'bg-safety-green/5 text-center',
              'animate-stamp'
            )}
          >
            {/* Corner rivets */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-safety-green/40" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-safety-green/40" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-safety-green/40" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-safety-green/40" />

            <p className="font-display text-2xl text-safety-green tracking-widest">
              CIRCUIT
            </p>
            <p className="font-display text-3xl text-safety-green tracking-[0.2em] -mt-1">
              APPROVED
            </p>
            <div className="mt-2 h-px bg-safety-green/30" />
            <p className="mt-1.5 text-[9px] font-mono text-safety-green/70 tracking-wider">
              ALL CHECKS PASSED ✓
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
