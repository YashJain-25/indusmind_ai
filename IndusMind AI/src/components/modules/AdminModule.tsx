import React, { useState } from "react";
import {
  ShieldCheck,
  Cpu,
  Database,
  Key,
  Users,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Lock,
  Terminal,
  Settings,
  HardDrive
} from "lucide-react";
import { AgentStatus, UserRole } from "../../types";

interface AdminModuleProps {
  agents: AgentStatus[];
}

interface SystemAgentConfig {
  id: string;
  name: string;
  codeName: string;
  enabled: boolean;
  temperature: number;
  maxTokens: number;
  model: string;
}

const INITIAL_AGENT_CONFIGS: SystemAgentConfig[] = [
  { id: "ag-1", name: "Cortex™ Enterprise RAG Agent", codeName: "cortex-rag", enabled: true, temperature: 0.2, maxTokens: 4096, model: "gemini-2.5-flash" },
  { id: "ag-2", name: "PulseGraph™ Knowledge Mapper", codeName: "pulse-graph", enabled: true, temperature: 0.1, maxTokens: 8192, model: "gemini-2.5-pro" },
  { id: "ag-3", name: "Sentinel™ Predictive FFT Agent", codeName: "sentinel-fft", enabled: true, temperature: 0.0, maxTokens: 2048, model: "gemini-2.5-flash" },
  { id: "ag-4", name: "Guardian™ Statutory Compliance Agent", codeName: "guardian-audit", enabled: true, temperature: 0.1, maxTokens: 4096, model: "gemini-2.5-pro" },
  { id: "ag-5", name: "Echo™ Failure Memory Engine", codeName: "echo-memory", enabled: true, temperature: 0.2, maxTokens: 4096, model: "gemini-2.5-flash" }
];

export const AdminModule: React.FC<AdminModuleProps> = () => {
  const [activeTab, setActiveTab] = useState<"agents" | "security" | "database" | "users">("agents");
  const [configs, setConfigs] = useState<SystemAgentConfig[]>(INITIAL_AGENT_CONFIGS);
  const [notice, setNotice] = useState<string | null>(null);

  const toggleAgent = (id: string) => {
    setConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
    setNotice("Updated agent operational status.");
    setTimeout(() => setNotice(null), 2500);
  };

  const handleUpdateTemperature = (id: string, val: number) => {
    setConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, temperature: val } : c))
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Enterprise System Administration & AI Governance
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage multi-agent cluster configurations, vector database indexing, RBAC policies, and API keys.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            FIRESTORE CONNECTED
          </span>
          <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-bold">
            GEMINI 2.5 FLASH ACTIVE
          </span>
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: "agents", label: "Agent Orchestration", icon: Cpu },
          { id: "security", label: "Security & API Keys", icon: Key },
          { id: "database", label: "Vector DB & Firestore", icon: Database },
          { id: "users", label: "Users & RBAC Directory", icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Agent Orchestration */}
      {activeTab === "agents" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Autonomous Agent Model Runtime Parameters
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {configs.map((cfg) => (
                <div key={cfg.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">{cfg.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {cfg.codeName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {cfg.model}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Max context tokens: {cfg.maxTokens} • Real-time grounding enabled
                    </p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-500 text-[11px]">Temp ({cfg.temperature}):</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={cfg.temperature}
                        onChange={(e) => handleUpdateTemperature(cfg.id, parseFloat(e.target.value))}
                        className="w-24 accent-blue-600"
                      />
                    </div>

                    <button
                      onClick={() => toggleAgent(cfg.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        cfg.enabled
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                      }`}
                    >
                      {cfg.enabled ? "ACTIVE" : "STANDBY"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & API Keys */}
      {activeTab === "security" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Environment Credentials & Secret Key Vault
              </h2>
              <p className="text-xs text-slate-500">
                Server-side proxied API secrets stored in environment variables.
              </p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">GEMINI_API_KEY</div>
                <div className="text-[10px] text-slate-400">Google GenAI SDK Server-Side Proxy</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ PROXIED & SECURE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">FIREBASE_FIRESTORE_DB</div>
                <div className="text-[10px] text-slate-400">ai-studio-forgemindai-933efb9a</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ ACTIVE & SYNCED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Database */}
      {activeTab === "database" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Vector Embeddings & Firestore Collections Status
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px]">DOCUMENTS COLLECTION</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">1,482 Docs</div>
              <div className="text-[10px] text-emerald-600">Vectorized (768-dim)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px]">WORK ORDERS DB</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">24 Work Orders</div>
              <div className="text-[10px] text-blue-600">Real-time Snapshot Active</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px]">KNOWLEDGE GRAPH NODES</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">3,120 Entities</div>
              <div className="text-[10px] text-violet-600">Graph Index Ready</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Users */}
      {activeTab === "users" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Active Plant Personnel & Role Directory
            </h2>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="grid grid-cols-4 font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700 pb-2">
              <span>USER</span>
              <span>EMAIL</span>
              <span>ROLE</span>
              <span>STATUS</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="grid grid-cols-4 py-2 text-slate-800 dark:text-slate-200">
                <span className="font-bold">Vikram Sharma</span>
                <span className="font-mono text-slate-500">manager@indusmind.ai</span>
                <span className="font-semibold text-blue-600">Plant Manager</span>
                <span className="text-emerald-600 font-bold">ONLINE</span>
              </div>
              <div className="grid grid-cols-4 py-2 text-slate-800 dark:text-slate-200">
                <span className="font-bold">Dr. Aris Thorne</span>
                <span className="font-mono text-slate-500">reliability@indusmind.ai</span>
                <span className="font-semibold text-blue-600">Reliability Engineer</span>
                <span className="text-emerald-600 font-bold">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
