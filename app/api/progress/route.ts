import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    studentId: "demo-student-01",
    completedLessons: ["first-circuit"],
    scores: { "first-circuit": 100 },
  });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Logged student progress record:", data);
    return NextResponse.json({ status: "recorded", record: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record progress" }, { status: 500 });
  }
}
