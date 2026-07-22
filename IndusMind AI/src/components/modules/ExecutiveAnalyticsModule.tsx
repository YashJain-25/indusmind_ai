import React from "react";
import { BarChart3, TrendingUp, Download, ShieldCheck, DollarSign, Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

const DOWNTIME_DATA = [
  { month: "Jan", downtimeHours: 42, costSavings: 120 },
  { month: "Feb", downtimeHours: 35, costSavings: 150 },
  { month: "Mar", downtimeHours: 28, costSavings: 190 },
  { month: "Apr", downtimeHours: 22, costSavings: 230 },
  { month: "May", downtimeHours: 18, costSavings: 280 },
  { month: "Jun", downtimeHours: 12, costSavings: 340 },
  { month: "Jul", downtimeHours: 8, costSavings: 410 }
];

export const ExecutiveAnalyticsModule: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-fuchsia-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              InsightX™ Executive Analytics & ROI Hub
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Strategic KPI benchmarks, MTBF/MTTR trends, and downtime cost mitigation reporting.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Exporting Executive Board Briefing PDF...")}
          className="px-4 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-fuchsia-600/30 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Executive Briefing</span>
        </button>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downtime Hours Reduction */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Plant Unplanned Downtime (Hours)
            </h2>
            <span className="text-xs font-bold text-emerald-600 font-mono">-81% Reduction</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DOWNTIME_DATA}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="downtimeHours" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Savings */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Cumulative Savings ($k)
            </h2>
            <span className="text-xs font-bold text-emerald-600 font-mono">$410,000 Saved</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DOWNTIME_DATA}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="costSavings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
