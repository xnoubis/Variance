import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldAlert, GitBranch, Layers, Cpu, Terminal, MessageSquareCode } from 'lucide-react';

// Components
import CorePrinciple from './components/CorePrinciple';
import Boundaries from './components/Boundaries';
import Classification from './components/Classification';
import Patterns from './components/Patterns';
import Simulator from './components/Simulator';
import PromptingGuide from './components/PromptingGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState('core');

  const tabs = [
    { id: 'core', label: 'Core Principle', icon: Activity },
    { id: 'boundaries', label: 'Variance Boundaries', icon: GitBranch },
    { id: 'classification', label: 'Classification', icon: Layers },
    { id: 'patterns', label: 'Implementation', icon: Cpu },
    { id: 'prompting', label: 'Prompt Engineering', icon: MessageSquareCode },
    { id: 'simulator', label: 'Resilience Engine', icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-mono selection:bg-cyan-900 selection:text-cyan-50">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            <h1 className="text-lg font-bold tracking-widest text-zinc-100 uppercase">
              Variance Resilience <span className="text-zinc-500">Protocol</span>
            </h1>
          </div>
          <div className="text-xs text-zinc-500 hidden sm:block">
            STATUS: <span className="text-cyan-400">ACTIVE</span> | STOCHASTICITY: <span className="text-amber-400">NOMINAL</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <nav className="md:w-64 shrink-0">
          <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 border-l-2 text-left whitespace-nowrap ${
                      isActive 
                        ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300' 
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0 pb-16">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'core' && <CorePrinciple />}
            {activeTab === 'boundaries' && <Boundaries />}
            {activeTab === 'classification' && <Classification />}
            {activeTab === 'patterns' && <Patterns />}
            {activeTab === 'prompting' && <PromptingGuide />}
            {activeTab === 'simulator' && <Simulator />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
