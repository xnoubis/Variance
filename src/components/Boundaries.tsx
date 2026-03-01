import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, MessageSquare, Cpu, ShieldCheck, Send, RefreshCw } from 'lucide-react';

const boundaries = [
  {
    id: 'b1',
    title: 'INTENT → INTERPRETATION',
    icon: MessageSquare,
    breaks: 'The model misreads what you meant.',
    stochastic: 'Natural language has combinatorial ambiguity. Same words, different probability paths through the model.',
    strategy: 'INTENT ECHO',
    strategyDesc: 'Before executing, reflect the interpreted intent back. Not "let me make sure I understand" (performative). Instead: State what you\'re about to do. Let the mismatch surface before work begins.',
    code: `If the echo is wrong → correction costs nothing.
If the echo is right → alignment is confirmed.
If the echo is partially wrong → the partial error reveals the specific ambiguity.`
  },
  {
    id: 'b2',
    title: 'INTERPRETATION → GENERATION',
    icon: Cpu,
    breaks: 'The model understood correctly but produced poorly. The plan was right; the execution wandered.',
    stochastic: 'Each token prediction is a sample from a distribution. Across hundreds of tokens, small deviations compound.',
    strategy: 'CONSTRAINT SATISFACTION',
    strategyDesc: 'Don\'t check: "Did the output match the expected output?" Check: "Does the output satisfy the constraints?" Constraint satisfaction is variance-tolerant. Output matching is variance-brittle.',
    code: `# BRITTLE (output matching):
assert output == expected_output  # fails on any variance

# RESILIENT (constraint satisfaction):
assert has_required_sections(output)      # structural
assert addresses_topic(output, intent)     # semantic  
assert code_executes_without_error(output) # functional
assert tone_matches_register(output)       # tonal`
  },
  {
    id: 'b3',
    title: 'GENERATION → VALIDATION',
    icon: ShieldCheck,
    breaks: 'The model generated something, and now the model must judge its own output. But the judge is also stochastic.',
    stochastic: 'Self-evaluation uses the same probabilistic machinery. The validator can miss what the generator missed.',
    strategy: 'ADVERSARIAL SELF-EVALUATION',
    strategyDesc: 'Don\'t ask: "Is this good?" Ask: "How would I break this?" Generate at one temperature. Evaluate at another. Generate in one frame. Evaluate in another. The disagreement between passes IS the signal.',
    code: `Generation → Breaker Agent (adversarial pass)
          → Integrity Overlay (constraint check)
          → Viability Appraiser (stratum identification)
          
If all three agree → ship
If disagreement → the disagreement IS diagnostic
                  It tells you WHERE variance matters`
  },
  {
    id: 'b4',
    title: 'VALIDATION → DELIVERY',
    icon: Send,
    breaks: 'The output passed validation but still doesn\'t serve the person. The checks passed but the thing is wrong.',
    stochastic: 'Validation criteria themselves may be incomplete. You checked what you thought to check.',
    strategy: 'GRACEFUL DEGRADATION WITH EXPLICIT UNCERTAINTY',
    strategyDesc: 'Instead of: "Here\'s the answer." Offer: "Here\'s what I produced. Here\'s my confidence. Here\'s what I\'m least sure about." Uncertainty is not weakness. It\'s the system correctly reporting its own variance.',
    code: `Flag:
- Areas where regeneration would likely produce different output
- Constraints that were hard to satisfy
- Aspects that depend on interpretation choices`
  },
  {
    id: 'b5',
    title: 'DELIVERY → FEEDBACK → NEXT GENERATION',
    icon: RefreshCw,
    breaks: 'The conversation continues. Context accumulates. Instructions decay. The model drifts from its original frame.',
    stochastic: 'Attention over long contexts is lossy. Earlier instructions compete with recent tokens. Probability mass shifts.',
    strategy: 'PERIODIC REANCHORING',
    strategyDesc: 'Every N turns (or when drift is detected): 1. Re-read the relevant skill 2. Restate active constraints 3. Check: Am I still operating in the right frame?',
    code: `This is not redundancy. It's fighting entropy.
Context windows are finite. Attention decays.
Reanchoring is the immune response to context drift.`
  }
];

export default function Boundaries() {
  const [expandedId, setExpandedId] = useState<string | null>('b1');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100 mb-6 uppercase tracking-wider">The Five Variance Boundaries</h2>
      <p className="text-zinc-400 mb-8">Every interaction has five points where unpredictability enters. Each boundary needs its own resilience strategy.</p>
      
      <div className="space-y-4">
        {boundaries.map((b, index) => {
          const isExpanded = expandedId === b.id;
          const Icon = b.icon;
          
          return (
            <div key={b.id} className={`border ${isExpanded ? 'border-cyan-900/50 bg-zinc-900/80' : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50'} rounded-lg overflow-hidden transition-colors`}>
              <button 
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => setExpandedId(isExpanded ? null : b.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isExpanded ? 'bg-cyan-950 text-cyan-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold tracking-wide text-sm sm:text-base text-zinc-200">
                    <span className="text-zinc-500 mr-2">0{index + 1}</span>
                    {b.title}
                  </span>
                </div>
                <ChevronRight className={`w-5 h-5 text-zinc-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Where it breaks</h4>
                            <p className="text-sm text-zinc-300">{b.breaks}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Why it's stochastic</h4>
                            <p className="text-sm text-zinc-400">{b.stochastic}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Resilience Strategy: {b.strategy}</h4>
                            <p className="text-sm text-zinc-300 mb-3">{b.strategyDesc}</p>
                            <pre className="bg-black/50 p-3 rounded border border-zinc-800 text-xs text-zinc-400 overflow-x-auto whitespace-pre-wrap">
                              {b.code}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
