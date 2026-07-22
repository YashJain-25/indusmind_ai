import React, { useState } from "react";
import { Lock, Shield, User, LogIn, Sparkles, X, CheckCircle2 } from "lucide-react";
import { UserRole } from "../types";
import { loginDemoUser, loginWithGoogle } from "../lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
}

const PERSONAS: { role: UserRole; title: string; desc: string; color: string }[] = [
  { role: "Plant Manager", title: "Plant Operations Leader", desc: "Full plant oversight, KPI dashboards, and high-level downtime metrics.", color: "from-blue-600 to-indigo-600" },
  { role: "Reliability Engineer", title: "Reliability & Asset Engineer", desc: "FFT vibration spectrums, RUL countdowns, and failure mode analysis.", color: "from-cyan-600 to-blue-600" },
  { role: "Maintenance Engineer", title: "Maintenance & Repair Lead", desc: "Work order management, spare parts checks, and overhaul SOPs.", color: "from-amber-600 to-orange-600" },
  { role: "Field Technician", title: "Field Technician (Scout™)", desc: "Mobile QR scanner, voice notes, and quick safety checklists.", color: "from-emerald-600 to-teal-600" },
  { role: "Compliance Officer", title: "Statutory & Safety Auditor", desc: "Factory Act, OISD-118, PESO standards, and audit evidence matrix.", color: "from-red-600 to-rose-600" },
  { role: "Executive Leadership", title: "Executive Leadership", desc: "Strategic enterprise reports, ROI, and cross-plant health benchmarks.", color: "from-fuchsia-600 to-pink-600" }
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Plant Manager");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await loginDemoUser(selectedRole);
      onLoginSuccess(selectedRole);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await loginWithGoogle();
      onLoginSuccess(selectedRole);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Google Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-slate-50 text-slate-900 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Enterprise Authentication</h2>
              <p className="text-xs text-slate-600 font-medium">Select your industrial persona & connect to Firestore</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
              1. Choose Enterprise Role Persona
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERSONAS.map((p) => {
                const isSelected = selectedRole === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => setSelectedRole(p.role)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute top-3 right-3" />
                    )}
                    <div className="font-bold text-xs text-slate-900 dark:text-white pr-5">{p.role}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {p.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              2. Authenticate to IndusMind AI
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDemoSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? "Signing In..." : `Enter as ${selectedRole}`}</span>
              </button>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-200/80 dark:border-slate-700 transition-all disabled:opacity-50"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Synced with Firestore Database</span>
          <span className="font-mono">Security Level: Enterprise SSO</span>
        </div>
      </div>
    </div>
  );
};
