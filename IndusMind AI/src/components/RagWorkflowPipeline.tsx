import React, { useState } from "react";
import {
  FileText,
  Scan,
  Cpu,
  Share2,
  Database,
  BrainCircuit,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  Info
} from "lucide-react";

interface PipelineStep {
  id: string;
  number: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  tech: string;
  status: "Active" | "Optimized" | "Ready";
  details: string;
}

export const RagWorkflowPipeline: React.FC<{ isProcessing?: boolean }> = ({ isProcessing }) => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const steps: PipelineStep[] = [
    {
      id: "documents",
      number: 1,
      label: "Documents",
      sublabel: "Ingestion Engine",
      icon: FileText,
      tech: "PDF / DWG / CSV / Word Parser",
      status: "Active",
      details: "Raw multi-format file ingestion supporting multi-page SOPs, CAD drawings, and sensor logs."
    },
    {
      id: "ocr",
      number: 2,
      label: "OCR",
      sublabel: "Atlas Optical Scan",
      icon: Scan,
      tech: "Atlas Vision™ OCR Engine",
      status: "Optimized",
      details: "Optical character and spatial diagram layout parsing for scanned engineering prints."
    },
    {
      id: "entity-extraction",
      number: 3,
      label: "Entity Extraction",
      sublabel: "Tag & Param NER",
      icon: Cpu,
      tech: "Regex & Transformer NER",
      status: "Active",
      details: "Automated extraction of Equipment IDs (e.g., P-101), Setpoints (8.8 mm/s), and Maintenance SOPs."
    },
    {
      id: "knowledge-graph",
      number: 4,
      label: "Knowledge Graph",
      sublabel: "Entity Relationship Mapping",
      icon: Share2,
      tech: "ForgeGraph™ GNN Engine",
      status: "Optimized",
      details: "Establishes contextual links between asset IDs, failure modes, replacement parts, and manuals."
    },
    {
      id: "vector-database",
      number: 5,
      label: "Vector Database",
      sublabel: "Semantic Index",
      icon: Database,
      tech: "Milvus / Pinecone Embeddings",
      status: "Ready",
      details: "Generates high-dimensional vector embeddings for sub-second semantic similarity searching."
    },
    {
      id: "llm-rag",
      number: 6,
      label: "LLM (RAG)",
      sublabel: "Grounded Synthesis",
      icon: BrainCircuit,
      tech: "Gemini 2.5 Flash + Grounding",
      status: "Active",
      details: "Retrieval-Augmented Generation grounding model responses strictly in enterprise technical documentation."
    },
    {
      id: "chatbot",
      number: 7,
      label: "Chatbot",
      sublabel: "Orion™ Assistant",
      icon: MessageSquare,
      tech: "Interactive Orion AI UI",
      status: "Active",
      details: "Conversational interface delivering root-cause diagnoses, cited sources, and emergency work orders."
    }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 font-mono">
            Industrial RAG Pipeline Architecture
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-200">
            End-to-End Enterprise Flow
          </span>
        </div>
        {isProcessing && (
          <div className="flex items-center space-x-1.5 text-[11px] text-blue-600 font-mono font-bold animate-pulse">
            <Scan className="w-3.5 h-3.5" />
            <span>Processing Query Through Pipeline...</span>
          </div>
        )}
      </div>

      {/* 7-Step Sequential Flow Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          const isSelected = selectedStep === step.id;

          return (
            <div key={step.id} className="relative group">
              <button
                onClick={() => setSelectedStep(isSelected ? null : step.id)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-full ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300"
                    : isProcessing && idx === 5
                    ? "bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-200 animate-pulse"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200/90 text-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-blue-700 text-white"
                          : "bg-slate-200/80 text-slate-600"
                      }`}
                    >
                      0{step.number}
                    </span>
                    <IconComponent
                      className={`w-4 h-4 ${
                        isSelected ? "text-white" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <p className="text-xs font-bold truncate leading-snug">{step.label}</p>
                  <p
                    className={`text-[10px] truncate ${
                      isSelected ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {step.sublabel}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[9px] font-mono">
                  <span
                    className={
                      isSelected ? "text-blue-100" : "text-slate-400"
                    }
                  >
                    Stage {step.number}
                  </span>
                  <ChevronRight
                    className={`w-3 h-3 ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}
                  />
                </div>
              </button>

              {/* Arrow Connector between steps (for large screens) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none text-slate-300">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Step Technical Details Drawer */}
      {selectedStep && (
        <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start space-x-3 animate-in fade-in duration-150">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            {steps.filter((s) => s.id === selectedStep).map((s) => (
              <div key={s.id}>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-900">{s.number}. {s.label} ({s.sublabel})</span>
                  <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-mono text-[10px] font-bold">
                    Engine: {s.tech}
                  </span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">{s.details}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSelectedStep(null)}
            className="text-blue-400 hover:text-blue-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
