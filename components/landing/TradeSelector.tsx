"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TradeSelector() {
  const trades = [
    {
      id: "electrical",
      kicker: "BS 7671 &bull; DOMESTIC INSTALLATION",
      title: "Electrical Installation Bay",
      href: "/workshop/electrical",
      accentClass: "text-trade-electrical",
      buttonClass: "btn-workshop",
      desc: "3D training wall featuring a 4-way Consumer Unit (100A Main Switch, 30mA RCD, 6A Lighting MCB), 1-gang wall switch, ceiling batten luminaire, and Fluke-style multimeter.",
      specs: [
        "Safe Isolation Procedure (GS38 Prove-Test-Prove)",
        "Brown (L), Blue (N), Green/Yellow (CPC) conductor routing",
        "Deterministic short-circuit & polarity verification",
      ],
    },
    {
      id: "plumbing",
      kicker: "WRAS &bull; DOMESTIC PIPEWORK",
      title: "Plumbing Commissioning Rig",
      href: "/workshop/plumbing",
      accentClass: "text-trade-plumbing",
      buttonClass: "btn-arc",
      desc: "3D tiled vanity bay with 15mm copper supply pipework, brass isolation ball valve, compression elbows, basin mixer tap, 32mm P-trap (50mm water seal), and Bourdon pressure gauge.",
      specs: [
        "Compression nut torque & olive seating inspection",
        "Hydrostatic pressure test up to 6.0 Bar (87 PSI)",
        "BS EN 274 P-trap water seal & waste fall verification",
      ],
    },
  ];

  return (
    <section className="py-16 bg-paper border-b border-workshop-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faded mb-1.5">
            02 &mdash; TRADE BAYS
          </div>
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Select a 3D Training Rig
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trades.map((t) => (
            <div key={t.id} className="workshop-card p-7 flex flex-col justify-between">
              <div>
                <div
                  className={`text-[11px] font-mono uppercase tracking-wider font-semibold mb-2 ${t.accentClass}`}
                  dangerouslySetInnerHTML={{ __html: t.kicker }}
                />
                <h3 className="font-serif text-2xl font-semibold text-ink mb-3">
                  {t.title}
                </h3>
                <p className="text-sm text-ink-secondary leading-relaxed mb-6">
                  {t.desc}
                </p>

                <div className="border-t border-rule-soft pt-4 mb-6 space-y-2">
                  {t.specs.map((spec) => (
                    <div key={spec} className="text-xs font-mono text-ink-muted flex items-start gap-2">
                      <span className="text-ink">&mdash;</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href={t.href} className={`${t.buttonClass} w-full py-3 flex items-center justify-center gap-2`}>
                <span>Enter {t.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
