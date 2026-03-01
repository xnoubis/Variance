import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CorePrinciple() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4 uppercase tracking-wider">The Constitutive Tension</h2>
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-sm leading-relaxed space-y-4">
          <p className="text-zinc-300">
            <strong className="text-cyan-400">Stochasticity is not a bug in an otherwise deterministic system.</strong><br/>
            Stochasticity is the substrate of generative capacity. Every method that reduces unpredictability also reduces capability. This is not a tradeoff to optimize. It is a tension to compose with.
          </p>
          <p className="text-zinc-400">
            Temperature reduction → flatness. RLHF → second-order instability. Prompt engineering → probabilistic nudge with context-length decay. Fine-tuning → distribution shift, not tail elimination.
          </p>
          <p className="text-zinc-300 border-l-2 border-amber-500 pl-4">
            None of these solve unpredictability because unpredictability is not the problem. The problem is that we've been building deterministic expectations on a stochastic substrate.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4 uppercase tracking-wider">Resilience Over Prediction</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Old Frame */}
          <div className="p-6 bg-zinc-900/50 border border-red-900/30 rounded-lg">
            <div className="flex items-center gap-2 mb-4 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wider">Old Frame</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-6 uppercase tracking-widest">Make the model predictable</p>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">├─</span> Reduce temperature
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">├─</span> Constrain outputs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">├─</span> Fine-tune for consistency
              </li>
              <li className="flex items-start gap-2 text-red-300 mt-4 pt-4 border-t border-red-900/30">
                <span className="text-red-500 mt-0.5">└─</span> Result: Diminished capability
              </li>
            </ul>
          </div>

          {/* New Frame */}
          <div className="p-6 bg-cyan-950/10 border border-cyan-900/30 rounded-lg">
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wider">New Frame</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-6 uppercase tracking-widest">Make the system resilient</p>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">├─</span> Generate freely (accept variance)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">├─</span> Validate against constraints (catch drift)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">├─</span> Regenerate on failure (use variance as resource)
              </li>
              <li className="flex items-start gap-2 text-cyan-300 mt-4 pt-4 border-t border-cyan-900/30 font-medium">
                <span className="text-cyan-500 mt-0.5">└─</span> Result: Full capability + reliability
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
