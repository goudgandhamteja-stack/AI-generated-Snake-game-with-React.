import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="mb-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Cpu className="text-cyan-400 w-6 h-6 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500">
            NEON SYNAPSE
          </h1>
          <Zap className="text-pink-500 w-6 h-6 animate-pulse" />
        </div>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">
          Arcade Core // Neural Link Active
        </p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
        {/* Game Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">System.Initialize</h2>
          </div>
          <SnakeGame />
        </section>

        {/* Info & Music Section */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Audio.Module</h2>
            </div>
            <MusicPlayer />
          </div>

          {/* Status Display Card */}
          <div className="neon-border bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 hidden md:block">
            <h3 className="text-xs font-mono text-zinc-500 uppercase mb-4 border-b border-zinc-800 pb-2">Terminal Status</h3>
            <div className="space-y-3 font-mono text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Uptime:</span>
                <span className="text-cyan-400">99.98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Latency:</span>
                <span className="text-pink-500">12ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Buffer:</span>
                <span className="text-zinc-300">Optimized</span>
              </div>
              <div className="pt-2">
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[70%] animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-zinc-600 font-mono text-[10px] tracking-widest uppercase relative z-10">
        &copy; 2026 AI Studio // Neo-Digital Interactive
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

