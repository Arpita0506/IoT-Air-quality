import React from 'react';
import { Thermometer, Droplets, Activity, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getAqiCategory, TEMP_THRESHOLDS, HUMIDITY_THRESHOLDS } from '../mockData';

export default function MetricCards({ latestReading }) {
  if (!latestReading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
        No reading available yet. Start the simulation to generate telemetry.
      </div>
    );
  }

  const aqiInfo = getAqiCategory(latestReading.aqi);
  const isHighTemp = latestReading.temperature > TEMP_THRESHOLDS.HIGH;
  const isLowTemp = latestReading.temperature < TEMP_THRESHOLDS.LOW;
  const isHighHum = latestReading.humidity > HUMIDITY_THRESHOLDS.HIGH;

  const formattedTime = new Date(latestReading.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="space-y-3">
      {/* Device & Timestamp Context Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
          <span>Latest Telemetry from </span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {latestReading.deviceId} ({latestReading.deviceName})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Timestamp: {formattedTime}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 font-mono text-slate-600 dark:text-slate-300">
            [SIMULATED]
          </span>
        </div>
      </div>

      {/* Grid of 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Air Quality Index (AQI) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Air Quality Index (AQI)
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {latestReading.aqi}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${aqiInfo.bg}`}>
              {aqiInfo.label}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Range: 0 - 300+</span>
            <span className="italic font-medium text-amber-600 dark:text-amber-400">
              * Simulated Reading
            </span>
          </div>
        </div>

        {/* Temperature Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Ambient Temperature
            </span>
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {latestReading.temperature}°C
            </span>
            {isHighTemp ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> High
              </span>
            ) : isLowTemp ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                Low
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Normal
              </span>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Limit: &gt; {TEMP_THRESHOLDS.HIGH}°C</span>
            <span className="italic font-medium text-amber-600 dark:text-amber-400">
              * Simulated Reading
            </span>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Relative Humidity
            </span>
            <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {latestReading.humidity}%
            </span>
            {isHighHum ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> High
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Normal
              </span>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Limit: &gt; {HUMIDITY_THRESHOLDS.HIGH}%</span>
            <span className="italic font-medium text-amber-600 dark:text-amber-400">
              * Simulated Reading
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
