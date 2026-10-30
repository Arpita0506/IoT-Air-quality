import React, { useState } from 'react';
import { Table, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAqiCategory } from '../mockData';

export default function RecentReadingsTable({ readings }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.max(1, Math.ceil(readings.length / pageSize));
  const displayedReadings = readings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
      {/* Table Title Bar */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Sensor Telemetry Log
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live streamed readings with device IDs and timestamps <span className="text-amber-600 dark:text-amber-400 font-medium">(Simulated)</span>
            </p>
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Page {currentPage} of {totalPages} ({readings.length} total)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3">Device ID</th>
              <th className="px-4 py-3">Device Name</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">AQI Level</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Temp (°C)</th>
              <th className="px-4 py-3">Humidity (%)</th>
              <th className="px-4 py-3 text-right">Data Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {displayedReadings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No readings found matching criteria.
                </td>
              </tr>
            ) : (
              displayedReadings.map((reading) => {
                const aqiCategory = getAqiCategory(reading.aqi);
                const timeString = new Date(reading.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });
                const dateString = new Date(reading.timestamp).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <tr
                    key={reading.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {reading.deviceId}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {reading.deviceName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono">
                      {dateString} {timeString}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {reading.aqi}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${aqiCategory.bg}`}>
                        {aqiCategory.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {reading.temperature}°C
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {reading.humidity}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-slate-500 dark:text-slate-400">
                        Simulated
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
