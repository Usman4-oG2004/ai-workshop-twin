import { NextResponse } from "next/server";
import { validatePlumbing } from "@/lib/simulation-engine/plumbing";

export async function POST(req: Request) {
  try {
    const { components = [], connections = [] } = await req.json();
    const result = validatePlumbing(components, connections);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Plumbing validation error:", error);
    return NextResponse.json(
      { isValid: false, errors: [{ message: "Internal plumbing validation failure", severity: "critical" }], score: 0 },
      { status: 500 }
    );
  }
}
