import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { action, role = "student" } = await req.json();

    const mockUser = {
      id: role === "instructor" ? "inst-001" : "student-001",
      name: role === "instructor" ? "Instructor Alan (ISA Electrical Lead)" : "Alex Morgan (Apprentice)",
      email: role === "instructor" ? "alan@imperialskills.co.uk" : "alex@imperialskills.co.uk",
      role: role,
    };

    return NextResponse.json({
      user: mockUser,
      token: "demo-jwt-token-verified-isa",
      isAuthenticated: true,
    });
  } catch (error) {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}
