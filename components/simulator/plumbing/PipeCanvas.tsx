"use client";

import { useState } from "react";
import { Wrench, RotateCw, Trash2 } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import { playClick, playConnect } from "@/lib/sound";

interface PipeCanvasProps {
  isWaterTurnedOn: boolean;
}

export default function PipeCanvas({ isWaterTurnedOn }: PipeCanvasProps) {
  const {
    components,
    connections,
    selectedComponent,
    connectingFrom,
    errors,
    soundEnabled,
    supplyPressure,
    selectComponent,
    moveComponent,
    rotateComponent,
    removeComponent,
    startConnection,
    completeConnection,
    setSupplyPressure,
  } = useSimulationStore();

  const [draggedId, setDraggedId] = useState<string | null>(null);

  const hasTrap = components.some((c) => c.type === "trap");
  const hasLeaks = errors.some((e) => e.severity === "critical");
  const flowRate = isWaterTurnedOn ? (supplyPressure * 0.12).toFixed(1) : "0.0";
  const highPressureWarning = isWaterTurnedOn && supplyPressure > 80;

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(id);
    setDraggedId(id);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = Math.max(30, Math.min(rect.width - 100, e.clientX - rect.left - 40));
    const newY = Math.max(40, Math.min(rect.height - 80, e.clientY - rect.top - 30));
    moveComponent(draggedId, Math.round(newX / 24) * 24, Math.round(newY / 24) * 24);
  };

  const handleMouseUp = () => setDraggedId(null);

  const handlePortClick = (componentId: string, port: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!connectingFrom) {
      startConnection(componentId, port);
      playClick(soundEnabled);
    } else {
      completeConnection(componentId, port);
      playConnect(soundEnabled);
    }
  };

  const renderPipeGraphic = (type: string) => {
    switch (type) {
      case "faucet":
        return (
          <g>
            <rect x="0" y="10" width="44" height="40" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
            <rect x="14" y="0" width="16" height="10" fill="#0284C7" stroke="#38BDF8" />
            <circle cx="22" cy="5" r="3" fill="#E0F2FE" />
            <path d="M 44 25 L 68 25 L 68 45" fill="none" stroke="#38BDF8" strokeWidth="4" />
            <text x="8" y="44" fill="#38BDF8" fontSize="9" fontFamily="monospace">TAP</text>
          </g>
        );
      case "pipe-straight":
        return (
          <g>
            <rect x="0" y="15" width="100" height="24" rx="1" fill="#0F172A" stroke="#D4A574" strokeWidth="1.5" />
            <line x1="10" y1="22" x2="90" y2="22" stroke="#FCD34D" strokeWidth="1" strokeOpacity="0.35" />
            <text x="26" y="31" fill="#E0F2FE" fontSize="9" fontFamily="monospace">15mm Cu</text>
          </g>
        );
      case "pipe-elbow":
        return (
          <g>
            <rect x="0" y="0" width="60" height="60" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <path d="M 10 50 Q 10 10 50 10" fill="none" stroke="#D4A574" strokeWidth="11" />
            <text x="14" y="42" fill="#38BDF8" fontSize="8" fontFamily="monospace">90° ELBOW</text>
          </g>
        );
      case "pipe-tee":
        return (
          <g>
            <rect x="0" y="0" width="70" height="60" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="0" y1="30" x2="70" y2="30" stroke="#D4A574" strokeWidth="10" />
            <line x1="35" y1="30" x2="35" y2="60" stroke="#D4A574" strokeWidth="10" />
            <text x="25" y="16" fill="#38BDF8" fontSize="8" fontFamily="monospace">TEE</text>
          </g>
        );
      case "trap":
        return (
          <g>
            <rect x="0" y="0" width="70" height="70" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <path
              d="M 15 10 L 15 40 Q 15 60 35 60 Q 55 60 55 35 L 55 10"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="8"
            />
            {isWaterTurnedOn && (
              <path d="M 15 44 Q 35 60 55 44" fill="none" stroke="#7DD3FC" strokeWidth="4" opacity="0.8" />
            )}
            <text x="18" y="34" fill="#38BDF8" fontSize="8" fontFamily="monospace">P-TRAP</text>
          </g>
        );
      case "drain":
        return (
          <g>
            <rect x="0" y="10" width="54" height="40" rx="2" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            <line x1="10" y1="20" x2="44" y2="20" stroke="#94A3B8" strokeWidth="2" />
            <line x1="10" y1="28" x2="44" y2="28" stroke="#94A3B8" strokeWidth="2" />
            <line x1="10" y1="36" x2="44" y2="36" stroke="#94A3B8" strokeWidth="2" />
            <text x="11" y="46" fill="#94A3B8" fontSize="8" fontFamily="monospace">DRAIN</text>
          </g>
        );
      case "valve":
        return (
          <g>
            <rect x="0" y="10" width="60" height="35" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <rect x="22" y="2" width="16" height="8" rx="1" fill={isWaterTurnedOn ? "#4ADE80" : "#EF4444"} stroke="#FAFAFA" strokeWidth="1" />
            <text x="14" y="32" fill="#38BDF8" fontSize="8" fontFamily="monospace">VALVE</text>
          </g>
        );
      default:
        return <rect x="0" y="0" width="70" height="40" rx="2" fill="#1E293B" stroke="#38BDF8" />;
    }
  };

  let statusPill = "Click a glowing blue port, then the destination fitting port to seat a pipe joint.";
  if (connectingFrom) statusPill = "ROUTING PIPE — Click destination fitting port to complete joint";
  else if (components.length === 0) statusPill = 'Bench clear — add fittings from left or click "ASSEMBLE FOR ME"';
  else if (highPressureWarning) statusPill = `WATER HAMMER WARNING — ${supplyPressure} PSI exceeds safe residential limit (80 PSI)!`;
  else if (isWaterTurnedOn && hasLeaks) statusPill = "LEAK DETECTED — Unsealed port under pressure!";
  else if (isWaterTurnedOn) statusPill = `SYSTEM PRESSURIZED — ${supplyPressure} PSI | ${flowRate} L/min | P-Trap: ${hasTrap ? "SEALED" : "MISSING"}`;

  return (
    <div className="relative w-full h-[520px] bg-[#0B0E14] border border-workshop-border rounded-workshop overflow-hidden select-none">
      {/* Subfloor Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(250, 250, 250, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 250, 250, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "96px 96px, 96px 96px, 24px 24px, 24px 24px",
        }}
      />

      {/* Scale Mark */}
      <div className="absolute bottom-3 left-4 pointer-events-none text-[10px] font-mono tracking-[0.2em] text-arc-400/40 uppercase">
        ISA HYDROSTATIC RIG &bull; 1 SQUARE = 25 MM &bull; WRAS SPEC
      </div>

      {/* Floating Status Pill */}
      <div
        className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-workshop border backdrop-blur-md text-[11px] font-mono tracking-wide shadow-lg whitespace-nowrap ${
          highPressureWarning || (isWaterTurnedOn && hasLeaks)
            ? "bg-safety-red/20 border-safety-red text-safety-red"
            : connectingFrom
            ? "bg-arc-500/20 border-arc-400 text-arc-300"
            : isWaterTurnedOn
            ? "bg-arc-500/15 border-arc-400/60 text-arc-300"
            : "bg-workshop-surface/90 border-workshop-border text-chalk-dim"
        }`}
      >
        {statusPill}
      </div>

      {/* Live Hydrostatic Gauge HUD (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-20 w-52 bg-[#111620]/95 border-2 border-arc-500/50 rounded-workshop p-3 shadow-2xl font-mono">
        <div className="flex items-center justify-between text-[9px] text-arc-400 border-b border-workshop-border pb-1 mb-2">
          <span>HYDRO-GAUGE PRV-20</span>
          <span className={`w-2 h-2 rounded-full ${isWaterTurnedOn ? "bg-arc-400 animate-pulse" : "bg-workshop-border-light"}`} />
        </div>
        <div className="bg-[#080B10] border border-workshop-border rounded-workshop p-2 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-chalk-faded">PRESSURE</span>
            <span className={`text-base font-bold ${highPressureWarning ? "text-safety-red" : "text-arc-400"}`}>
              {isWaterTurnedOn ? `${supplyPressure} PSI` : "0 PSI"}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-chalk-faded">FLOW</span>
            <span className="text-sm font-bold text-safety-green">{flowRate} L/m</span>
          </div>
          <div className="flex justify-between items-baseline text-[10px]">
            <span className="text-chalk-faded">GAS SEAL</span>
            <span className={hasTrap ? "text-safety-green" : "text-safety-yellow"}>
              {hasTrap ? "P-TRAP OK" : "NO TRAP"}
            </span>
          </div>
        </div>
      </div>

      {/* Floating TRY IT LIVE Card when pressurized */}
      {isWaterTurnedOn && (
        <div className="absolute bottom-36 right-3 z-20 w-52 bg-workshop-surface/95 backdrop-blur-md border border-arc-500/40 rounded-workshop p-3 shadow-xl font-mono space-y-2">
          <div className="flex items-center justify-between text-[10px] text-arc-400 uppercase tracking-wider">
            <span>💧 TRY IT LIVE</span>
            <span className="text-[9px] text-chalk-faded">PRV VALVE</span>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-chalk-muted mb-1">
              <span>Main Pressure</span>
              <span className={highPressureWarning ? "text-safety-red font-bold" : "text-arc-400"}>{supplyPressure} PSI</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={supplyPressure}
              onChange={(e) => setSupplyPressure(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-1.5"
            />
          </div>
        </div>
      )}

      {/* Main SVG Workspace */}
      <svg
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => selectComponent(null)}
      >
        {connections.map((conn) => {
          const fromComp = components.find((c) => c.id === conn.from.componentId);
          const toComp = components.find((c) => c.id === conn.to.componentId);
          if (!fromComp || !toComp) return null;

          const x1 = fromComp.x + 30;
          const y1 = fromComp.y + 25;
          const x2 = toComp.x + 30;
          const y2 = toComp.y + 25;

          return (
            <g key={conn.id}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0F172A" strokeWidth="9" strokeLinecap="round" />
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#0284C7"
                strokeWidth={isWaterTurnedOn ? "6" : "4"}
                strokeLinecap="round"
              />
              {isWaterTurnedOn && (
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#BAE6FD"
                  strokeWidth="2.5"
                  strokeDasharray="5,7"
                  className="animate-flow"
                />
              )}
            </g>
          );
        })}

        {components.map((comp) => {
          const isSelected = selectedComponent === comp.id;
          const hasError = errors.some((e) => e.componentId === comp.id);

          return (
            <g
              key={comp.id}
              transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation || 0}, 35, 25)`}
              onMouseDown={(e) => handleMouseDown(comp.id, e)}
              className="cursor-move"
            >
              {renderPipeGraphic(comp.type)}

              {isSelected && (
                <rect
                  x="-4"
                  y="-4"
                  width="85"
                  height="65"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4,2"
                />
              )}

              {hasError && <circle cx="70" cy="5" r="7" fill="#EF4444" stroke="#FAFAFA" strokeWidth="1.5" />}

              <circle
                cx="5"
                cy="25"
                r="6"
                fill={connectingFrom?.componentId === comp.id ? "#38BDF8" : "#0F172A"}
                stroke="#38BDF8"
                strokeWidth="2"
                className="hover:scale-125 transition-transform cursor-pointer"
                onClick={(e) => handlePortClick(comp.id, "in", e)}
              />

              <circle
                cx="65"
                cy="25"
                r="6"
                fill={connectingFrom?.componentId === comp.id ? "#38BDF8" : "#0F172A"}
                stroke="#38BDF8"
                strokeWidth="2"
                className="hover:scale-125 transition-transform cursor-pointer"
                onClick={(e) => handlePortClick(comp.id, "out", e)}
              />

              <text x="5" y="-6" fill="#7DD3FC" fontSize="10" fontFamily="monospace">
                {comp.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Selected Component Controls */}
      {selectedComponent && (
        <div className="absolute bottom-10 left-4 z-20 flex items-center gap-2 bg-workshop-elevated/95 p-1.5 rounded-workshop border border-arc-500/40 shadow-lg text-xs font-mono">
          <button
            onClick={() => {
              rotateComponent(selectedComponent);
              playClick(soundEnabled);
            }}
            className="p-1.5 hover:bg-workshop-surface rounded-workshop text-chalk hover:text-arc-400 flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" /> Rotate
          </button>
          <div className="w-px h-4 bg-workshop-border" />
          <button
            onClick={() => {
              removeComponent(selectedComponent);
              playClick(soundEnabled);
            }}
            className="p-1.5 hover:bg-workshop-surface rounded-workshop text-safety-red hover:bg-safety-red/10 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Discard
          </button>
        </div>
      )}
    </div>
  );
}
