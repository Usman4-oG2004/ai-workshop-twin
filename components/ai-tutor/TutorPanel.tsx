"use client";

import { useState, useRef, useEffect } from "react";
import { HardHat, Send, X, AlertTriangle, BookCheck, ShieldAlert, Sparkles, User } from "lucide-react";
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
  lessonTitle = "Your First Circuit",
  category = "electrical",
  simulationStateSummary,
}: TutorPanelProps) {
  const { messages, isOpen, setOpen, addMessage, isLoading, setLoading } = useTutorStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial welcome message if conversation is empty
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: "msg-welcome",
        role: "tutor",
        content: `Hey there! I'm your AI Workshop Foreman. We're working on "${lessonTitle}". Connect up your components on the bench — if you run into any issues or want to know what a switch, load, or fitting actually does, hit me up! No questions are silly here; make your mistakes here in the simulator before you ever touch a live training kit.`,
        timestamp: "Just now",
        sourceReference: "ISA Apprentice Handbook § 1.2",
      });
    }
  }, [lessonTitle, messages.length, addMessage]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "student" as const,
      content: text,
      timestamp: "Just now",
    };

    addMessage(userMsg);
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
            category: category,
            currentStep: 1,
            totalSteps: 4,
            objectives: ["Understand switch and load functions", "Avoid short circuits"],
          },
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          simulationState: simulationStateSummary
            ? {
                components: [`${simulationStateSummary.componentsCount} components active`],
                errors: simulationStateSummary.errors,
                score: simulationStateSummary.score,
              }
            : undefined,
          approvedMaterials: "Imperial Skills Academy Curriculum §2: A circuit requires an unbroken closed loop. Current moves from (+) terminal through control element (switch) into load (bulb filament), dissipating energy and returning to (-) terminal. A direct (+) to (-) path without load creates an extreme current spike (Short Circuit), activating thermal protection.",
        }),
      });

      const data = await res.json();
      addMessage({
        id: `tutor-${Date.now()}`,
        role: "tutor",
        content: data.message,
        timestamp: "Just now",
        sourceReference: data.sourceReference,
        confidence: data.confidence,
        requiresInstructorReview: data.requiresInstructorReview,
      });
    } catch (err) {
      addMessage({
        id: `tutor-err-${Date.now()}`,
        role: "tutor",
        content: "I had a momentary glitch contacting the academy knowledge base. Try again or check the safety diagram!",
        timestamp: "Just now",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-workshop-surface border-l border-workshop-border shadow-2xl flex flex-col font-body">
      {/* Top Header */}
      <div className="p-4 border-b border-workshop-border bg-workshop-elevated flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-workshop bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display tracking-wider text-base text-chalk">
                WORKSHOP FOREMAN AI
              </span>
              <span className="w-2 h-2 rounded-full bg-safety-green animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-chalk-faded uppercase tracking-wider">
              ISA Approved Materials &bull; Level 1 Tutor
            </div>
          </div>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="p-1.5 text-chalk-muted hover:text-chalk hover:bg-workshop-bg rounded-workshop border border-transparent hover:border-workshop-border transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Prompts */}
      <div className="p-2.5 bg-workshop-bg border-b border-workshop-border flex gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
        <button
          onClick={() => handleSend("What does the switch actually do in this circuit?")}
          className="px-2.5 py-1 rounded-workshop bg-workshop-surface hover:bg-workshop-elevated border border-workshop-border text-chalk-muted hover:text-amber-400 whitespace-nowrap transition-colors"
        >
          💡 Explain Switch
        </button>
        <button
          onClick={() => handleSend("Give me a hint on why my circuit isn't lighting.")}
          className="px-2.5 py-1 rounded-workshop bg-workshop-surface hover:bg-workshop-elevated border border-workshop-border text-chalk-muted hover:text-amber-400 whitespace-nowrap transition-colors"
        >
          🔍 Staging Hint
        </button>
        <button
          onClick={() => handleSend("What is a short circuit and why is it dangerous?")}
          className="px-2.5 py-1 rounded-workshop bg-workshop-surface hover:bg-workshop-elevated border border-workshop-border text-chalk-muted hover:text-amber-400 whitespace-nowrap transition-colors"
        >
          ⚠️ Short Circuit?
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-workshop-bg/50">
        {messages.map((msg) => {
          const isTutor = msg.role === "tutor";
          return (
            <div
              key={msg.id}
              className={cn("flex flex-col text-xs", isTutor ? "items-start" : "items-end")}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-chalk-faded">
                {isTutor ? (
                  <>
                    <HardHat className="w-3 h-3 text-amber-500" />
                    <span>Foreman AI</span>
                  </>
                ) : (
                  <>
                    <span>You (Apprentice)</span>
                    <User className="w-3 h-3 text-chalk-muted" />
                  </>
                )}
                <span>&bull;</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={cn(
                  "p-3 rounded-workshop max-w-[92%] leading-relaxed border transition-all",
                  isTutor
                    ? "bg-workshop-surface border-workshop-border text-chalk shadow-sm"
                    : "bg-amber-500/15 border-amber-500/40 text-amber-100"
                )}
              >
                {msg.content}

                {/* Source Citation badge */}
                {msg.sourceReference && (
                  <div className="mt-2.5 pt-2 border-t border-workshop-border/80 flex items-center gap-1.5 text-[10px] font-mono text-amber-400/90">
                    <BookCheck className="w-3 h-3 text-amber-400" />
                    <span>Source: {msg.sourceReference}</span>
                  </div>
                )}

                {/* Low Confidence / Safety Warning */}
                {msg.requiresInstructorReview && (
                  <div className="mt-2 p-1.5 rounded-workshop bg-safety-yellow/10 border border-safety-yellow/30 text-[10px] font-mono text-safety-yellow flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>Low AI certainty &bull; Flagged for Instructor verification</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-workshop-surface border border-workshop-border rounded-workshop text-xs font-mono text-chalk-muted max-w-[200px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Consulting ISA notes...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Safety Banner */}
      <div className="px-4 py-1.5 bg-workshop-elevated border-t border-workshop-border flex items-center justify-between text-[10px] font-mono text-chalk-faded">
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-amber-400" /> Virtual simulation only
        </span>
        <span>Physical kit requires instructor supervisor</span>
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-workshop-surface border-t border-workshop-border flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Foreman about wiring, switch, fittings..."
          className="flex-1 bg-workshop-bg border border-workshop-border rounded-workshop px-3 py-2 text-xs text-chalk focus:outline-none focus:border-amber-500 font-body placeholder:text-chalk-faded"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-workshop bg-amber-500 text-workshop-bg hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
