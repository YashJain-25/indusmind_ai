import React, { useState } from "react";
import {
  FileText,
  Scan,
  Scissors,
  Tag,
  Cpu,
  Database,
  Search,
  Sliders,
  Layers,
  BrainCircuit,
  FileCheck,
  ShieldCheck,
  Copy,
  Check,
  Code2,
  Play,
  Terminal,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { PRODUCTION_RAG_STEPS, RagStepInfo } from "../data/ragPipelineData";

export const ProductionRagPipelineExplorer: React.FC = () => {
  const [selectedStepId, setSelectedStepId] = useState<string>("pdf-loader");
  const [codeLanguage, setCodeLanguage] = useState<"TS" | "Py">("TS");
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Interactive Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<Array<{ step: string; message: string; durationMs: number }>>([]);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const currentStep = PRODUCTION_RAG_STEPS.find((s) => s.id === selectedStepId) || PRODUCTION_RAG_STEPS[0];

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText": return FileText;
      case "Scan": return Scan;
      case "Scissors": return Scissors;
      case "Tag": return Tag;
      case "Cpu": return Cpu;
      case "Database": return Database;
      case "Search": return Search;
      case "Sliders": return Sliders;
      case "Layers": return Layers;
      case "BrainCircuit": return BrainCircuit;
      case "FileCheck": return FileCheck;
      case "ShieldCheck": return ShieldCheck;
      default: return Sparkles;
    }
  };

  const copyLangChainCode = () => {
    const code = codeLanguage === "TS" ? currentStep.langchainCodeTS : currentStep.langchainCodePy;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunPipelineSimulation = async () => {
    setIsSimulating(true);
    setSimulationLogs([]);
    setSimulationComplete(false);

    const stepsToSimulate = [
      { step: "1. PDF Loader", message: "Parsed 48 pages from PND_CDU_TrainA_P101.pdf", durationMs: 120 },
      { step: "2. OCR Engine", message: "Atlas Vision OCR processed 4 scanned P&ID diagrams (99.4% confidence)", durationMs: 210 },
      { step: "3. Chunking Strategy", message: "Generated 142 semantic chunks (chunk_size: 800, overlap: 150)", durationMs: 90 },
      { step: "4. Metadata Extraction", message: "Tagged equipment: ['P-101-A', 'TK-204-B'], SOPs: ['SOP-2024-PUMP']", durationMs: 180 },
      { step: "5. Vector Embedding", message: "Computed 1536-dim embeddings via Google text-embedding-004", durationMs: 140 },
      { step: "6. Vector Database", message: "Indexed 142 vectors in Pinecone namespace 'plant-assets-v1'", durationMs: 110 },
      { step: "7. Hybrid Retriever", message: "Ensemble search (BM25 + Dense Vector) retrieved top 20 candidate chunks", durationMs: 160 },
      { step: "8. Cross-Encoder Re-ranker", message: "Cohere Rerank v3 narrowed candidates down to top 4 highest relevance chunks", durationMs: 230 },
      { step: "9. Context Building", message: "Assembled 1,850 token prompt window with strict grounding directives", durationMs: 70 },
      { step: "10. Gemini 2.5 Flash", message: "LLM generated grounded synthesis at temperature=0.0", durationMs: 380 },
      { step: "11. Source Citation", message: "Mapped 3 inline citations to PND_CDU_P101.pdf (Page 4, Section 2.1)", durationMs: 110 },
      { step: "12. Confidence Scoring", message: "Faithfulness Score: 96.4% (HIGH CONFIDENCE) - Passed safety gate", durationMs: 80 }
    ];

    for (const item of stepsToSimulate) {
      await new Promise((r) => setTimeout(r, item.durationMs + 60));
      setSimulationLogs((prev) => [...prev, item]);
    }

    setIsSimulating(false);
    setSimulationComplete(true);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Ingestion & Prep":
        return "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300";
      case "Embedding & Indexing":
        return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300";
      case "Retrieval & Ranking":
        return "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300";
      case "Generation & Citation":
        return "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white font-mono uppercase tracking-wider">
              Production RAG Architecture
            </span>
            <span className="text-xs text-slate-500 font-mono">12 Sequential Stages</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Production-Grade RAG Pipeline & LangChain Specification
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            End-to-end architectural design, step-by-step explanations, best practices, and copyable LangChain code.
          </p>
        </div>

        <button
          onClick={handleRunPipelineSimulation}
          disabled={isSimulating}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md shadow-purple-500/20 cursor-pointer transition-all shrink-0"
        >
          <Play className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
          <span>{isSimulating ? "Simulating 12 Steps..." : "Run Live 12-Step Pipeline Simulation"}</span>
        </button>
      </div>

      {/* 12 Steps Grid Navigator */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-500" /> Select Pipeline Stage (12 Stages)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRODUCTION_RAG_STEPS.map((step) => {
            const Icon = getStepIcon(step.iconName);
            const isSelected = selectedStepId === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-20 cursor-pointer ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300"
                    : "bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-purple-700 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    #{step.stepNumber}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-purple-600 dark:text-purple-400"}`} />
                </div>
                <div className="text-[11px] font-bold truncate leading-tight mt-1">{step.title.replace(/^\d+\.\s*/, "")}</div>
                <div className={`text-[9px] truncate font-mono ${isSelected ? "text-purple-100" : "text-slate-500"}`}>
                  {step.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Selected Step Technical Deep-Dive & LangChain Implementation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Conceptual Breakdown & Best Practices */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${getCategoryBadgeClass(currentStep.category)}`}>
                  {currentStep.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">Stage #{currentStep.stepNumber} of 12</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {currentStep.title}
              </h3>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-0.5">
                {currentStep.shortDesc}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Architectural Breakdown
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {currentStep.detailedExplanation}
              </p>
            </div>

            {/* Key Technologies Tags */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Key Stack Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentStep.keyTechnologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-bold shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Production Best Practices */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Production Best Practices
              </h4>
              <ul className="space-y-1.5">
                {currentStep.bestPractices.map((bp, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Pitfalls */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Common Anti-Patterns & Pitfalls
              </h4>
              <ul className="space-y-1.5">
                {currentStep.commonPitfalls.map((cp, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{cp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Complete LangChain Implementation Code */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-xs">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white">LangChain Implementation</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                  {codeLanguage === "TS" ? "TypeScript SDK" : "Python SDK"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
                  <button
                    onClick={() => setCodeLanguage("TS")}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                      codeLanguage === "TS" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    TypeScript
                  </button>
                  <button
                    onClick={() => setCodeLanguage("Py")}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                      codeLanguage === "Py" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Python
                  </button>
                </div>

                <button
                  onClick={copyLangChainCode}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                </button>
              </div>
            </div>

            <pre className="p-3 bg-slate-900 rounded-xl text-xs text-emerald-400 overflow-x-auto max-h-[480px] leading-relaxed">
              {codeLanguage === "TS" ? currentStep.langchainCodeTS : currentStep.langchainCodePy}
            </pre>
          </div>

          {/* Live Execution Logs Drawer */}
          {(isSimulating || simulationComplete) && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Live 12-Step Execution Logs</span>
                </div>
                {simulationComplete && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
                    100% Executed
                  </span>
                )}
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto text-xs">
                {simulationLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[11px] leading-snug">
                    <span className="text-purple-400 shrink-0 font-bold">[{log.step}]</span>
                    <span className="text-slate-300 flex-1">{log.message}</span>
                    <span className="text-slate-500 shrink-0 text-[10px]">{log.durationMs}ms</span>
                  </div>
                ))}
                {isSimulating && (
                  <div className="flex items-center space-x-2 text-purple-400 animate-pulse text-xs pt-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing pipeline stage...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
