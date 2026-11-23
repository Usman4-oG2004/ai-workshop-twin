import { NextResponse } from "next/server";
import { validateCircuit } from "@/lib/simulation-engine/electrical";

export async function POST(req: Request) {
  try {
    const { components = [], connections = [], rules = [] } = await req.json();
    const result = validateCircuit(components, connections, rules);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Circuit validation error:", error);
    return NextResponse.json(
      { isValid: false, errors: [{ message: "Internal validation failure", severity: "critical" }], score: 0 },
      { status: 500 }
    );
  }
}
