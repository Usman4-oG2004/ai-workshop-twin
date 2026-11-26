'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Electrical3DRig, {
  type Electrical3DState,
  type ElectricalFaultMode,
} from '@/components/simulator/electrical/Electrical3DRig';
import TutorAvatar from '@/components/ai-tutor/TutorAvatar';
import TutorPanel from '@/components/ai-tutor/TutorPanel';
import { playClick, playConnect, playEnergize, playAlarm } from '@/lib/sound';
import { cn } from '@/lib/utils';

const WIRING_STEPS = [
  {
    step: 1,
    title: 'Route Brown Line Conductor (6A MCB → Switch COM)',
    detail: 'BS 6004 1.5mm² Twin & Earth brown insulated conductor.',
  },
  {
    step: 2,
    title: 'Route Switched Line (Switch L1 → Luminaire L)',
    detail: 'Sleeved brown at switch return terminal to ceiling batten live.',
  },
  {
    step: 3,
    title: 'Route Blue Neutral Return (Luminaire N → CU Neutral Bar)',
    detail: 'Continuous blue neutral return path to Consumer Unit busbar.',
  },
  {
    step: 4,
    title: 'Connect Green/Yellow CPC Earth (CU Earth Bar → Backbox & Fitting)',
    detail: 'Mandatory Circuit Protective Conductor continuity (R1+R2).',
  },
];

export default function ElectricalWorkshopPage() {
  const [rig, setRig] = useState<Electrical3DState>({
    mainIsolatorOn: false,
    mcb6AOn: false,
    wallSwitchOn: true,
    wiredSteps: 0,
    faultMode: 'none',
    safeIsolated: true,
    cameraPreset: '3/4',
    labelsVisible: true,
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [logs, setLogs] = useState<{ ts: string; level: 'info' | 'ok' | 'err'; msg: string }[]>([
    { ts: '00:00.000', level: 'info', msg: 'BAY_01_READY: 230V AC supply locked off. GS38 isolation verified.' },
  ]);

  const appendLog = (level: 'info' | 'ok' | 'err', msg: string) => {
    const now = new Date();
    const ts = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    setLogs((prev) => [...prev.slice(-24), { ts, level, msg }]);
  };

  const handleStepWire = (stepNum: number) => {
    if (rig.mainIsolatorOn) {
      playAlarm(soundEnabled);
      appendLog('err', 'SAFETY VIOLATION: Isolate 100A Main Switch before altering conductors.');
      return;
    }
    playConnect(soundEnabled);
    setRig((s) => ({ ...s, wiredSteps: stepNum }));
    appendLog('ok', `CONDUCTOR_TERMINATED: Step ${stepNum} (${WIRING_STEPS[stepNum - 1].title})`);
  };

  const handleAutoWireAll = () => {
    if (rig.mainIsolatorOn) {
      setRig((s) => ({ ...s, mainIsolatorOn: false, mcb6AOn: false, wiredSteps: 4 }));
    } else {
      setRig((s) => ({ ...s, wiredSteps: 4 }));
    }
    playConnect(soundEnabled);
    appendLog('ok', 'COMPLETE_LOOM_ROUTED: L, Switched L, N, and CPC Earth terminated to BS 7671.');
  };

  const handleToggleMain = () => {
    const next = !rig.mainIsolatorOn;
    playClick(soundEnabled);
    setRig((s) => ({ ...s, mainIsolatorOn: next, safeIsolated: !next }));
    appendLog('info', `MAIN_ISOLATOR_100A: ${next ? 'CLOSED (Live Busbar)' : 'OPEN (Safe Isolated)'}`);
  };

  const handleToggleMcb = () => {
    if (!rig.mainIsolatorOn) {
      playClick(soundEnabled);
      setRig((s) => ({ ...s, mcb6AOn: !s.mcb6AOn }));
      return;
    }
    if (!rig.mcb6AOn && rig.faultMode === 'short-ln') {
      playAlarm(soundEnabled);
      appendLog('err', '6A_MCB_TRIPPED: Dead short detected (Line-to-Neutral). Magnetic trip <10ms.');
      setRig((s) => ({ ...s, mcb6AOn: false }));
      return;
    }
    const next = !rig.mcb6AOn;
    if (next) playEnergize(soundEnabled);
    else playClick(soundEnabled);
    setRig((s) => ({ ...s, mcb6AOn: next }));
    appendLog(next ? 'ok' : 'info', `MCB_6A_LIGHTING: ${next ? 'ENERGIZED (230.4V AC)' : 'OFF'}`);
  };

  const handleToggleSwitch = () => {
    playClick(soundEnabled);
    setRig((s) => ({ ...s, wallSwitchOn: !s.wallSwitchOn }));
    appendLog('info', `WALL_SWITCH_10AX: ${!rig.wallSwitchOn ? 'CLOSED' : 'OPEN'}`);
  };

  // Instrument Readings (MFT)
  const supplyLive = rig.mainIsolatorOn && rig.mcb6AOn && rig.faultMode !== 'short-ln';
  const circuitClosed = supplyLive && rig.wiredSteps >= 3 && rig.wallSwitchOn && rig.faultMode === 'none';
  const voltsReading = supplyLive && rig.wiredSteps >= 1 ? '230.4 V' : '000.0 V';
  const ampsReading = circuitClosed ? '0.026 A' : '0.000 A';
  const r1r2Reading =
    rig.wiredSteps >= 4 && rig.faultMode !== 'no-earth' ? '0.34 Ω' : 'OPEN (FAIL)';
  const irReading = rig.faultMode === 'short-ln' ? '0.02 MΩ (FAULT)' : '>299 MΩ (PASS)';

  return (
    <main className="min-h-screen flex flex-col bg-paper text-ink">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-workshop-border gap-3">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-trade-electrical font-semibold">
              BS 7671 &bull; BAY 01 DOMESTIC LIGHTING COMMISSIONING
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink">
              1-Way Lighting Circuit &amp; Consumer Unit
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Camera Presets */}
            <div className="flex items-center bg-paper-lo p-1 rounded-workshop border border-workshop-border text-[11px] font-mono">
              {(['3/4', 'front', 'cu', 'switch'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setRig((s) => ({ ...s, cameraPreset: preset }))}
                  className={cn(
                    'px-2.5 py-1 rounded-workshop uppercase transition-colors',
                    rig.cameraPreset === preset ? 'bg-ink text-paper-hi' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  {preset === 'cu' ? 'Consumer Unit' : preset}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn-workshop-secondary py-1.5 px-3 text-[11px] font-mono"
            >
              {soundEnabled ? 'Audio: On' : 'Audio: Muted'}
            </button>
          </div>
        </div>

        {/* Main 3D Rig + Side Commissioning Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* 3D Viewport */}
          <div className="lg:col-span-8 space-y-3">
            <Electrical3DRig
              state={rig}
              onToggleMainIsolator={handleToggleMain}
              onToggleMcb={handleToggleMcb}
              onToggleWallSwitch={handleToggleSwitch}
            />

            {/* Digital MFT Instrument Strip */}
            <div className="bg-[#141619] text-[#E2E8F0] rounded-workshop border border-zinc-700 p-4 font-mono grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Supply Voltage (L-N)</div>
                <div className="text-lg font-semibold text-amber-400">{voltsReading}</div>
                <div className="text-[10px] text-zinc-500">50.0 Hz AC</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Load Current</div>
                <div className="text-lg font-semibold text-emerald-400">{ampsReading}</div>
                <div className="text-[10px] text-zinc-500">6W LED Batten</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Continuity (R1+R2)</div>
                <div className={cn('text-lg font-semibold', r1r2Reading.includes('FAIL') ? 'text-red-400' : 'text-emerald-400')}>
                  {r1r2Reading}
                </div>
                <div className="text-[10px] text-zinc-500">CPC Earth Loop</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Insulation (500V DC)</div>
                <div className={cn('text-lg font-semibold', irReading.includes('FAULT') ? 'text-red-400' : 'text-emerald-400')}>
                  {irReading}
                </div>
                <div className="text-[10px] text-zinc-500">Min &ge; 1.0 MΩ</div>
              </div>
            </div>
          </div>

          {/* Right Panel: Wiring Sequence, Breakers & Fault Injection */}
          <div className="lg:col-span-4 space-y-4">
            {/* Conductor Termination Sequence */}
            <div className="workshop-card p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-workshop-border pb-2">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-ink">
                  1. Conductor Termination
                </span>
                <button
                  onClick={handleAutoWireAll}
                  className="text-[11px] font-mono text-trade-electrical hover:underline font-semibold"
                >
                  Terminate All (Demo)
                </button>
              </div>

              <div className="space-y-2">
                {WIRING_STEPS.map((w) => {
                  const done = rig.wiredSteps >= w.step;
                  return (
                    <button
                      key={w.step}
                      onClick={() => handleStepWire(w.step)}
                      className={cn(
                        'w-full text-left p-2.5 rounded-workshop border text-xs transition-colors',
                        done
                          ? 'bg-emerald-50/70 border-safety-green/40 text-ink'
                          : 'bg-paper border-workshop-border hover:border-ink text-ink-secondary'
                      )}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>{w.step}. {w.title}</span>
                        <span className="font-mono text-[10px] uppercase">
                          {done ? 'TERMINATED' : 'ROUTE'}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-faded mt-0.5">{w.detail}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Consumer Unit Controls */}
            <div className="workshop-card p-4 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider font-semibold text-ink border-b border-workshop-border pb-2">
                2. Commissioning &amp; Isolation
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  onClick={handleToggleMain}
                  className={cn(
                    'py-2 px-2 rounded-workshop border font-semibold transition-colors',
                    rig.mainIsolatorOn
                      ? 'bg-red-700 text-white border-red-800'
                      : 'bg-paper text-ink border-workshop-border hover:border-ink'
                  )}
                >
                  Main: {rig.mainIsolatorOn ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={handleToggleMcb}
                  className={cn(
                    'py-2 px-2 rounded-workshop border font-semibold transition-colors',
                    rig.mcb6AOn
                      ? 'bg-amber-700 text-white border-amber-800'
                      : 'bg-paper text-ink border-workshop-border hover:border-ink'
                  )}
                >
                  6A MCB: {rig.mcb6AOn ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={handleToggleSwitch}
                  className={cn(
                    'py-2 px-2 rounded-workshop border font-semibold transition-colors',
                    rig.wallSwitchOn
                      ? 'bg-ink text-paper-hi border-ink'
                      : 'bg-paper text-ink border-workshop-border hover:border-ink'
                  )}
                >
                  Switch: {rig.wallSwitchOn ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Fault Injection */}
              <div className="pt-2 border-t border-rule-soft">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-ink-faded mb-1.5">
                  Diagnostic Fault Scenario
                </label>
                <select
                  value={rig.faultMode}
                  onChange={(e) => {
                    const mode = e.target.value as ElectricalFaultMode;
                    setRig((s) => ({ ...s, faultMode: mode, mcb6AOn: false }));
                    appendLog('info', `SCENARIO_LOADED: ${mode.toUpperCase()}`);
                  }}
                  className="input-workshop py-1.5 text-xs font-mono"
                >
                  <option value="none">Nominal Installation (No Fault)</option>
                  <option value="short-ln">Fault: Line-to-Neutral Dead Short (MCB Trip)</option>
                  <option value="open-neutral">Fault: Open Neutral Conductor</option>
                  <option value="no-earth">Fault: Disconnected CPC Earth</option>
                </select>
              </div>
            </div>

            {/* Live Commissioning Log */}
            <div className="bg-[#141619] text-[#E2E8F0] rounded-workshop border border-zinc-700 p-3 font-mono text-[10px] h-36 overflow-y-auto space-y-1.5">
              <div className="text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1">
                Commissioning Telemetry Log
              </div>
              {logs.map((l, i) => (
                <div key={i}>
                  <span className="text-zinc-500 mr-1.5">[{l.ts}]</span>
                  <span className={l.level === 'err' ? 'text-red-400' : l.level === 'ok' ? 'text-emerald-400' : 'text-zinc-300'}>
                    {l.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <TutorAvatar />
      <TutorPanel lessonTitle="BS 7671 1-Way Lighting Circuit" category="electrical" />
    </main>
  );
}
