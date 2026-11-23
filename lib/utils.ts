import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return remainMins > 0 ? `${hours}h ${remainMins}m` : `${hours}h`;
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function getDifficultyColor(level: string): string {
  switch (level) {
    case "beginner": return "text-safety-green";
    case "intermediate": return "text-safety-yellow";
    case "advanced": return "text-safety-red";
    default: return "text-chalk-muted";
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case "electrical": return "⚡";
    case "plumbing": return "🔧";
    default: return "📐";
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case "electrical": return "amber";
    case "plumbing": return "arc";
    default: return "chalk";
  }
}
