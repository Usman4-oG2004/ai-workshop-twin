"use client";

import { useState } from "react";
import { Wrench, Droplets, RotateCw, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { useSimulationStore } from "@/lib/store";

interface PipeCanvasProps {
  isWaterTurnedOn: boolean;
}

export default function PipeCanvas({ isWaterTurnedOn }: PipeCanvasProps) {
  const {
    components,
    connections,
    selectedComponent,
    selectComponent,
    moveComponent,
    rotateComponent,
    removeComponent,
    startConnection,
    completeConnection,
    connectingFrom,
    errors,
  } = useSimulationStore();

  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(id);
    setDraggedId(id);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = Math.max(30, Math.min(rect.width - 100, e.clientX - rect.left - 40));
    const newY = Math.max(30, Math.min(rect.height - 80, e.clientY - rect.top - 30));
    // Snap to 20px grid
    moveComponent(draggedId, Math.round(newX / 20) * 20, Math.round(newY / 20) * 20);
  };

  const handleMouseUp = () => {
    setDraggedId(null);
  };

  const handlePortClick = (componentId: string, port: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!connectingFrom) {
      startConnection(componentId, port);
    } else {
      completeConnection(componentId, port);
    }
  };

  const renderPipeGraphic = (type: string, isFlowing: boolean) => {
    switch (type) {
      case "faucet":
        return (
          <g>
            <rect x="0" y="10" width="40" height="40" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
            {/* Tap valve handle */}
            <rect x="12" y="0" width="16" height="10" fill="#0284C7" stroke="#38BDF8" />
            <circle cx="20" cy="5" r="3" fill="#E0F2FE" />
            {/* Spout */}
            <path d="M 40 25 L 65 25 L 65 45" fill="none" stroke="#38BDF8" strokeWidth="4" />
            <text x="5" y="45" fill="#38BDF8" fontSize="9" fontFamily="monospace">TAP</text>
          </g>
        );
      case "pipe-straight":
        return (
          <g>
            <rect x="0" y="15" width="100" height="24" rx="1" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            {/* Copper texture / shine */}
            <line x1="10" y1="22" x2="90" y2="22" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
            <text x="28" y="31" fill="#7DD3FC" fontSize="9" fontFamily="monospace">15mm PIPE</text>
          </g>
        );
      case "pipe-elbow":
        return (
          <g>
            <rect x="0" y="0" width="60" height="60" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <path
              d="M 10 50 Q 10 10 50 10"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="12"
            />
            <text x="14" y="36" fill="#38BDF8" fontSize="8" fontFamily="monospace">90° ELBOW</text>
          </g>
        );
      case "pipe-tee":
        return (
          <g>
            <rect x="0" y="0" width="70" height="60" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="0" y1="30" x2="70" y2="30" stroke="#38BDF8" strokeWidth="12" />
            <line x1="35" y1="30" x2="35" y2="60" stroke="#38BDF8" strokeWidth="12" />
            <text x="24" y="24" fill="#38BDF8" fontSize="8" fontFamily="monospace">TEE</text>
          </g>
        );
      case "trap":
        return (
          <g>
            <rect x="0" y="0" width="70" height="70" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            {/* P-trap shape */}
            <path
              d="M 15 10 L 15 40 Q 15 60 35 60 Q 55 60 55 35 L 55 10"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="8"
            />
            <text x="18" y="42" fill="#38BDF8" fontSize="8" fontFamily="monospace">P-TRAP</text>
          </g>
        );
      case "drain":
        return (
          <g>
            <rect x="0" y="10" width="50" height="40" rx="2" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            {/* Grate lines */}
            <line x1="10" y1="20" x2="40" y2="20" stroke="#94A3B8" strokeWidth="2" />
            <line x1="10" y1="28" x2="40" y2="28" stroke="#94A3B8" strokeWidth="2" />
            <line x1="10" y1="36" x2="40" y2="36" stroke="#94A3B8" strokeWidth="2" />
            <text x="10" y="46" fill="#94A3B8" fontSize="8" fontFamily="monospace">DRAIN</text>
          </g>
        );
      case "valve":
        return (
          <g>
            <rect x="0" y="10" width="60" height="35" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            {/* Ball valve handle */}
            <rect x="22" y="2" width="16" height="8" rx="1" fill="#EF4444" stroke="#FAFAFA" strokeWidth="1" />
            <text x="14" y="32" fill="#38BDF8" fontSize="8" fontFamily="monospace">VALVE</text>
          </g>
        );
      default:
        return (
          <rect x="0" y="0" width="70" height="40" rx="2" fill="#1E293B" stroke="#38BDF8" />
        );
    }
  };

  return (
    <div className="relative w-full h-[520px] bg-workshop-bg border border-workshop-border rounded-workshop overflow-hidden select-none">
      {/* Plumbing blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-40 pointer-events-none" />

      {/* Top Banner overlay */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-workshop bg-workshop-surface/90 border border-workshop-border text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-arc-400 animate-pulse" />
          <span className="text-chalk">PLUMBING BENCH: HYDROSTATIC ASSEMBLY</span>
        </div>
        {connectingFrom && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-workshop bg-arc-500/20 border border-arc-400 text-arc-300 text-xs font-mono">
            <span>Routing Connection: Click target fitting port</span>
          </div>
        )}
      </div>

      {/* Main SVG Workspace */}
      <svg
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => selectComponent(null)}
      >
        {/* Render Pipe Connections */}
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
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#0284C7"
                strokeWidth={isWaterTurnedOn ? "6" : "4"}
                strokeOpacity="0.8"
              />
              {isWaterTurnedOn && (
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeDasharray="4,6"
                  className="animate-flow"
                />
              )}
            </g>
          );
        })}

        {/* Render Components */}
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
              {renderPipeGraphic(comp.type, isWaterTurnedOn)}

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

              {hasError && (
                <circle cx="70" cy="5" r="7" fill="#EF4444" stroke="#FAFAFA" strokeWidth="1.5" />
              )}

              {/* In Port */}
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

              {/* Out Port */}
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

      {/* Selected Action Tools */}
      {selectedComponent && (
        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 bg-workshop-elevated/95 p-1.5 rounded-workshop border border-workshop-border shadow-lg text-xs font-mono">
          <button
            onClick={() => rotateComponent(selectedComponent)}
            className="p-1.5 hover:bg-workshop-surface rounded-workshop text-chalk hover:text-arc-400 flex items-center gap-1"
            title="Rotate Fitting 90°"
          >
            <RotateCw className="w-3.5 h-3.5" /> Rotate
          </button>
          <div className="w-px h-4 bg-workshop-border" />
          <button
            onClick={() => removeComponent(selectedComponent)}
            className="p-1.5 hover:bg-workshop-surface rounded-workshop text-safety-red hover:bg-safety-red/10 flex items-center gap-1"
            title="Discard Fitting"
          >
            <Trash2 className="w-3.5 h-3.5" /> Discard
          </button>
        </div>
      )}

      {components.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-chalk-faded">
          <Wrench className="w-10 h-10 mb-2 text-workshop-border-light stroke-[1.5]" />
          <div className="font-heading text-sm text-chalk-muted">Plumbing Bench Clear</div>
          <div className="text-xs font-mono">Click fittings from the shelf on the left to add straight runs, elbows, and P-traps</div>
        </div>
      )}
    </div>
  );
}
