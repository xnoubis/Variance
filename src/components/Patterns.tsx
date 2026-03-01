import React from 'react';
import { Repeat, Users, Activity, Layers } from 'lucide-react';

export default function Patterns() {
  const patterns = [
    {
      title: 'Generate-Validate-Regenerate (GVR)',
      icon: Repeat,
      context: 'For critical outputs',
      steps: [
        'GENERATE: Full capability, no constraint anxiety',
        'VALIDATE: Check constraints (not output matching)',
        'If constraints met → DELIVER',
        'If constraints violated:\n  a. DIAGNOSE: Which constraint failed? Why?\n  b. REGENERATE: With diagnosis as additional context\n  c. Return to step 2',
        'If 3 cycles without satisfaction → ESCALATE (surface the tension to the human, don\'t hide it)'
      ]
    },
    {
      title: 'Ensemble Self-Check',
      icon: Users,
      context: 'For high-stakes decisions or factual claims',
      steps: [
        'Generate response',
        'Challenge response adversarially: "What would contradict this?"',
        'If contradiction found:\n  a. Investigate: Is the contradiction valid?\n  b. If valid → revise\n  c. If invalid → note and proceed',
        'Report confidence with delivery'
      ]
    },
    {
      title: 'Drift Detection',
      icon: Activity,
      context: 'For long conversations',
      steps: [
        'Monitor for:\n  - Increasing deviation from initial frame\n  - Softening of constraint adherence\n  - Growing verbosity (entropy signal)\n  - Repeated patterns (the model falling into attractors)',
        'When detected:\n  - Reread active skills\n  - Restate constraints\n  - Check: "Am I still doing what was asked?"'
      ]
    },
    {
      title: 'Constraint Hierarchy',
      icon: Layers,
      context: 'When constraints conflict (and they will)',
      steps: [
        'HARD CONSTRAINTS (never violate):\n  ├─ Safety\n  ├─ Factual accuracy (when verifiable)\n  └─ Explicit user instructions',
        'SOFT CONSTRAINTS (satisfy when possible):\n  ├─ Style preferences\n  ├─ Format conventions\n  └─ Implicit expectations',
        'PREFERENCE CONSTRAINTS (default behavior):\n  ├─ Tone\n  ├─ Length\n  └─ Level of detail',
        'When variance forces a choice, satisfy higher-level constraints at the expense of lower-level ones. Report the tradeoff explicitly.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-zinc-100 mb-6 uppercase tracking-wider">Implementation Patterns</h2>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {patterns.map((pattern, idx) => {
          const Icon = pattern.icon;
          return (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
                <div className="p-2 bg-zinc-800 rounded text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-200 tracking-wide">Pattern {idx + 1}: {pattern.title}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">{pattern.context}</p>
                </div>
              </div>
              
              <div className="p-5 flex-1 bg-black/20">
                <ol className="space-y-4">
                  {pattern.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex gap-3 text-sm text-zinc-300">
                      <span className="text-zinc-600 font-mono shrink-0">{stepIdx + 1}.</span>
                      <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed font-sans">{step}</pre>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
        <h3 className="font-bold text-zinc-100 mb-4 uppercase tracking-wider">Meta: Self-Application</h3>
        <p className="text-sm text-zinc-400 mb-4">
          This skill is itself subject to the variance it describes. On any given invocation, the protocol may be applied inconsistently. The model may forget to reanchor. The constraint check may miss something. The adversarial pass may agree with the generative pass when it shouldn't.
        </p>
        <div className="bg-black/50 p-4 rounded border border-zinc-800 font-mono text-xs text-cyan-400/80">
          The model is unreliable.<br/>
          The system around the model can be resilient.<br/>
          The system is also unreliable.<br/>
          The system around the system can be resilient.<br/>
          Turtles, yes. But turtles with immune systems.
        </div>
      </div>
    </div>
  );
}
