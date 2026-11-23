// ═══════════════════════════════════════════════
// AI Tutor Service — Gemini Integration
// Grounded in instructor-approved materials
// ═══════════════════════════════════════════════

const SYSTEM_PROMPT = `You are the AI Workshop Foreman — a friendly, patient, and knowledgeable tutor helping beginners learn electrical and plumbing skills at Imperial Skills Academy (ISA).

CORE RULES:
1. SAFETY FIRST: Always prioritize safety. If a student's action could be dangerous, stop and explain why before anything else.
2. GROUNDED RESPONSES: Base your explanations on the provided course materials. Reference specific sections when possible.
3. PROGRESSIVE HINTS: Don't give the answer immediately. Ask a guiding question first, then provide a small hint, then a bigger hint. Let the student think.
4. PLAIN LANGUAGE: These are beginners with no experience. Use simple, everyday words. Explain jargon when you first use it.
5. ENCOURAGING TONE: Mistakes are learning opportunities. Never make the student feel bad about errors.
6. KNOW YOUR LIMITS: If you're unsure about something or if the question is about a real-world task that requires supervision, say so clearly and suggest asking the instructor.
7. NO REAL-WORLD SAFETY DECISIONS: Never tell a student it's safe to do something with real electricity or water. Always defer to the instructor for real-world tasks.

RESPONSE FORMAT:
- Keep responses concise (2-4 sentences for hints, up to a paragraph for explanations)
- Use analogies from everyday life (e.g., "Think of a switch like a drawbridge — when it's up, nothing can cross")
- When referencing course material, cite it: [Source: Module 1, Section 2]

PERSONALITY:
- Patient and calm
- Uses workshop humor occasionally
- Celebrates small wins
- Treats every question as valid`;

interface TutorRequest {
  message: string;
  lessonContext: {
    title: string;
    category: string;
    currentStep: number;
    totalSteps: number;
    objectives: string[];
  };
  conversationHistory: Array<{ role: string; content: string }>;
  simulationState?: {
    components: string[];
    errors: string[];
    score: number;
  };
  approvedMaterials?: string;
}

interface TutorResponse {
  message: string;
  confidence: number;
  sourceReference?: string;
  requiresInstructorReview: boolean;
  suggestedAction?: "hint" | "explanation" | "encouragement" | "safety-warning" | "ask-instructor";
}

export async function getAITutorResponse(request: TutorRequest): Promise<TutorResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      message: "I'm having trouble connecting right now. Please ask your instructor for help with this question.",
      confidence: 0,
      requiresInstructorReview: false,
      suggestedAction: "ask-instructor",
    };
  }

  const contextPrompt = buildContextPrompt(request);
  const messages = [
    ...request.conversationHistory.map((m) => ({
      role: m.role === "student" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: request.message }] },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT + "\n\n" + contextPrompt }] },
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 500,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Determine confidence based on response content
    const confidence = calculateConfidence(text, request);
    const requiresReview = confidence < 0.6 || containsSafetyTopic(text);

    return {
      message: text,
      confidence,
      sourceReference: extractSourceReference(text),
      requiresInstructorReview: requiresReview,
      suggestedAction: determineSuggestedAction(text, confidence),
    };
  } catch (error) {
    console.error("AI Tutor error:", error);
    return {
      message: "I'm not sure about that one — it's a great question though! Let's flag it for your instructor so you get the most accurate answer.",
      confidence: 0,
      requiresInstructorReview: true,
      suggestedAction: "ask-instructor",
    };
  }
}

function buildContextPrompt(request: TutorRequest): string {
  let context = `\nCURRENT LESSON: "${request.lessonContext.title}" (${request.lessonContext.category})`;
  context += `\nProgress: Step ${request.lessonContext.currentStep} of ${request.lessonContext.totalSteps}`;
  context += `\nObjectives: ${request.lessonContext.objectives.join(", ")}`;

  if (request.simulationState) {
    context += `\n\nSIMULATION STATE:`;
    context += `\nComponents placed: ${request.simulationState.components.join(", ")}`;
    if (request.simulationState.errors.length > 0) {
      context += `\nCurrent issues: ${request.simulationState.errors.join("; ")}`;
    }
    context += `\nCurrent score: ${request.simulationState.score}%`;
  }

  if (request.approvedMaterials) {
    context += `\n\nAPPROVED COURSE MATERIALS:\n${request.approvedMaterials}`;
  }

  return context;
}

function calculateConfidence(text: string, request: TutorRequest): number {
  let confidence = 0.8;
  if (text.toLowerCase().includes("i'm not sure") || text.toLowerCase().includes("i think")) {
    confidence -= 0.3;
  }
  if (text.toLowerCase().includes("[source:")) {
    confidence += 0.1;
  }
  if (request.approvedMaterials && request.approvedMaterials.length > 0) {
    confidence += 0.05;
  }
  return Math.max(0, Math.min(1, confidence));
}

function containsSafetyTopic(text: string): boolean {
  const safetyKeywords = [
    "voltage", "mains", "live wire", "electrocution", "shock",
    "gas leak", "flood", "emergency", "danger", "hazard",
    "real-world", "supervised", "instructor should",
  ];
  const lower = text.toLowerCase();
  return safetyKeywords.some((kw) => lower.includes(kw));
}

function extractSourceReference(text: string): string | undefined {
  const match = text.match(/\[Source:\s*([^\]]+)\]/);
  return match ? match[1] : undefined;
}

function determineSuggestedAction(text: string, confidence: number): TutorResponse["suggestedAction"] {
  if (confidence < 0.5) return "ask-instructor";
  if (containsSafetyTopic(text)) return "safety-warning";
  if (text.includes("?") && text.split("?").length > 2) return "hint";
  if (text.includes("Well done") || text.includes("Great") || text.includes("🎉")) return "encouragement";
  return "explanation";
}
