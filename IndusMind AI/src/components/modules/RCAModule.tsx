import React, { useState } from "react";
import {
  GitPullRequest,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Workflow,
  Plus,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { IncidentRecord } from "../../types";

interface RCAModuleProps {
  incidents: IncidentRecord[];
  onAddIncident: (inc: IncidentRecord) => void;
}

export const RCAModule: React.FC<RCAModuleProps> = ({ incidents, onAddIncident }) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(incidents[0] || null);
  const [incidentTitle, setIncidentTitle] = useState("");
  const [equipmentCode, setEquipmentCode] = useState("P-101");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRCA = async () => {
    if (!incidentTitle.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/rca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentTitle,
          equipmentCode,
          description
        })
      });

      const data = await res.json();

      const newInc: IncidentRecord = {
        id: `inc-${Date.now()}`,
        title: data.incidentTitle || incidentTitle,
        equipmentCode,
        severity: "Critical",
        status: "RCA Completed",
        fiveWhys: data.fiveWhys || [],
        fishbone: data.fishboneCategories || {},
        capa: data.capaActions || [],
        reportedBy: "Quality Engineer",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      onAddIncident(newInc);
      setSelectedIncident(newInc);
      setIncidentTitle("");
      setDescription("");
    } catch (err) {
      console.error("RCA Generation Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Root Cause Analysis (RCA) Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              5-Whys Causal Tree, Ishikawa (Fishbone) Category Generator & CAPA Action Tracking.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          {incidents.length} RCA Case Studies
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & History */}
        <div className="lg:col-span-5 space-y-4">
          {/* Create RCA Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-slate-50 text-slate-900 border border-indigo-100/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4 text-indigo-600" /> AI Root Cause Analysis Generator
              </span>
            </div>

            <input
              type="text"
              value={incidentTitle}
              onChange={(e) => setIncidentTitle(e.target.value)}
              placeholder="Incident Title (e.g., Pump P-101 Thermal Trip)"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs font-medium"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={equipmentCode}
                onChange={(e) => setEquipmentCode(e.target.value)}
                placeholder="Asset Code (e.g., P-101)"
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none"
              />

              <button
                onClick={handleGenerateRCA}
                disabled={!incidentTitle.trim() || isGenerating}
                className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-indigo-600/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Analyzing..." : "Generate RCA"}</span>
              </button>
            </div>
          </div>

          {/* Incident Records List */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              RCA Incident Cases:
            </label>
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedIncident?.id === inc.id
                    ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {inc.equipmentCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700">
                    {inc.status}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white mt-1">
                  {inc.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 5-Whys & Fishbone Categories */}
        <div className="lg:col-span-7">
          {selectedIncident ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                  RCA Case Study
                </span>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedIncident.title}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Asset: {selectedIncident.equipmentCode} • Reported by {selectedIncident.reportedBy}
                </p>
              </div>

              {/* 5-Whys Tree */}
              {selectedIncident.fiveWhys && selectedIncident.fiveWhys.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    1. 5-Whys Causal Tree Breakdown
                  </h3>
                  <div className="space-y-2">
                    {selectedIncident.fiveWhys.map((why) => (
                      <div
                        key={why.step}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                      >
                        <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5" /> Why #{why.step}: {why.question}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 pl-5">
                          {why.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CAPA Recommendations */}
              {selectedIncident.capa && selectedIncident.capa.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    2. Corrective & Preventive Actions (CAPA)
                  </h3>
                  <div className="space-y-2">
                    {selectedIncident.capa.map((cap, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-emerald-800 dark:text-emerald-300">
                            [{cap.type}] {cap.action}
                          </span>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Owner: {cap.owner}
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-white dark:bg-slate-900 text-emerald-700 font-mono text-[10px] rounded font-bold">
                          {cap.timeline}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              Select an incident case or generate a new RCA study.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
