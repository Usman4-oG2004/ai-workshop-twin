"use client";

import { useTutorStore } from "@/lib/store";

export default function TutorAvatar() {
  const { toggleOpen, isOpen, messages } = useTutorStore();

  return (
    <button
      onClick={toggleOpen}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-workshop bg-ink text-paper-hi border border-ink font-sans text-xs font-medium shadow-desk hover:bg-ink-secondary transition-all"
      title="Open ISA Course Tutor"
    >
      <span className="w-2 h-2 rounded-full bg-safety-green" />
      <span>{isOpen ? "Close Instructor AI" : "Ask ISA Course Tutor"}</span>
      {messages.length > 0 && !isOpen && (
        <span className="px-1.5 py-0.5 bg-paper-hi text-ink text-[10px] font-mono rounded-workshop">
          {messages.length}
        </span>
      )}
    </button>
  );
}
