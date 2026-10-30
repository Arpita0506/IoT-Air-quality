import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Bell, CheckCircle2, Trash2 } from 'lucide-react';

export default function AlertHistory({ alerts, onClearAlerts }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'ALL') return true;
    return alert.severity === filterSeverity;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
      {/* Alert Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Threshold Warnings & Alert History
              {alerts.length > 0 && (
                <span className="px-2 py-0.2 rounded-full text-[11px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">
                  {alerts.length}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated threshold monitoring alerts <span className="text-amber-600 dark:text-amber-400 font-medium">(Simulated Events)</span>
            </p>
          </div>
        </div>

        {/* Severity Filter & Clear */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-900 text-xs font-medium border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                filterSeverity === 'ALL'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                filterSeverity === 'critical'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                filterSeverity === 'warning'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Warning
            </button>
          </div>

          {alerts.length > 0 && (
            <button
              onClick={onClearAlerts}
              className="p-1.5 text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Clear Alert History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Alert Feed */}
      <div className="p-4 max-h-72 overflow-y-auto space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs flex flex-col items-center justify-center gap-1.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span>No active threshold violations recorded for this filter.</span>
          </div>
        ) : (
          filteredAlerts.slice(0, 15).map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            
            const badgeClasses = isCritical
              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800'
              : isWarning
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800';

            const Icon = isCritical ? AlertCircle : isWarning ? AlertTriangle : Info;

            const timeStr = new Date(alert.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div
                key={alert.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-md border ${badgeClasses} mt-0.5`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {alert.type}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        [{alert.deviceId}]
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                      {alert.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span>Param: {alert.parameter}</span>
                      <span>•</span>
                      <span>Observed: {alert.value}</span>
                      <span>•</span>
                      <span>Trigger: {alert.threshold}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap">
                  <span className="text-[11px] font-mono text-slate-400">
                    {timeStr}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
