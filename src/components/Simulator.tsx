import React, { useState } from 'react';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { Play, CheckCircle2, XCircle, AlertTriangle, Shield, Code2, Terminal, Activity, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Simulator() {
  const [prompt, setPrompt] = useState('Write a function that returns the sum of all even numbers in an array.');
  const [funcName, setFuncName] = useState('sumEven');
  const [testInput, setTestInput] = useState('[1, 2, 3, 4, 5, 6]');
  const [testOutput, setTestOutput] = useState('12');

  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0); 
  
  const [generation, setGeneration] = useState('');
  const [constraints, setConstraints] = useState<any[]>([]);
  const [challenge, setChallenge] = useState('');
  const [analysis, setAnalysis] = useState('');

  const runSimulation = async () => {
    setIsRunning(true);
    setStep(1);
    setGeneration('');
    setConstraints([]);
    setChallenge('');
    setAnalysis('');

    try {
      // 1. Generation
      const genRes = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a JavaScript function named ${funcName} that fulfills this request: ${prompt}. Return ONLY the JavaScript code in a markdown block. Do not include explanations.`,
      });
      
      const codeText = genRes.text || '';
      setGeneration(codeText);
      setStep(2);

      // 2. Constraints
      const newConstraints = [];
      
      const hasCodeBlock = codeText.includes('```javascript') || codeText.includes('```js');
      let extractedCode = codeText;
      if (hasCodeBlock) {
        const match = codeText.match(/```(?:javascript|js)\n([\s\S]*?)```/);
        if (match) extractedCode = match[1];
      } else {
        extractedCode = codeText.replace(/```/g, '');
      }
      
      newConstraints.push({
        name: 'Format: Contains JS Code',
        passed: hasCodeBlock || extractedCode.includes('function'),
        details: hasCodeBlock ? 'Markdown code block found.' : 'Code structure detected.'
      });

      let syntaxPassed = false;
      let syntaxDetails = '';
      try {
        // eslint-disable-next-line no-new-func
        new Function(extractedCode);
        syntaxPassed = true;
        syntaxDetails = 'Code parsed successfully.';
      } catch (e: any) {
        syntaxDetails = e.message;
      }
      newConstraints.push({
        name: 'Syntax: Valid JavaScript',
        passed: syntaxPassed,
        details: syntaxDetails
      });

      let functionalPassed = false;
      let functionalDetails = '';
      if (syntaxPassed) {
        try {
          // eslint-disable-next-line no-new-func
          const testFunc = new Function(`${extractedCode}\nreturn ${funcName}(${testInput});`);
          const result = testFunc();
          let expected;
          try {
             expected = JSON.parse(testOutput);
          } catch(e) {
             expected = testOutput;
          }
          
          if (JSON.stringify(result) === JSON.stringify(expected)) {
            functionalPassed = true;
            functionalDetails = `Output matched expected: ${JSON.stringify(result)}`;
          } else {
            functionalDetails = `Expected ${testOutput}, but got ${JSON.stringify(result)}`;
          }
        } catch (e: any) {
          functionalDetails = `Execution error: ${e.message}`;
        }
      } else {
        functionalDetails = 'Skipped due to syntax error.';
      }
      newConstraints.push({
        name: 'Functional: Passes Test Case',
        passed: functionalPassed,
        details: functionalDetails
      });

      // Semantic, Tonal, and Clarity Evaluation using Gemini 3.1 Pro with Thinking Mode
      try {
        const evalRes = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: `Evaluate the following code based on the task prompt.
Task Prompt: "${prompt}"
Code:
${extractedCode}

Evaluate three aspects:
1. Semantic Relevance: Does the code actually attempt to solve the specific problem described in the task prompt?
2. Tonal Consistency: Is the code written in a professional, standard style (e.g., no inappropriate comments)?
3. Code Clarity and Readability: Does the code use consistent indentation, appropriate comment usage for complex logic, and adhere to standard JavaScript naming conventions (e.g., camelCase for variables and functions)?`,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                semanticRelevance: {
                  type: Type.OBJECT,
                  properties: {
                    passed: { type: Type.BOOLEAN },
                    details: { type: Type.STRING }
                  },
                  required: ['passed', 'details']
                },
                tonalConsistency: {
                  type: Type.OBJECT,
                  properties: {
                    passed: { type: Type.BOOLEAN },
                    details: { type: Type.STRING }
                  },
                  required: ['passed', 'details']
                },
                codeClarity: {
                  type: Type.OBJECT,
                  properties: {
                    passed: { type: Type.BOOLEAN },
                    details: { type: Type.STRING }
                  },
                  required: ['passed', 'details']
                }
              },
              required: ['semanticRelevance', 'tonalConsistency', 'codeClarity']
            }
          }
        });

        const evalData = JSON.parse(evalRes.text || '{}');
        if (evalData.semanticRelevance) {
          newConstraints.push({
            name: 'Semantic: Addresses Prompt',
            passed: evalData.semanticRelevance.passed,
            details: evalData.semanticRelevance.details
          });
        }
        if (evalData.tonalConsistency) {
          newConstraints.push({
            name: 'Tonal: Professional Style',
            passed: evalData.tonalConsistency.passed,
            details: evalData.tonalConsistency.details
          });
        }
        if (evalData.codeClarity) {
          newConstraints.push({
            name: 'Clarity: Readable & Maintainable',
            passed: evalData.codeClarity.passed,
            details: evalData.codeClarity.details
          });
        }
      } catch (e: any) {
        console.error("Failed to evaluate semantic/tonal/clarity constraints", e);
        newConstraints.push({
          name: 'Semantic/Tonal/Clarity Evaluation',
          passed: false,
          details: `Evaluation failed: ${e.message}`
        });
      }

      setConstraints(newConstraints);
      setStep(3);

      // 3. Adversarial Challenge
      const challengeRes = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `You are an adversarial security researcher and senior code reviewer. Your goal is to break the following code and find edge cases that the author missed.

Task Prompt: "${prompt}"
Code:
${extractedCode}

Identify specific, actionable flaws in the code. Focus heavily on:
1. Array/Input Edge Cases: What happens with empty arrays ([]), arrays containing non-numeric types (e.g., ['a', null, {}]), sparse arrays, or extremely large arrays (e.g., 10^7 elements causing stack overflow or performance degradation)?
2. Invalid Data Types: What if the input is a string, null, undefined, or an object instead of an array? Does it throw an unhandled exception or return garbage data?
3. Security/Vulnerabilities: Are there any injection risks, prototype pollution, or unsafe type coercions (e.g., implicit string concatenation instead of addition)?
4. Performance: Are there any O(N^2) operations that could be O(N)? Is memory usage optimized for large inputs?

Be highly critical. Do not rewrite the code. List the flaws concisely using bullet points. If the code is perfectly robust, state "No significant flaws found."`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });
      
      const challengeText = challengeRes.text || '';
      setChallenge(challengeText);
      setStep(4);

      // 4. Analysis
      const constraintsSummary = newConstraints.map(c => `- ${c.name}: ${c.passed ? 'PASSED' : 'FAILED'} (${c.details})`).join('\n');

      const analysisRes = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Task: "${prompt}"
Code:
${extractedCode}

Constraint Checks:
${constraintsSummary}

Adversarial Critique:
${challengeText}

Based on the constraint checks and the adversarial critique, provide a highly detailed synthesis of the code's reliability. 
Structure your response exactly as follows:

### 1. Constraint Analysis
(Discuss how the code performed against the structural, functional, semantic, and clarity constraints. Explicitly reference the passed/failed statuses.)

### 2. Adversarial Analysis
(Discuss the severity of the flaws found in the adversarial critique, specifically addressing edge cases, types, security, and performance.)

### 3. Synthesis
(Weigh the passed constraints against the identified flaws. Explain explicitly why the code is considered viable or why it needs regeneration.)

VERDICT: [VIABLE or REGENERATE]`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });

      setAnalysis(analysisRes.text || '');
      setStep(5);

    } catch (error: any) {
      console.error(error);
      setAnalysis(`An error occurred: ${error.message}`);
      setStep(5);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4 uppercase tracking-wider">Resilience Engine</h2>
        <p className="text-zinc-400 mb-6">
          Test the constraint satisfaction and adversarial self-evaluation mechanisms in real-time.
        </p>

        {/* Input Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Task Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm text-zinc-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Function Name</label>
              <input 
                type="text"
                value={funcName}
                onChange={(e) => setFuncName(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm text-zinc-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Test Input (JSON)</label>
              <input 
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm text-zinc-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Expected Output (JSON)</label>
              <input 
                type="text"
                value={testOutput}
                onChange={(e) => setTestOutput(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm text-zinc-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              />
            </div>
          </div>
          <button 
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-900/50 px-6 py-3 rounded font-bold tracking-wide text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'EXECUTING PIPELINE...' : 'RUN RESILIENCE PIPELINE'}
          </button>
        </div>

        {/* Pipeline Visualization */}
        {step > 0 && (
          <div className="space-y-6">
            {/* Step 1: Generation */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg overflow-hidden ${step >= 1 ? 'border-zinc-700' : 'border-zinc-800 opacity-50'}`}
            >
              <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm tracking-wide">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  1. GENERATION
                </div>
                {step === 1 && <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />}
              </div>
              <div className="p-4 bg-black/30">
                {generation ? (
                  <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap overflow-x-auto">{generation}</pre>
                ) : (
                  <div className="text-xs text-zinc-600 font-mono">Generating initial response...</div>
                )}
              </div>
            </motion.div>

            {/* Step 2: Constraints */}
            {step >= 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="border border-zinc-700 rounded-lg overflow-hidden"
              >
                <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm tracking-wide">
                    <Shield className="w-4 h-4 text-amber-400" />
                    2. CONSTRAINT SATISFACTION
                  </div>
                  {step === 2 && <Activity className="w-4 h-4 text-amber-400 animate-pulse" />}
                </div>
                <div className="p-4 bg-black/30 space-y-3">
                  {constraints.length > 0 ? constraints.map((c, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded border ${c.passed ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-red-950/10 border-red-900/30'}`}>
                      {c.passed ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                      <div>
                        <div className={`text-sm font-bold ${c.passed ? 'text-emerald-400' : 'text-red-400'}`}>{c.name}</div>
                        <div className="text-xs text-zinc-400 mt-1 font-mono">{c.details}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-xs text-zinc-600 font-mono">Evaluating constraints...</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Adversarial */}
            {step >= 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="border border-zinc-700 rounded-lg overflow-hidden"
              >
                <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    3. ADVERSARIAL CHALLENGE
                  </div>
                  {step === 3 && <Activity className="w-4 h-4 text-red-400 animate-pulse" />}
                </div>
                <div className="p-4 bg-black/30">
                  {challenge ? (
                    <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{challenge}</div>
                  ) : (
                    <div className="text-xs text-zinc-600 font-mono">Generating adversarial critique...</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Analysis */}
            {step >= 4 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="border border-zinc-700 rounded-lg overflow-hidden"
              >
                <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm tracking-wide">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    4. SYNTHESIS & VERDICT
                  </div>
                  {step === 4 && <Activity className="w-4 h-4 text-purple-400 animate-pulse" />}
                </div>
                <div className="p-4 bg-black/30">
                  {analysis ? (
                    <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {analysis.split('\n').map((line, i) => {
                        if (line.includes('VERDICT: VIABLE')) {
                          return <div key={i} className="mt-4 inline-block bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 px-3 py-1 rounded font-bold tracking-widest">{line}</div>;
                        }
                        if (line.includes('VERDICT: REGENERATE')) {
                          return <div key={i} className="mt-4 inline-block bg-red-950/50 text-red-400 border border-red-900/50 px-3 py-1 rounded font-bold tracking-widest">{line}</div>;
                        }
                        return <div key={i}>{line}</div>;
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-600 font-mono">Analyzing relationship and determining viability...</div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
