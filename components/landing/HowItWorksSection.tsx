"use client";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Study the Job Sheet",
      desc: "Review the wiring diagram or pipework schematic in plain language, backed strictly by instructor-approved ISA course notes.",
      meta: "Theory & Standards",
    },
    {
      num: "02",
      title: "Assemble on the 3D Rig",
      desc: "Route Twin & Earth conductors (Brown, Blue, CPC Earth) or seat 15mm copper pipes and brass compression fittings on a realistic training wall.",
      meta: "Procedural 3D Bench",
    },
    {
      num: "03",
      title: "Commission & Fault-Find",
      desc: "Execute Safe Isolation (Lock-Off / Prove-Test-Prove), energize the MCB, or run a 3.0 bar hydrostatic pressure test with live instrument readouts.",
      meta: "Deterministic Rules",
    },
    {
      num: "04",
      title: "Instructor Sign-Off",
      desc: "Move to the physical bay with logged procedural habits. Physical bench power remains locked until the instructor verifies the build.",
      meta: "Supervised Practical",
    },
  ];

  return (
    <section className="py-16 bg-paper-hi border-b border-workshop-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faded mb-1.5">
              01 &mdash; WORKFLOW
            </div>
            <h2 className="font-serif text-3xl font-semibold text-ink">
              From Virtual Rig to Physical Bay
            </h2>
          </div>
          <p className="mt-2 md:mt-0 text-xs text-ink-muted max-w-md">
            Structured around real UK trade commissioning sequences so beginners build muscle memory before handling live tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div key={s.num} className="workshop-card p-5 flex flex-col justify-between bg-paper">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-rule-soft">
                  <span className="font-mono text-sm font-semibold text-trade-electrical">
                    {s.num}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faded">
                    {s.meta}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
