'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSimulationStore } from '@/lib/store';
import { ELECTRICAL_SCENARIOS } from '@/lib/simulation-engine/electrical';
import CircuitCanvas from '@/components/simulator/electrical/CircuitCanvas';
import ComponentShelf from '@/components/simulator/electrical/ComponentShelf';
import CircuitControls from '@/components/simulator/electrical/CircuitControls';
import ValidationPanel from '@/components/simulator/electrical/ValidationPanel';
import TutorAvatar from '@/components/ai-tutor/TutorAvatar';
import TutorPanel from '@/components/ai-tutor/TutorPanel';

// ═══════════════════════════════════════
// Electrical Workshop Page
// ═══════════════════════════════════════

type ScenarioKey = keyof typeof ELECTRICAL_SCENARIOS;

export default function ElectricalWorkshopPage() {
  const [scenarioId, setScenarioId] = useState<ScenarioKey>('first-circuit');
  const [showTutor, setShowTutor] = useState(false);
  const reset = useSimulationStore((s) => s.reset);
  const components = useSimulationStore((s) => s.components);
  const isComplete = useSimulationStore((s) => s.isComplete);

  const scenario = ELECTRICAL_SCENARIOS[scenarioId];
  const scenarioKeys = Object.keys(ELECTRICAL_SCENARIOS) as ScenarioKey[];

  // Reset simulation when scenario changes
  useEffect(() => {
    reset();
  }, [scenarioId, reset]);

  return (
    <div className="flex flex-col h-screen bg-workshop-bg text-chalk">
      {/* ─── Top Bar ─── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-workshop-surface border-b border-workshop-border">
        <div className="flex items-center gap-4">
          {/* Back link */}
          <a
            href="/"
            className="text-xs font-mono text-chalk-faded hover:text-amber-400 transition-colors tracking-wider"
          >
            ← WORKSHOP
          </a>

          {/* Divider */}
          <div className="w-px h-5 bg-workshop-border" />

          {/* Title */}
          <div>
            <h1 className="font-display text-xl text-amber-500 tracking-wider leading-none">
              ⚡ ELECTRICAL LAB
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Scenario selector */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-chalk-faded tracking-widest">SCENARIO</span>
            <select
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value as ScenarioKey)}
              className={cn(
                'bg-workshop-bg border border-workshop-border rounded-workshop',
                'text-xs font-heading text-chalk px-2 py-1.5',
                'focus:outline-none focus:border-amber-500/40',
                'cursor-pointer appearance-none pr-6',
                'hover:border-workshop-border-light transition-colors'
              )}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2371717A'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
              }}
            >
              {scenarioKeys.map((key) => (
                <option key={key} value={key}>
                  {ELECTRICAL_SCENARIOS[key].title}
                </option>
              ))}
            </select>
          </div>

          {/* Progress pills */}
          <div className="flex items-center gap-1.5 ml-2">
            <div className={cn(
              'h-1.5 w-8 rounded-full transition-colors',
              components.length > 0 ? 'bg-amber-500' : 'bg-workshop-border'
            )} />
            <div className={cn(
              'h-1.5 w-8 rounded-full transition-colors',
              components.length >= 3 ? 'bg-amber-500' : 'bg-workshop-border'
            )} />
            <div className={cn(
              'h-1.5 w-8 rounded-full transition-colors',
              isComplete ? 'bg-safety-green' : 'bg-workshop-border'
            )} />
          </div>

          {/* Tutor toggle */}
          <button
            onClick={() => setShowTutor(!showTutor)}
            className={cn(
              'px-3 py-1.5 text-xs font-heading tracking-wide rounded-workshop transition-all',
              showTutor
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-workshop-bg text-chalk-muted border border-workshop-border hover:border-workshop-border-light'
            )}
          >
            {showTutor ? '🎓 TUTOR ON' : '🎓 TUTOR'}
          </button>
        </div>
      </header>

      {/* ─── Scenario description bar ─── */}
      <div className="flex-shrink-0 px-4 py-2 bg-workshop-bg border-b border-workshop-border/50 flex items-center gap-3">
        <span className="work-order-tag text-[9px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-workshop tracking-widest">
          WORK ORDER
        </span>
        <p className="text-xs font-body text-chalk-dim">
          {scenario?.description}
        </p>
        {scenario?.requiredComponents && (
          <div className="ml-auto flex items-center gap-1">
            {scenario.requiredComponents.map((type: string) => (
              <span
                key={type}
                className="text-[8px] font-mono text-chalk-faded bg-workshop-elevated px-1.5 py-0.5 rounded-workshop border border-workshop-border"
              >
                {type.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Component Shelf */}
        <ComponentShelf />

        {/* Center: Circuit Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <CircuitCanvas />
          <CircuitControls scenarioId={scenarioId} />
        </div>

        {/* Right: Validation Panel / Tutor toggle area */}
        {showTutor ? (
          <div className="w-72 flex-shrink-0 h-full bg-workshop-surface border-l border-workshop-border flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-workshop bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <p className="font-display text-sm text-amber-400 tracking-wider">
                WORKSHOP FOREMAN
              </p>
              <p className="text-[10px] font-mono text-chalk-faded leading-relaxed">
                AI TUTOR PANEL<br />LOADS HERE
              </p>
            </div>
          </div>
        ) : (
          <ValidationPanel />
        )}
      </div>

      {/* ─── Hazard stripe footer ─── */}
      <div className="flex-shrink-0 h-1 bg-hazard-stripe" />

      {/* ─── AI Tutor Foreman ─── */}
      <TutorAvatar />
      <TutorPanel lessonTitle={scenario?.title} category="electrical" />
    </div>
  );
}
