import React from "react";
import { Workflow, Play, CheckCircle2, Zap, Power } from "lucide-react";
import { WorkflowRule } from "../../types";

interface WorkflowModuleProps {
  rules: WorkflowRule[];
  onToggleRule: (id: string) => void;
}

export const WorkflowAutomationModule: React.FC<WorkflowModuleProps> = ({ rules, onToggleRule }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
          <Workflow className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Workflow Studio & Trigger-Action Automation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Autonomous event triggers linking Sentinel vibration limits, Guardian statutory gaps & Scout field apps.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {rule.title}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-100 text-cyan-800 font-bold">
                  {rule.executionCount} Executions
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-400">Trigger: </span>
                {rule.trigger} | <span className="font-bold text-slate-400">Action: </span>
                {rule.action}
              </div>
            </div>

            <button
              onClick={() => onToggleRule(rule.id)}
              className={`p-3 rounded-xl flex items-center space-x-2 font-bold text-xs transition-colors ${
                rule.enabled
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{rule.enabled ? "Active" : "Disabled"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
