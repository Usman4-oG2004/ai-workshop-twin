// ═══════════════════════════════════════════════
// Electrical Simulation Engine
// DETERMINISTIC — no AI dependency for safety
// ═══════════════════════════════════════════════

import type { SimulationComponent, Connection, SimulationError, ValidationRule } from "@/lib/types";

interface CircuitNode {
  componentId: string;
  type: string;
  connections: string[];
}

interface CircuitGraph {
  nodes: Map<string, CircuitNode>;
  edges: Connection[];
}

// ─── Build circuit graph from components ───
function buildGraph(components: SimulationComponent[], connections: Connection[]): CircuitGraph {
  const nodes = new Map<string, CircuitNode>();
  components.forEach((c) => {
    nodes.set(c.id, { componentId: c.id, type: c.type, connections: [] });
  });
  connections.forEach((conn) => {
    const fromNode = nodes.get(conn.from.componentId);
    const toNode = nodes.get(conn.to.componentId);
    if (fromNode) fromNode.connections.push(conn.to.componentId);
    if (toNode) toNode.connections.push(conn.from.componentId);
  });
  return { nodes, edges: connections };
}

// ─── Check if circuit has a complete path ───
function hasCompletePath(graph: CircuitGraph): boolean {
  const batteries = Array.from(graph.nodes.values()).filter((n) => n.type === "battery");
  if (batteries.length === 0) return false;

  for (const battery of batteries) {
    const visited = new Set<string>();
    const stack = [battery.componentId];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      const node = graph.nodes.get(current);
      if (!node) continue;
      for (const neighbor of node.connections) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
    // Check if path goes through a load and returns to battery
    const hasLoad = Array.from(visited).some((id) => {
      const n = graph.nodes.get(id);
      return n && ["bulb", "resistor", "outlet"].includes(n.type);
    });
    if (hasLoad && visited.size >= 3) return true;
  }
  return false;
}

// ─── Check for short circuits ───
function hasShortCircuit(graph: CircuitGraph): boolean {
  const batteries = Array.from(graph.nodes.values()).filter((n) => n.type === "battery");
  for (const battery of batteries) {
    // Direct connection from + to - with no load = short circuit
    for (const neighbor of battery.connections) {
      const neighborNode = graph.nodes.get(neighbor);
      if (neighborNode?.type === "battery" || neighborNode?.type === "wire") {
        // Check if wire leads directly back to battery without a load
        const visited = new Set<string>([battery.componentId]);
        let pathHasLoad = false;
        const stack = [neighbor];
        while (stack.length > 0) {
          const current = stack.pop()!;
          if (visited.has(current)) {
            if (current === battery.componentId && !pathHasLoad) return true;
            continue;
          }
          visited.add(current);
          const node = graph.nodes.get(current);
          if (!node) continue;
          if (["bulb", "resistor", "outlet"].includes(node.type)) pathHasLoad = true;
          for (const n of node.connections) stack.push(n);
        }
      }
    }
  }
  return false;
}

// ─── Check if switch is in the circuit ───
function hasSwitchInPath(graph: CircuitGraph): boolean {
  return Array.from(graph.nodes.values()).some((n) => n.type === "switch");
}

// ─── Validate circuit ───
export function validateCircuit(
  components: SimulationComponent[],
  connections: Connection[],
  rules: ValidationRule[]
): { isValid: boolean; errors: SimulationError[]; score: number } {
  const errors: SimulationError[] = [];
  const graph = buildGraph(components, connections);

  // Safety checks (always first)
  if (hasShortCircuit(graph)) {
    errors.push({
      type: "safety",
      message: "⚠️ SHORT CIRCUIT DETECTED — Direct path from positive to negative with no load. This would cause overheating and is a fire hazard.",
      severity: "critical",
      hint: "Every circuit needs a load (like a bulb or resistor) between the positive and negative terminals.",
    });
  }

  // Structural checks
  const hasBattery = components.some((c) => c.type === "battery");
  if (!hasBattery) {
    errors.push({
      type: "incomplete",
      message: "No power source found. Add a battery to power the circuit.",
      severity: "error",
      hint: "Drag a battery from the component shelf to the workbench.",
    });
  }

  const hasLoad = components.some((c) => ["bulb", "resistor", "outlet"].includes(c.type));
  if (!hasLoad) {
    errors.push({
      type: "incomplete",
      message: "No load component found. Add a bulb or resistor.",
      severity: "error",
      hint: "A circuit needs something to do work — a bulb to light up, or a resistor to control current.",
    });
  }

  // Connection checks
  const unconnected = components.filter((c) => {
    const node = graph.nodes.get(c.id);
    return node && node.connections.length === 0;
  });

  unconnected.forEach((c) => {
    errors.push({
      type: "incomplete",
      componentId: c.id,
      message: `${c.label} is not connected to anything.`,
      severity: "warning",
      hint: `Connect ${c.label} to other components using wires.`,
    });
  });

  // Complete path check
  if (hasBattery && hasLoad && !hasCompletePath(graph)) {
    errors.push({
      type: "functional",
      message: "Circuit is not complete. Current cannot flow from battery through the load and back.",
      severity: "error",
      hint: "Make sure there's a continuous path of wires from the battery's positive terminal, through the load, and back to the negative terminal.",
    });
  }

  // Apply custom validation rules
  rules.forEach((rule) => {
    switch (rule.type) {
      case "component-present": {
        const requiredType = rule.params.componentType as string;
        if (!components.some((c) => c.type === requiredType)) {
          errors.push({
            type: "incomplete",
            message: rule.errorMessage,
            severity: "error",
            hint: rule.hintMessage,
          });
        }
        break;
      }
      case "circuit-complete": {
        if (!hasCompletePath(graph)) {
          errors.push({
            type: "functional",
            message: rule.errorMessage,
            severity: "error",
            hint: rule.hintMessage,
          });
        }
        break;
      }
    }
  });

  // Calculate score
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

// ─── Predefined lesson scenarios ───
export const ELECTRICAL_SCENARIOS = {
  "first-circuit": {
    id: "first-circuit",
    title: "Your First Circuit",
    description: "Build a simple circuit with a battery, switch, and bulb",
    requiredComponents: ["battery", "switch", "bulb", "wire"],
    targetConnections: [
      { from: "battery", fromPort: "positive", to: "switch", toPort: "in" },
      { from: "switch", fromPort: "out", to: "bulb", toPort: "in" },
      { from: "bulb", fromPort: "out", to: "battery", toPort: "negative" },
    ],
    hints: [
      "Start by placing the battery — it's your power source",
      "Connect the positive terminal of the battery to the switch",
      "Now connect the switch to the bulb",
      "Finally, connect the bulb back to the negative terminal of the battery",
      "Close the switch to test your circuit!",
    ],
    successMessage: "🎉 Great work! Your bulb lights up. You've built a complete series circuit.",
  },
  "fault-finder": {
    id: "fault-finder",
    title: "Fault Finder",
    description: "Find and fix the fault in a broken circuit",
    requiredComponents: ["battery", "switch", "bulb", "wire", "fuse"],
    hints: [
      "Look carefully at each connection — is anything loose or disconnected?",
      "Check if the fuse is blown",
      "Verify the switch is in the correct position",
      "Trace the path from positive terminal through each component",
    ],
    successMessage: "⚡ Excellent troubleshooting! You identified and fixed the fault.",
  },
  "two-switch-one-light": {
    id: "two-switch-one-light",
    title: "Two Switches, One Light",
    description: "Wire a light that can be controlled from two different switches",
    requiredComponents: ["battery", "switch", "switch", "bulb", "wire"],
    hints: [
      "This is called a 'two-way switching' circuit",
      "Think about how a hallway light works — you can turn it on or off from either end",
      "The switches need to be connected differently than a simple circuit",
    ],
    successMessage: "💡 Perfect! You've wired a two-way switching circuit — a real-world skill used in every home.",
  },
};
