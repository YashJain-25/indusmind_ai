import React, { useState, useEffect } from "react";
import { Search, FileText, Activity, Bot, Shield, ArrowRight, X, Sparkles, Building2 } from "lucide-react";
import { AppModule } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: AppModule) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: "Module" | "Equipment" | "Document" | "AI Agent";
  subtitle: string;
  moduleId: AppModule;
  icon: React.ComponentType<{ className?: string }>;
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: "c1", title: "Enterprise Knowledge Copilot (Cortex™)", category: "AI Agent", subtitle: "Ask industrial queries with exact RAG citations", moduleId: "copilot", icon: Bot },
  { id: "c2", title: "Pump P-101 Boiler Feed Asset", category: "Equipment", subtitle: "Health Score 68% - High Vibration Alert", moduleId: "twin", icon: Activity },
  { id: "c3", title: "SOP-2024-PUMP Overhaul Procedure", category: "Document", subtitle: "18 pages - Mechanical seal & bearing torque specs", moduleId: "documents", icon: FileText },
  { id: "c4", title: "Root Cause Analysis (RCA Engine)", category: "Module", subtitle: "5-Whys, Ishikawa diagram, and CAPA matrix", moduleId: "rca", icon: Sparkles },
  { id: "c5", title: "Knowledge Graph Explorer (PulseGraph™)", category: "Module", subtitle: "Visual neural mapping of equipment, SOPs and regulations", moduleId: "graph", icon: Building2 },
  { id: "c6", title: "OISD-STD-118 Regulatory Audit", category: "Document", subtitle: "Statutory lubrication and moisture compliance rules", moduleId: "compliance", icon: Shield },
  { id: "c7", title: "Predictive Maintenance & Sentinel™", category: "Module", subtitle: "FFT spectrum analysis and Remaining Useful Life (RUL)", moduleId: "maintenance", icon: Activity }
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setSearchTerm("");
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COMMAND_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a command, equipment code, document, or AI task..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.moduleId);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/80 dark:hover:bg-blue-900/30 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>{item.title}</span>
                        <span className="px-1.5 py-0.2 text-[9px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 transition-colors" />
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No industrial assets or commands found for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span>
            Press <kbd className="font-semibold text-slate-600 dark:text-slate-300">Esc</kbd> to exit
          </span>
          <span className="font-mono">IndusMind AI Search Engine v1.0</span>
        </div>
      </div>
    </div>
  );
};
