// ═══════════════════════════════════════════════
// Plumbing Simulation Engine
// DETERMINISTIC — no AI dependency for safety
// ═══════════════════════════════════════════════

import type { SimulationComponent, Connection, SimulationError } from "@/lib/types";

interface PipeNode {
  componentId: string;
  type: string;
  diameter: number; // mm
  connections: string[];
}

interface PipeSystem {
  nodes: Map<string, PipeNode>;
  edges: Connection[];
}

function buildPipeSystem(components: SimulationComponent[], connections: Connection[]): PipeSystem {
  const nodes = new Map<string, PipeNode>();
  components.forEach((c) => {
    nodes.set(c.id, {
      componentId: c.id,
      type: c.type,
      diameter: (c.properties.diameter as number) || 15,
      connections: [],
    });
  });
  connections.forEach((conn) => {
    const fromNode = nodes.get(conn.from.componentId);
    const toNode = nodes.get(conn.to.componentId);
    if (fromNode) fromNode.connections.push(conn.to.componentId);
    if (toNode) toNode.connections.push(conn.from.componentId);
  });
  return { nodes, edges: connections };
}

// ─── Check flow path from supply to drain ───
function hasFlowPath(system: PipeSystem): boolean {
  const faucets = [...system.nodes.values()].filter(
    (n) => n.type === "faucet" || n.type === "valve"
  );
  const drains = [...system.nodes.values()].filter((n) => n.type === "drain");

  if (faucets.length === 0 || drains.length === 0) return false;

  for (const faucet of faucets) {
    const visited = new Set<string>();
    const stack = [faucet.componentId];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      const node = system.nodes.get(current);
      if (!node) continue;
      if (node.type === "drain") return true;
      for (const neighbor of node.connections) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
  }
  return false;
}

// ─── Check for incompatible pipe sizes ───
function checkPipeSizeCompatibility(system: PipeSystem): SimulationError[] {
  const errors: SimulationError[] = [];
  system.edges.forEach((conn) => {
    const fromNode = system.nodes.get(conn.from.componentId);
    const toNode = system.nodes.get(conn.to.componentId);
    if (fromNode && toNode && fromNode.diameter !== toNode.diameter) {
      // Need a reducer/adapter
      errors.push({
        type: "functional",
        connectionId: conn.id,
        message: `Pipe size mismatch: ${fromNode.diameter}mm to ${toNode.diameter}mm. You need a reducer fitting.`,
        severity: "error",
        hint: "When connecting pipes of different diameters, use a reducer or adapter fitting.",
      });
    }
  });
  return errors;
}

// ─── Check for missing trap ───
function hasTrap(system: PipeSystem): boolean {
  return [...system.nodes.values()].some((n) => n.type === "trap");
}

// ─── Check T-joint connections ───
function checkTeeConnections(system: PipeSystem): SimulationError[] {
  const errors: SimulationError[] = [];
  const tees = [...system.nodes.values()].filter((n) => n.type === "pipe-tee");
  tees.forEach((tee) => {
    if (tee.connections.length < 2) {
      errors.push({
        type: "incomplete",
        componentId: tee.componentId,
        message: "T-junction needs at least 2 connections to function properly.",
        severity: "warning",
        hint: "A tee fitting splits flow into two directions. Connect pipes to at least two of its three ports.",
      });
    }
  });
  return errors;
}

// ─── Check for potential leaks ───
function checkForLeaks(components: SimulationComponent[], connections: Connection[]): SimulationError[] {
  const errors: SimulationError[] = [];
  const connectedPorts = new Set<string>();

  connections.forEach((conn) => {
    connectedPorts.add(`${conn.from.componentId}:${conn.from.port}`);
    connectedPorts.add(`${conn.to.componentId}:${conn.to.port}`);
  });

  // Check for open ports on components that should be sealed
  components.forEach((c) => {
    const portCount = c.type === "pipe-tee" ? 3 : c.type === "pipe-elbow" ? 2 : 2;
    let connectedCount = 0;
    for (let i = 0; i < portCount; i++) {
      if (connectedPorts.has(`${c.id}:port-${i}`)) connectedCount++;
    }

    if (connectedCount > 0 && connectedCount < portCount && !["faucet", "drain", "valve"].includes(c.type)) {
      errors.push({
        type: "safety",
        componentId: c.id,
        message: `⚠️ POTENTIAL LEAK: ${c.label} has ${portCount - connectedCount} open port(s). Water will escape here.`,
        severity: "critical",
        hint: "Either connect all ports or cap unused openings with an end cap.",
      });
    }
  });

  return errors;
}

// ─── Validate plumbing system ───
export function validatePlumbing(
  components: SimulationComponent[],
  connections: Connection[]
): { isValid: boolean; errors: SimulationError[]; score: number } {
  const errors: SimulationError[] = [];
  const system = buildPipeSystem(components, connections);

  // Check required components
  const hasFaucet = components.some((c) => c.type === "faucet" || c.type === "valve");
  const hasDrain = components.some((c) => c.type === "drain");

  if (!hasFaucet) {
    errors.push({
      type: "incomplete",
      message: "No water supply found. Add a faucet or valve.",
      severity: "error",
      hint: "Every plumbing system needs a water supply source.",
    });
  }

  if (!hasDrain) {
    errors.push({
      type: "incomplete",
      message: "No drain found. Where will the water go?",
      severity: "error",
      hint: "Add a drain to allow water to exit the system.",
    });
  }

  // Safety: check for leaks
  errors.push(...checkForLeaks(components, connections));

  // Check pipe compatibility
  errors.push(...checkPipeSizeCompatibility(system));

  // Check T-joints
  errors.push(...checkTeeConnections(system));

  // Check flow path
  if (hasFaucet && hasDrain && !hasFlowPath(system)) {
    errors.push({
      type: "functional",
      message: "Water cannot flow from supply to drain. The system is not connected.",
      severity: "error",
      hint: "Trace the path from the faucet to the drain — make sure every section is connected.",
    });
  }

  // Check for trap (required for waste water)
  if (hasDrain && !hasTrap(system)) {
    errors.push({
      type: "safety",
      message: "No P-trap or S-trap found. Sewer gas could enter the room.",
      severity: "warning",
      hint: "Every drain needs a trap — it holds water that blocks sewer gases from coming back up. Add a P-trap before the drain.",
    });
  }

  // Unconnected components
  components.forEach((c) => {
    const node = system.nodes.get(c.id);
    if (node && node.connections.length === 0) {
      errors.push({
        type: "incomplete",
        componentId: c.id,
        message: `${c.label} is not connected to the system.`,
        severity: "warning",
        hint: `Connect ${c.label} to other fittings.`,
      });
    }
  });

  const criticalErrors = errors.filter((e) => e.severity === "critical").length;
  const regularErrors = errors.filter((e) => e.severity === "error").length;
  const warnings = errors.filter((e) => e.severity === "warning").length;

  let score = 100;
  score -= criticalErrors * 40;
  score -= regularErrors * 20;
  score -= warnings * 5;
  score = Math.max(0, score);

  return {
    isValid: errors.filter((e) => e.severity !== "warning").length === 0,
    errors,
    score,
  };
}

// ─── Predefined plumbing scenarios ───
export const PLUMBING_SCENARIOS = {
  "basic-assembly": {
    id: "basic-assembly",
    title: "Pipe Assembly Basics",
    description: "Assemble a simple pipe run using straight pipes, elbows, and couplings",
    requiredComponents: ["pipe-straight", "pipe-elbow", "coupling", "faucet", "drain"],
    hints: [
      "Start from the faucet (water supply)",
      "Use straight pipes for horizontal and vertical runs",
      "Use elbows to change direction by 90°",
      "Use couplings to join two straight pipes end-to-end",
      "Make sure all connections are sealed — no open ports!",
      "End with a drain to complete the system",
    ],
    successMessage: "🔧 Well done! You've assembled a leak-free pipe system.",
  },
  "sink-trap": {
    id: "sink-trap",
    title: "Installing a Sink Trap",
    description: "Connect a sink drain with a proper P-trap to block sewer gases",
    requiredComponents: ["drain", "trap", "pipe-straight", "pipe-elbow", "coupling"],
    hints: [
      "The P-trap goes directly below the drain",
      "It's shaped like the letter P (or U) to hold water",
      "This water seal stops sewer gas from coming up",
      "Connect the trap outlet to the waste pipe",
    ],
    successMessage: "👏 Excellent! The P-trap will keep sewer gases out. That's a crucial safety feature.",
  },
  "tee-junction": {
    id: "tee-junction",
    title: "Splitting the Flow",
    description: "Use a T-junction to supply water to two fixtures",
    requiredComponents: ["faucet", "pipe-tee", "pipe-straight", "valve", "drain"],
    hints: [
      "A tee fitting has three ports — one inlet and two outlets",
      "Use valves to control flow to each fixture independently",
      "Make sure both branches have proper drainage",
    ],
    successMessage: "💧 Perfect! You've created a branched supply system — this is how real homes distribute water.",
  },
};
