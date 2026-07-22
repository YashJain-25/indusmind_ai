import React, { useState } from "react";
import {
  Activity,
  History,
  FileCheck,
  FileText,
  BookOpen,
  AlertTriangle,
  Clock,
  Calendar,
  TrendingUp,
  ShieldAlert,
  Bot,
  Database,
  Calculator,
  Terminal,
  Code2,
  Copy,
  Check,
  Play,
  Zap,
  ChevronRight,
  Sparkles,
  Layers,
  Cpu,
  ArrowRight,
  CheckCircle2,
  ListFilter
} from "lucide-react";
import {
  INPUT_DATA_SOURCES,
  DELIVERABLE_OUTPUTS,
  MULTI_AGENT_WORKFLOW,
  DATABASE_SCHEMAS,
  MAINTENANCE_ALGORITHMS,
  MAINTENANCE_SYSTEM_PROMPTS,
  DataInputCategory,
  IntelligenceOutputDeliverable
} from "../data/maintenanceAgentData";

export const MaintenanceAgentArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inputs" | "outputs" | "workflow" | "database" | "algorithms" | "prompts">("outputs");
  const [selectedInputId, setSelectedInputId] = useState<string>("sensor-telemetry");
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string>("out-failure-pred");
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>("alg-weibull");
  const [copiedPromptKey, setCopiedPromptKey] = useState<string | null>(null);

  // Live Interactive RUL Calculator State
  const [calcRunHours, setCalcRunHours] = useState<number>(4500);
  const [calcBeta, setCalcBeta] = useState<number>(2.5); // Wear-out phase
  const [calcEta, setCalcEta] = useState<number>(6000); // 6000 hrs characteristic life
  const [calcThreshold, setCalcThreshold] = useState<number>(0.10); // 10% min reliability

  // Calculated RUL Output
  const calculateLiveRUL = () => {
    const tFail = calcEta * Math.pow(-Math.log(calcThreshold), 1 / calcBeta);
    const rul = Math.max(0, tFail - calcRunHours);
    return Math.round(rul);
  };

  const currentInput = INPUT_DATA_SOURCES.find((i) => i.id === selectedInputId) || INPUT_DATA_SOURCES[0];
  const currentDeliverable = DELIVERABLE_OUTPUTS.find((o) => o.id === selectedDeliverableId) || DELIVERABLE_OUTPUTS[0];
  const currentAlgo = MAINTENANCE_ALGORITHMS.find((a) => a.id === selectedAlgoId) || MAINTENANCE_ALGORITHMS[0];

  const copyPromptText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptKey(key);
    setTimeout(() => setCopiedPromptKey(null), 2000);
  };

  const getInputIcon = (iconName: string) => {
    switch (iconName) {
      case "History": return History;
      case "FileCheck": return FileCheck;
      case "FileText": return FileText;
      case "Activity": return Activity;
      case "BookOpen": return BookOpen;
      default: return Activity;
    }
  };

  const getDeliverableIcon = (iconName: string) => {
    switch (iconName) {
      case "AlertTriangle": return AlertTriangle;
      case "Clock": return Clock;
      case "Calendar": return Calendar;
      case "TrendingUp": return TrendingUp;
      case "ShieldAlert": return ShieldAlert;
      case "Activity": return Activity;
      default: return Sparkles;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-600 text-white font-mono uppercase tracking-wider">
              AI Maintenance Intelligence Agent
            </span>
            <span className="text-xs text-slate-500 font-mono">Architecture & Algorithms</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Sentinel™ Maintenance Intelligence Agent Specification
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            5 Data Inputs → 6 AI Deliverables | Multi-Agent DAG Workflow | PostgreSQL Schema | Weibull Prognostics
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            <span>Gemini 2.5 Flash + Weibull Math</span>
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("outputs")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "outputs"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>6 Core AI Deliverables</span>
        </button>

        <button
          onClick={() => setActiveTab("inputs")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "inputs"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>5 Input Data Pipelines</span>
        </button>

        <button
          onClick={() => setActiveTab("workflow")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "workflow"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>6-Agent AI Workflow DAG</span>
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "database"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Schema (Drizzle ORM)</span>
        </button>

        <button
          onClick={() => setActiveTab("algorithms")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "algorithms"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Algorithms & Live RUL Math</span>
        </button>

        <button
          onClick={() => setActiveTab("prompts")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "prompts"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>System Prompts Engine</span>
        </button>
      </div>

      {/* TAB 1: 6 Core AI Deliverables */}
      {activeTab === "outputs" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              6 Core Intelligence Output Deliverables
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {DELIVERABLE_OUTPUTS.map((out) => {
                const Icon = getDeliverableIcon(out.iconName);
                const isSelected = selectedDeliverableId === out.id;

                return (
                  <button
                    key={out.id}
                    onClick={() => setSelectedDeliverableId(out.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300"
                        : "bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
                    <div className="text-[11px] font-bold leading-tight mt-1 truncate">{out.name}</div>
                    <span className={`text-[9px] font-mono truncate ${isSelected ? "text-amber-100" : "text-slate-400"}`}>
                      {out.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Selected Deliverable Deep-Dive */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold font-mono uppercase">
                  Category: {currentDeliverable.category}
                </span>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {currentDeliverable.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {currentDeliverable.description}
                </p>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase">
                    Key Business Impact
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">
                    {currentDeliverable.businessImpact}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Sample Live Output JSON Payload */}
            <div className="lg:col-span-7 space-y-2">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Live AI Deliverable Output
                  </span>
                  <span className="text-slate-400 text-[10px]">JSON Format</span>
                </div>

                <pre className="p-3 bg-slate-900 rounded-xl text-xs text-emerald-400 overflow-x-auto max-h-80 leading-relaxed">
                  {JSON.stringify(currentDeliverable.sampleOutput, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5 Input Data Pipelines */}
      {activeTab === "inputs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {INPUT_DATA_SOURCES.map((input) => {
              const Icon = getInputIcon(input.iconName);
              const isSelected = selectedInputId === input.id;

              return (
                <button
                  key={input.id}
                  onClick={() => setSelectedInputId(input.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300"
                      : "bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
                  <div className="text-[11px] font-bold leading-tight mt-1 truncate">{input.name}</div>
                  <span className={`text-[9px] font-mono truncate ${isSelected ? "text-amber-100" : "text-slate-400"}`}>
                    {input.updateFrequency}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-extrabold">
                    {currentInput.format}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{currentInput.updateFrequency}</span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{currentInput.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{currentInput.description}</p>

                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Key Extracted Fields</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentInput.keyFieldsExtracted.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-3 font-mono">
                <span className="text-xs font-bold text-amber-400">Sample Ingested Data Stream Payload</span>
                <pre className="p-3 bg-slate-900 rounded-xl text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                  {currentInput.samplePayload}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 6-Agent AI Workflow DAG */}
      {activeTab === "workflow" && (
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
            Sequential 6-Agent Directed Acyclic Graph (DAG) Workflow
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MULTI_AGENT_WORKFLOW.map((node) => (
              <div
                key={node.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold font-mono">
                      Agent Stage #{node.stepNumber}
                    </span>
                    <Bot className="w-4 h-4 text-amber-500" />
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{node.agentName}</h4>
                  <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">{node.role}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{node.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[10px]">
                  <div>
                    <span className="text-slate-400">Model Engine: </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{node.primaryModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Output Artifacts: </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{node.outputArtifacts.join(", ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Database Schema (Drizzle ORM) */}
      {activeTab === "database" && (
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
            Relational PostgreSQL & Drizzle ORM Schema Specifications
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {DATABASE_SCHEMAS.map((schema, idx) => (
              <div key={idx} className="lg:col-span-12 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">Table: {schema.tableName}</span>
                    <p className="text-xs text-slate-500">{schema.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px]">PK: {schema.primaryKey}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Columns Table */}
                  <div className="lg:col-span-6 overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-400 text-[10px] uppercase">
                          <th className="py-1">Column</th>
                          <th className="py-1">Type</th>
                          <th className="py-1">Constraints</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {schema.columns.map((c, i) => (
                          <tr key={i} className="text-slate-700 dark:text-slate-300">
                            <td className="py-1.5 font-bold text-amber-600 dark:text-amber-400">{c.name}</td>
                            <td className="py-1.5 text-slate-500">{c.type}</td>
                            <td className="py-1.5 text-slate-400 text-[10px]">{c.constraints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Drizzle Code */}
                  <div className="lg:col-span-6 p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
                    <pre>{schema.drizzleCodeSnippet}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Algorithms & Live RUL Math */}
      {activeTab === "algorithms" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
              Prognostics & Reliability Mathematics
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive RUL Calculator */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-4">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>Live Interactive Weibull RUL Calculator</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Current Operating Run Hours (t = {calcRunHours} hrs)
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="6500"
                    step="100"
                    value={calcRunHours}
                    onChange={(e) => setCalcRunHours(Number(e.target.value))}
                    className="w-full mt-1 accent-amber-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Weibull Shape Parameter β (beta = {calcBeta}) [Wear-out &gt; 1]
                  </label>
                  <input
                    type="range"
                    min="1.1"
                    max="4.0"
                    step="0.1"
                    value={calcBeta}
                    onChange={(e) => setCalcBeta(Number(e.target.value))}
                    className="w-full mt-1 accent-amber-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Characteristic Life η (eta = {calcEta} hrs)
                  </label>
                  <input
                    type="range"
                    min="3000"
                    max="10000"
                    step="500"
                    value={calcEta}
                    onChange={(e) => setCalcEta(Number(e.target.value))}
                    className="w-full mt-1 accent-amber-600"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-center space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Calculated Remaining Useful Life</span>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                  {calculateLiveRUL()} Operating Hours
                </div>
                <div className="text-[10px] text-slate-500">
                  (~{(calculateLiveRUL() / 24).toFixed(1)} Operating Days Remaining)
                </div>
              </div>
            </div>

            {/* Right: Formulas Deep Dive */}
            <div className="lg:col-span-7 space-y-4">
              {MAINTENANCE_ALGORITHMS.map((algo) => (
                <div key={algo.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono">{algo.name}</h4>
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[9px] font-mono font-bold">
                      {algo.category}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 text-amber-400 font-mono text-xs">
                    {algo.plainFormula}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{algo.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: System Prompts Engine */}
      {activeTab === "prompts" && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
            Maintenance Intelligence System Prompts Specification
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-2 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400">Master Maintenance Intelligence System Prompt</span>
                <button
                  onClick={() => copyPromptText("master", MAINTENANCE_SYSTEM_PROMPTS.masterAgentPrompt)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center space-x-1 cursor-pointer"
                >
                  {copiedPromptKey === "master" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPromptKey === "master" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 rounded-xl text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {MAINTENANCE_SYSTEM_PROMPTS.masterAgentPrompt}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-2 font-mono">
                <span className="text-xs font-bold text-amber-400">RUL Estimation Prompt Template</span>
                <pre className="p-3 bg-slate-900 rounded-xl text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {MAINTENANCE_SYSTEM_PROMPTS.rulPrompt}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-2 font-mono">
                <span className="text-xs font-bold text-amber-400">5-Why Root Cause Prompt Template</span>
                <pre className="p-3 bg-slate-900 rounded-xl text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {MAINTENANCE_SYSTEM_PROMPTS.rcaPrompt}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
