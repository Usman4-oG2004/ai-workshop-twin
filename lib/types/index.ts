// ═══════════════════════════════════════
// AI Workshop Twin — Type Definitions
// ═══════════════════════════════════════

// ─── User & Auth ───
export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Lessons & Curriculum ───
export type LessonCategory = "electrical" | "plumbing";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type LessonStatus = "draft" | "approved" | "archived";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  difficulty: DifficultyLevel;
  status: LessonStatus;
  duration: number; // minutes
  objectives: string[];
  safetyNotes: string[];
  steps: LessonStep[];
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonStep {
  id: string;
  order: number;
  type: "instruction" | "simulation" | "quiz" | "safety-check" | "hands-on";
  title: string;
  content: string;
  media?: { type: "image" | "video" | "diagram"; url: string; alt: string }[];
  hints: string[];
  validationRules?: ValidationRule[];
}

// ─── Simulation Engine ───
export type ComponentType =
  | "battery" | "switch" | "bulb" | "wire" | "resistor" | "fuse" | "outlet" | "ground"
  | "pipe-straight" | "pipe-elbow" | "pipe-tee" | "coupling" | "valve" | "faucet" | "drain" | "trap";

export interface SimulationComponent {
  id: string;
  type: ComponentType;
  label: string;
  x: number;
  y: number;
  rotation: number;
  connections: string[]; // ids of connected components
  properties: Record<string, number | string | boolean>;
  isCorrect?: boolean;
}

export interface SimulationState {
  id: string;
  lessonId: string;
  components: SimulationComponent[];
  connections: Connection[];
  isComplete: boolean;
  errors: SimulationError[];
  score: number;
  startedAt: string;
  completedAt?: string;
}

export interface Connection {
  id: string;
  from: { componentId: string; port: string };
  to: { componentId: string; port: string };
  isValid: boolean;
}

export interface SimulationError {
  type: "safety" | "functional" | "incomplete" | "incorrect";
  componentId?: string;
  connectionId?: string;
  message: string;
  severity: "warning" | "error" | "critical";
  hint?: string;
}

export interface ValidationRule {
  id: string;
  type: "connection" | "component-present" | "component-property" | "circuit-complete" | "flow-complete";
  params: Record<string, unknown>;
  errorMessage: string;
  hintMessage: string;
}

// ─── AI Tutor ───
export interface TutorMessage {
  id: string;
  role: "student" | "tutor" | "system";
  content: string;
  timestamp: string;
  sourceReference?: string; // reference to approved material
  confidence?: number;
  requiresInstructorReview?: boolean;
}

export interface TutorSession {
  id: string;
  studentId: string;
  lessonId: string;
  messages: TutorMessage[];
  startedAt: string;
  endedAt?: string;
}

// ─── Student Progress ───
export interface StudentProgress {
  studentId: string;
  lessonId: string;
  status: "not-started" | "in-progress" | "completed" | "needs-review";
  score: number;
  timeSpent: number; // seconds
  attempts: number;
  observations: Observation[];
  completedAt?: string;
}

export interface Observation {
  id: string;
  type: "strength" | "area-to-develop" | "note";
  category: "attention-to-detail" | "sequence-following" | "troubleshooting" | "safety-awareness" | "speed" | "interest";
  description: string;
  evidence: string;
  timestamp: string;
}

export interface StudentAnalytics {
  studentId: string;
  studentName: string;
  lessonsCompleted: number;
  totalLessons: number;
  averageScore: number;
  totalTimeSpent: number;
  strengths: string[];
  areasToDevlop: string[];
  interestLevel: number; // 1-5
  recentActivity: ActivityEntry[];
}

export interface ActivityEntry {
  lessonId: string;
  lessonTitle: string;
  category: LessonCategory;
  action: string;
  timestamp: string;
  score?: number;
}

// ─── Instructor Dashboard ───
export interface DashboardStats {
  totalStudents: number;
  activeToday: number;
  lessonsCompleted: number;
  averageScore: number;
  pendingReviews: number;
  safetyFlags: number;
}

export interface ContentReview {
  id: string;
  type: "ai-response" | "lesson-content" | "safety-concern";
  content: string;
  context: string;
  status: "pending" | "approved" | "rejected" | "modified";
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}
