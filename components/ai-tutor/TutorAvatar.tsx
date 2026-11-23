"use client";

import { HardHat, MessageSquare } from "lucide-react";
import { useTutorStore } from "@/lib/store";

export default function TutorAvatar() {
  const { toggleOpen, isOpen, messages } = useTutorStore();

  return (
    <button
      onClick={toggleOpen}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-workshop bg-amber-500 text-workshop-bg border-2 border-amber-400 font-heading text-sm uppercase tracking-wider font-semibold shadow-glow-amber hover:bg-amber-400 active:translate-y-0.5 transition-all group"
      title="Open AI Workshop Foreman Tutor"
    >
      <div className="relative">
        <HardHat className="w-5 h-5 text-workshop-bg" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-safety-green border border-workshop-bg animate-pulse" />
      </div>
      <span>{isOpen ? "Close Foreman" : "Ask Foreman AI"}</span>
      {messages.length > 0 && !isOpen && (
        <span className="px-1.5 py-0.2 bg-workshop-bg text-amber-400 text-xs font-mono rounded-workshop">
          {messages.length}
        </span>
      )}
    </button>
  );
}
