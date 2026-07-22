import React, { useState } from "react";
import {
  Brain,
  History,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  CheckCircle2,
  Layers,
  Search,
  Plus,
  Cpu,
  Database,
  Network,
  FileText,
  Lightbulb,
  Filter,
  ArrowRight,
  BarChart3,
  PieChart,
  Zap,
  Download,
  RefreshCw,
  Eye,
  BookOpen,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Activity,
  Wrench,
  FlaskConical,
  ClipboardList,
  Flame,
  Radio
} from "lucide-react";
import {
  INGESTION_RECORDS,
  PATTERN_CLUSTERS,
  PREDICTED_INCIDENTS,
  SAFETY_ALERTS,
  KNOWLEDGE_SUMMARIES,
  ML_LLM_PIPELINE_STEPS,
  IngestionDataRecord,
  RecurringPatternCluster,
  PredictedIncident,
  SafetyAlert,
  KnowledgeSummaryCard
} from "../data/lessonsLearnedEngineData";

export const LessonsLearnedEngine: React.FC = () => {
  // Main view navigation tabs
  const [activeEngineTab, setActiveEngineTab] = useState<
    "streams" | "patterns" | "predictions" | "actions" | "alerts" | "dashboards" | "summaries" | "pipeline"
  >("patterns");

  // Filter for Data Streams
  const [selectedSourceType, setSelectedSourceType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Interactive State
  const [ingestedRecords, setIngestedRecords] = useState<IngestionDataRecord[]>(INGESTION_RECORDS);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(SAFETY_ALERTS);
  const [selectedClusterId, setSelectedClusterId] = useState<string>("CLUST-01");
  const [copiedCodeStep, setCopiedCodeStep] = useState<number | null>(null);

  // New Record Simulation Modal
  const [isSimulateOpen, setIsSimulateOpen] = useState<boolean>(false);
  const [simTitle, setSimTitle] = useState<string>("");
  const [simSource, setSimSource] = useState<IngestionDataRecord["sourceType"]>("Near Miss");
  const [simAsset, setSimAsset] = useState<string>("P-101");
  const [simSummary, setSimSummary] = useState<string>("");

  // Filtering records
  const filteredRecords = ingestedRecords.filter((rec) => {
    const matchesSource = selectedSourceType === "All" || rec.sourceType === selectedSourceType;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.assetId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const activeCluster = PATTERN_CLUSTERS.find((c) => c.id === selectedClusterId) || PATTERN_CLUSTERS[0];

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTitle) return;

    const newRecord: IngestionDataRecord = {
      id: `SIM-${Date.now().toString().slice(-4)}`,
      sourceType: simSource,
      title: simTitle,
      assetId: simAsset,
      assetName: `Asset ${simAsset} - Unit 04`,
      unitLocation: "Unit 04 - Hydrotreating",
      dateRecorded: new Date().toISOString().split("T")[0],
      severity: "High",
      category: "Mechanical Failure",
      summary: simSummary || "Simulated real-time sensor & operator entry for automated AI pattern clustering.",
      tags: ["Realtime Ingested", "AI Pattern Search", "Simulated Log"]
    };

    setIngestedRecords([newRecord, ...ingestedRecords]);
    setIsSimulateOpen(false);
    setSimTitle("");
    setSimSummary("");
    alert(`Successfully ingested new ${simSource}! Gemini AI pattern engine updated.`);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledgedByPlantLead: true } : a))
    );
  };

  const getSourceIcon = (type: IngestionDataRecord["sourceType"]) => {
    switch (type) {
      case "Incident Report":
        return <Flame className="w-4 h-4 text-red-500" />;
      case "Near Miss":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "Quality Report":
        return <FlaskConical className="w-4 h-4 text-purple-500" />;
      case "Audit Finding":
        return <ClipboardList className="w-4 h-4 text-blue-500" />;
      case "Maintenance Record":
        return <Wrench className="w-4 h-4 text-emerald-500" />;
      case "Failure History":
        return <History className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-600 text-white font-mono uppercase tracking-wider flex items-center gap-1">
              <Brain className="w-3 h-3" /> Echo™ Enterprise AI Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">6 Multi-Source Data Feeds • Gemini 2.5 RAG</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            AI Lessons Learned & Incident Prevention Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Synthesizes Incidents, Near Misses, Quality Reports, Audit Findings, Maintenance Records & Failure History to predict and prevent downtime.
          </p>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Ingested Feeds</div>
            <div className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">
              {ingestedRecords.length} Items
            </div>
            <div className="text-[9px] text-emerald-600 font-bold">6 Streams Syncing</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase font-bold">Pattern Clusters</div>
            <div className="text-base font-black text-amber-900 dark:text-amber-200 font-mono mt-0.5">
              {PATTERN_CLUSTERS.length} Clusters
            </div>
            <div className="text-[9px] text-amber-700 dark:text-amber-400 font-bold">High Risk Co-occurrence</div>
          </div>

          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
            <div className="text-[10px] font-mono text-red-600 dark:text-red-400 uppercase font-bold">Predictive Alerts</div>
            <div className="text-base font-black text-red-900 dark:text-red-200 font-mono mt-0.5">
              {PREDICTED_INCIDENTS.length} Forecasted
            </div>
            <div className="text-[9px] text-red-600 font-bold">88.5% Likelihood</div>
          </div>

          <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/50">
            <div className="text-[10px] font-mono text-violet-600 dark:text-violet-400 uppercase font-bold">Prevented Losses</div>
            <div className="text-base font-black text-violet-900 dark:text-violet-200 font-mono mt-0.5">
              $2.45 Million
            </div>
            <div className="text-[9px] text-violet-600 font-bold">Verified ROI</div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveEngineTab("patterns")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngineTab === "patterns"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>1. Pattern Detection ({PATTERN_CLUSTERS.length})</span>
          </button>

          <button
            onClick={() => setActiveEngineTab("predictions")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngineTab === "predictions"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2. Predictive Incidents ({PREDICTED_INCIDENTS.length})</span>
          </button>

          <button
            onClick={() => setActiveEngineTab("actions")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngineTab === "actions"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Preventive Actions (CAPA)</span>
          </button>

          <button
            onClick={() => setActiveEngineTab("alerts")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngineTab === "alerts"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>4. Safety Alerts ({alerts.length})</span>
          </button>

          <button
            onClick={() => setActiveEngineTab("dashboards")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngineTab === "dashboards"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>5. Dashboards</span>
          </button>

          <button
            onClick={() => setActiveEngineTab("summaries")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngineTab === "summaries"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>6. Knowledge Summaries</span>
          </button>

          <button
            onClick={() => setActiveEngineTab("streams")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngineTab === "streams"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>6 Input Streams ({ingestedRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveEngineTab("pipeline")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeEngineTab === "pipeline"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>ML & LLM Pipeline Architecture</span>
          </button>
        </div>

        <button
          onClick={() => setIsSimulateOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center space-x-1.5 hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest New Data Feed</span>
        </button>
      </div>

      {/* SECTION 1: PATTERN DETECTION */}
      {activeEngineTab === "patterns" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-600" />
                Unsupervised AI Failure Mode Pattern Clusters
              </h3>
              <p className="text-xs text-slate-500">
                HDBSCAN + Gemini 2.5 Flash correlates isolated near-misses, maintenance records, and quality reports into systemic root cause patterns.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400">
              Confidence Score Threshold: &gt;85%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cluster Selector Sidebar */}
            <div className="lg:col-span-5 space-y-3">
              {PATTERN_CLUSTERS.map((clust) => {
                const isSelected = selectedClusterId === clust.id;

                return (
                  <button
                    key={clust.id}
                    onClick={() => setSelectedClusterId(clust.id)}
                    className={`w-full p-4 rounded-2xl border text-left space-y-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-violet-600 text-white border-violet-600 shadow-md ring-2 ring-violet-300"
                        : "bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected ? "bg-violet-700 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      }`}>
                        {clust.id}
                      </span>
                      <span className="text-[10px] font-bold font-mono text-emerald-400">
                        {clust.confidenceScore}% AI Confidence
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold leading-snug">{clust.clusterName}</h4>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {clust.sourcesInvolved.map((src, i) => (
                        <span
                          key={i}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-violet-800 text-violet-100"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {src}
                        </span>
                      ))}
                    </div>

                    <div className={`text-[10px] font-mono flex items-center justify-between ${
                      isSelected ? "text-violet-100" : "text-slate-400"
                    }`}>
                      <span>Affected Assets: {clust.affectedAssets.join(", ")}</span>
                      <span>{clust.occurrencesCount} Linked Events</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Cluster Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-violet-950 text-violet-300 text-[10px] font-mono font-bold">
                      Cluster {activeCluster.id} Analysis
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-1">
                      {activeCluster.clusterName}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs font-bold font-mono">
                    Risk: {activeCluster.riskLevel}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Primary Failure Mode Identified
                  </label>
                  <p className="text-xs text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {activeCluster.primaryFailureMode}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Underlying Root Cause Pattern (Correlated Across Sources)
                  </label>
                  <p className="text-xs text-emerald-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed italic">
                    "{activeCluster.underlyingRootCausePattern}"
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Cross-Source Evidence Ingested ({activeCluster.occurrencesCount} Events)
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                      <span className="text-violet-400 font-bold block">Incident Reports:</span>
                      1 Major Pump Seizure (P-101)
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                      <span className="text-amber-400 font-bold block">Near Misses:</span>
                      3 Washdown Spray Logs
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                      <span className="text-emerald-400 font-bold block">Maintenance Records:</span>
                      3 Unscheduled Seal Replacements
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                      <span className="text-indigo-400 font-bold block">Failure History:</span>
                      1 MTBF Decline Trend
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">Vector Cosine Similarity: 0.942</span>
                  <button
                    onClick={() => setActiveEngineTab("predictions")}
                    className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>View Predicted Incidents for Cluster</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PREDICTIVE INCIDENTS */}
      {activeEngineTab === "predictions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                ML Predictive Incident Forecasting Radar
              </h3>
              <p className="text-xs text-slate-500">
                Predicts upcoming asset failures by extrapolating sensor drift curves against historical cluster degradation models.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-red-600">
              Survival Analysis Engine Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREDICTED_INCIDENTS.map((pred) => (
              <div
                key={pred.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-mono text-[10px] font-extrabold">
                      {pred.urgencyStatus}
                    </span>
                    <span className="text-xs font-mono font-black text-red-600 dark:text-red-400">
                      {pred.likelihoodPercent}% Likelihood
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Target Asset: {pred.assetLocation}</span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{pred.targetAsset}</h4>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Predicted Incident Type:</div>
                    <div className="text-xs font-extrabold text-red-600 dark:text-red-400">{pred.predictedIncidentType}</div>
                    <div className="text-[10px] font-mono text-slate-500">Estimated Window: {pred.estimatedTimeframe}</div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Leading Indicators Detected:</label>
                    <ul className="space-y-1">
                      {pred.leadingIndicators.map((ind, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-xs text-violet-900 dark:text-violet-200 space-y-1">
                    <span className="font-bold font-mono text-[10px] uppercase text-violet-700 dark:text-violet-400 block">
                      AI Prescriptive Preventive Action:
                    </span>
                    <p>{pred.preventiveAction}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-bold">Impact: {pred.potentialImpactCost}</span>
                  <button
                    onClick={() => alert(`Created Priority Work Order for ${pred.targetAsset} to execute preventive action!`)}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                  >
                    Create Preventative WO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: PREVENTIVE ACTIONS (CAPA) */}
      {activeEngineTab === "actions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Hierarchy of Controls Preventive Action Matrix (CAPA)
              </h3>
              <p className="text-xs text-slate-500">
                AI-recommended corrective and preventive action items ranked by standard EHS engineering control levels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                Level 1: Engineering Controls
              </span>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Hardware Design & Interlock Modification
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Replace all elastomeric oil lip seals with metallic labyrinth isolators (Inpro/Seal IP66) to permanently eliminate washdown water ingress.
              </p>
              <div className="text-[10px] font-mono text-emerald-600 font-bold">Status: WO Drafted</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold uppercase">
                Level 2: Administrative Controls
              </span>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                SOP Revision & Key Lock Interlocks
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Update Startup SOP-OPS-044 to require Shift Engineer physical key confirmation prior to bypassing any high-vibration trip logic.
              </p>
              <div className="text-[10px] font-mono text-amber-600 font-bold">Status: Pending Sign-off</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold uppercase">
                Level 3: Predictive Safeguards
              </span>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Continuous SCADA Water-in-Oil Sensor Telemetry
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Install inline moisture-in-oil capacitive probes on 14 API centrifugal pumps with automatic DCS high-moisture early alarm at 500 PPM.
              </p>
              <div className="text-[10px] font-mono text-blue-600 font-bold">Status: Budget Approved</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SAFETY ALERTS GENERATOR */}
      {activeEngineTab === "alerts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Automated Safety Alert & Advisory Generator
              </h3>
              <p className="text-xs text-slate-500">
                Broadcast-ready safety bulletins generated automatically upon pattern detection across plant departments.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {alerts.map((al) => (
              <div
                key={al.id}
                className={`p-5 rounded-2xl border space-y-3 ${
                  al.severityLevel.includes("RED")
                    ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50"
                    : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white font-mono">
                      {al.alertCode}
                    </span>
                    <span className="text-xs font-bold font-mono text-red-700 dark:text-red-400">{al.severityLevel}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Issued: {al.issueDate}</span>
                </div>

                <h4 className="text-sm font-black text-slate-900 dark:text-white">{al.title}</h4>

                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white font-mono text-[10px] uppercase block">
                    Triggering Pattern:
                  </span>
                  <p className="italic">{al.triggeringPattern}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white font-mono text-[10px] uppercase block">
                    Mandatory Plant Actions:
                  </span>
                  <ul className="space-y-1">
                    {al.mandatoryActions.map((act, i) => (
                      <li key={i} className="text-xs text-slate-800 dark:text-slate-200 flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-500">
                    Target Departments: {al.targetDepartments.join(" • ")}
                  </div>
                  {al.acknowledgedByPlantLead ? (
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledged by Plant Lead</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcknowledgeAlert(al.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      Sign & Acknowledge Alert
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: DASHBOARDS */}
      {activeEngineTab === "dashboards" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
              Cross-Plant Lessons Learned Executive Analytics Dashboard
            </h3>
            <span className="text-xs font-mono text-slate-400">Live Telemetry & Historical Digest</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Visual Bar 1: Multi-Source Ingestion Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">Data Streams Breakdown</span>
                <PieChart className="w-4 h-4 text-violet-500" />
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                    <span>Incident Reports</span>
                    <span className="font-bold">28%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                    <span>Near Miss Logs</span>
                    <span className="font-bold">35%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                    <span>Quality Reports</span>
                    <span className="font-bold">15%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                    <span>Maintenance & Failure Records</span>
                    <span className="font-bold">22%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "22%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Bar 2: Failure Mode Categories */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">Failure Category Frequency</span>
                <BarChart3 className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="space-y-3 text-xs font-sans">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">Mechanical & Seals</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">42 Events</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">Instrumentation & Valves</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">28 Events</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">Human Factors & SOPs</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">19 Events</span>
                </div>
              </div>
            </div>

            {/* Visual Bar 3: Financial ROI Savings */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold font-mono text-violet-400 uppercase">Financial Impact Prevented</span>
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>

              <div className="text-2xl font-black font-mono text-white">$2,450,000</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculated based on 4 pre-empted plant shutdowns across Hydrotreating and Distillation units.
              </p>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400 font-bold">
                ✓ Verified by Plant Financial Auditor
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: KNOWLEDGE SUMMARIES */}
      {activeEngineTab === "summaries" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-600" />
                AI-Synthesized Lessons Learned & Standards Updates
              </h3>
              <p className="text-xs text-slate-500">
                Cross-plant memory cards generated by Gemini 2.5 LLM to update engineering standards and prevent duplicate failures.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KNOWLEDGE_SUMMARIES.map((ks) => (
              <div
                key={ks.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 font-mono text-[10px] font-extrabold">
                      {ks.equipmentFamily}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      {ks.aiConfidence}% Synthesis Confidence
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{ks.title}</h4>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block font-mono text-[10px] uppercase">
                      Problem Statement:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{ks.problemStatement}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1 font-mono text-[10px] uppercase">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600" /> Synthesized Lesson & Solution:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{ks.synthesizedLesson}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-1">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block font-mono text-[10px] uppercase">
                      Updated Plant Engineering Standard:
                    </span>
                    <p className="text-blue-800 dark:text-blue-200 font-mono">{ks.engineeringStandardUpdate}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 font-bold">Prevented: {ks.financialImpactPrevented}</span>
                  <button
                    onClick={() => alert(`Exporting Lessons Learned PDF for ${ks.title}...`)}
                    className="text-violet-600 hover:underline font-bold cursor-pointer"
                  >
                    Export Memory Card PDF →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: INPUT STREAMS EXPLORER */}
      {activeEngineTab === "streams" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
              6 Heterogeneous Data Input Feeds Explorer
            </h3>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 text-xs">
              {["All", "Incident Report", "Near Miss", "Quality Report", "Audit Finding", "Maintenance Record", "Failure History"].map(
                (src) => (
                  <button
                    key={src}
                    onClick={() => setSelectedSourceType(src)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                      selectedSourceType === src
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {src}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search across Incident Reports, Near Misses, Quality Reports, Audit Findings, Maintenance Records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center gap-1.5">
                      {getSourceIcon(rec.sourceType)}
                      <span>{rec.sourceType}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{rec.dateRecorded}</span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">{rec.title}</h4>
                  <div className="text-[10px] font-mono text-violet-600 dark:text-violet-400">
                    Asset: {rec.assetId} ({rec.unitLocation})
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{rec.summary}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                  {rec.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: ML & LLM PIPELINE ARCHITECTURE */}
      {activeEngineTab === "pipeline" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-600" />
                End-to-End Machine Learning & LLM Pipeline Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Detailed technical breakdown of how data moves from multi-source ingestion to vector clustering, forecasting, and Gemini 2.5 synthesis.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {ML_LLM_PIPELINE_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-3 font-sans"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded bg-violet-600 text-white font-mono text-[10px] font-black">
                      Stage {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-extrabold text-white">{step.phaseName}</h4>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{step.techStack}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Input Data Feed:</span>
                    <p className="text-slate-300">{step.inputData}</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">ML / LLM Processing Logic:</span>
                    <p className="text-slate-300">{step.processingLogic}</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Output Artifact:</span>
                    <p className="text-emerald-300 font-mono">{step.outputArtifact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIMULATION MODAL */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
                Simulate New Multi-Source Data Feed Ingestion
              </h3>
              <button onClick={() => setIsSimulateOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 font-mono">Source Feed Type</label>
                <select
                  value={simSource}
                  onChange={(e) => setSimSource(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Incident Report">Incident Report</option>
                  <option value="Near Miss">Near Miss</option>
                  <option value="Quality Report">Quality Report</option>
                  <option value="Audit Finding">Audit Finding</option>
                  <option value="Maintenance Record">Maintenance Record</option>
                  <option value="Failure History">Failure History</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 font-mono">Report Title</label>
                <input
                  type="text"
                  placeholder="e.g. Unscheduled Lube Oil Filter Flush on P-101"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 font-mono">Target Asset Code</label>
                <input
                  type="text"
                  placeholder="e.g. P-101 or TK-204"
                  value={simAsset}
                  onChange={(e) => setSimAsset(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 font-mono">Report Observations & Summary</label>
                <textarea
                  rows={3}
                  placeholder="Describe observed condition or failure parameters for AI embedding & clustering..."
                  value={simSummary}
                  onChange={(e) => setSimSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer shadow-sm"
                >
                  Ingest & Process with Gemini AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
