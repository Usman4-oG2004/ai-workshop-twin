import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-workshop-border bg-paper-lo/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-2.5">
            <div className="font-serif text-lg font-semibold text-ink">
              Imperial Skills Academy — Virtual Trade Bench
            </div>
            <p className="text-xs text-ink-muted max-w-md leading-relaxed">
              Procedural 3D WebGL training rigs and deterministic commissioning checks for domestic electrical installation (BS 7671) and plumbing pipework (WRAS).
            </p>
            <div className="text-[11px] font-mono text-ink-faded pt-1">
              All 3D hardware, copper fittings, consumer units, and instruments are procedurally rendered in real time.
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faded mb-3">
              Training Bays
            </div>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/workshop/electrical" className="hover:text-ink hover:underline">
                  Electrical Installation Bay
                </Link>
              </li>
              <li>
                <Link href="/workshop/plumbing" className="hover:text-ink hover:underline">
                  Plumbing Commissioning Rig
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-ink hover:underline">
                  Curriculum &amp; Job Sheets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faded mb-3">
              Supervision
            </div>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/instructor" className="hover:text-ink hover:underline">
                  Instructor Control Room
                </Link>
              </li>
              <li>
                <Link href="/instructor/students" className="hover:text-ink hover:underline">
                  Observation Evidence Log
                </Link>
              </li>
              <li>
                <Link href="/instructor/content" className="hover:text-ink hover:underline">
                  Approved Course Notes
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-5 border-t border-workshop-border flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-ink-faded gap-2">
          <div>Imperial Skills Academy Pilot &bull; Built by Ahsan Naeem</div>
          <div>Deterministic Validation Engine &bull; Grounded AI Tutor</div>
        </div>
      </div>
    </footer>
  );
}
