"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import PipeCanvas from "@/components/simulator/plumbing/PipeCanvas";
import FittingsShelf from "@/components/simulator/plumbing/FittingsShelf";
import PlumbingControls from "@/components/simulator/plumbing/PlumbingControls";
import ValidationPanel from "@/components/simulator/plumbing/ValidationPanel";
import TutorAvatar from "@/components/ai-tutor/TutorAvatar";
import TutorPanel from "@/components/ai-tutor/TutorPanel";
import { useSimulationStore } from "@/lib/store";
import { PLUMBING_SCENARIOS, validatePlumbing } from "@/lib/simulation-engine/plumbing";
import { playAlarm, playSuccess } from "@/lib/sound";

export default function PlumbingWorkshopPage() {
  const { components, connections, soundEnabled, setErrors, setScore, setComplete } = useSimulationStore();
  const [selectedScenarioId, setSelectedScenarioId] = useState("basic-assembly");
  const [showValidation, setShowValidation] = useState(false);
  const [isWaterTurnedOn, setIsWaterTurnedOn] = useState(false);

  const scenario = PLUMBING_SCENARIOS[selectedScenarioId as keyof typeof PLUMBING_SCENARIOS] || PLUMBING_SCENARIOS["basic-assembly"];

  const handleTestSystem = () => {
    const result = validatePlumbing(components, connections);
    setErrors(result.errors);
    setScore(result.score);
    setComplete(result.isValid);
    setShowValidation(true);
    if (result.isValid) {
      setIsWaterTurnedOn(true);
      playSuccess(soundEnabled);
    } else {
      playAlarm(soundEnabled);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-workshop-bg text-chalk font-body">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-workshop-border mb-6 gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/learn"
              className="p-2 rounded-workshop bg-workshop-surface border border-workshop-border hover:text-arc-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display tracking-wider text-xl text-chalk">
                  {scenario.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-workshop bg-arc-500/10 text-arc-400 border border-arc-500/30">
                  PLUMBING LAB
                </span>
              </div>
              <div className="text-xs text-chalk-muted font-body">{scenario.description}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-chalk-faded">EXERCISE:</span>
            <select
              value={selectedScenarioId}
              onChange={(e) => {
                setSelectedScenarioId(e.target.value);
                setShowValidation(false);
              }}
              className="bg-workshop-surface border border-workshop-border text-chalk text-xs font-mono rounded-workshop px-3 py-1.5 focus:outline-none focus:border-arc-500"
            >
              <option value="basic-assembly">01: Pipe Assembly Basics</option>
              <option value="sink-trap">02: Installing a Sink Trap</option>
              <option value="tee-junction">03: Splitting the Flow</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 items-start">
          <div className="md:col-span-3">
            <FittingsShelf />
          </div>

          <div className="md:col-span-9 space-y-4">
            <PipeCanvas isWaterTurnedOn={isWaterTurnedOn} />

            <PlumbingControls
              onTestSystem={handleTestSystem}
              isWaterTurnedOn={isWaterTurnedOn}
              onToggleWater={() => setIsWaterTurnedOn(!isWaterTurnedOn)}
            />

            {showValidation && <ValidationPanel onClose={() => setShowValidation(false)} />}
          </div>
        </div>
      </div>

      <Footer />
      <TutorAvatar />
      <TutorPanel
        lessonTitle={scenario.title}
        category="plumbing"
        simulationStateSummary={{
          componentsCount: components.length,
          hasErrors: false,
          errors: [],
          score: 100,
        }}
      />
    </main>
  );
}
