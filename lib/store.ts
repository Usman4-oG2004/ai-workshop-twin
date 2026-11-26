// ═══════════════════════════════════════
// Global State Store — Zustand
// ═══════════════════════════════════════

import { create } from "zustand";
import type {
  User,
  SimulationComponent,
  Connection,
  SimulationError,
  TutorMessage,
  LessonCategory,
} from "@/lib/types";

export interface TelemetryLog {
  id: string;
  time: string;
  level: "info" | "ok" | "warn" | "error";
  message: string;
}

function formatTs(): string {
  const now = new Date();
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${m}:${s}.${ms}`;
}

// ─── Auth Store ───
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  setUser: (user) => set({ user }),
}));

// ─── Simulation Store ───
interface SimulationStore {
  components: SimulationComponent[];
  connections: Connection[];
  errors: SimulationError[];
  selectedComponent: string | null;
  connectingFrom: { componentId: string; port: string } | null;
  score: number;
  isComplete: boolean;
  hintsUsed: number;
  currentHintIndex: number;
  startTime: number | null;

  // Interactive Lab Realism State
  soundEnabled: boolean;
  isRunning: boolean;
  switchClosed: boolean;
  supplyVoltage: number;
  loadResistance: number;
  supplyPressure: number;
  quizMode: boolean;
  telemetryLogs: TelemetryLog[];

  // Actions
  addComponent: (component: SimulationComponent) => void;
  removeComponent: (id: string) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  rotateComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  startConnection: (componentId: string, port: string) => void;
  completeConnection: (componentId: string, port: string) => void;
  cancelConnection: () => void;
  setErrors: (errors: SimulationError[]) => void;
  setScore: (score: number) => void;
  setComplete: (complete: boolean) => void;
  useHint: () => void;
  reset: () => void;

  // Realism Actions
  toggleSound: () => void;
  setRunning: (running: boolean) => void;
  toggleSwitch: () => void;
  setSupplyVoltage: (v: number) => void;
  setLoadResistance: (r: number) => void;
  setSupplyPressure: (psi: number) => void;
  setQuizMode: (active: boolean) => void;
  addLog: (level: TelemetryLog["level"], message: string) => void;
  clearLogs: () => void;
  setPresetCircuit: (components: SimulationComponent[], connections: Connection[]) => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  components: [],
  connections: [],
  errors: [],
  selectedComponent: null,
  connectingFrom: null,
  score: 0,
  isComplete: false,
  hintsUsed: 0,
  currentHintIndex: 0,
  startTime: null,

  soundEnabled: true,
  isRunning: false,
  switchClosed: true,
  supplyVoltage: 12,
  loadResistance: 24,
  supplyPressure: 55,
  quizMode: false,
  telemetryLogs: [
    {
      id: "init-1",
      time: "00:00.000",
      level: "info",
      message: "WORKSHOP_TWIN initialized. Deterministic safety rules active.",
    },
  ],

  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
      startTime: state.startTime || Date.now(),
      telemetryLogs: [
        ...state.telemetryLogs.slice(-30),
        {
          id: `log-${Date.now()}-${Math.random()}`,
          time: formatTs(),
          level: "info",
          message: `STAGED: ${component.label} at (${component.x}, ${component.y})`,
        },
      ],
    })),

  removeComponent: (id) =>
    set((state) => {
      const target = state.components.find((c) => c.id === id);
      return {
        components: state.components.filter((c) => c.id !== id),
        connections: state.connections.filter(
          (c) => c.from.componentId !== id && c.to.componentId !== id
        ),
        selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
        isRunning: false,
        telemetryLogs: target
          ? [
              ...state.telemetryLogs.slice(-30),
              {
                id: `log-${Date.now()}`,
                time: formatTs(),
                level: "warn",
                message: `REMOVED: ${target.label}`,
              },
            ]
          : state.telemetryLogs,
      };
    }),

  moveComponent: (id, x, y) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, x, y } : c
      ),
    })),

  rotateComponent: (id) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, rotation: (c.rotation + 90) % 360 } : c
      ),
    })),

  selectComponent: (id) => set({ selectedComponent: id }),

  startConnection: (componentId, port) =>
    set({ connectingFrom: { componentId, port } }),

  completeConnection: (componentId, port) => {
    const { connectingFrom } = get();
    if (!connectingFrom) return;
    if (connectingFrom.componentId === componentId) {
      set({ connectingFrom: null });
      return;
    }
    const newConnection: Connection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      from: connectingFrom,
      to: { componentId, port },
      isValid: true,
    };
    set((state) => ({
      connections: [...state.connections, newConnection],
      connectingFrom: null,
      telemetryLogs: [
        ...state.telemetryLogs.slice(-30),
        {
          id: `log-${Date.now()}-${Math.random()}`,
          time: formatTs(),
          level: "info",
          message: `CONNECTED: ${connectingFrom.port.toUpperCase()} → ${port.toUpperCase()}`,
        },
      ],
    }));
  },

  cancelConnection: () => set({ connectingFrom: null }),

  setErrors: (errors) => set({ errors }),
  setScore: (score) => set({ score }),
  setComplete: (complete) => set({ isComplete: complete }),

  useHint: () =>
    set((state) => ({
      hintsUsed: state.hintsUsed + 1,
      currentHintIndex: state.currentHintIndex + 1,
    })),

  reset: () =>
    set({
      components: [],
      connections: [],
      errors: [],
      selectedComponent: null,
      connectingFrom: null,
      score: 0,
      isComplete: false,
      hintsUsed: 0,
      currentHintIndex: 0,
      startTime: null,
      isRunning: false,
      switchClosed: true,
      telemetryLogs: [
        {
          id: `log-${Date.now()}`,
          time: formatTs(),
          level: "info",
          message: "BENCH_CLEARED: Ready for new build.",
        },
      ],
    }),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setRunning: (running) => set({ isRunning: running }),
  toggleSwitch: () =>
    set((state) => ({
      switchClosed: !state.switchClosed,
      telemetryLogs: [
        ...state.telemetryLogs.slice(-30),
        {
          id: `log-${Date.now()}`,
          time: formatTs(),
          level: "info",
          message: `SWITCH_STATE: ${!state.switchClosed ? "CLOSED (Circuit continuous)" : "OPEN (Air gap isolated)"}`,
        },
      ],
    })),
  setSupplyVoltage: (supplyVoltage) => set({ supplyVoltage }),
  setLoadResistance: (loadResistance) => set({ loadResistance }),
  setSupplyPressure: (supplyPressure) => set({ supplyPressure }),
  setQuizMode: (quizMode) => set({ quizMode }),
  addLog: (level, message) =>
    set((state) => ({
      telemetryLogs: [
        ...state.telemetryLogs.slice(-35),
        { id: `log-${Date.now()}-${Math.random()}`, time: formatTs(), level, message },
      ],
    })),
  clearLogs: () => set({ telemetryLogs: [] }),
  setPresetCircuit: (components, connections) =>
    set((state) => ({
      components,
      connections,
      errors: [],
      selectedComponent: null,
      connectingFrom: null,
      startTime: state.startTime || Date.now(),
      telemetryLogs: [
        ...state.telemetryLogs.slice(-30),
        {
          id: `log-${Date.now()}`,
          time: formatTs(),
          level: "ok",
          message: `AUTO_WIRED: Staged ${components.length} components and ${connections.length} leads.`,
        },
      ],
    })),
}));

// ─── Tutor Store ───
interface TutorStore {
  messages: TutorMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string | null;

  addMessage: (message: TutorMessage) => void;
  setLoading: (loading: boolean) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setSessionId: (id: string) => void;
  clearMessages: () => void;
}

export const useTutorStore = create<TutorStore>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  sessionId: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setLoading: (loading) => set({ isLoading: loading }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  setSessionId: (id) => set({ sessionId: id }),
  clearMessages: () => set({ messages: [] }),
}));

// ─── Navigation Store ───
interface NavStore {
  activeCategory: LessonCategory | "all";
  searchQuery: string;
  setCategory: (category: LessonCategory | "all") => void;
  setSearch: (query: string) => void;
}

export const useNavStore = create<NavStore>((set) => ({
  activeCategory: "all",
  searchQuery: "",
  setCategory: (category) => set({ activeCategory: category }),
  setSearch: (query) => set({ searchQuery: query }),
}));
