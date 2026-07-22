import React, { useState } from "react";
import {
  Activity,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  ShieldCheck,
  Zap,
  TrendingDown,
  UserCheck
} from "lucide-react";
import { EquipmentTwin, WorkOrder } from "../../types";
import { MaintenanceAgentArchitecture } from "../MaintenanceAgentArchitecture";

interface MaintenanceModuleProps {
  equipment: EquipmentTwin[];
  workOrders: WorkOrder[];
  onAddWorkOrder: (order: WorkOrder) => void;
}

export const MaintenanceModule: React.FC<MaintenanceModuleProps> = ({
  equipment,
  workOrders,
  onAddWorkOrder
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentTwin>(equipment[0]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunSentinelAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/predictive-maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentCode: selectedEquipment.code,
          name: selectedEquipment.name,
          vibration: selectedEquipment.vibration,
          temperature: selectedEquipment.temperature,
          pressure: selectedEquipment.pressure,
          rpm: selectedEquipment.rpm,
          healthScore: selectedEquipment.healthScore
        })
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Sentinel analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateWorkOrderFromAI = () => {
    if (!analysisResult) return;
    const wo: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderId: `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentId: selectedEquipment.id,
      equipmentCode: selectedEquipment.code,
      equipmentName: selectedEquipment.name,
      priority: analysisResult.generatedWorkOrder?.priority || "P1 - Critical",
      status: "Open",
      assignedTo: analysisResult.generatedWorkOrder?.assignedRole || "Senior Technician",
      description: analysisResult.predictedFailureMode || "Predictive Overhaul Work Order",
      recommendedSpares: analysisResult.recommendedSpares?.map((s: any) => s.partName) || [
        "SKF Heavy Duty Bearing"
      ],
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      type: "Predictive"
    };

    onAddWorkOrder(wo);
    alert(`Work Order ${wo.orderId} created and dispatched to Field Tech Scout™!`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Sentinel™ Predictive Maintenance Intelligence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              FFT vibration spectrum analysis, Remaining Useful Life (RUL) estimation, and predictive work order dispatch.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunSentinelAnalysis}
          disabled={isAnalyzing}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-amber-600/30 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? "Running FFT Analysis..." : "Run Sentinel™ AI Diagnostic"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Asset Selection & AI Failure Analysis */}
        <div className="lg:col-span-7 space-y-4">
          {/* Asset Selection Grid */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Select Target Equipment Asset:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {equipment.map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => {
                    setSelectedEquipment(eq);
                    setAnalysisResult(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedEquipment.id === eq.id
                      ? "border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{eq.code}</span>
                    <span className="text-[10px] font-mono text-amber-600">{eq.healthScore}%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-1">{eq.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Analysis Result */}
          {analysisResult ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Sentinel™ AI Diagnostic Output
                </span>
                <span className="text-xs font-bold font-mono text-rose-600">
                  Failure Prob: {analysisResult.failureProbability}%
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Predicted Failure Mode:
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 font-medium">
                  {analysisResult.predictedFailureMode}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Recommended Action Steps:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {analysisResult.actionableSteps?.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleCreateWorkOrderFromAI}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/30 transition-all"
              >
                <Wrench className="w-4 h-4" />
                <span>Dispatch Work Order to Scout™ Field App</span>
              </button>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              Click "Run Sentinel™ AI Diagnostic" above to generate predictive failure analysis for {selectedEquipment.code}.
            </div>
          )}
        </div>

        {/* Right Column: Work Orders List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-500" /> Dispatched Work Orders
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {workOrders.length} Orders
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {workOrders.map((wo) => (
                <div
                  key={wo.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {wo.orderId}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        wo.priority.includes("Critical")
                          ? "bg-rose-100 text-rose-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 dark:text-white">
                    {wo.equipmentCode} - {wo.equipmentName}
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {wo.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Assigned: {wo.assignedTo}</span>
                    <span>Due: {wo.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Maintenance Intelligence Agent Architecture & Algorithms Specification */}
      <MaintenanceAgentArchitecture />
    </div>
  );
};
