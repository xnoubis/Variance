import React from 'react';
import { Target, AlignLeft, Zap, Ban, ArrowRight } from 'lucide-react';

export default function PromptingGuide() {
  const strategies = [
    {
      title: 'Explicit Constraint Declaration',
      icon: AlignLeft,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-900/50',
      bgColor: 'bg-cyan-950/10',
      description: 'Do not rely on implicit expectations. State exactly what structural, semantic, and tonal constraints the output must satisfy.',
      example: 'Instead of "Write a professional email", use "Write an email. Constraints: Under 100 words, formal tone, must include the project deadline."'
    },
    {
      title: 'Codex Triggers',
      icon: Zap,
      color: 'text-amber-400',
      borderColor: 'border-amber-900/50',
      bgColor: 'bg-amber-950/10',
      description: 'Use single-word, highly specific commands mapped to complex instructions. This reduces interpretation variance to zero.',
      example: 'Instead of "Can you check this for errors and fix them?", use a predefined trigger like "/cultivate" or "/audit".'
    },
    {
      title: 'High-Density Context Anchoring',
      icon: Target,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-900/50',
      bgColor: 'bg-emerald-950/10',
      description: 'Provide the exact frame of reference immediately. Do not make the model guess the persona or the environment.',
      example: 'Start with: "Context: You are a senior database architect reviewing a migration script for a high-throughput financial system."'
    },
    {
      title: 'Negative Pruning',
      icon: Ban,
      color: 'text-red-400',
      borderColor: 'border-red-900/50',
      bgColor: 'bg-red-950/10',
      description: 'Explicitly state what the model should NOT do. This prunes unwanted probability branches early in the generation process.',
      example: 'Add: "Do NOT include introductory filler, do NOT use markdown formatting, do NOT explain the code."'
    }
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4 uppercase tracking-wider">Prompting for Resilience</h2>
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-sm leading-relaxed space-y-4 mb-8">
          <p className="text-zinc-300">
            <strong className="text-cyan-400">Reduce Interpretation Variance at Boundary 1.</strong><br/>
            The goal of prompt engineering in a resilient system is not to force a specific sequence of words, but to establish a rigid boundary condition that the stochastic generation must operate within. Clarity and specificity reduce the combinatorial ambiguity of natural language.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {strategies.map((strat) => {
            const Icon = strat.icon;
            return (
              <div key={strat.title} className={`p-6 rounded-lg border ${strat.borderColor} ${strat.bgColor} flex flex-col h-full`}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-5 h-5 ${strat.color}`} />
                  <h3 className={`font-bold tracking-wider uppercase ${strat.color}`}>{strat.title}</h3>
                </div>
                <p className="text-sm text-zinc-300 mb-4 flex-1">
                  {strat.description}
                </p>
                <div className={`pt-4 border-t ${strat.borderColor} mt-auto`}>
                  <p className="text-xs text-zinc-400 font-mono">
                    <span className={`${strat.color} font-bold`}>EXAMPLE:</span> {strat.example}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-zinc-100 mb-4 uppercase tracking-wider">Before & After: The Resilience Delta</h3>
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              <div className="p-6">
                <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Brittle Prompt (High Variance)</div>
                <p className="text-sm text-zinc-400 italic">"Write a function to parse a CSV file and return the data. Make sure it handles errors well."</p>
                <ul className="mt-4 space-y-2 text-xs text-zinc-500">
                  <li>• "Parse" is ambiguous (what output format?)</li>
                  <li>• "Handles errors well" is subjective</li>
                  <li>• Leaves tone and structure entirely up to chance</li>
                </ul>
              </div>
              <div className="p-6 bg-cyan-950/5">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">Resilient Prompt (Low Variance)</div>
                <p className="text-sm text-zinc-300 italic">"Write a TypeScript function named parseCSV that takes a raw CSV string and returns an array of objects. <br/><br/>Constraints:<br/>- Must throw a custom 'CSVParseError' on malformed rows.<br/>- Do not include usage examples.<br/>- Return only the code block."</p>
                <ul className="mt-4 space-y-2 text-xs text-zinc-400">
                  <li>• Explicit input/output types</li>
                  <li>• Concrete error handling requirement</li>
                  <li>• Negative pruning applied</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
