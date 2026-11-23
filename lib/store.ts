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

  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
      startTime: state.startTime || Date.now(),
    })),

  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      connections: state.connections.filter(
        (c) => c.from.componentId !== id && c.to.componentId !== id
      ),
    })),

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
    }),
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
