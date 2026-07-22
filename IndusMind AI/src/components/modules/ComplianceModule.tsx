import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Lock,
  Download,
  Search,
  ExternalLink
} from "lucide-react";
import { ComplianceItem } from "../../types";
import { ComplianceAgentArchitecture } from "../ComplianceAgentArchitecture";

interface ComplianceModuleProps {
  complianceItems: ComplianceItem[];
  onUpdateItem: (item: ComplianceItem) => void;
}

export const ComplianceModule: React.FC<ComplianceModuleProps> = ({
  complianceItems,
  onUpdateItem
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = complianceItems.filter(
    (c) =>
      c.regulation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Guardian™ Statutory & Regulatory Compliance
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated compliance auditing against Factory Act, OISD-STD-118, PESO Static Vessel Rules & ISO 55001.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Downloading Statutory Compliance Audit Evidence Package (PDF/Zip)...")}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-rose-600/30 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Package</span>
        </button>
      </div>

      {/* Compliance List Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clauses or regulation standards..."
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Regulation Standard</th>
                <th className="p-3">Statutory Clause</th>
                <th className="p-3">Description & Scope</th>
                <th className="p-3">Status</th>
                <th className="p-3">Evidence Doc</th>
                <th className="p-3">Next Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white font-mono">
                    {item.regulation}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                    {item.clause}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold font-mono ${
                        item.status === "Compliant"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "Gap Detected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                    {item.evidenceDoc || "N/A"}
                  </td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">
                    {item.nextAuditDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Statutory & Regulatory Compliance Agent Specification */}
      <ComplianceAgentArchitecture />
    </div>
  );
};
