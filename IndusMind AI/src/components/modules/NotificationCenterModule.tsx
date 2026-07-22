import React from "react";
import { Bell, Radio, ShieldAlert, CheckCircle2 } from "lucide-react";
import { AgentActivityLog } from "../../types";

interface NotificationsProps {
  activityLogs: AgentActivityLog[];
}

export const NotificationCenterModule: React.FC<NotificationsProps> = ({ activityLogs }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Real-time Operational Alert Feed
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Synced via Firestore real-time listener across all plant units and field operations.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {activityLogs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-xs flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  [{log.agentName}] {log.action}
                </div>
                <div className="text-[11px] text-slate-500">{log.details}</div>
              </div>
            </div>

            <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
