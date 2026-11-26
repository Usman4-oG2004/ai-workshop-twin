'use client';

import { useCallback } from 'react';
import { cn, formatScore } from '@/lib/utils';
import { useSimulationStore } from '@/lib/store';
import { validateCircuit, ELECTRICAL_SCENARIOS } from '@/lib/simulation-engine/electrical';
import { playClick, playEnergize, playAlarm, playSuccess } from '@/lib/sound';
import type { SimulationComponent, Connection } from '@/lib/types';

interface CircuitControlsProps {
  scenarioId?: string;
}

export default function CircuitControls({ scenarioId = 'first-circuit' }: CircuitControlsProps) {
  const {
    components,
    connections,
    score,
    isComplete,
    isRunning,
    soundEnabled,
    quizMode,
    hintsUsed,
    currentHintIndex,
    setErrors,
    setScore,
    setComplete,
    setRunning,
    toggleSound,
    setQuizMode,
    useHint,
    reset,
    setPresetCircuit,
    addLog,
  } = useSimulationStore();

  const scenario = ELECTRICAL_SCENARIOS[scenarioId as keyof typeof ELECTRICAL_SCENARIOS];
  const hints = scenario?.hints ?? [];

  // ─── Run / Test & Energize Circuit ───
  const handleRunOrStop = useCallback(() => {
    if (isRunning) {
      setRunning(false);
      playClick(soundEnabled);
      addLog('info', 'POWER_OFF: Bench supply de-energized.');
      return;
    }

    const result = validateCircuit(components, connections, []);
    setErrors(result.errors);
    setScore(result.score);
    setComplete(result.isValid);

    if (result.isValid) {
      setRunning(true);
      playEnergize(soundEnabled);
      playSuccess(soundEnabled);
      addLog('ok', `VALIDATION_PASSED (${result.score}%): 12V DC supply energized.`);
    } else {
      setRunning(false);
      playAlarm(soundEnabled);
      addLog('error', `VALIDATION_FAILED: ${result.errors[0]?.message || 'Check wiring.'}`);
    }
  }, [components, connections, isRunning, soundEnabled, setErrors, setScore, setComplete, setRunning, addLog]);

  // ─── 1-Click "Wire It For Me" Demo Builder ───
  const handleWireForMe = useCallback(() => {
    playClick(soundEnabled);
    const batId = 'demo-bat-1';
    const swId = 'demo-sw-1';
    const fuseId = 'demo-fuse-1';
    const bulbId = 'demo-bulb-1';

    const presetComponents: SimulationComponent[] = [
      { id: batId, type: 'battery', label: '12V Battery', x: 168, y: 216, rotation: 0, connections: [], properties: { voltage: 12 } },
      { id: fuseId, type: 'fuse', label: '5A Safety Fuse', x: 360, y: 120, rotation: 0, connections: [], properties: {} },
      { id: swId, type: 'switch', label: 'Knife Switch', x: 528, y: 120, rotation: 0, connections: [], properties: {} },
      { id: bulbId, type: 'bulb', label: '12V Test Bulb', x: 432, y: 312, rotation: 0, connections: [], properties: {} },
    ];

    const presetConnections: Connection[] = [
      { id: 'c1', from: { componentId: batId, port: 'positive' }, to: { componentId: fuseId, port: 'in' }, isValid: true },
      { id: 'c2', from: { componentId: fuseId, port: 'out' }, to: { componentId: swId, port: 'in' }, isValid: true },
      { id: 'c3', from: { componentId: swId, port: 'out' }, to: { componentId: bulbId, port: 'in' }, isValid: true },
      { id: 'c4', from: { componentId: bulbId, port: 'out' }, to: { componentId: batId, port: 'negative' }, isValid: true },
    ];

    setPresetCircuit(presetComponents, presetConnections);
    const result = validateCircuit(presetComponents, presetConnections, []);
    setErrors(result.errors);
    setScore(result.score);
    setComplete(result.isValid);
    setRunning(false);
  }, [soundEnabled, setPresetCircuit, setErrors, setScore, setComplete, setRunning]);

  const handleHint = useCallback(() => {
    if (currentHintIndex < hints.length) {
      useHint();
      playClick(soundEnabled);
    }
  }, [currentHintIndex, hints.length, useHint, soundEnabled]);

  const currentHint =
    currentHintIndex > 0 && currentHintIndex <= hints.length
      ? hints[currentHintIndex - 1]
      : null;

  const gaugeWidth = `${Math.min(100, Math.max(0, score))}%`;

  return (
    <div className="flex-shrink-0 bg-workshop-surface border-t border-workshop-border">
      {currentHint && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
          <p className="text-xs font-mono text-amber-400">
            <span className="text-amber-600 mr-2">HINT {currentHintIndex}/{hints.length}</span>
            {currentHint}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5 px-4 py-3">
        {/* Run / Stop Energize Button */}
        <button
          onClick={handleRunOrStop}
          disabled={components.length === 0}
          className={cn(
            'px-4 py-2 font-heading text-xs sm:text-sm font-medium tracking-wider uppercase rounded-workshop transition-all duration-150',
            isRunning
              ? 'bg-safety-red text-white hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]'
              : 'bg-safety-green text-workshop-bg hover:bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.25)]',
            'disabled:opacity-30 disabled:cursor-not-allowed'
          )}
        >
          {isRunning ? '■ STOP POWER' : '▶ RUN / ENERGIZE'}
        </button>

        {/* Wire It For Me Demo Button */}
        <button
          onClick={handleWireForMe}
          className="px-3 py-2 font-mono text-xs bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/40 rounded-workshop transition-colors"
        >
          ⚡ WIRE IT FOR ME
        </button>

        {/* Find the Part Quiz */}
        <button
          onClick={() => {
            if (components.length === 0) handleWireForMe();
            setQuizMode(!quizMode);
            playClick(soundEnabled);
          }}
          className={cn(
            'px-3 py-2 font-mono text-xs border rounded-workshop transition-colors',
            quizMode
              ? 'bg-amber-500 text-workshop-bg border-amber-400 font-bold'
              : 'bg-workshop-bg text-chalk-muted hover:text-chalk border-workshop-border'
          )}
        >
          🎯 FIND THE PART
        </button>

        {/* Hint */}
        <button
          onClick={handleHint}
          disabled={currentHintIndex >= hints.length}
          className="px-3 py-2 font-mono text-xs bg-workshop-bg text-amber-500/80 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 disabled:opacity-30 rounded-workshop transition-colors"
        >
          HINT {hintsUsed > 0 ? `(${hintsUsed})` : ''}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="px-2.5 py-2 font-mono text-xs bg-workshop-bg text-chalk-muted hover:text-chalk border border-workshop-border rounded-workshop transition-colors"
          title="Toggle Workshop Audio"
        >
          {soundEnabled ? '🔊 SOUND ON' : '🔇 MUTED'}
        </button>

        {/* Reset */}
        <button
          onClick={() => {
            reset();
            playClick(soundEnabled);
          }}
          className="px-3 py-2 font-mono text-xs bg-workshop-bg text-chalk-muted hover:text-safety-red border border-workshop-border rounded-workshop transition-colors"
        >
          CLEAR BENCH
        </button>

        <div className="flex-1" />

        {/* Score Gauge */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[9px] font-mono text-chalk-faded tracking-widest">SCORE</span>
            <span
              className={cn(
                'text-lg font-display tracking-wider leading-none',
                score >= 80 ? 'text-safety-green' : score >= 50 ? 'text-amber-400' : score > 0 ? 'text-safety-red' : 'text-chalk-muted'
              )}
            >
              {formatScore(score)}
            </span>
          </div>

          <div className="w-28 h-5 bg-workshop-bg border border-workshop-border rounded-workshop overflow-hidden relative">
            <div className="absolute inset-0 flex">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex-1 border-r border-workshop-border/50 last:border-r-0" />
              ))}
            </div>
            <div
              className={cn(
                'h-full transition-all duration-700 ease-out relative z-10',
                score >= 80 ? 'bg-safety-green/80' : score >= 50 ? 'bg-amber-500/80' : 'bg-safety-red/80'
              )}
              style={{ width: gaugeWidth }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
