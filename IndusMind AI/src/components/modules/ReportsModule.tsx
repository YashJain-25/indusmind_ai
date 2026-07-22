import React, { useState } from "react";
import {
  FileCheck,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileText,
  Printer,
  Sparkles,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Clock,
  Send,
  CheckCircle2,
  Share2
} from "lucide-react";
import { IndustrialDocument, IncidentRecord, WorkOrder, ComplianceItem } from "../../types";

interface ReportsModuleProps {
  documents?: IndustrialDocument[];
  incidents?: IncidentRecord[];
  workOrders?: WorkOrder[];
  complianceItems?: ComplianceItem[];
}

interface ReportTemplate {
  id: string;
  title: string;
  category: "Compliance" | "Maintenance" | "Operations" | "Safety";
  description: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "On-Demand";
  lastGenerated: string;
  author: string;
  status: "Ready" | "Generating" | "Scheduled";
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "REP-COMP-2026",
    title: "Statutory Environmental & Safety Compliance Audit",
    category: "Compliance",
    description: "Comprehensive statutory audit report evaluating CPCB emission levels, OSHA zero-harm metrics, and pressure vessel certifications.",
    frequency: "Monthly",
    lastGenerated: "2026-07-20 09:30 AM",
    author: "Guardian™ Audit Agent",
    status: "Ready"
  },
  {
    id: "REP-MAIN-882",
    title: "Predictive Maintenance & Asset Health Digest",
    category: "Maintenance",
    description: "Vibration FFT analysis, remaining useful life (RUL) projections, and high-risk work order summary for rotating equipment.",
    frequency: "Weekly",
    lastGenerated: "2026-07-21 06:00 AM",
    author: "Sentinel™ FFT Agent",
    status: "Ready"
  },
  {
    id: "REP-INC-104",
    title: "Quarterly Incident Root Cause & RCA Summary",
    category: "Safety",
    description: "Synthesized 8D & 5-Why analysis of root causes across all plant trips, pump seal failures, and electrical faults.",
    frequency: "Monthly",
    lastGenerated: "2026-07-15 02:15 PM",
    author: "Orion™ Orchestrator",
    status: "Ready"
  },
  {
    id: "REP-OPS-501",
    title: "Cross-Plant Failure Memory & Lessons Learned Report",
    category: "Operations",
    description: "Aggregated vector index of historical failures across Gujarat, Jamnagar, and Mathura refineries with actionable takeaways.",
    frequency: "On-Demand",
    lastGenerated: "2026-07-22 01:10 AM",
    author: "Echo™ Memory Engine",
    status: "Ready"
  }
];

export const ReportsModule: React.FC<ReportsModuleProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate>(REPORT_TEMPLATES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [dispatchEmail, setDispatchEmail] = useState("");
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const filteredReports = selectedCategory === "All"
    ? REPORT_TEMPLATES
    : REPORT_TEMPLATES.filter((r) => r.category === selectedCategory);

  const handleGenerateReport = (rep: ReportTemplate) => {
    setIsGenerating(true);
    setExportNotice(null);
    setTimeout(() => {
      setIsGenerating(false);
      setExportNotice(`Generated ${rep.title} (PDF/CSV ready)`);
    }, 1200);
  };

  const handleExportPDF = () => {
    setExportNotice("Downloading PDF report package with AI executive summaries...");
    setTimeout(() => {
      setExportNotice("PDF Report Downloaded: " + selectedTemplate.id + ".pdf");
    }, 1000);
  };

  const handleExportCSV = () => {
    setExportNotice("Exporting raw sensor telemetry & audit tables to CSV...");
    setTimeout(() => {
      setExportNotice("CSV Data Export Downloaded: " + selectedTemplate.id + ".csv");
    }, 1000);
  };

  const handleScheduleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchEmail) return;
    setScheduledSuccess(true);
    setTimeout(() => setScheduledSuccess(false), 3000);
    setDispatchEmail("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Enterprise Industrial Reports & Export Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated AI report generation, statutory compliance exports, and executive PDF/CSV downloads.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Active PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV Data</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            {exportNotice}
          </span>
          <button onClick={() => setExportNotice(null)} className="text-[10px] text-blue-600 underline">Dismiss</button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {["All", "Compliance", "Maintenance", "Safety", "Operations"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Reports */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Standard Enterprise Report Suite
          </h2>

          <div className="space-y-3">
            {filteredReports.map((rep) => {
              const isSelected = selectedTemplate.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedTemplate(rep)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {rep.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {rep.frequency}
                    </span>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white mt-2">
                    {rep.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {rep.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Generated by {rep.author}</span>
                    <span className="text-emerald-600 font-semibold">{rep.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Report Preview & Dispatch */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="text-[10px] text-blue-600 font-bold font-mono tracking-widest uppercase">
                  {selectedTemplate.id} • PREVIEW
                </div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedTemplate.title}
                </h2>
              </div>

              <button
                onClick={() => handleGenerateReport(selectedTemplate)}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Synthesizing..." : "Run AI Synthesis"}</span>
              </button>
            </div>

            {/* Executive Report Abstract */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                AI Executive Summary & Findings
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                This document synthesizes real-time telemetry from 142 equipment sensor nodes, statutory compliance records, and root-cause failure logs. All safety thresholds remain within standard operating limits, with 0 critical non-compliance items logged in the past 30 days.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 text-[10px]">RELIABILITY SCORE</div>
                  <div className="text-sm font-black text-emerald-600">98.4%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 text-[10px]">AUDIT MARGIN</div>
                  <div className="text-sm font-black text-blue-600">PASS (100%)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 text-[10px]">OPEN WORK ORDERS</div>
                  <div className="text-sm font-black text-amber-600">3 Pending</div>
                </div>
              </div>
            </div>

            {/* Scheduled Dispatch Form */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-blue-600" />
                Automate Scheduled Email Dispatch
              </div>

              {scheduledSuccess && (
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  ✓ Schedule configured! Report will be automatically sent on {selectedTemplate.frequency} cadence.
                </div>
              )}

              <form onSubmit={handleScheduleDispatch} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={dispatchEmail}
                  onChange={(e) => setDispatchEmail(e.target.value)}
                  placeholder="executive@indusmind.ai"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Schedule Dispatch
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
