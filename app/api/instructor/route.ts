import { NextResponse } from "next/server";

export async function GET() {
  const stats = {
    totalStudents: 38,
    activeToday: 14,
    lessonsCompleted: 142,
    averageScore: 84.6,
    pendingReviews: 3,
    safetyFlags: 0,
  };

  const students = [
    {
      studentId: "stu-101",
      studentName: "Marcus Vance",
      category: "electrical",
      lessonsCompleted: 3,
      totalLessons: 6,
      averageScore: 92,
      totalTimeSpent: 3840,
      interestLevel: 5,
      strengths: [
        "Checked 4 of 4 connections before energizing",
        "Methodical isolation checklist execution",
        "Naturally gravitated to fault diagnostic branch",
      ],
      areasToDevelop: [
        "Slow on initial terminal labeling identification",
      ],
      observations: [
        {
          id: "obs-1",
          type: "strength",
          category: "attention-to-detail",
          description: "Verified polarity orientation on all battery terminals twice before flipping toggle.",
          evidence: "Zero short-circuit attempts across 3 workshop sessions.",
          timestamp: "Today 10:14 AM",
        },
        {
          id: "obs-2",
          type: "strength",
          category: "troubleshooting",
          description: "Used single-variable isolation when troubleshooting open circuit.",
          evidence: "Swapped test bulb only after confirming 12V terminal feed continuity.",
          timestamp: "Today 10:45 AM",
        },
      ],
    },
    {
      studentId: "stu-102",
      studentName: "Elena Rostova",
      category: "plumbing",
      lessonsCompleted: 4,
      totalLessons: 6,
      averageScore: 88,
      totalTimeSpent: 4210,
      interestLevel: 4,
      strengths: [
        "Zero open-port leaks across pipe runs",
        "Consistently installs P-traps with correct fall pitch",
      ],
      areasToDevelop: [
        "Tends to skip diameter verification before fitting selection",
      ],
      observations: [
        {
          id: "obs-3",
          type: "strength",
          category: "safety-awareness",
          description: "Identified open drain port leak hazard prior to engaging simulation test valve.",
          evidence: "Corrected missing end cap without needing AI hint.",
          timestamp: "Yesterday 3:20 PM",
        },
      ],
    },
    {
      studentId: "stu-103",
      studentName: "Darnell Jenkins",
      category: "electrical",
      lessonsCompleted: 2,
      totalLessons: 6,
      averageScore: 78,
      totalTimeSpent: 2980,
      interestLevel: 5,
      strengths: [
        "High enthusiasm; completed 2 bonus challenges",
        "Fast spatial comprehension of wiring diagrams",
      ],
      areasToDevelop: [
        "Changed two variables at once while diagnosing fault",
      ],
      observations: [
        {
          id: "obs-4",
          type: "area-to-develop",
          category: "troubleshooting",
          description: "Changed both the switch and wire run simultaneously when bulb failed.",
          evidence: "AI prompted: 'Change one component at a time to know which was faulty.'",
          timestamp: "Nov 22, 2:10 PM",
        },
      ],
    },
  ];

  const recentActivity = [
    {
      id: "act-1",
      studentName: "Marcus Vance",
      lessonTitle: "Your First Circuit",
      category: "electrical",
      action: "Completed virtual circuit simulation with 100% score",
      timestamp: "12 mins ago",
      score: 100,
    },
    {
      id: "act-2",
      studentName: "Darnell Jenkins",
      lessonTitle: "Fault Finder",
      category: "electrical",
      action: "Triggered progressive hint #2: 'Trace path from positive terminal'",
      timestamp: "34 mins ago",
      score: 75,
    },
    {
      id: "act-3",
      studentName: "Elena Rostova",
      lessonTitle: "P-Trap Installation",
      category: "plumbing",
      action: "Passed hydrostatic leak test with 0 open joints",
      timestamp: "1 hour ago",
      score: 95,
    },
  ];

  const contentReviews = [
    {
      id: "rev-1",
      type: "ai-response",
      content: "Student asked: 'Can I test 230V mains with the same multimeter setting?' AI replied: 'Stop! Virtual simulations cover low-voltage (12V) DC only. Never touch 230V mains without certified instructor supervision.'",
      context: "Low confidence flag triggered on mains electricity keyword",
      status: "pending",
      createdAt: "Today 11:20 AM",
    },
    {
      id: "rev-2",
      type: "safety-concern",
      content: "Student simulated 3 consecutive direct dead-shorts on 24V supply without load.",
      context: "Repetitive failure trigger: AI redirected to circuit basics explanation",
      status: "pending",
      createdAt: "Yesterday 4:40 PM",
    },
  ];

  return NextResponse.json({ stats, students, recentActivity, contentReviews });
}
