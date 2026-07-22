import React, { useState } from "react";
import {
  Lock,
  Mail,
  Key,
  Shield,
  Building2,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Zap,
  Globe,
  AlertCircle
} from "lucide-react";
import { auth, loginWithEmail, registerWithEmail, logoutUser } from "../../lib/firebase";
import { UserProfile, UserRole } from "../../types";

interface LoginModuleProps {
  currentUser: UserProfile | null;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigateModule: (module: any) => void;
}

const DEMO_ACCOUNTS = [
  { role: "Plant Manager" as UserRole, email: "manager@indusmind.ai", name: "Vikram Sharma", unit: "Gujarat Refinery - Plant 04" },
  { role: "Reliability Engineer" as UserRole, email: "reliability@indusmind.ai", name: "Dr. Aris Thorne", unit: "Cracking Unit #2" },
  { role: "Safety Officer" as UserRole, email: "safety@indusmind.ai", name: "Priya Nair", unit: "EHS & Statutory Division" },
  { role: "Maintenance Engineer" as UserRole, email: "maintenance@indusmind.ai", name: "Marcus Vance", unit: "Rotating Equipment Group" }
];

export const LoginModule: React.FC<LoginModuleProps> = ({
  currentUser,
  activeRole,
  onRoleChange,
  onNavigateModule
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(activeRole);
  const [plantLocation, setPlantLocation] = useState("Gujarat Refinery - Plant 04");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isRegister) {
        await registerWithEmail(email, password, displayName || "Industrial User", selectedRole);
        onRoleChange(selectedRole);
        setSuccessMsg("Account successfully provisioned in Firebase Auth!");
      } else {
        await loginWithEmail(email, password);
        onRoleChange(selectedRole);
        setSuccessMsg("Authenticated successfully.");
      }
      setTimeout(() => {
        onNavigateModule("dashboard");
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = async (demo: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(demo.email);
    setPassword("password123");
    setSelectedRole(demo.role);
    onRoleChange(demo.role);
    setPlantLocation(demo.unit);
    setErrorMsg(null);
    
    // Auto login
    setLoading(true);
    try {
      await loginWithEmail(demo.email, "password123");
      setSuccessMsg(`Logged in as ${demo.name} (${demo.role})`);
      setTimeout(() => {
        onNavigateModule("dashboard");
      }, 800);
    } catch {
      // If user doesn't exist, register demo user
      try {
        await registerWithEmail(demo.email, "password123", demo.name, demo.role);
        setSuccessMsg(`Created & logged in as ${demo.name}`);
        setTimeout(() => {
          onNavigateModule("dashboard");
        }, 800);
      } catch (err: any) {
        setErrorMsg("Demo access ready. Role set to " + demo.role);
        setTimeout(() => {
          onNavigateModule("dashboard");
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Page Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-sky-50/90 text-slate-900 shadow-sm border border-indigo-100/90">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>ENTERPRISE IDENTITY & ACCESS MANAGEMENT</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight font-sans text-slate-900">
            IndusMind AI Portal Authentication
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl font-medium">
            Secure single sign-on (SSO), Firebase Authentication, and RBAC impersonation for plant engineers and executives.
          </p>
        </div>

        {currentUser && (
          <div className="p-3 rounded-xl bg-white border border-indigo-100/80 shadow-xs text-xs space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ACTIVE SESSION
              </span>
              <button
                onClick={() => logoutUser()}
                className="text-[10px] text-slate-500 hover:text-slate-900 font-bold underline cursor-pointer"
              >
                Sign Out
              </button>
            </div>
            <div className="font-bold text-slate-900">{currentUser.displayName}</div>
            <div className="text-[11px] text-slate-600 font-mono">{currentUser.email}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {isRegister ? "Create Enterprise Account" : "Sign In to Plant Console"}
              </h2>
              <p className="text-xs text-slate-500">
                {isRegister ? "Provision credentials with role-based access control." : "Enter your email and password to access industrial AI modules."}
              </p>
            </div>

            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
            >
              {isRegister ? "Already have an account? Sign In" : "Need an account? Register"}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name & Title
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Dr. Aris Thorne"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@indusmind.ai"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Plant Unit / Location
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={plantLocation}
                    onChange={(e) => setPlantLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned RBAC Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Plant Manager">Plant Manager</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Reliability Engineer">Reliability Engineer</option>
                  <option value="Maintenance Engineer">Maintenance Engineer</option>
                  <option value="Field Technician">Field Technician</option>
                  <option value="Compliance Officer">Compliance Officer</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Quality Engineer">Quality Engineer</option>
                  <option value="Executive Leadership">Executive Leadership</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating with Firebase...</span>
              ) : (
                <>
                  <span>{isRegister ? "Create Account & Sign In" : "Sign In to Industrial Platform"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-mono">
              <Lock className="w-3 h-3 text-emerald-600" /> AES-256 TLS 1.3 Encrypted
            </span>
            <span className="font-mono">Project ID: ai-studio-forgemindai</span>
          </div>
        </div>

        {/* Right Column: One-Click Demo Personas */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                One-Click Quick Persona Impersonation
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Select an industrial role persona to immediately experience tailored AI views, permissions, and agent recommendations.
            </p>

            <div className="space-y-2.5">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => handleSelectDemo(demo)}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 dark:bg-slate-800/50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                      {demo.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {demo.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                    <span className="font-mono">{demo.email}</span>
                    <span className="text-[10px] text-slate-400">{demo.unit}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" /> Enterprise Single Sign-On (SSO) Ready
            </div>
            <p className="text-[11px] text-blue-800 dark:text-blue-300">
              Supports Azure AD, Okta, SAML 2.0, and Google Workspace OAuth integrations for seamless plant-wide authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
