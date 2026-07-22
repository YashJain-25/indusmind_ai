import React, { useState } from "react";
import {
  X,
  Sparkles,
  Layers,
  Database,
  Cpu,
  BrainCircuit,
  Workflow,
  Target,
  FileCode,
  ShieldCheck,
  Zap,
  TrendingUp,
  Copy,
  Check,
  Terminal,
  Server,
  Key,
  Settings,
  Users,
  Search,
  AlertTriangle,
  FileText,
  Scan,
  GitFork,
  Activity,
  Table,
  Link,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { SQL_SCHEMA_TABLES, FULL_POSTGRESQL_DDL_SCRIPT } from "../../data/sqlSchema";

interface HackathonBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonBlueprintModal: React.FC<HackathonBlueprintModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedMermaid, setCopiedMermaid] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<"modules" | "sql_schema" | "mermaid" | "flow">("sql_schema");
  const [searchTable, setSearchTable] = useState("");
  const [selectedTableName, setSelectedTableName] = useState<string | null>("users");

  if (!isOpen) return null;

  const mermaidCode = `graph TD
    subgraph Ingestion_Layer["1. Ingestion & Vision Parsing"]
      A1[Document Upload Engine] --> A2[Atlas Optical OCR Scanner]
      A1 --> A3[P&ID CAD Diagram Parser]
    end

    subgraph Extraction_Layer["2. Intelligence & Knowledge Mapping"]
      A2 & A3 --> B1[Industrial Entity Extractor]
      A2 & A3 --> B2[Metadata Auto-Indexer]
      B1 & B2 --> C1[(ForgeGraph™ Knowledge Graph)]
      B1 & B2 --> C2[(Milvus / Pinecone Vector DB)]
    end

    subgraph Core_RAG["3. Grounded AI Core"]
      C1 & C2 --> D1[Hybrid Graph-Vector RAG Engine]
      D1 --> D2[Gemini 2.5 Flash LLM Grounding]
    end

    subgraph Agentic_Layer["4. Autonomous Agent Swarm"]
      D2 --> E1[Compliance Agent OISD/ISO]
      D2 --> E2[Predictive Maintenance Agent]
      D2 --> E3[RCA Root Cause Agent]
    end

    subgraph Delivery_Layer["5. User Experience & Enterprise Control"]
      E1 & E2 & E3 --> F1[Unified Executive Dashboard]
      F1 --> F2[Auth & Role-Based Access RBAC]
      F1 --> F3[System Admin & Telemetry Panel]
    end`;

  const copyMermaid = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  const copySql = () => {
    navigator.clipboard.writeText(FULL_POSTGRESQL_DDL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const filteredTables = SQL_SCHEMA_TABLES.filter(t =>
    t.name.toLowerCase().includes(searchTable.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTable.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTable.toLowerCase())
  );

  const activeTable = SQL_SCHEMA_TABLES.find(t => t.name === selectedTableName) || SQL_SCHEMA_TABLES[0];

  const enterpriseModules = [
    {
      id: "doc-upload",
      title: "1. Document Upload",
      icon: FileText,
      tech: "Multi-Format Ingestion Adapter",
      badge: "Ingestion Layer",
      desc: "Ingests raw PDF manuals, P&ID CAD drawings, Excel maintenance logs, Word SOPs, paper scan images, and remote web URLs with drag-and-drop & cloud bucket sync."
    },
    {
      id: "ocr",
      title: "2. Optical Character Recognition (OCR)",
      icon: Scan,
      tech: "Atlas Vision™ Optical Pipeline",
      badge: "Vision Layer",
      desc: "Converts noisy scanned paper reports, faded maintenance logs, and multi-column industrial PDFs into searchable clean text with spatial coordinate mapping."
    },
    {
      id: "pid-parser",
      title: "3. P&ID Drawing Parser",
      icon: GitFork,
      tech: "Spatial Vector & Symbol Extractor",
      badge: "CAD Layer",
      desc: "Parses Piping & Instrumentation Diagrams to extract valve tags, line numbers, instrument loops, pump nodes, and pipeline connectivity topology."
    },
    {
      id: "entity-extraction",
      title: "4. Entity Extraction (NER)",
      icon: Cpu,
      tech: "Transformer & Regex Rule Extractor",
      badge: "NL Pipeline",
      desc: "Detects equipment IDs (P-101), asset tags, dates, maintenance technician names, process setpoints (8.8 mm/s), regulations (OISD-118), and failure modes."
    },
    {
      id: "metadata-extraction",
      title: "5. Metadata Extraction",
      icon: Database,
      tech: "Automated Tagging Engine",
      badge: "Cataloging Layer",
      desc: "Auto-indexes document revision numbers, approval authorities, document creation timestamps, asset criticalities, and plant location tags."
    },
    {
      id: "knowledge-graph",
      title: "6. Knowledge Graph (ForgeGraph™)",
      icon: Workflow,
      tech: "GNN Triple Mapping Engine",
      badge: "Graph Layer",
      desc: "Constructs semantic triples: (Asset: P-101) ➔ [HAS_PART] ➔ (Bearing: SKF-6314) ➔ [REFERENCED_IN] ➔ (SOP-2024-PUMP) for deep structural reasoning."
    },
    {
      id: "vector-db",
      title: "7. Vector Database",
      icon: Server,
      tech: "Milvus / Pinecone Embedding Index",
      badge: "Semantic Search",
      desc: "Generates 1536-dimensional vector embeddings for sub-second semantic retrieval across millions of technical paragraphs and historical work orders."
    },
    {
      id: "rag-pipeline",
      title: "8. Hybrid RAG Pipeline",
      icon: BrainCircuit,
      tech: "Graph-Augmented Retrieval Engine",
      badge: "Grounding Core",
      desc: "Combines vector similarity search with Knowledge Graph relational traversals to ensure zero-hallucination responses with exact page-level citations."
    },
    {
      id: "llm",
      title: "9. Large Language Model (LLM)",
      icon: Sparkles,
      tech: "Google Gemini 2.5 Flash SDK",
      badge: "Reasoning Core",
      desc: "High-speed multi-modal reasoning engine that translates complex industrial telemetry and document context into actionable engineering directives."
    },
    {
      id: "compliance-agent",
      title: "10. Compliance Agent",
      icon: ShieldCheck,
      tech: "Regulatory Statutory Scanner",
      badge: "Autonomous Agent",
      desc: "Scans active plant practices against OISD-118, ISO-55001, and OSHA standards, detecting regulatory gaps and auto-generating PDF audit reports."
    },
    {
      id: "maintenance-agent",
      title: "11. Predictive Maintenance Agent",
      icon: Activity,
      tech: "Vibration & Thermal Predictor",
      badge: "Autonomous Agent",
      desc: "Monitors real-time telemetry (8.8 mm/s vibration), calculates Remaining Useful Life (RUL), and triggers emergency work orders for component replacement."
    },
    {
      id: "rca-agent",
      title: "12. Root Cause Analysis (RCA) Agent",
      icon: AlertTriangle,
      tech: "Automated 5-Whys & Fishbone Engine",
      badge: "Autonomous Agent",
      desc: "Synthesizes incident history, sensor telemetry, and maintenance logs to automatically construct 5-Whys trees and Ishikawa Cause & Effect diagrams."
    },
    {
      id: "dashboard",
      title: "13. Executive Command Dashboard",
      icon: Layers,
      tech: "React 18 + Recharts Unified UI",
      badge: "User Layer",
      desc: "Centralized real-time operational brain presenting overall equipment effectiveness (OEE), live alert feeds, active work orders, and plant digital twins."
    },
    {
      id: "authentication",
      title: "14. Authentication & Security (RBAC)",
      icon: Key,
      tech: "Firebase Auth & Role-Based Rules",
      badge: "Security Layer",
      desc: "Enterprise SSO, OAuth, and strict Role-Based Access Control enforcing granular view/edit permissions across Plant Managers, Reliability Engineers, & Technicians."
    },
    {
      id: "admin-panel",
      title: "15. Admin & Telemetry Control Panel",
      icon: Settings,
      tech: "System Configuration Suite",
      badge: "Admin Layer",
      desc: "Provides total system oversight: vector re-indexing controls, graph node inspection, system prompt tuning, user audit logs, and API key management."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden font-sans">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-slate-50 text-slate-900 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg border border-blue-200">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-wide flex items-center gap-2 text-slate-900">
                IndusMind AI Enterprise Architecture
                <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 font-mono rounded border border-emerald-200 font-bold">
                  Production Specification
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Unified Industrial Knowledge Intelligence & Operations Brain
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between shrink-0 font-mono text-xs flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("sql_schema")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === "sql_schema"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>14-Table SQL Schema</span>
            </button>

            <button
              onClick={() => setActiveTab("modules")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === "modules"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>15 Enterprise Modules</span>
            </button>

            <button
              onClick={() => setActiveTab("mermaid")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === "mermaid"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Mermaid Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab("flow")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === "flow"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-200"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>7-Stage RAG Pipeline</span>
            </button>
          </div>

          <button
            onClick={copySql}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] flex items-center space-x-1.5 transition-all cursor-pointer border border-slate-700 shadow-2xs"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? "Copied DDL Script!" : "Export Full SQL DDL"}</span>
          </button>
        </div>

        {/* Tab 0: 14-Table SQL Database Schema Explorer */}
        {activeTab === "sql_schema" && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50">
            {/* Left Sidebar: Table List */}
            <div className="w-full md:w-64 bg-white border-r border-slate-200 p-3 flex flex-col shrink-0 overflow-y-auto space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter 14 tables..."
                  value={searchTable}
                  onChange={(e) => setSearchTable(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono pt-1">
                Database Tables ({filteredTables.length}/14)
              </div>

              <div className="space-y-1">
                {filteredTables.map((tbl) => {
                  const isSelected = selectedTableName === tbl.name;
                  return (
                    <button
                      key={tbl.name}
                      onClick={() => setSelectedTableName(tbl.name)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer font-mono ${
                        isSelected
                          ? "bg-blue-600 text-white font-bold shadow-2xs"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Table className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-blue-600"}`} />
                        <span className="truncate">{tbl.name}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ${isSelected ? "bg-blue-700 text-blue-100" : "bg-slate-100 text-slate-500"}`}>
                        {tbl.columns.length} col
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Table Details & Columns Inspector */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Table className="w-5 h-5 text-blue-600" />
                      <h3 className="text-base font-extrabold text-slate-900 font-mono">
                        public.{activeTable.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-bold">
                        {activeTable.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{activeTable.description}</p>
                  </div>

                  <button
                    onClick={copySql}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold font-mono transition-colors flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Table DDL</span>
                  </button>
                </div>

                {/* Columns Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <th className="py-2 px-3 font-bold">Column Name</th>
                        <th className="py-2 px-3 font-bold">Data Type</th>
                        <th className="py-2 px-3 font-bold">Constraints</th>
                        <th className="py-2 px-3 font-bold font-sans">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {activeTable.columns.map((col) => (
                        <tr key={col.name} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-3 font-bold text-blue-900">{col.name}</td>
                          <td className="py-2 px-3 text-purple-700 font-semibold">{col.type}</td>
                          <td className="py-2 px-3 text-slate-500 text-[11px]">{col.constraints}</td>
                          <td className="py-2 px-3 font-sans text-slate-600 text-[11px]">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Indexes & FKs Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] font-mono flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Performance Indexes
                    </span>
                    {activeTable.indexes.length > 0 ? (
                      <div className="space-y-1 font-mono text-[10px] text-slate-600">
                        {activeTable.indexes.map((idx, i) => (
                          <div key={i} className="bg-white p-1 rounded border border-slate-200 truncate">{idx}</div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400">Default primary key index</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] font-mono flex items-center gap-1">
                      <Link className="w-3.5 h-3.5 text-blue-500" /> Foreign Keys
                    </span>
                    {activeTable.foreignKeys.length > 0 ? (
                      <div className="space-y-1 font-mono text-[10px] text-slate-600">
                        {activeTable.foreignKeys.map((fk, i) => (
                          <div key={i} className="bg-white p-1 rounded border border-slate-200 truncate">{fk}</div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400">No external foreign key dependencies</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: 15 Enterprise Modules Breakdown */}
        {activeTab === "modules" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 text-slate-800 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {enterpriseModules.map((mod) => {
                const IconComp = mod.icon;
                return (
                  <div
                    key={mod.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 hover:border-blue-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          {mod.badge}
                        </span>
                        <IconComp className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{mod.title}</h4>
                      <p className="text-[10px] font-mono text-slate-400 mb-1">{mod.tech}</p>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{mod.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Mermaid Architecture Diagram & Code */}
        {activeTab === "mermaid" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900 text-slate-100 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-white">Mermaid.js System Architecture Source</span>
              </div>
              <button
                onClick={copyMermaid}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
              >
                {copiedMermaid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMermaid ? "Copied Diagram Code!" : "Copy Mermaid Code"}</span>
              </button>
            </div>

            {/* Rendered Visual Diagram Summary Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                System Topology Flow Preview
              </span>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2 text-[11px] text-slate-300">
                <p>⚡ <strong>Ingestion:</strong> Upload Adapter ➔ Optical OCR Scanner ➔ P&ID CAD Parser</p>
                <p>⚡ <strong>Intelligence:</strong> Entity Extractor + Metadata Indexer ➔ ForgeGraph™ & Vector DB</p>
                <p>⚡ <strong>Core RAG:</strong> Hybrid Retrieval Engine ➔ Gemini 2.5 Flash Grounded LLM</p>
                <p>⚡ <strong>Agents:</strong> Compliance Agent + Maintenance Agent + RCA Root Cause Agent</p>
                <p>⚡ <strong>Delivery:</strong> Executive Dashboard + RBAC Authentication + Admin Control Panel</p>
              </div>
            </div>

            {/* Mermaid Code Snippet Box */}
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
              {mermaidCode}
            </pre>
          </div>
        )}

        {/* Tab 3: 7-Stage RAG Pipeline */}
        {activeTab === "flow" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 text-slate-800 text-xs">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs font-mono text-blue-700">
                End-to-End RAG Data Lifecycle Flow
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 font-mono text-xs">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Documents Ingestion</h4>
                    <p className="text-slate-600 text-[11px]">Inbound multi-format file ingestion (PDF, DWG, CSV, DOCX) via drag-and-drop or batch cloud sync.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 font-mono text-xs">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900">OCR & P&ID Parsing</h4>
                    <p className="text-slate-600 text-[11px]">Atlas Vision™ extracts spatial text coordinates, diagram nodes, and instrument tags from engineering prints.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 font-mono text-xs">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Entity & Metadata Extraction</h4>
                    <p className="text-slate-600 text-[11px]">NER models identify Equipment IDs (P-101), vibration thresholds (8.8 mm/s), regulations, and maintenance dates.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 font-mono text-xs">4</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Knowledge Graph Construction</h4>
                    <p className="text-slate-600 text-[11px]">ForgeGraph™ links asset tags to parts, failure modes, and SOP manuals to form an interconnected enterprise web.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 font-mono text-xs">5</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Vector Database Indexing</h4>
                    <p className="text-slate-600 text-[11px]">Stores 1536-dimensional embeddings for rapid semantic similarity search and retrieval.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 font-mono text-xs">6</div>
                  <div>
                    <h4 className="font-bold text-slate-900">LLM Grounding (RAG)</h4>
                    <p className="text-slate-600 text-[11px]">Gemini 2.5 Flash synthesizes retrieved graph triples and document chunks with zero hallucination.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 font-mono text-xs">7</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Chatbot & Agent Delivery</h4>
                    <p className="text-slate-600 text-[11px]">Delivers cited technical answers, triggers emergency work orders, and outputs audit reports to engineers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-slate-500">
            IndusMind AI Architecture • Powered by Google Gemini 2.5 Flash
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
