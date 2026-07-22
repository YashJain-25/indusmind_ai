import React from "react";
import {
  Activity,
  Cpu,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  Building2,
  Radio,
  Sparkles,
  ArrowRight,
  Gauge
} from "lucide-react";
import { AgentStatus, EquipmentTwin, WorkOrder, AgentActivityLog } from "../../types";

interface DashboardProps {
  agents: AgentStatus[];
  equipment: EquipmentTwin[];
  workOrders: WorkOrder[];
  activityLogs: AgentActivityLog[];
  onNavigateModule: (module: any) => void;
}

export const DashboardModule: React.FC<DashboardProps> = ({
  agents,
  equipment,
  workOrders,
  activityLogs,
  onNavigateModule
}) => {
  const criticalAssets = equipment.filter((e) => e.status !== "Optimal");
  const openWorkOrders = workOrders.filter((w) => w.status !== "Completed");
  const overallPlantHealth = Math.round(
    equipment.reduce((acc, e) => acc + e.healthScore, 0) / (equipment.length || 1)
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Google I/O Hero Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Subtle Gemini Style Gradient Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Google I/O AI Command Center
            </span>
            <span className="text-slate-400 text-xs font-mono">• 9 Neural Agents Live</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Gujarat Refinery Plant 04 Intelligence
          </h1>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Multi-agent orchestrator conducting continuous vibration spectrum FFTs, Remaining Useful Life (RUL) estimation, and statutory compliance auditing.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3 shrink-0">
          <button
            onClick={() => onNavigateModule("copilot")}
            className="px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Cortex™ Copilot</span>
          </button>
          <button
            onClick={() => onNavigateModule("twin")}
            className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Digital Twins
          </button>
        </div>
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Plant Health Index */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                Plant Health Index
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <Gauge className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
                {overallPlantHealth}%
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center">
                +2.4% <TrendingUp className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${overallPlantHealth}%` }}
            ></div>
          </div>
        </div>

        {/* Asset Risks */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                Asset Risks & Anomalies
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
                {criticalAssets.length}
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                P-101 Vibration
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 font-medium">
            Sentinel™ FFT spectrum threshold warning
          </p>
        </div>

        {/* Active Work Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                Active Work Orders
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
                {openWorkOrders.length}
              </span>
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                2 P1 Critical
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 font-medium">
            Synced with Scout™ Mobile Field App
          </p>
        </div>

        {/* Statutory Compliance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                Statutory Compliance
              </span>
              <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
                96.4%
              </span>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                1 OISD Gap
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 font-medium">
            Guardian™ regulatory audits passed
          </p>
        </div>
      </div>

      {/* AI Agent Ecosystem Live Grid */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Specialized Agent Fleet Topology
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Autonomous neural agents operating across RAG indexing, FFT telemetry, RCA causal trees, and statutory auditing.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 shrink-0">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>9 Agents Online</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((ag) => (
            <div
              key={ag.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ag.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({ag.codeName})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {ag.role}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    ag.status === "active"
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  {ag.status.toUpperCase()}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 line-clamp-2">
                <span className="font-bold text-slate-400">Action: </span>
                {ag.lastAction}
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Latency: {ag.latencyMs}ms</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Accuracy: {ag.accuracyRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Equipment & Recent Agent Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagged Assets Watchlist */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Flagged Assets & Digital Twins
            </h3>
            <button
              onClick={() => onNavigateModule("twin")}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Twins</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                onClick={() => onNavigateModule("twin")}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl font-black font-mono text-xs flex items-center justify-center text-white shadow-xs ${
                      eq.status === "Critical"
                        ? "bg-rose-600"
                        : eq.status === "Warning"
                        ? "bg-amber-600"
                        : "bg-emerald-600"
                    }`}
                  >
                    {eq.code}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {eq.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Vib: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{eq.vibration} mm/s</span> | Temp: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{eq.temperature}°C</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {eq.healthScore}% Health
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold font-mono mt-0.5">
                    RUL: {eq.rulDays} days
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Agent Activity Log Stream */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              Live Telemetry & Activity Stream
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Firestore Real-time</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {log.agentName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-tight">
                    {log.details}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-3">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

