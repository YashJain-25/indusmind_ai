import React from "react";
import {
  LayoutDashboard,
  UploadCloud,
  Network,
  Bot,
  ShieldAlert,
  Wrench,
  AlertOctagon,
  FileText,
  BarChart3,
  Settings,
  LogIn,
  Box,
  History,
  Workflow,
  ClipboardCheck,
  Bell,
  Smartphone,
  ChevronRight,
  Sparkles,
  Terminal,
  Cpu,
  Factory
} from "lucide-react";
import { AppModule } from "../types";

interface SidebarProps {
  activeModule: AppModule;
  onSelectModule: (module: AppModule) => void;
  openCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavGroup {
  category: string;
  items: {
    id: AppModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    category: "CORE NAVIGATION",
    items: [
      { id: "login", label: "Login & Identity", icon: LogIn, badge: "SSO" },
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: "LIVE" },
      { id: "copilot", label: "AI Chat", icon: Bot, badge: "GEMINI 2.5" },
      { id: "documents", label: "Upload Documents", icon: UploadCloud },
      { id: "graph", label: "Knowledge Graph", icon: Network }
    ]
  },
  {
    category: "OPERATIONS & MAINTENANCE",
    items: [
      { id: "compliance", label: "Compliance Dashboard", icon: ShieldAlert },
      { id: "maintenance", label: "Maintenance Dashboard", icon: Wrench, badge: "P1 Risk" },
      { id: "rca", label: "Incidents & RCA", icon: AlertOctagon },
      { id: "twin", label: "Equipment Digital Twin", icon: Box },
      { id: "lessons", label: "Lessons Learned Memory", icon: History }
    ]
  },
  {
    category: "REPORTS & GOVERNANCE",
    items: [
      { id: "fastapi", label: "FastAPI Backend API", icon: Terminal, badge: "FASTAPI" },
      { id: "reports", label: "Reports", icon: FileText },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "admin", label: "Admin Portal", icon: Settings, badge: "RBAC" },
      { id: "automation", label: "Workflow Automation", icon: Workflow },
      { id: "audit", label: "Audit Workspace", icon: ClipboardCheck }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  mobileOpen = false,
  onCloseMobile
}) => {
  const sidebarContent = (
    <aside className="w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 select-none overflow-y-auto font-sans transition-colors">
      {/* App Branding Header in Mobile or Drawer */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 ring-1 ring-white/20">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-black text-slate-900 dark:text-white text-xs tracking-wider uppercase font-sans">
              INDUSMIND <span className="text-blue-600">AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono font-medium">Plant Operating OS v1.0</div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-4 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.category}>
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
              {group.category}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectModule(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold shrink-0 ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Runtime Footer */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[11px] space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          <span>AI CLUSTER</span>
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
          </span>
        </div>
        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-medium">
            <span>Gemini 2.5 Flash</span>
            <span className="text-[10px] text-blue-600 font-mono font-bold">18ms</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>RAG Grounding</span>
            <span>99.2% Acc.</span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 max-w-xs w-full bg-white dark:bg-slate-900 h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
