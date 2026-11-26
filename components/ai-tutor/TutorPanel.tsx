"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, AlertTriangle, BookOpen } from "lucide-react";
import { useTutorStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface TutorPanelProps {
  lessonTitle?: string;
  category?: "electrical" | "plumbing";
  simulationStateSummary?: {
    componentsCount: number;
    hasErrors: boolean;
    errors: string[];
    score: number;
  };
}

export default function TutorPanel({
  lessonTitle = "BS 7671 1-Way Lighting Circuit",
  category = "electrical",
  simulationStateSummary,
}: TutorPanelProps) {
  const { messages, isOpen, setOpen, addMessage, isLoading, setLoading } = useTutorStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: "msg-welcome",
        role: "tutor",
        content: `Welcome to ${lessonTitle}. Ask any question about wiring colours, safe isolation, compression torque, or fault diagnosis — answers are grounded strictly in approved ISA notes.`,
        timestamp: "Ready",
        sourceReference: "ISA Syllabus § 1.2",
      });
    }
  }, [lessonTitle, messages.length, addMessage]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    addMessage({
      id: `user-${Date.now()}`,
      role: "student",
      content: text,
      timestamp: "Now",
    });

    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lessonContext: {
            title: lessonTitle,
            category,
            currentStep: 1,
            totalSteps: 4,
            objectives: ["Safe isolation", "Standards-compliant installation"],
          },
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          simulationState: simulationStateSummary,
          approvedMaterials:
            "ISA Course Notes: BS 7671 requires Brown for Line, Blue for Neutral, and Green/Yellow for CPC Earth. Always lock off and prove dead before touching terminals. WRAS plumbing requires 50mm water seal P-traps and properly seated brass olives.",
        }),
      });

      const data = await res.json();
      addMessage({
        id: `tutor-${Date.now()}`,
        role: "tutor",
        content: data.message,
        timestamp: "Now",
        sourceReference: data.sourceReference,
        confidence: data.confidence,
        requiresInstructorReview: data.requiresInstructorReview,
      });
    } catch {
      addMessage({
        id: `tutor-err-${Date.now()}`,
        role: "tutor",
        content: "Unable to reach course database right now. Please consult your bay instructor.",
        timestamp: "Now",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-paper-hi border-l border-workshop-border shadow-2xl flex flex-col font-sans">
      <div className="p-4 border-b border-workshop-border bg-paper flex items-center justify-between">
        <div>
          <div className="font-serif text-base font-semibold text-ink">
            ISA Course Tutor
          </div>
          <div className="text-[10px] font-mono text-ink-faded uppercase tracking-wider">
            Grounded in Approved Syllabus
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 text-ink-muted hover:text-ink rounded-workshop border border-transparent hover:border-workshop-border"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-2.5 bg-paper-lo border-b border-workshop-border flex gap-1.5 overflow-x-auto text-[11px] font-mono">
        <button
          onClick={() => handleSend("Explain why we isolate the 100A main switch first.")}
          className="px-2.5 py-1 rounded-workshop bg-paper-hi border border-workshop-border text-ink-secondary hover:border-ink whitespace-nowrap"
        >
          Safe Isolation?
        </button>
        <button
          onClick={() => handleSend("What happens if a brass olive is not seated properly?")}
          className="px-2.5 py-1 rounded-workshop bg-paper-hi border border-workshop-border text-ink-secondary hover:border-ink whitespace-nowrap"
        >
          Compression Olive?
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-paper/50">
        {messages.map((msg) => {
          const isTutor = msg.role === "tutor";
          return (
            <div key={msg.id} className={cn("flex flex-col text-xs", isTutor ? "items-start" : "items-end")}>
              <div className="text-[10px] font-mono text-ink-faded mb-1">
                {isTutor ? "ISA Tutor" : "Apprentice"} &bull; {msg.timestamp}
              </div>
              <div
                className={cn(
                  "p-3 rounded-workshop max-w-[92%] leading-relaxed border",
                  isTutor
                    ? "bg-paper-hi border-workshop-border text-ink"
                    : "bg-ink text-paper-hi border-ink"
                )}
              >
                {msg.content}
                {msg.sourceReference && (
                  <div className="mt-2 pt-1.5 border-t border-rule-soft flex items-center gap-1.5 text-[10px] font-mono text-ink-muted">
                    <BookOpen className="w-3 h-3" />
                    <span>Ref: {msg.sourceReference}</span>
                  </div>
                )}
                {msg.requiresInstructorReview && (
                  <div className="mt-2 p-1.5 rounded-workshop bg-amber-50 border border-amber-300 text-[10px] font-mono text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>Flagged for Instructor Verification</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="p-2.5 bg-paper-hi border border-workshop-border rounded-workshop text-[11px] font-mono text-ink-muted">
            Checking approved course notes...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-paper-hi border-t border-workshop-border flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about wiring, fittings, or faults..."
          className="input-workshop py-2 text-xs"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-workshop bg-ink text-paper-hi hover:bg-ink-secondary disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
