import { NextResponse } from "next/server";
import { getAITutorResponse } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, lessonContext, conversationHistory, simulationState, approvedMaterials } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await getAITutorResponse({
      message,
      lessonContext: lessonContext || {
        title: "Your First Circuit",
        category: "electrical",
        currentStep: 1,
        totalSteps: 4,
        objectives: ["Understand switch and load", "Identify short circuits safely"],
      },
      conversationHistory: conversationHistory || [],
      simulationState,
      approvedMaterials,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI Tutor API Error:", error);
    return NextResponse.json(
      {
        message: "I am having trouble reaching the ISA training database. Ask your instructor or try again shortly.",
        confidence: 0,
        requiresInstructorReview: true,
        suggestedAction: "ask-instructor",
      },
      { status: 500 }
    );
  }
}
