'use client';

import { useState } from 'react';
import { cn, formatScore } from '@/lib/utils';
import { useSimulationStore } from '@/lib/store';

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
  const { errors, score, isComplete, telemetryLogs, clearLogs } = useSimulationStore();
  const [activeTab, setActiveTab] = useState<'validation' | 'telemetry'>('validation');

  const hasResults = errors.length > 0 || isComplete;

  return (
    <div className="w-72 flex-shrink-0 h-full bg-workshop-surface border-l border-workshop-border flex flex-col overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex border-b border-workshop-border bg-workshop-bg">
        <button
          onClick={() => setActiveTab('validation')}
          className={cn(
            'flex-1 py-2.5 text-[10px] font-mono uppercase tracking-wider border-b-2 transition-colors',
            activeTab === 'validation'
              ? 'border-amber-500 text-amber-400 bg-workshop-surface'
              : 'border-transparent text-chalk-faded hover:text-chalk'
          )}
        >
          Validation {errors.length > 0 ? `(${errors.length})` : ''}
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={cn(
            'flex-1 py-2.5 text-[10px] font-mono uppercase tracking-wider border-b-2 transition-colors',
            activeTab === 'telemetry'
              ? 'border-amber-500 text-amber-400 bg-workshop-surface'
              : 'border-transparent text-chalk-faded hover:text-chalk'
          )}
        >
          Serial Log ({telemetryLogs.length})
        </button>
      </div>

      {activeTab === 'telemetry' ? (
        <div className="flex-1 flex flex-col bg-[#0B0C0E] overflow-hidden">
          <div className="px-3 py-2 border-b border-workshop-border flex items-center justify-between text-[10px] font-mono text-chalk-faded">
            <span>BENCH TELEMETRY</span>
            <button onClick={clearLogs} className="hover:text-chalk">CLEAR</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 font-mono text-[10px]">
            {telemetryLogs.map((log) => (
              <div key={log.id} className="leading-relaxed">
                <span className="text-chalk-faded mr-1.5">[{log.time}]</span>
                <span
                  className={cn(
                    log.level === 'ok'
                      ? 'text-safety-green'
                      : log.level === 'error'
                      ? 'text-safety-red'
                      : log.level === 'warn'
                      ? 'text-safety-yellow'
                      : 'text-chalk-dim'
                  )}
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : !hasResults ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-workshop bg-workshop-bg border border-workshop-border flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-chalk-faded">
              <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            </svg>
          </div>
          <p className="text-xs font-mono text-chalk-faded tracking-wider">
            CLICK &quot;RUN / ENERGIZE&quot;<br />TO TEST YOUR CIRCUIT
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-workshop-border flex items-center justify-between">
            <span className="text-[10px] font-mono text-chalk-faded tracking-widest">SCORE</span>
            <span
              className={cn(
                'text-sm font-display tracking-wider',
                score >= 80 ? 'text-safety-green' : score >= 50 ? 'text-amber-400' : 'text-safety-red'
              )}
            >
              {formatScore(score)}
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {isComplete && errors.length === 0 && (
              <div className="p-3 bg-safety-green/10 border border-safety-green/40 rounded-workshop space-y-2">
                <div className="stamp stamp-approved text-xs">CIRCUIT APPROVED</div>
                <p className="text-xs font-body text-chalk-dim leading-relaxed">
                  Closed loop verified! Use the floating &quot;TRY IT LIVE&quot; sliders on the bench to test Ohm&apos;s Law and trip the 5A fuse.
                </p>
              </div>
            )}

            {errors.map((err, i) => {
              const cfg = SEVERITY_CONFIG[err.severity] || SEVERITY_CONFIG.error;
              return (
                <div key={i} className={cn('p-3 rounded-workshop border text-xs space-y-1.5', cfg.bgColor, cfg.borderColor)}>
                  <div className={cn('font-mono text-[10px] font-bold flex items-center gap-1.5', cfg.textColor)}>
                    <span>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                  </div>
                  <p className="font-body text-chalk-dim leading-relaxed">{err.message}</p>
                  {err.hint && (
                    <p className="text-[11px] font-mono text-chalk-muted pt-1 border-t border-workshop-border/40">
                      💡 {err.hint}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
