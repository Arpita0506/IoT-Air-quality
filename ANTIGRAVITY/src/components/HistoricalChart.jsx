import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';

export default function HistoricalChart({ readings, darkMode }) {
  const [activeMetric, setActiveMetric] = useState('ALL'); // 'ALL' | 'AQI' | 'TEMP' | 'HUM'

  // Prepare chart data: chronological order (oldest to newest)
  // Limit to last 35 points if too large to prevent cramped chart
  const chartData = [...readings]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(-35)
    .map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      rawTime: item.timestamp,
      deviceId: item.deviceId,
      aqi: item.aqi,
      temperature: item.temperature,
      humidity: item.humidity,
    }));

  const gridColor = darkMode ? '#334155' : '#e2e8f0';
  const textColor = darkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <ChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Historical Telemetry Trends
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sensor readings over time <span className="text-amber-600 dark:text-amber-400 font-medium">(Simulated)</span>
            </p>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-900 text-xs font-medium border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveMetric('ALL')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeMetric === 'ALL'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveMetric('AQI')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeMetric === 'AQI'
                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            AQI
          </button>
          <button
            onClick={() => setActiveMetric('TEMP')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeMetric === 'TEMP'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Temp
          </button>
          <button
            onClick={() => setActiveMetric('HUM')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeMetric === 'HUM'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Humidity
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No historical data available for selected filters.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="time"
                stroke={textColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={textColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: darkMode ? '#cbd5e1' : '#475569', fontWeight: 'bold' }}
                formatter={(value, name) => {
                  if (name === 'AQI') return [`${value} (Simulated)`, 'Air Quality'];
                  if (name === 'Temperature (°C)') return [`${value}°C (Simulated)`, 'Temperature'];
                  if (name === 'Humidity (%)') return [`${value}% (Simulated)`, 'Humidity'];
                  return [value, name];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="circle"
              />

              {(activeMetric === 'ALL' || activeMetric === 'AQI') && (
                <Line
                  type="monotone"
                  dataKey="aqi"
                  name="AQI"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}

              {(activeMetric === 'ALL' || activeMetric === 'TEMP') && (
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}

              {(activeMetric === 'ALL' || activeMetric === 'HUM') && (
                <Line
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
