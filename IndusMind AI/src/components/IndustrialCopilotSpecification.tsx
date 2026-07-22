import React, { useState } from "react";
import {
  Bot,
  Terminal,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Play,
  FileText,
  Search,
  BookOpen,
  Wrench,
  ShieldAlert,
  History,
  Package,
  Activity,
  ChevronRight,
  ExternalLink,
  Code2,
  Sliders,
  Cpu,
  HelpCircle,
  RefreshCw,
  Zap,
  ArrowRight
} from "lucide-react";
import {
  INDUSTRIAL_SYSTEM_PROMPT,
  PROMPT_ENGINEERING_STRATEGY,
  CONVERSATION_FLOW_STEPS,
  FALLBACK_RESPONSES,
  DOMAIN_EXAMPLES,
  DomainQueryExample
} from "../data/copilotDesignData";

export const IndustrialCopilotSpecification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"system-prompt" | "prompt-engineering" | "flow" | "domains" | "fallbacks" | "confidence">("domains");
  const [selectedDomainId, setSelectedDomainId] = useState<string>("ex-maint");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [modelChoice, setModelChoice] = useState<string>("gemini-2.5-flash");
  const [temperature, setTemperature] = useState<number>(0.0);

  // Active Domain Example
  const currentDomainExample = DOMAIN_EXAMPLES.find((d) => d.id === selectedDomainId) || DOMAIN_EXAMPLES[0];

  const copySystemPrompt = () => {
    navigator.clipboard.writeText(INDUSTRIAL_SYSTEM_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "Maintenance": return Wrench;
      case "Safety": return ShieldAlert;
      case "Equipment History": return History;
      case "SOP Lookup": return FileText;
      case "Manual Lookup": return BookOpen;
      case "Inspection History": return Search;
      case "Previous Failures": return AlertTriangle;
      case "Spare Parts": return Package;
      case "Root Cause Analysis": return Activity;
      default: return Bot;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white font-mono uppercase tracking-wider">
              Industrial AI Copilot Architecture
            </span>
            <span className="text-xs text-slate-500 font-mono">Grounding & Citation Engine</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Orion™ Industrial Reliability & Safety Copilot Design
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            System prompts, 9 domain query handlers, prompt engineering strategies, fallback rules, and citation engine.
          </p>
        </div>

        {/* Model Selection Badge */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-mono">
          <Cpu className="w-4 h-4 text-indigo-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Model:</span>
          <select
            value={modelChoice}
            onChange={(e) => setModelChoice(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-800 dark:text-slate-200 cursor-pointer outline-none"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Default)</option>
            <option value="gpt-4o">GPT-4o Enterprise</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          </select>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("domains")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "domains"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>9 Domain Query Demonstrator</span>
        </button>

        <button
          onClick={() => setActiveTab("system-prompt")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "system-prompt"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>System Prompt & Directives</span>
        </button>

        <button
          onClick={() => setActiveTab("prompt-engineering")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "prompt-engineering"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Prompt Engineering Strategy</span>
        </button>

        <button
          onClick={() => setActiveTab("flow")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "flow"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Conversation Flow Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab("fallbacks")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "fallbacks"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Fallback System & Safety Holds</span>
        </button>

        <button
          onClick={() => setActiveTab("confidence")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "confidence"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Confidence & Citations Engine</span>
        </button>
      </div>

      {/* TAB 1: 9 Domain Query Demonstrator */}
      {activeTab === "domains" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Select Industrial Query Domain (9 Required Modules)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
              {DOMAIN_EXAMPLES.map((item) => {
                const Icon = getDomainIcon(item.domain);
                const isSelected = selectedDomainId === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDomainId(item.id)}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between h-20 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300"
                        : "bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-indigo-600 dark:text-indigo-400"}`} />
                    <span className="text-[11px] font-bold leading-tight mt-1 truncate w-full">{item.domain}</span>
                    <span className={`text-[9px] font-mono ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                      {item.confidenceScore}% Score
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Domain Query & Grounded Response View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Query & Retrieved Document Chunks */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px] font-extrabold font-mono uppercase">
                    Domain: {currentDomainExample.domain}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Grounded ({currentDomainExample.confidenceScore}%)
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    User Input Query
                  </label>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    "{currentDomainExample.query}"
                  </p>
                </div>

                {/* Retrieved Context Chunks */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
                    <span>Retrieved Document Chunks</span>
                    <span className="text-indigo-600 dark:text-indigo-400">Hybrid Search</span>
                  </label>

                  {currentDomainExample.retrievedContext.map((chunk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{chunk.sourceDoc}</span>
                        <span>Page #{chunk.pageNumber}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        "{chunk.excerpt}"
                      </p>
                      {chunk.equipmentTag && (
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-mono font-bold">
                          Tag: {chunk.equipmentTag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Copilot Output with Citations & Action Triggers */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-xs font-mono text-white">Orion™ AI Copilot Grounded Synthesis</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold">
                    Temperature: {temperature.toFixed(1)}
                  </span>
                </div>

                <div className="text-xs text-slate-200 space-y-2 whitespace-pre-line leading-relaxed">
                  {currentDomainExample.copilotResponse}
                </div>

                {/* Inline Citations Registry */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Source Citations & Audit Trace
                  </span>
                  <div className="space-y-1.5">
                    {currentDomainExample.citations.map((cit, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                      >
                        <div>
                          <div className="font-bold text-indigo-400 font-mono text-[11px]">{cit.title}</div>
                          <div className="text-[10px] text-slate-400">{cit.section} (Page {cit.page})</div>
                        </div>
                        <div className="px-2.5 py-1 rounded bg-slate-800 text-[10px] text-slate-300 italic font-mono truncate max-w-xs">
                          "{cit.verbatimQuote}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Field Actions */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Automated Field Actions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentDomainExample.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-800 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{act}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: System Prompt & Directives */}
      {activeTab === "system-prompt" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
              Production Industrial System Prompt Specification
            </h3>
            <button
              onClick={copySystemPrompt}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow-sm"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? "Copied System Prompt" : "Copy Prompt Text"}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto max-h-[500px]">
            <pre className="whitespace-pre-wrap">{INDUSTRIAL_SYSTEM_PROMPT}</pre>
          </div>
        </div>
      )}

      {/* TAB 3: Prompt Engineering Strategy */}
      {activeTab === "prompt-engineering" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMPT_ENGINEERING_STRATEGY.map((strat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{strat.title}</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{strat.description}</p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-indigo-600 dark:text-indigo-300">
                {strat.example}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Conversation Flow Architecture */}
      {activeTab === "flow" && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
            5-Stage Real-Time Copilot Conversation Architecture
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {CONVERSATION_FLOW_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px] font-extrabold font-mono">
                    Stage #{step.step}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 leading-snug">{step.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-500 self-end mt-2 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Fallback System */}
      {activeTab === "fallbacks" && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
            Industrial Fallback & Safety Hold Protocol
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FALLBACK_RESPONSES.map((fb, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3"
              >
                <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-xs font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{fb.condition}</span>
                </div>
                <p className="text-[11px] text-amber-900 dark:text-amber-200 font-semibold">{fb.trigger}</p>
                <p className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {fb.response}
                </p>
                <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  Automated Action: {fb.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Confidence & Citations Engine */}
      {activeTab === "confidence" && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono uppercase">
            Faithfulness & Grounding Confidence Scoring Formula
          </h3>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-3">
            <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              Overall Score = (Vector Similarity × 0.20) + (Reranker Score × 0.30) + (Claim Grounding Ratio × 0.50)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400">Vector Similarity (20%)</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Cosine Distance Metric</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400">Cross-Encoder Rerank (30%)</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Cohere Rerank v3.5 Score</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400">Claim Grounding Ratio (50%)</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Verbatim Citation Matches</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
