import { NextResponse } from "next/server";

export async function GET() {
  const lessons = [
    {
      id: "first-circuit",
      title: "Your First Circuit: What a Switch and Load Do",
      description: "Learn how electrical energy flows from a battery source through a control switch to energize an incandescent bulb. Experience short-circuit failsafes firsthand.",
      category: "electrical",
      difficulty: "beginner",
      duration: 15,
      status: "approved",
      objectives: [
        "Explain the role of positive (+) and negative (-) battery terminals",
        "Explain how an open vs. closed switch controls current continuity",
        "Distinguish between a functional circuit load and a hazardous short circuit",
        "Safely complete the low-voltage isolation checklist before physical assembly",
      ],
      safetyNotes: [
        "Always de-energize the power switch before altering any wiring terminals.",
        "A zero-resistance path between terminals results in extreme current draw and cell failure.",
        "Instructor checkoff is mandatory prior to physical bench supply energization.",
      ],
      stepsCount: 4,
    },
    {
      id: "fault-finder",
      title: "Fault Finder: Diagnosing Broken Loops",
      description: "An installed lighting circuit fails to illuminate upon switch engagement. Use progressive isolation to pinpoint blown fuses and high-resistance joints.",
      category: "electrical",
      difficulty: "intermediate",
      duration: 25,
      status: "approved",
      objectives: [
        "Read continuity across series junctions using a virtual multimeter probe",
        "Identify blown fuses without blindly swapping components",
        "Formulate a structured troubleshooting hypothesis rather than making random changes",
      ],
      safetyNotes: [
        "Never bridge a blown fuse with solid copper wire or foil.",
      ],
      stepsCount: 5,
    },
    {
      id: "two-switch-one-light",
      title: "Two Switches, One Light (Two-Way Hallway Circuit)",
      description: "Design a two-way switching network allowing a single overhead fixture to be turned ON or OFF from opposite staircase ends using SPDT traveler lines.",
      category: "electrical",
      difficulty: "intermediate",
      duration: 30,
      status: "approved",
      objectives: [
        "Identify Common (COM), Traveler 1 (L1), and Traveler 2 (L2) terminal lugs",
        "Route dual traveler conductors between two three-way toggle switches",
        "Verify full truth-table state switching without creating cross-phase shorts",
      ],
      safetyNotes: [
        "Ensure neutral wires are never switched; switching must occur on the ungrounded line conductor.",
      ],
      stepsCount: 5,
    },
    {
      id: "basic-assembly",
      title: "Pipe Run Assembly: Couplings & 90° Direction Changes",
      description: "Assemble a pressurized water distribution run from a main supply ball valve to a fixture tap using copper straight lengths and solderless compression elbows.",
      category: "plumbing",
      difficulty: "beginner",
      duration: 20,
      status: "approved",
      objectives: [
        "Measure and align pipe runs allowing for fitting socket depths",
        "Identify orientation and directional flow markers on inline valves",
        "Inspect connection joints for unseated seals causing pressure leaks",
      ],
      safetyNotes: [
        "Open end-caps on pressurized lines create water hammer and flooding hazards.",
        "Always shut off the isolation valve before fitting assembly.",
      ],
      stepsCount: 4,
    },
    {
      id: "sink-trap",
      title: "P-Trap Installation & Sewer Gas Containment",
      description: "Install an under-sink drainage assembly with a liquid water-seal P-trap to prevent methane and hazardous municipal sewer gas infiltration.",
      category: "plumbing",
      difficulty: "beginner",
      duration: 20,
      status: "approved",
      objectives: [
        "Explain how the 50mm liquid water barrier prevents toxic gas backflow",
        "Connect slip-joint washers with correct bevel orientation toward fitting threads",
        "Verify minimum pitch fall (1/4 inch per foot) on horizontal waste arms",
      ],
      safetyNotes: [
        "Never omit the trap seal; sewer gases (hydrogen sulfide) are toxic and flammable.",
      ],
      stepsCount: 4,
    },
    {
      id: "tee-junction",
      title: "Branching Supply Lines with Tee Fittings",
      description: "Split a 22mm main incoming supply line into dual 15mm cold feeds for a washbasin and utility fixture with dedicated branch shutoffs.",
      category: "plumbing",
      difficulty: "intermediate",
      duration: 30,
      status: "approved",
      objectives: [
        "Size reduction fittings without causing localized cavitation turbulence",
        "Incorporate individual fixture stopcocks for local isolation maintenance",
        "Validate balanced hydraulic pressure across simultaneous fixture draw",
      ],
      safetyNotes: [
        "Never connect potable supply lines directly to waste lines without backflow prevention.",
      ],
      stepsCount: 5,
    },
  ];

  return NextResponse.json({ lessons });
}
