import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  FileText,
  CheckCircle2,
  Download,
  Search,
  ExternalLink,
  Layers,
  Bot,
  Database,
  Terminal,
  Code2,
  Copy,
  Check,
  Sparkles,
  Cpu,
  ArrowRight,
  Lock,
  RefreshCw,
  FolderCheck,
  Scale,
  Building2,
  Flame,
  ShieldAlert,
  ListFilter
} from "lucide-react";
import {
  REGULATORY_FRAMEWORKS,
  COMPLIANCE_GAPS,
  MISSING_DOCUMENTS,
  AUDIT_CHECKLIST_DATA,
  COMPLIANCE_WORKFLOW,
  COMPLIANCE_PROMPT_ENGINEERING,
  ComplianceGapItem,
  MissingDocumentAlert
} from "../data/complianceAgentData";

export const ComplianceAgentArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"frameworks" | "gap-analysis" | "missing-docs" | "checklist" | "workflow" | "prompts">("gap-analysis");
  const [selectedGapId, setSelectedGapId] = useState<string>("gap-01");
  const [selectedStandardId, setSelectedStandardId] = useState<string>("factory-act-1948");
  const [copiedPromptKey, setCopiedPromptKey] = useState<string | null>(null);

  // Filtered Gaps & Audit Items
  const currentGap = COMPLIANCE_GAPS.find((g) => g.id === selectedGapId) || COMPLIANCE_GAPS[0];
  const currentStandard = REGULATORY_FRAMEWORKS.find((r) => r.id === selectedStandardId) || REGULATORY_FRAMEWORKS[0];

  const copyPromptText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptKey(key);
    setTimeout(() => setCopiedPromptKey(null), 2000);
  };

  // Live Score Calculator
  const totalAuditPoints = AUDIT_CHECKLIST_DATA.reduce((acc, curr) => acc + curr.complianceScoreImpactPoints, 0);
  const passedPoints = AUDIT_CHECKLIST_DATA.filter((c) => c.status === "PASS").reduce((acc, curr) => acc + curr.complianceScoreImpactPoints, 0);
  const partialPoints = AUDIT_CHECKLIST_DATA.filter((c) => c.status === "PARTIAL").reduce((acc, curr) => acc + (curr.complianceScoreImpactPoints * 0.5), 0);
  const liveComplianceScore = Math.round(((passedPoints + partialPoints) / totalAuditPoints) * 100);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white font-mono uppercase tracking-wider">
              AI Statutory & Regulatory Compliance Agent
            </span>
            <span className="text-xs text-slate-500 font-mono">Factory Act | OISD | PESO | ISO | CPCB</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Guardian™ Autonomous Regulatory Audit Architecture
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compares uploaded industrial documents against 5 major statutory frameworks to generate Gap Analysis, Audit Packages & Compliance Scores.
          </p>
        </div>

        {/* Live Score Badge */}
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Live Composite Compliance Score</div>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono flex items-center gap-1">
              <span>{liveComplianceScore}%</span>
              <span className="text-xs font-bold text-amber-500 font-sans">
                {liveComplianceScore >= 80 ? "(Audit Ready)" : "(Action Required)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("gap-analysis")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "gap-analysis"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Statutory Gap Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab("missing-docs")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "missing-docs"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FolderCheck className="w-4 h-4" />
          <span>Missing Document Detector ({MISSING_DOCUMENTS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("checklist")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "checklist"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Interactive Audit Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab("frameworks")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "frameworks"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>5 Standards Frameworks</span>
        </button>

        <button
          onClick={() => setActiveTab("workflow")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "workflow"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Multi-Agent DAG Workflow</span>
        </button>

        <button
          onClick={() => setActiveTab("prompts")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "prompts"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Prompt Directives</span>
        </button>
      </div>

      {/* TAB 1: Statutory Gap Analysis */}
      {activeTab === "gap-analysis" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {COMPLIANCE_GAPS.map((gap) => {
              const isSelected = selectedGapId === gap.id;

              return (
                <button
                  key={gap.id}
                  onClick={() => setSelectedGapId(gap.id)}
                  className={`p-3.5 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300"
                      : "bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? "bg-rose-700 text-rose-100" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}>
                      {gap.standardCode}
                    </span>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      gap.severity === "CRITICAL"
                        ? "bg-red-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}>
                      {gap.severity}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold truncate">{gap.clauseTitle}</div>
                  <div className={`text-[10px] truncate ${isSelected ? "text-rose-100" : "text-slate-400"}`}>
                    Doc: {gap.uploadedDocumentRef}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Gap Detailed View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 text-[10px] font-extrabold font-mono">
                    Clause Ref: {currentGap.clauseId} ({currentGap.standardCode})
                  </span>
                  <span className="text-[10px] font-bold font-mono text-red-600 dark:text-red-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Severity: {currentGap.severity}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {currentGap.clauseTitle}
                </h3>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Observed Condition in Uploaded Document ({currentGap.uploadedDocumentRef})
                  </label>
                  <p className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-rose-200 dark:border-rose-900/40 leading-relaxed italic">
                    "{currentGap.observedCondition}"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-900 dark:text-red-200 font-medium">
                  <span className="font-bold font-mono uppercase text-[10px] block text-red-700 dark:text-red-400">
                    Statutory Penalty & Regulatory Risk:
                  </span>
                  {currentGap.penaltyRisk}
                </div>
              </div>
            </div>

            {/* Right: AI Corrective Action Plan */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-xs font-mono text-white">AI Prescriptive Corrective Engineering Plan</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-[10px] font-bold">
                    Zero-Hallucination Directive
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    Required Corrective Action Step
                  </label>
                  <p className="text-xs text-slate-200 leading-relaxed p-3 bg-slate-900 rounded-xl border border-slate-800">
                    {currentGap.correctiveAction}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px] font-mono">Target Audit Evidence Needed:</span>
                  <button
                    onClick={() => alert(`Generated Draft Evidence Document Request for ${currentGap.standardCode}...`)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Generate Evidence Template</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Missing Document Detector */}
      {activeTab === "missing-docs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
              Mandatory Statutory Document Checklist & Expiry Tracker
            </h3>
            <span className="text-xs text-slate-500 font-mono">Audited against DISH & PESO Master Lists</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MISSING_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
                  doc.status === "Missing"
                    ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                    : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {doc.regulatoryAuthority}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-extrabold ${
                        doc.status === "Missing"
                          ? "bg-rose-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">{doc.documentTitle}</h4>
                  <div className="text-[10px] font-mono text-slate-500">Rule: {doc.mandatingRule}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{doc.operationalImpact}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">Renewal Cycle: {doc.renewalFrequency}</span>
                  <button
                    onClick={() => alert(`Initiating Upload Request for ${doc.documentTitle}...`)}
                    className="text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                  >
                    Request File Upload →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Interactive Audit Checklist */}
      {activeTab === "checklist" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
              Clause-by-Clause Compliance Verification Checklist
            </h3>
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
              Live Weighted Compliance Index: {liveComplianceScore}%
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Standard & Clause</th>
                  <th className="p-3">Verification Item</th>
                  <th className="p-3">Audit Method</th>
                  <th className="p-3">Weight Points</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Evidence Artifact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {AUDIT_CHECKLIST_DATA.map((chk) => (
                  <tr key={chk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">
                      <div>{chk.standard}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{chk.clauseRef}</div>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-medium max-w-sm">
                      {chk.verificationQuestion}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        {chk.verificationMethod}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {chk.complianceScoreImpactPoints} pts
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-extrabold font-mono ${
                          chk.status === "PASS"
                            ? "bg-emerald-100 text-emerald-800"
                            : chk.status === "FAIL"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {chk.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 truncate max-w-xs">
                      {chk.evidenceDocName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: 5 Standards Frameworks */}
      {activeTab === "frameworks" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {REGULATORY_FRAMEWORKS.map((frame) => {
              const isSelected = selectedStandardId === frame.id;

              return (
                <button
                  key={frame.id}
                  onClick={() => setSelectedStandardId(frame.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300"
                      : "bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span className="text-[11px] font-extrabold truncate">{frame.code}</span>
                  <span className={`text-[9px] font-mono truncate ${isSelected ? "text-rose-100" : "text-slate-400"}`}>
                    {frame.category}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{currentStandard.authority}</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{currentStandard.title}</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-mono text-[10px] font-extrabold">
                {currentStandard.category}
              </span>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Key Statutory Clauses & Mandatory Documents</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentStandard.keyClauses.map((clause, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-bold">
                      {clause.clauseId}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{clause.clauseTitle}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{clause.statutoryRequirement}</p>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                      Req Doc: {clause.mandatoryDocRequired}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Multi-Agent DAG Workflow */}
      {activeTab === "workflow" && (
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
            Sequential 5-Agent Compliance Audit DAG Workflow
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {COMPLIANCE_WORKFLOW.map((node) => (
              <div
                key={node.stepNumber}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-extrabold font-mono">
                    Step #{node.stepNumber}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 leading-snug">{node.agentName}</h4>
                  <div className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 mt-1">{node.role}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{node.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-500 self-end mt-2 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Prompt Directives */}
      {activeTab === "prompts" && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
            Zero-Hallucination Compliance Audit System Prompts
          </h3>

          <div className="space-y-4">
            {COMPLIANCE_PROMPT_ENGINEERING.map((prompt) => (
              <div key={prompt.key} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-2 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-rose-400">{prompt.title}</span>
                  <button
                    onClick={() => copyPromptText(prompt.key, prompt.promptText)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedPromptKey === prompt.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPromptKey === prompt.key ? "Copied" : "Copy Prompt"}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{prompt.description}</p>
                <pre className="p-3 bg-slate-900 rounded-xl text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {prompt.promptText}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
