import React, { useState } from "react";
import {
  Search,
  Bell,
  Shield,
  Activity,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Building2,
  Lock,
  Menu,
  X,
  Globe,
  Check,
  Factory
} from "lucide-react";
import { UserProfile, UserRole } from "../types";

interface HeaderProps {
  currentUser: UserProfile | null;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCommandPalette: () => void;
  unreadCount: number;
  onToggleSidebarMobile?: () => void;
  onOpenBlueprint?: () => void;
}

const ROLES: UserRole[] = [
  "Plant Manager",
  "Operations Manager",
  "Reliability Engineer",
  "Maintenance Engineer",
  "Field Technician",
  "Compliance Officer",
  "Safety Officer",
  "Quality Engineer",
  "Executive Leadership"
];

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeRole,
  onRoleChange,
  onOpenAuth,
  onLogout,
  onOpenCommandPalette,
  unreadCount,
  onToggleSidebarMobile,
  onOpenBlueprint
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white text-slate-900 border-b border-slate-200 shadow-2xs transition-colors">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left Branding & System Status */}
        <div className="flex items-center space-x-6 shrink-0">
          <button
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/20">
              <Factory className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 tracking-wider text-base font-sans uppercase">
              INDUSMIND <span className="text-blue-600">AI</span>
            </span>

            <div className="hidden sm:flex items-center space-x-2 pl-4 border-l border-slate-200 text-xs text-slate-600 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold tracking-tight text-slate-700">ORION™ ORCHESTRATOR ONLINE</span>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Blueprint Specs Button */}
          {onOpenBlueprint && (
            <button
              onClick={onOpenBlueprint}
              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-xs font-bold border border-blue-200 transition-colors flex items-center space-x-1 cursor-pointer"
              title="View Hackathon Architecture Blueprint"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Blueprint Specs</span>
            </button>
          )}
          {/* Quick Search */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search (⌘K)</span>
          </button>

          {/* Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200 transition-colors"
            >
              <Shield className="w-3 h-3 text-blue-600" />
              <span>{activeRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-800">
                <div className="px-3 py-1 font-bold text-slate-400 uppercase tracking-widest text-[9px] font-mono border-b border-slate-100">
                  Select Role Persona
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onRoleChange(role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        activeRole === role ? "text-blue-600 font-bold bg-blue-50/60" : "text-slate-700"
                      }`}
                    >
                      <span>{role}</span>
                      {activeRole === role && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Version tag */}
          <span className="hidden xl:inline-block text-[11px] font-mono text-slate-400">
            v1.0-ENTERPRISE
          </span>

          {/* User Initials Badge / Avatar */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center hover:bg-blue-500 transition-colors shadow-2xs"
                title={currentUser.displayName}
              >
                {currentUser.displayName ? currentUser.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "JD"}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 rounded-lg bg-white shadow-xl border border-slate-200 p-3 z-50 text-xs space-y-2 text-slate-800">
                  <div className="pb-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{currentUser.displayName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full py-1.5 px-2 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold flex items-center justify-center space-x-1.5 transition-colors border border-rose-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-2xs"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

