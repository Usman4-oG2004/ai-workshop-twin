'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSimulationStore } from '@/lib/store';
import { playClick, playConnect, playAlarm, playSuccess } from '@/lib/sound';
import type { SimulationComponent } from '@/lib/types';

// ═══════════════════════════════════════
// SVG Schematic + Hardware Symbols
// ═══════════════════════════════════════

const QUIZ_PROMPTS = [
  { type: 'battery', question: 'Click the DC POWER SOURCE that drives electrical pressure (voltage).' },
  { type: 'switch', question: 'Click the CONTROL DEVICE that opens or closes the current path.' },
  { type: 'bulb', question: 'Click the ELECTRICAL LOAD that converts current into light & heat.' },
  { type: 'fuse', question: 'Click the SAFETY DEVICE that melts to break the circuit during an overload.' },
  { type: 'resistor', question: 'Click the COMPONENT that limits current flow in the loop.' },
];

const COMPONENT_SYMBOLS: Record<string, {
  render: (props: { highlight: boolean; error: boolean; energized?: boolean; switchClosed?: boolean; fuseBlown?: boolean; brightness?: number }) => React.ReactNode;
  ports: { id: string; dx: number; dy: number; polarity?: 'pos' | 'neg' | 'neutral' }[];
  width: number;
  height: number;
}> = {
  battery: {
    width: 84,
    height: 52,
    ports: [
      { id: 'positive', dx: 84, dy: 26, polarity: 'pos' },
      { id: 'negative', dx: 0, dy: 26, polarity: 'neg' },
    ],
    render: ({ highlight, error }) => (
      <g>
        {/* Physical Battery Pack Housing */}
        <rect x="12" y="4" width="60" height="44" rx="2" fill="#18181B" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#3F3F46'} strokeWidth="1.5" />
        <rect x="16" y="8" width="52" height="36" rx="1" fill="#111113" />
        {/* Cell plates */}
        <line x1="30" y1="14" x2="30" y2="38" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA'} strokeWidth="3" />
        <line x1="38" y1="19" x2="38" y2="33" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="1.5" />
        <line x1="46" y1="14" x2="46" y2="38" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA'} strokeWidth="3" />
        <line x1="54" y1="19" x2="54" y2="33" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="1.5" />
        {/* Terminals */}
        <line x1="0" y1="26" x2="12" y2="26" stroke="#71717A" strokeWidth="2.5" />
        <line x1="72" y1="26" x2="84" y2="26" stroke="#EF4444" strokeWidth="2.5" />
        {/* +/- labels */}
        <text x="73" y="18" fill="#EF4444" fontSize="11" fontWeight="bold" fontFamily="monospace">+</text>
        <text x="4" y="18" fill="#71717A" fontSize="11" fontWeight="bold" fontFamily="monospace">−</text>
      </g>
    ),
  },
  switch: {
    width: 80,
    height: 44,
    ports: [
      { id: 'in', dx: 0, dy: 24, polarity: 'pos' },
      { id: 'out', dx: 80, dy: 24, polarity: 'neutral' },
    ],
    render: ({ highlight, error, switchClosed = true }) => (
      <g>
        <rect x="10" y="6" width="60" height="32" rx="2" fill="#18181B" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#3F3F46'} strokeWidth="1.5" />
        <line x1="0" y1="24" x2="22" y2="24" stroke="#A1A1AA" strokeWidth="2" />
        <circle cx="22" cy="24" r="3.5" fill="#18181B" stroke={error ? '#EF4444' : '#F59E0B'} strokeWidth="2" />
        {/* Knife blade animates open/closed */}
        <line
          x1="24"
          y1="23"
          x2={switchClosed ? '56' : '52'}
          y2={switchClosed ? '24' : '9'}
          stroke={switchClosed ? '#4ADE80' : '#F59E0B'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="58" cy="24" r="3.5" fill="#18181B" stroke={error ? '#EF4444' : '#F59E0B'} strokeWidth="2" />
        <line x1="58" y1="24" x2="80" y2="24" stroke="#A1A1AA" strokeWidth="2" />
        <text x="27" y="36" fill={switchClosed ? '#4ADE80' : '#F59E0B'} fontSize="7.5" fontFamily="monospace">
          {switchClosed ? 'CLOSED' : 'OPEN'}
        </text>
      </g>
    ),
  },
  bulb: {
    width: 64,
    height: 64,
    ports: [
      { id: 'in', dx: 0, dy: 32, polarity: 'neutral' },
      { id: 'out', dx: 64, dy: 32, polarity: 'neg' },
    ],
    render: ({ highlight, error, energized = false, brightness = 1 }) => {
      const col = error ? '#EF4444' : energized ? '#FDE047' : highlight ? '#F59E0B' : '#FAFAFA';
      return (
        <g>
          {/* Ambient glow when lit */}
          {energized && (
            <circle
              cx="32"
              cy="32"
              r={22 + brightness * 8}
              fill="rgba(245, 158, 11, 0.25)"
              opacity={Math.min(1, 0.4 + brightness * 0.6)}
            />
          )}
          <circle
            cx="32"
            cy="32"
            r="17"
            fill={energized ? `rgba(251, 191, 36, ${Math.min(0.85, 0.25 + brightness * 0.5)})` : '#18181B'}
            stroke={col}
            strokeWidth="2"
          />
          {/* Tungsten Filament */}
          <path d="M 22 36 Q 32 18 42 36" fill="none" stroke={energized ? '#FFFFFF' : col} strokeWidth="1.8" />
          <line x1="0" y1="32" x2="15" y2="32" stroke="#A1A1AA" strokeWidth="2" />
          <line x1="49" y1="32" x2="64" y2="32" stroke="#A1A1AA" strokeWidth="2" />
        </g>
      );
    },
  },
  resistor: {
    width: 84,
    height: 36,
    ports: [
      { id: 'in', dx: 0, dy: 18, polarity: 'neutral' },
      { id: 'out', dx: 84, dy: 18, polarity: 'neutral' },
    ],
    render: ({ highlight, error }) => {
      const col = error ? '#EF4444' : highlight ? '#F59E0B' : '#D4A574';
      return (
        <g>
          <line x1="0" y1="18" x2="16" y2="18" stroke="#A1A1AA" strokeWidth="2" />
          <rect x="16" y="8" width="52" height="20" rx="3" fill="#27272A" stroke={col} strokeWidth="1.5" />
          {/* Color bands */}
          <rect x="24" y="8" width="4" height="20" fill="#EF4444" />
          <rect x="34" y="8" width="4" height="20" fill="#09090B" />
          <rect x="44" y="8" width="4" height="20" fill="#F59E0B" />
          <rect x="56" y="8" width="3" height="20" fill="#D4AF37" />
          <line x1="68" y1="18" x2="84" y2="18" stroke="#A1A1AA" strokeWidth="2" />
        </g>
      );
    },
  },
  fuse: {
    width: 76,
    height: 36,
    ports: [
      { id: 'in', dx: 0, dy: 18, polarity: 'pos' },
      { id: 'out', dx: 76, dy: 18, polarity: 'pos' },
    ],
    render: ({ highlight, error, fuseBlown = false }) => {
      const col = error || fuseBlown ? '#EF4444' : highlight ? '#F59E0B' : '#38BDF8';
      return (
        <g>
          <line x1="0" y1="18" x2="16" y2="18" stroke="#A1A1AA" strokeWidth="2" />
          <rect x="16" y="9" width="44" height="18" rx="2" fill="#18181B" stroke={col} strokeWidth="1.5" />
          {fuseBlown ? (
            <path d="M 18 18 L 32 18 M 44 18 L 58 18" stroke="#EF4444" strokeWidth="2" strokeDasharray="2 2" />
          ) : (
            <path d="M 18 18 Q 28 12 38 18 T 58 18" fill="none" stroke={col} strokeWidth="1.8" />
          )}
          <line x1="60" y1="18" x2="76" y2="18" stroke="#A1A1AA" strokeWidth="2" />
          {fuseBlown && (
            <text x="23" y="34" fill="#EF4444" fontSize="7.5" fontFamily="monospace">BLOWN</text>
          )}
        </g>
      );
    },
  },
  wire: {
    width: 64,
    height: 24,
    ports: [
      { id: 'in', dx: 0, dy: 12, polarity: 'neutral' },
      { id: 'out', dx: 64, dy: 12, polarity: 'neutral' },
    ],
    render: ({ highlight, error }) => (
      <g>
        <line x1="0" y1="12" x2="64" y2="12" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2.5" />
        <circle cx="32" cy="12" r="3" fill={highlight ? '#F59E0B' : '#71717A'} />
      </g>
    ),
  },
};

export default function CircuitCanvas() {
  const {
    components,
    connections,
    errors,
    selectedComponent,
    connectingFrom,
    isComplete,
    isRunning,
    switchClosed,
    supplyVoltage,
    loadResistance,
    soundEnabled,
    quizMode,
    selectComponent,
    moveComponent,
    rotateComponent,
    removeComponent,
    startConnection,
    completeConnection,
    cancelConnection,
    toggleSwitch,
    setSupplyVoltage,
    setLoadResistance,
    setQuizMode,
    addLog,
  } = useSimulationStore();

  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const errorComponentIds = new Set(
    errors.filter((e) => e.componentId).map((e) => e.componentId!)
  );

  // Live Ohm's Law Telemetry
  const hasSwitch = components.some((c) => c.type === 'switch');
  const hasFuse = components.some((c) => c.type === 'fuse');
  const circuitActive = isRunning && isComplete && (!hasSwitch || switchClosed);
  const currentAmps = circuitActive ? supplyVoltage / Math.max(1, loadResistance) : 0;
  const fuseBlown = hasFuse && currentAmps > 5.0;
  const effectiveActive = circuitActive && !fuseBlown;
  const powerWatts = effectiveActive ? supplyVoltage * currentAmps : 0;
  const brightness = effectiveActive ? Math.min(1.5, powerWatts / 12) : 0;

  useEffect(() => {
    if (fuseBlown && isRunning) {
      playAlarm(soundEnabled);
      addLog('error', `FUSE_TRIPPED: ${currentAmps.toFixed(2)}A exceeded 5.0A rating!`);
    }
  }, [fuseBlown, isRunning, currentAmps, soundEnabled, addLog]);

  const getSVGPoint = useCallback((e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  const snapToGrid = (val: number) => Math.round(val / 24) * 24;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, comp: SimulationComponent) => {
      e.stopPropagation();
      if (quizMode) {
        const target = QUIZ_PROMPTS[quizIndex % QUIZ_PROMPTS.length];
        if (comp.type === target.type) {
          playSuccess(soundEnabled);
          setQuizFeedback({ ok: true, msg: `Correct! That is the ${comp.label}.` });
          setTimeout(() => {
            setQuizFeedback(null);
            setQuizIndex((i) => i + 1);
          }, 1200);
        } else {
          playAlarm(soundEnabled);
          setQuizFeedback({ ok: false, msg: `Not quite — that's the ${comp.label}. Try again!` });
        }
        return;
      }

      const pt = getSVGPoint(e);
      setDragging({ id: comp.id, offsetX: pt.x - comp.x, offsetY: pt.y - comp.y });
      selectComponent(comp.id);
    },
    [getSVGPoint, selectComponent, quizMode, quizIndex, soundEnabled]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const pt = getSVGPoint(e);
      const x = Math.max(24, Math.min(840, snapToGrid(pt.x - dragging.offsetX)));
      const y = Math.max(48, Math.min(540, snapToGrid(pt.y - dragging.offsetY)));
      moveComponent(dragging.id, x, y);
    },
    [dragging, getSVGPoint, moveComponent]
  );

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const handlePortClick = useCallback(
    (e: React.MouseEvent, componentId: string, portId: string) => {
      e.stopPropagation();
      if (connectingFrom) {
        completeConnection(componentId, portId);
        playConnect(soundEnabled);
      } else {
        startConnection(componentId, portId);
        playClick(soundEnabled);
      }
    },
    [connectingFrom, startConnection, completeConnection, soundEnabled]
  );

  const handleCanvasClick = useCallback(() => {
    if (connectingFrom) cancelConnection();
    else selectComponent(null);
  }, [connectingFrom, cancelConnection, selectComponent]);

  const getPortPosition = useCallback(
    (componentId: string, portId: string) => {
      const comp = components.find((c) => c.id === componentId);
      if (!comp) return { x: 0, y: 0 };
      const sym = COMPONENT_SYMBOLS[comp.type];
      if (!sym) return { x: comp.x, y: comp.y };
      const port = sym.ports.find((p) => p.id === portId);
      if (!port) return { x: comp.x, y: comp.y };
      return { x: comp.x + port.dx, y: comp.y + port.dy };
    },
    [components]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelConnection();
        selectComponent(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cancelConnection, selectComponent]);

  const selectedCompObj = components.find((c) => c.id === selectedComponent);
  const currentQuiz = QUIZ_PROMPTS[quizIndex % QUIZ_PROMPTS.length];

  // Floating status prompt
  let statusPill = 'Click a glowing terminal ring, then its destination terminal to route a wire.';
  if (connectingFrom) statusPill = 'ROUTING WIRE — Click destination terminal or press ESC to cancel';
  else if (components.length === 0) statusPill = 'Bench empty — add components from the Parts Rack or click "WIRE IT FOR ME"';
  else if (fuseBlown) statusPill = 'OVERCURRENT TRIP — 5A safety fuse blown! Lower voltage or raise resistance.';
  else if (effectiveActive) statusPill = `CIRCUIT ENERGIZED — ${currentAmps.toFixed(2)}A flowing (${powerWatts.toFixed(1)}W load)`;
  else if (isRunning && !switchClosed) statusPill = 'SWITCH IS OPEN — Click the switch blade on the bench to close the loop.';

  return (
    <div className="relative flex-1 h-full overflow-hidden bg-[#0D0F12] rounded-workshop border border-workshop-border select-none">
      {/* ESD Cutting Mat Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245, 158, 11, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 158, 11, 0.045) 1px, transparent 1px),
            linear-gradient(rgba(250, 250, 250, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 250, 250, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '96px 96px, 96px 96px, 24px 24px, 24px 24px',
        }}
      />

      {/* Mat Scale Stamp */}
      <div className="absolute bottom-3 left-4 pointer-events-none text-[10px] font-mono tracking-[0.2em] text-chalk-faded/40 uppercase">
        ISA ESD-SAFE WORKMAT &bull; 1 SQUARE = 10 MM &bull; 12V DC BENCH
      </div>

      {/* Floating Status Pill (Top Center) */}
      <div
        className={cn(
          'absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-workshop border backdrop-blur-md text-[11px] font-mono tracking-wide shadow-lg transition-colors whitespace-nowrap',
          fuseBlown
            ? 'bg-safety-red/20 border-safety-red text-safety-red'
            : connectingFrom
            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
            : effectiveActive
            ? 'bg-safety-green/15 border-safety-green/50 text-safety-green'
            : 'bg-workshop-surface/90 border-workshop-border text-chalk-dim'
        )}
      >
        {statusPill}
      </div>

      {/* Quiz Mode Banner */}
      {quizMode && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md bg-workshop-elevated/95 border-2 border-amber-500 rounded-workshop p-3 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 mb-1">
            <span>FIND THE PART QUIZ &bull; QUESTION {(quizIndex % QUIZ_PROMPTS.length) + 1}/{QUIZ_PROMPTS.length}</span>
            <button onClick={() => setQuizMode(false)} className="text-chalk-muted hover:text-chalk">EXIT</button>
          </div>
          <p className="text-xs font-heading text-chalk">{currentQuiz.question}</p>
          {quizFeedback && (
            <div className={cn('mt-2 text-[11px] font-mono', quizFeedback.ok ? 'text-safety-green' : 'text-safety-red')}>
              {quizFeedback.msg}
            </div>
          )}
        </div>
      )}

      {/* Contextual Floating Part Toolbar */}
      {selectedCompObj && !quizMode && (
        <div
          className="absolute z-20 flex items-center gap-1.5 bg-workshop-elevated/95 border border-amber-500/40 px-2 py-1 rounded-workshop shadow-xl text-[11px] font-mono"
          style={{
            left: Math.max(16, Math.min(680, selectedCompObj.x)),
            top: Math.max(44, selectedCompObj.y - 34),
          }}
        >
          <span className="text-amber-400 px-1">{selectedCompObj.label}</span>
          {selectedCompObj.type === 'switch' && (
            <button
              onClick={() => {
                toggleSwitch();
                playClick(soundEnabled);
              }}
              className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-workshop border border-amber-500/30"
            >
              {switchClosed ? 'Open Blade' : 'Close Blade'}
            </button>
          )}
          <button
            onClick={() => {
              rotateComponent(selectedCompObj.id);
              playClick(soundEnabled);
            }}
            className="px-2 py-0.5 hover:bg-workshop-surface text-chalk rounded-workshop"
          >
            Rotate
          </button>
          <button
            onClick={() => {
              removeComponent(selectedCompObj.id);
              playClick(soundEnabled);
            }}
            className="px-2 py-0.5 hover:bg-safety-red/20 text-safety-red rounded-workshop"
          >
            Remove
          </button>
        </div>
      )}

      {/* Live Digital Multimeter HUD (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-20 w-52 bg-[#16181C]/95 border-2 border-amber-500/50 rounded-workshop p-3 shadow-2xl font-mono">
        <div className="flex items-center justify-between text-[9px] text-amber-400 border-b border-workshop-border pb-1 mb-2">
          <span>ISA-DMM80 MULTIMETER</span>
          <span className={cn('w-2 h-2 rounded-full', effectiveActive ? 'bg-safety-green animate-pulse' : 'bg-workshop-border-light')} />
        </div>
        <div className="bg-[#0A0D0A] border border-workshop-border rounded-workshop p-2 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-chalk-faded">VOLTS</span>
            <span className="text-base font-bold text-amber-400">
              {effectiveActive ? `${supplyVoltage.toFixed(2)} V` : '00.00 V'}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-chalk-faded">AMPS</span>
            <span className={cn('text-sm font-bold', fuseBlown ? 'text-safety-red' : 'text-safety-green')}>
              {effectiveActive ? `${currentAmps.toFixed(2)} A` : '0.00 A'}
            </span>
          </div>
          <div className="flex justify-between items-baseline text-[10px]">
            <span className="text-chalk-faded">LOAD</span>
            <span className="text-chalk-dim">{loadResistance} Ω</span>
          </div>
        </div>
      </div>

      {/* Floating "TRY IT" Interactive Controls Card when Energized */}
      {isRunning && isComplete && (
        <div className="absolute bottom-36 right-3 z-20 w-52 bg-workshop-surface/95 backdrop-blur-md border border-amber-500/40 rounded-workshop p-3 shadow-xl font-mono space-y-2.5">
          <div className="flex items-center justify-between text-[10px] text-amber-400 uppercase tracking-wider">
            <span>⚡ TRY IT LIVE</span>
            <span className="text-[9px] text-chalk-faded">OHM&apos;S LAW</span>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-chalk-muted mb-1">
              <span>Supply Voltage</span>
              <span className="text-amber-400">{supplyVoltage}V</span>
            </div>
            <input
              type="range"
              min={6}
              max={24}
              step={1}
              value={supplyVoltage}
              onChange={(e) => setSupplyVoltage(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5"
            />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-chalk-muted mb-1">
              <span>Load Resistance</span>
              <span className="text-chalk">{loadResistance}Ω</span>
            </div>
            <input
              type="range"
              min={2}
              max={100}
              step={2}
              value={loadResistance}
              onChange={(e) => setLoadResistance(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5"
            />
          </div>
          {hasSwitch && (
            <button
              onClick={() => {
                toggleSwitch();
                playClick(soundEnabled);
              }}
              className="w-full py-1.5 rounded-workshop bg-workshop-bg border border-workshop-border hover:border-amber-500 text-[10px] text-chalk transition-colors"
            >
              {switchClosed ? 'Toggle Switch → OPEN' : 'Toggle Switch → CLOSED'}
            </button>
          )}
        </div>
      )}

      {/* Main SVG Workspace */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 960 640"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        style={{ cursor: dragging ? 'grabbing' : connectingFrom ? 'crosshair' : 'default' }}
      >
        <defs>
          <pattern id="grid-dot" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.8" fill="rgba(245, 158, 11, 0.14)" />
          </pattern>
        </defs>
        <rect width="960" height="640" fill="url(#grid-dot)" />

        {/* Ruler Markings along Top & Left */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <text key={`rx-${n}`} x={n * 96 - 6} y="16" fill="rgba(250,250,250,0.22)" fontSize="9" fontFamily="monospace">
            {n * 10}
          </text>
        ))}
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <text key={`ry-${n}`} x="8" y={n * 96 + 4} fill="rgba(250,250,250,0.22)" fontSize="9" fontFamily="monospace">
            {n * 10}
          </text>
        ))}

        {/* Connections (Insulated Curved Jumper Wires) */}
        {connections.map((conn, idx) => {
          const from = getPortPosition(conn.from.componentId, conn.from.port);
          const to = getPortPosition(conn.to.componentId, conn.to.port);
          const midX = (from.x + to.x) / 2;
          const wireColor = !conn.isValid
            ? '#EF4444'
            : conn.from.port === 'positive'
            ? '#EF4444'
            : idx % 2 === 0
            ? '#F59E0B'
            : '#38BDF8';
          return (
            <g key={conn.id}>
              <path
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke="rgba(0,0,0,0.55)"
                strokeWidth="6"
              />
              <path
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke={wireColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              {effectiveActive && (
                <path
                  d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                  fill="none"
                  stroke="#FEF08A"
                  strokeWidth="2.5"
                  strokeDasharray="6 10"
                  className="animate-flow"
                />
              )}
            </g>
          );
        })}

        {/* Components */}
        {components.map((comp) => {
          const sym = COMPONENT_SYMBOLS[comp.type];
          if (!sym) return null;
          const isHovered = hoveredId === comp.id;
          const isSelected = selectedComponent === comp.id;
          const hasError = errorComponentIds.has(comp.id);

          return (
            <g
              key={comp.id}
              transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation || 0}, ${sym.width / 2}, ${sym.height / 2})`}
              onMouseDown={(e) => handleMouseDown(e, comp)}
              onMouseEnter={() => setHoveredId(comp.id)}
              onMouseLeave={() => setHoveredId(null)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (comp.type === 'switch') {
                  toggleSwitch();
                  playClick(soundEnabled);
                }
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              {(isSelected || isHovered) && (
                <rect
                  x="-5"
                  y="-5"
                  width={sym.width + 10}
                  height={sym.height + 10}
                  rx="3"
                  fill="none"
                  stroke={isSelected ? '#F59E0B' : 'rgba(245,158,11,0.4)'}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}

              {sym.render({
                highlight: isHovered || isSelected,
                error: hasError,
                energized: effectiveActive,
                switchClosed,
                fuseBlown,
                brightness,
              })}

              {/* Label */}
              <text
                x={sym.width / 2}
                y={sym.height + 14}
                textAnchor="middle"
                fill={hasError ? '#EF4444' : '#A1A1AA'}
                fontSize="10"
                fontFamily="monospace"
              >
                {comp.label}
              </text>

              {/* Glowing Connection Ports */}
              {sym.ports.map((port) => {
                const isSource =
                  connectingFrom?.componentId === comp.id && connectingFrom?.port === port.id;
                return (
                  <g
                    key={port.id}
                    onClick={(e) => handlePortClick(e, comp.id, port.id)}
                    className="cursor-pointer"
                  >
                    {/* Outer glowing target ring when connecting */}
                    {(connectingFrom || isHovered || isSelected) && (
                      <circle
                        cx={port.dx}
                        cy={port.dy}
                        r={isSource ? 11 : 8}
                        fill="none"
                        stroke={isSource ? '#4ADE80' : '#F59E0B'}
                        strokeWidth="1.5"
                        opacity="0.7"
                      />
                    )}
                    <circle
                      cx={port.dx}
                      cy={port.dy}
                      r="5"
                      fill={isSource ? '#4ADE80' : port.polarity === 'pos' ? '#EF4444' : '#18181B'}
                      stroke="#F59E0B"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
