import React from 'react';
import { Wind, Play, Square, Sun, Moon, Radio } from 'lucide-react';

export default function Navbar({
  isSimulating,
  onStartSimulation,
  onStopSimulation,
  darkMode,
  onToggleTheme,
}) {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & System Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                IoT Air Quality Monitor
              </h1>
              {/* Mandatory Simulated Label */}
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Simulated Data
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phase 1 Cloud IoT Telemetry Dashboard
            </p>
          </div>
        </div>

        {/* Controls: Simulation + Theme */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
            <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <span>{isSimulating ? 'Simulating (5s tick)' : 'Simulation Stopped'}</span>
          </div>

          {/* Simulation Start / Stop Buttons */}
          <div className="inline-flex rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={onStartSimulation}
              disabled={isSimulating}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                isSimulating
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
              }`}
              title="Start generating sensor readings every 5s"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
            <button
              onClick={onStopSimulation}
              disabled={!isSimulating}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                !isSimulating
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
              }`}
              title="Stop simulation data generation"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

      </div>
    </header>
  );
}
