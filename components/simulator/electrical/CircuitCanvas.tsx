'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSimulationStore } from '@/lib/store';
import type { SimulationComponent, ComponentType } from '@/lib/types';

// ═══════════════════════════════════════
// SVG Schematic Symbols
// ═══════════════════════════════════════

const COMPONENT_SYMBOLS: Record<string, {
  render: (props: { highlight: boolean; error: boolean }) => React.ReactNode;
  ports: { id: string; dx: number; dy: number }[];
  width: number;
  height: number;
}> = {
  battery: {
    width: 72,
    height: 48,
    ports: [
      { id: 'positive', dx: 72, dy: 24 },
      { id: 'negative', dx: 0, dy: 24 },
    ],
    render: ({ highlight, error }) => (
      <g>
        {/* Cell plates */}
        <line x1="24" y1="8" x2="24" y2="40" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA'} strokeWidth="3" />
        <line x1="32" y1="14" x2="32" y2="34" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA'} strokeWidth="1.5" />
        <line x1="40" y1="8" x2="40" y2="40" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA'} strokeWidth="3" />
        <line x1="48" y1="14" x2="48" y2="34" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA'} strokeWidth="1.5" />
        {/* Terminals */}
        <line x1="0" y1="24" x2="24" y2="24" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
        <line x1="48" y1="24" x2="72" y2="24" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
        {/* +/- labels */}
        <text x="62" y="18" fill={highlight ? '#F59E0B' : '#71717A'} fontSize="10" fontFamily="monospace">+</text>
        <text x="6" y="18" fill={highlight ? '#F59E0B' : '#71717A'} fontSize="10" fontFamily="monospace">−</text>
      </g>
    ),
  },
  switch: {
    width: 72,
    height: 36,
    ports: [
      { id: 'in', dx: 0, dy: 18 },
      { id: 'out', dx: 72, dy: 18 },
    ],
    render: ({ highlight, error }) => (
      <g>
        <line x1="0" y1="18" x2="20" y2="18" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
        <circle cx="20" cy="18" r="3" fill="none" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA'} strokeWidth="2" />
        <line x1="22" y1="16" x2="50" y2="6" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA'} strokeWidth="2" />
        <circle cx="52" cy="18" r="3" fill="none" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA'} strokeWidth="2" />
        <line x1="52" y1="18" x2="72" y2="18" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
      </g>
    ),
  },
  bulb: {
    width: 56,
    height: 56,
    ports: [
      { id: 'in', dx: 0, dy: 28 },
      { id: 'out', dx: 56, dy: 28 },
    ],
    render: ({ highlight, error }) => {
      const col = error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA';
      return (
        <g>
          <circle cx="28" cy="28" r="16" fill="none" stroke={col} strokeWidth="2" />
          <line x1="17" y1="17" x2="39" y2="39" stroke={col} strokeWidth="1.5" />
          <line x1="39" y1="17" x2="17" y2="39" stroke={col} strokeWidth="1.5" />
          <line x1="0" y1="28" x2="12" y2="28" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
          <line x1="44" y1="28" x2="56" y2="28" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
        </g>
      );
    },
  },
  resistor: {
    width: 80,
    height: 32,
    ports: [
      { id: 'in', dx: 0, dy: 16 },
      { id: 'out', dx: 80, dy: 16 },
    ],
    render: ({ highlight, error }) => {
      const col = error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA';
      return (
        <g>
          <line x1="0" y1="16" x2="16" y2="16" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
          <polyline
            points="16,16 22,4 30,28 38,4 46,28 54,4 62,28 68,16"
            fill="none"
            stroke={col}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="68" y1="16" x2="80" y2="16" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
        </g>
      );
    },
  },
  fuse: {
    width: 64,
    height: 28,
    ports: [
      { id: 'in', dx: 0, dy: 14 },
      { id: 'out', dx: 64, dy: 14 },
    ],
    render: ({ highlight, error }) => {
      const col = error ? '#EF4444' : highlight ? '#F59E0B' : '#FAFAFA';
      return (
        <g>
          <line x1="0" y1="14" x2="14" y2="14" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
          <rect x="14" y="4" width="36" height="20" rx="2" fill="none" stroke={col} strokeWidth="2" />
          <line x1="22" y1="14" x2="42" y2="14" stroke={col} strokeWidth="1" strokeDasharray="2 2" />
          <line x1="50" y1="14" x2="64" y2="14" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
        </g>
      );
    },
  },
  wire: {
    width: 48,
    height: 8,
    ports: [
      { id: 'in', dx: 0, dy: 4 },
      { id: 'out', dx: 48, dy: 4 },
    ],
    render: ({ highlight, error }) => (
      <g>
        <line x1="0" y1="4" x2="48" y2="4" stroke={error ? '#EF4444' : highlight ? '#F59E0B' : '#A1A1AA'} strokeWidth="2" />
      </g>
    ),
  },
};

// ═══════════════════════════════════════
// CircuitCanvas Component
// ═══════════════════════════════════════

export default function CircuitCanvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const {
    components,
    connections,
    errors,
    selectedComponent,
    connectingFrom,
    moveComponent,
    selectComponent,
    startConnection,
    completeConnection,
    cancelConnection,
  } = useSimulationStore();

  // ─── Determine error component IDs ───
  const errorComponentIds = new Set(
    errors
      .filter((e) => e.componentId)
      .map((e) => e.componentId!)
  );

  // ─── Check if circuit is complete (for flow animation) ───
  const isCircuitComplete =
    errors.length === 0 &&
    components.length >= 3 &&
    connections.length >= 2;

  // ─── SVG coordinates from mouse event ───
  const getSVGPoint = useCallback(
    (e: React.MouseEvent) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const pt = svgRef.current.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPt = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
      return { x: svgPt.x, y: svgPt.y };
    },
    []
  );

  // ─── Snap to 24px grid ───
  const snapToGrid = (val: number) => Math.round(val / 24) * 24;

  // ─── Drag handling ───
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, comp: SimulationComponent) => {
      e.stopPropagation();
      const pt = getSVGPoint(e);
      setDragging({ id: comp.id, offsetX: pt.x - comp.x, offsetY: pt.y - comp.y });
      selectComponent(comp.id);
    },
    [getSVGPoint, selectComponent]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const pt = getSVGPoint(e);
      const x = snapToGrid(pt.x - dragging.offsetX);
      const y = snapToGrid(pt.y - dragging.offsetY);
      moveComponent(dragging.id, x, y);
    },
    [dragging, getSVGPoint, moveComponent]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  // ─── Port click ───
  const handlePortClick = useCallback(
    (e: React.MouseEvent, componentId: string, portId: string) => {
      e.stopPropagation();
      if (connectingFrom) {
        completeConnection(componentId, portId);
      } else {
        startConnection(componentId, portId);
      }
    },
    [connectingFrom, startConnection, completeConnection]
  );

  // ─── Canvas click (deselect / cancel) ───
  const handleCanvasClick = useCallback(() => {
    if (connectingFrom) {
      cancelConnection();
    } else {
      selectComponent(null);
    }
  }, [connectingFrom, cancelConnection, selectComponent]);

  // ─── Get port world position ───
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

  // ─── Keyboard listener for delete ───
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

  return (
    <div className="relative flex-1 h-full overflow-hidden bg-workshop-bg rounded-workshop border border-workshop-border">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245, 158, 11, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 158, 11, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Connection mode indicator */}
      {connectingFrom && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-workshop text-amber-400 text-xs font-mono tracking-wider">
          CONNECTING — CLICK A PORT OR ESC TO CANCEL
        </div>
      )}

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
        {/* ─── Grid dots ─── */}
        <defs>
          <pattern id="grid-dot" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.8" fill="rgba(245, 158, 11, 0.12)" />
          </pattern>
          {/* Flow animation for wires */}
          <marker id="flow-dot" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4">
            <circle cx="3" cy="3" r="2" fill="#F59E0B" />
          </marker>
        </defs>
        <rect width="960" height="640" fill="url(#grid-dot)" />

        {/* ─── Connections (wires) ─── */}
        {connections.map((conn) => {
          const from = getPortPosition(conn.from.componentId, conn.from.port);
          const to = getPortPosition(conn.to.componentId, conn.to.port);
          const midX = (from.x + to.x) / 2;
          return (
            <g key={conn.id}>
              {/* Wire shadow */}
              <path
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="4"
              />
              {/* Wire body */}
              <path
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke={conn.isValid ? '#A1A1AA' : '#EF4444'}
                strokeWidth="2"
              />
              {/* Animated current flow when circuit complete */}
              {isCircuitComplete && (
                <path
                  d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  className="animate-flow"
                  opacity="0.8"
                />
              )}
            </g>
          );
        })}

        {/* ─── Components ─── */}
        {components.map((comp) => {
          const sym = COMPONENT_SYMBOLS[comp.type];
          if (!sym) return null;

          const isHovered = hoveredId === comp.id;
          const isSelected = selectedComponent === comp.id;
          const hasError = errorComponentIds.has(comp.id);

          return (
            <g
              key={comp.id}
              transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation}, ${sym.width / 2}, ${sym.height / 2})`}
              onMouseDown={(e) => handleMouseDown(e, comp)}
              onMouseEnter={() => setHoveredId(comp.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: dragging?.id === comp.id ? 'grabbing' : 'grab' }}
            >
              {/* Selection / hover outline */}
              {(isSelected || isHovered) && (
                <rect
                  x={-4}
                  y={-4}
                  width={sym.width + 8}
                  height={sym.height + 8}
                  rx="2"
                  fill="none"
                  stroke={hasError ? '#EF4444' : '#F59E0B'}
                  strokeWidth="1"
                  strokeDasharray={isSelected ? 'none' : '4 2'}
                  opacity={isSelected ? 0.6 : 0.3}
                />
              )}

              {/* Component symbol */}
              {sym.render({ highlight: isHovered || isSelected, error: hasError })}

              {/* Ports */}
              {sym.ports.map((port) => (
                <circle
                  key={port.id}
                  cx={port.dx}
                  cy={port.dy}
                  r={connectingFrom ? 6 : 4}
                  fill={
                    connectingFrom
                      ? 'rgba(245, 158, 11, 0.3)'
                      : 'rgba(250, 250, 250, 0.1)'
                  }
                  stroke={connectingFrom ? '#F59E0B' : '#71717A'}
                  strokeWidth="1.5"
                  className={cn(
                    'transition-all duration-150',
                    connectingFrom && 'cursor-pointer hover:fill-amber-500/60'
                  )}
                  onClick={(e) => handlePortClick(e, comp.id, port.id)}
                />
              ))}

              {/* Label */}
              <text
                x={sym.width / 2}
                y={sym.height + 14}
                textAnchor="middle"
                fill={hasError ? '#EF4444' : '#71717A'}
                fontSize="9"
                fontFamily="monospace"
                className="select-none pointer-events-none"
              >
                {comp.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* ─── Empty state ─── */}
        {components.length === 0 && (
          <g>
            <text
              x="480"
              y="300"
              textAnchor="middle"
              fill="#3F3F46"
              fontSize="16"
              fontFamily="monospace"
            >
              DRAG COMPONENTS FROM THE SHELF
            </text>
            <text
              x="480"
              y="324"
              textAnchor="middle"
              fill="#2A2A2F"
              fontSize="12"
              fontFamily="monospace"
            >
              Click ports to connect • ESC to cancel
            </text>
          </g>
        )}
      </svg>

      {/* Circuit complete glow overlay */}
      {isCircuitComplete && (
        <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/20 rounded-workshop shadow-glow-amber" />
      )}
    </div>
  );
}
