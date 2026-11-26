'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Plumbing3DRig, {
  type Plumbing3DState,
  type PlumbingFaultMode,
} from '@/components/simulator/plumbing/Plumbing3DRig';
import TutorAvatar from '@/components/ai-tutor/TutorAvatar';
import TutorPanel from '@/components/ai-tutor/TutorPanel';
import { playClick, playConnect, playAlarm, playSuccess } from '@/lib/sound';
import { cn } from '@/lib/utils';

const ASSEMBLY_STEPS = [
  { step: 1, title: 'Mount 15mm Copper Riser & Brass Isolation Valve', detail: 'Incoming mains cold feed with quarter-turn ball valve.' },
  { step: 2, title: 'Fit Compression Elbow & Horizontal 15mm Run to Mixer', detail: 'Seat brass olive squarely; tighten compression nut 1.25 turns past hand-tight.' },
  { step: 3, title: 'Install 32mm P-Trap (50mm Seal) & 1:40 Waste Arm', detail: 'BS EN 274 water seal prevents municipal sewer gas backflow.' },
  { step: 4, title: 'Attach Brass Test Tee & Bourdon Pressure Gauge', detail: '0–6 Bar analog test manifold for hydrostatic commissioning.' },
];

export default function PlumbingWorkshopPage() {
  const [rig, setRig] = useState<Plumbing3DState>({
    valveOpen: false,
    pressureBar: 3.0,
    assembledSteps: 0,
    jointsTorqued: false,
    faultMode: 'none',
    cameraPreset: '3/4',
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [logs, setLogs] = useState<{ ts: string; level: 'info' | 'ok' | 'err'; msg: string }[]>([
    { ts: '00:00.000', level: 'info', msg: 'RIG_02_READY: Isolation valve closed. Assemble 15mm copperwork.' },
  ]);

  const appendLog = (level: 'info' | 'ok' | 'err', msg: string) => {
    const now = new Date();
    const ts = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    setLogs((prev) => [...prev.slice(-24), { ts, level, msg }]);
  };

  const handleStepAssemble = (stepNum: number) => {
    playConnect(soundEnabled);
    setRig((s) => ({ ...s, assembledSteps: stepNum }));
    appendLog('ok', `FITTING_SEATED: ${ASSEMBLY_STEPS[stepNum - 1].title}`);
  };

  const handleAutoAssemble = () => {
    playConnect(soundEnabled);
    setRig((s) => ({ ...s, assembledSteps: 4, jointsTorqued: true }));
    appendLog('ok', 'PIPEWORK_ASSEMBLED: 15mm copper supply, P-trap, and test gauge torqued.');
  };

  const handleTorqueJoints = () => {
    playClick(soundEnabled);
    setRig((s) => ({ ...s, jointsTorqued: true }));
    appendLog('ok', 'COMPRESSION_TORQUE: Brass olives seated 1.25 turns past finger-tight.');
  };

  const handleToggleValve = () => {
    const next = !rig.valveOpen;
    if (next && (!rig.jointsTorqued || rig.faultMode === 'loose-olive')) {
      playAlarm(soundEnabled);
      appendLog('err', 'COMPRESSION_LEAK: Water weeping at untorqued 15mm brass elbow nut.');
    } else if (next && rig.faultMode === 'no-trap') {
      playAlarm(soundEnabled);
      appendLog('err', 'BS_EN_274_FAIL: No 50mm water seal trap installed on waste outlet.');
    } else if (next) {
      playSuccess(soundEnabled);
      appendLog('ok', `HYDRO_TEST_ACTIVE: Holding ${rig.pressureBar.toFixed(1)} Bar with 0 weeping joints.`);
    } else {
      playClick(soundEnabled);
      appendLog('info', 'ISOLATION_VALVE: Closed.');
    }
    setRig((s) => ({ ...s, valveOpen: next }));
  };

  const isLeaking = rig.valveOpen && rig.assembledSteps >= 2 && (!rig.jointsTorqued || rig.faultMode === 'loose-olive');
  const activePressure = rig.valveOpen && rig.assembledSteps >= 2 ? (isLeaking ? Math.max(0.8, rig.pressureBar - 1.4) : rig.pressureBar) : 0;
  const flowLpm = rig.valveOpen && rig.assembledSteps >= 2 ? (activePressure * 2.4).toFixed(1) : '0.0';

  return (
    <main className="min-h-screen flex flex-col bg-paper text-ink">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-workshop-border gap-3">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-trade-plumbing font-semibold">
              WRAS &bull; RIG 02 DOMESTIC COPPER &amp; WASTE COMMISSIONING
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink">
              15mm Copper Compression Supply &amp; 32mm P-Trap
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-paper-lo p-1 rounded-workshop border border-workshop-border text-[11px] font-mono">
              {(['3/4', 'front', 'valve', 'trap'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setRig((s) => ({ ...s, cameraPreset: preset }))}
                  className={cn(
                    'px-2.5 py-1 rounded-workshop uppercase transition-colors',
                    rig.cameraPreset === preset ? 'bg-ink text-paper-hi' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  {preset}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-3">
            <Plumbing3DRig
              state={rig}
              onToggleValve={handleToggleValve}
              onTorqueJoints={handleTorqueJoints}
            />

            {/* Hydrostatic Gauge Telemetry Strip */}
            <div className="bg-[#141619] text-[#E2E8F0] rounded-workshop border border-zinc-700 p-4 font-mono grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Static Pressure</div>
                <div className={cn('text-lg font-semibold', isLeaking ? 'text-red-400' : 'text-teal-400')}>
                  {activePressure.toFixed(1)} Bar
                </div>
                <div className="text-[10px] text-zinc-500">{(activePressure * 14.5).toFixed(0)} PSI</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Flow Rate</div>
                <div className="text-lg font-semibold text-emerald-400">{flowLpm} L/min</div>
                <div className="text-[10px] text-zinc-500">15mm Copper Bore</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Compression Seal</div>
                <div className={cn('text-lg font-semibold', isLeaking ? 'text-red-400' : rig.jointsTorqued ? 'text-emerald-400' : 'text-amber-400')}>
                  {isLeaking ? 'LEAKING' : rig.jointsTorqued ? 'TORQUED' : 'HAND-TIGHT'}
                </div>
                <div className="text-[10px] text-zinc-500">Olive Seating Check</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Trap Water Seal</div>
                <div className={cn('text-lg font-semibold', rig.faultMode === 'no-trap' || rig.assembledSteps < 3 ? 'text-amber-400' : 'text-emerald-400')}>
                  {rig.faultMode === 'no-trap' ? 'OMITTED' : rig.assembledSteps >= 3 ? '50mm OK' : 'PENDING'}
                </div>
                <div className="text-[10px] text-zinc-500">BS EN 274 Std</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="workshop-card p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-workshop-border pb-2">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-ink">
                  1. Pipework Assembly
                </span>
                <button
                  onClick={handleAutoAssemble}
                  className="text-[11px] font-mono text-trade-plumbing hover:underline font-semibold"
                >
                  Assemble &amp; Torque (Demo)
                </button>
              </div>

              <div className="space-y-2">
                {ASSEMBLY_STEPS.map((w) => {
                  const done = rig.assembledSteps >= w.step;
                  return (
                    <button
                      key={w.step}
                      onClick={() => handleStepAssemble(w.step)}
                      className={cn(
                        'w-full text-left p-2.5 rounded-workshop border text-xs transition-colors',
                        done
                          ? 'bg-teal-50/70 border-trade-plumbing/40 text-ink'
                          : 'bg-paper border-workshop-border hover:border-ink text-ink-secondary'
                      )}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>{w.step}. {w.title}</span>
                        <span className="font-mono text-[10px] uppercase">{done ? 'FITTED' : 'FIT'}</span>
                      </div>
                      <div className="text-[11px] text-ink-faded mt-0.5">{w.detail}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="workshop-card p-4 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider font-semibold text-ink border-b border-workshop-border pb-2">
                2. Hydrostatic Commissioning
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={handleTorqueJoints}
                  className={cn(
                    'py-2 px-2 rounded-workshop border font-semibold transition-colors',
                    rig.jointsTorqued
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-paper text-ink border-workshop-border hover:border-ink'
                  )}
                >
                  {rig.jointsTorqued ? 'Nuts Torqued' : 'Torque Brass Nuts'}
                </button>
                <button
                  onClick={handleToggleValve}
                  className={cn(
                    'py-2 px-2 rounded-workshop border font-semibold transition-colors',
                    rig.valveOpen
                      ? 'bg-trade-plumbing text-white border-teal-800'
                      : 'bg-paper text-ink border-workshop-border hover:border-ink'
                  )}
                >
                  Valve: {rig.valveOpen ? 'OPEN' : 'SHUT'}
                </button>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-ink-muted mb-1">
                  <span>Test Manifold Pressure</span>
                  <span className="font-semibold text-ink">{rig.pressureBar.toFixed(1)} Bar</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={6.0}
                  step={0.5}
                  value={rig.pressureBar}
                  onChange={(e) => setRig((s) => ({ ...s, pressureBar: Number(e.target.value) }))}
                  className="w-full accent-teal-700 cursor-pointer h-1.5"
                />
              </div>

              <div className="pt-2 border-t border-rule-soft">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-ink-faded mb-1.5">
                  Diagnostic Fault Scenario
                </label>
                <select
                  value={rig.faultMode}
                  onChange={(e) => {
                    const mode = e.target.value as PlumbingFaultMode;
                    setRig((s) => ({ ...s, faultMode: mode, valveOpen: false }));
                    appendLog('info', `SCENARIO_LOADED: ${mode.toUpperCase()}`);
                  }}
                  className="input-workshop py-1.5 text-xs font-mono"
                >
                  <option value="none">Nominal Commissioning (3.0 Bar Tight)</option>
                  <option value="loose-olive">Fault: Unseated Olive / Weeping Compression Nut</option>
                  <option value="no-trap">Fault: Missing 32mm P-Trap (Sewer Gas)</option>
                </select>
              </div>
            </div>

            <div className="bg-[#141619] text-[#E2E8F0] rounded-workshop border border-zinc-700 p-3 font-mono text-[10px] h-32 overflow-y-auto space-y-1.5">
              <div className="text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1">
                Hydrostatic Test Log
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
      <TutorPanel lessonTitle="WRAS 15mm Copper & P-Trap Commissioning" category="plumbing" />
    </main>
  );
}
