import React from "react";
import { ClipboardCheck, CheckCircle2, Shield, Lock, FileText } from "lucide-react";

export const AuditWorkspaceModule: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
          <ClipboardCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Statutory Audit & Collaborative Evidence Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-user sign-off workspace, evidence validation matrix, and statutory verification timeline.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Active Statutory Verification Matrix
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Factory Act Sec 31 Hydrostatic Pressure Vessel Audit
              </div>
              <div className="text-[11px] text-slate-500">
                Verified by Quality Officer • Evidence Doc: Cert-PV-2025-Hydro.pdf
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px]">
              Verified & Signed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
