import React from 'react';
import { Sparkles, Minus, AlertOctagon, XOctagon } from 'lucide-react';

export default function Classification() {
  const classes = [
    {
      title: 'GENERATIVE VARIANCE',
      icon: Sparkles,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-900/50',
      bgColor: 'bg-cyan-950/10',
      items: [
        'Novel phrasing that improves clarity',
        'Unexpected connection that adds insight',
        'Creative solution not in the prompt'
      ],
      action: 'Preserve. This is the capability.',
      actionColor: 'text-cyan-300'
    },
    {
      title: 'NEUTRAL VARIANCE',
      icon: Minus,
      color: 'text-zinc-400',
      borderColor: 'border-zinc-800',
      bgColor: 'bg-zinc-900/30',
      items: [
        'Different word choice, same meaning',
        'Structural reorganization, same content',
        'Stylistic drift within acceptable range'
      ],
      action: 'Ignore. Not worth constraining.',
      actionColor: 'text-zinc-300'
    },
    {
      title: 'DEGRADATIVE VARIANCE',
      icon: AlertOctagon,
      color: 'text-amber-400',
      borderColor: 'border-amber-900/50',
      bgColor: 'bg-amber-950/10',
      items: [
        'Instruction non-compliance',
        'Factual error introduced by sampling',
        'Tone mismatch / register drift',
        'Hallucinated content presented as fact'
      ],
      action: 'Catch and regenerate.',
      actionColor: 'text-amber-300'
    },
    {
      title: 'CATASTROPHIC VARIANCE',
      icon: XOctagon,
      color: 'text-red-500',
      borderColor: 'border-red-900/50',
      bgColor: 'bg-red-950/10',
      items: [
        'Complete task misunderstanding',
        'Harmful content generation',
        'Identity/instruction collapse'
      ],
      action: 'Hard stop. Reanchor. Restart if needed.',
      actionColor: 'text-red-400'
    }
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4 uppercase tracking-wider">Variance Classification</h2>
        <p className="text-zinc-400 mb-8 max-w-3xl">
          Not all variance is equal. Some variance is generative (good). Some is degradative (bad). 
          The goal is NOT to eliminate all variance. The goal is to eliminate degradative and catastrophic variance while PRESERVING generative variance.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {classes.map((cls) => {
            const Icon = cls.icon;
            return (
              <div key={cls.title} className={`p-6 rounded-lg border ${cls.borderColor} ${cls.bgColor} flex flex-col h-full`}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-5 h-5 ${cls.color}`} />
                  <h3 className={`font-bold tracking-wider uppercase ${cls.color}`}>{cls.title}</h3>
                </div>
                
                <ul className="space-y-2 mb-6 flex-1">
                  {cls.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className={`${cls.color} opacity-50 mt-0.5`}>├─</span>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <div className={`pt-4 border-t ${cls.borderColor} mt-auto`}>
                  <div className="flex items-start gap-2 text-sm font-medium">
                    <span className={`${cls.color} opacity-50 mt-0.5`}>└─</span>
                    <span className={cls.actionColor}>ACTION: {cls.action}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      
      <div className="p-4 bg-zinc-900 border-l-4 border-cyan-500 text-sm text-zinc-300">
        <p>This is why constraint satisfaction beats output matching. Output matching kills generative variance along with degradative. Constraint satisfaction lets generative variance through.</p>
      </div>
    </div>
  );
}
