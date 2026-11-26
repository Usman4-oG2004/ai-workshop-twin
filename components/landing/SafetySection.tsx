"use client";

export default function SafetySection() {
  const pillars = [
    {
      title: "Deterministic Rule Validation",
      desc: "Short-circuit detection, reversed polarity, open CPC earth, and compression leak checks run on strict mathematical rules — never generative AI guesses.",
      tag: "Non-Hallucinatory",
    },
    {
      title: "Instructor-Approved Course Notes",
      desc: "The AI Tutor only cites materials uploaded and approved by ISA instructors, keeping explanations aligned with UK trade terminology.",
      tag: "Grounded RAG",
    },
    {
      title: "Uncertainty Escalation",
      desc: "Questions outside the approved syllabus or involving live mains work are automatically flagged for the human instructor queue.",
      tag: "Supervisor Queue",
    },
    {
      title: "Physical Bay Interlock",
      desc: "Virtual completion unlocks the pre-energize safety checklist; real bench supplies remain locked off until inspected by an instructor.",
      tag: "Live Bay Gate",
    },
  ];

  return (
    <section className="py-16 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faded mb-1.5">
            04 &mdash; ACCURACY &amp; SAFETY GOVERNANCE
          </div>
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Engineered for Real Trade Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p) => (
            <div key={p.title} className="workshop-card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-lg font-semibold text-ink">{p.title}</h3>
                <span className="work-order-tag text-[10px]">{p.tag}</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
