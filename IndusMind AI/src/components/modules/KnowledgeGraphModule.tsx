import React, { useState } from "react";
import {
  Network,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Box,
  User,
  Shield,
  Layers,
  Sparkles,
  Database,
  Code2,
  Copy,
  Check,
  Play,
  Share2,
  Zap,
  BookOpen,
  Cpu,
  Wrench,
  AlertOctagon,
  Download,
  Terminal
} from "lucide-react";
import { GraphNode, GraphEdge } from "../../types";
import {
  NEO4J_NODE_TYPES,
  NEO4J_RELATIONSHIPS,
  NEO4J_FULL_CYPHER_SCHEMA,
  CYPHER_QUERIES_CATALOG,
  CypherQuerySample
} from "../../data/neo4jGraphData";

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const KnowledgeGraphModule: React.FC<KnowledgeGraphProps> = ({ nodes, edges }) => {
  const [activeTab, setActiveTab] = useState<"graph" | "nodes_and_relationships" | "neo4j_schema" | "cypher_playground">("graph");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(nodes[0] || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [nodeTypeFilter, setNodeTypeFilter] = useState("All");

  // Cypher playground state
  const [selectedCypherQuery, setSelectedCypherQuery] = useState<CypherQuerySample>(CYPHER_QUERIES_CATALOG[0]);
  const [customCypher, setCustomCypher] = useState(CYPHER_QUERIES_CATALOG[0].cypher);
  const [queryResultJson, setQueryResultJson] = useState<any | null>(null);
  const [isExecutingCypher, setIsExecutingCypher] = useState(false);
  const [copiedCypher, setCopiedCypher] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = nodeTypeFilter === "All" || node.type === nodeTypeFilter;
    return matchesSearch && matchesType;
  });

  const connectedEdges = selectedNode
    ? edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  const handleExecuteCypher = () => {
    setIsExecutingCypher(true);
    setTimeout(() => {
      setIsExecutingCypher(false);
      setQueryResultJson({
        status: "SUCCESS",
        query_time_ms: 12.4,
        records_matched: 8,
        graph_traversal: {
          nodes_scanned: 14,
          relationships_synapsed: 22,
          labels_matched: selectedCypherQuery.nodesInvolved
        },
        sample_returned_records: [
          {
            EquipmentTag: "P-101-A",
            RootCause: "Drive-End Bearing Race Pitting",
            IncidentTitle: "Emergency High-Vibration Trip on P-101-A",
            SOPCode: "SOP-2024-PUMP-OVERHAUL",
            StatutoryStandard: "OISD-STD-118",
            LeadEngineer: "Dr. Aris Thorne"
          },
          {
            EquipmentTag: "C-201-B",
            RootCause: "Impeller Blade Unbalance",
            IncidentTitle: "Hydrogen Compressor Pressure Fluctuation",
            SOPCode: "SOP-COMPRESSOR-MAINT-02",
            StatutoryStandard: "API 618 Standard",
            LeadEngineer: "Marcus Vance"
          }
        ]
      });
    }, 600);
  };

  const copyCypher = () => {
    navigator.clipboard.writeText(customCypher);
    setCopiedCypher(true);
    setTimeout(() => setCopiedCypher(false), 2000);
  };

  const copySchema = () => {
    navigator.clipboard.writeText(NEO4J_FULL_CYPHER_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "Equipment":
      case "Pump":
      case "Valve":
      case "Motor":
      case "Compressor":
        return "bg-amber-500 border-amber-600 text-amber-950";
      case "Plant":
        return "bg-blue-600 border-blue-700 text-white";
      case "Document":
      case "Manual":
      case "SOP":
        return "bg-emerald-600 border-emerald-700 text-white";
      case "Regulation":
        return "bg-rose-600 border-rose-700 text-white";
      case "Incident":
      case "Failure":
        return "bg-red-600 border-red-700 text-white";
      case "Technician":
      case "Engineer":
        return "bg-cyan-600 border-cyan-700 text-white";
      default:
        return "bg-slate-600 border-slate-700 text-white";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              PulseGraph™ Industrial Knowledge Graph & Neo4j Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Neural graph connecting Equipment, Technicians, Engineers, SOPs, Inspections, Failures & Regulations.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-800">
            14 Industrial Entity Labels
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-800">
            10 Typed Relationships
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setActiveTab("graph")}
          className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === "graph"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Interactive Canvas</span>
        </button>

        <button
          onClick={() => setActiveTab("nodes_and_relationships")}
          className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === "nodes_and_relationships"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>14 Node Types & Relationships</span>
        </button>

        <button
          onClick={() => setActiveTab("neo4j_schema")}
          className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === "neo4j_schema"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Neo4j Cypher Schema DDL</span>
        </button>

        <button
          onClick={() => setActiveTab("cypher_playground")}
          className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === "cypher_playground"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Cypher Query Playground</span>
        </button>
      </div>

      {/* Tab 1: Interactive Graph Canvas */}
      {activeTab === "graph" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Neural Canvas */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 relative min-h-[500px] flex flex-col justify-between overflow-hidden shadow-xl">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 z-10">
              <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search graph nodes..."
                  className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full font-mono"
                />
              </div>

              <div className="flex items-center space-x-1 text-xs">
                {["All", "Equipment", "Document", "Regulation", "Incident"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setNodeTypeFilter(type)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors font-mono cursor-pointer ${
                      nodeTypeFilter === type
                        ? "bg-purple-600 text-white"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas SVG Grid */}
            <div className="relative my-8 h-80 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {edges.map((edge) => {
                  const sourceNode = nodes.find((n) => n.id === edge.source);
                  const targetNode = nodes.find((n) => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const isSelected =
                    selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

                  return (
                    <line
                      key={edge.id}
                      x1={sourceNode.x || 200}
                      y1={sourceNode.y || 150}
                      x2={targetNode.x || 400}
                      y2={targetNode.y || 150}
                      stroke={isSelected ? "#a855f7" : "#334155"}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeDasharray={isSelected ? "4 2" : "none"}
                      className="transition-all"
                    />
                  );
                })}
              </svg>

              <div className="relative w-full h-full">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{ left: `${node.x || 100}px`, top: `${node.y || 100}px` }}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-3.5 py-2 rounded-xl text-xs font-extrabold border shadow-lg transition-all flex items-center space-x-2 z-10 cursor-pointer ${getNodeColor(
                        node.type
                      )} ${isSelected ? "ring-4 ring-purple-400 scale-110" : "hover:scale-105 opacity-90"}`}
                    >
                      <span>{node.label}</span>
                      <span className="text-[9px] font-mono opacity-80 uppercase">
                        ({node.type})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3 text-[10px] text-slate-400 z-10 font-mono">
              <span>Graph Legend:</span>
              <div className="flex items-center space-x-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Equipment</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Document</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Regulation</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Incident</span>
              </div>
            </div>
          </div>

          {/* Right Column: Node Details & Connected Edges */}
          <div className="lg:col-span-4">
            {selectedNode ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono uppercase">
                    {selectedNode.type}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedNode.label}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedNode.subText || "Connected industrial entity node"}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-500" /> Synapsed Relationships ({connectedEdges.length})
                  </h3>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {connectedEdges.map((edge) => {
                      const otherNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const otherNode = nodes.find((n) => n.id === otherNodeId);
                      return (
                        <div
                          key={edge.id}
                          onClick={() => otherNode && setSelectedNode(otherNode)}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-50/50 text-xs flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {otherNode?.label}
                            </div>
                            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">
                              Relationship: {edge.relationship}
                            </div>
                          </div>

                          <span className="text-[10px] text-slate-400 font-mono">
                            {otherNode?.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                Select a node in the graph canvas to inspect its relationships.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: 14 Node Types & Relationships Explainer */}
      {activeTab === "nodes_and_relationships" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              14 Core Node Types Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {NEO4J_NODE_TYPES.map((node) => (
                <div key={node.label} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-purple-700 dark:text-purple-300 font-mono">
                      :{node.label}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[9px] font-bold">
                      {node.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{node.description}</p>
                  <div className="p-2 bg-slate-900 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto">
                    {node.example}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600" />
              Typed Relationships Architecture
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-3 font-bold">Relationship Type</th>
                    <th className="py-2.5 px-3 font-bold">Source Node</th>
                    <th className="py-2.5 px-3 font-bold">Target Node</th>
                    <th className="py-2.5 px-3 font-bold font-sans">Description</th>
                    <th className="py-2.5 px-3 font-bold">Cypher Pattern</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {NEO4J_RELATIONSHIPS.map((rel) => (
                    <tr key={rel.type} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3 font-bold text-purple-600 dark:text-purple-400">:{rel.type}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{rel.sourceNode}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{rel.targetNode}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400 text-[11px]">{rel.description}</td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">{rel.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Neo4j Cypher Schema DDL */}
      {activeTab === "neo4j_schema" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                Neo4j Enterprise Graph DDL Schema
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Includes unique constraints, range indexes, node seeding & typed relationship definitions.
              </p>
            </div>

            <button
              onClick={copySchema}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? "Copied Cypher DDL!" : "Copy Full DDL Script"}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-900 rounded-xl text-xs text-emerald-400 overflow-x-auto max-h-[550px] leading-relaxed">
            {NEO4J_FULL_CYPHER_SCHEMA}
          </pre>
        </div>
      )}

      {/* Tab 4: Cypher Query Playground */}
      {activeTab === "cypher_playground" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query Selector List */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Sample Cypher Queries Catalog
            </span>
            <div className="space-y-2">
              {CYPHER_QUERIES_CATALOG.map((q) => {
                const isSelected = selectedCypherQuery.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedCypherQuery(q);
                      setCustomCypher(q.cypher);
                      setQueryResultJson(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-500 shadow-md"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold font-sans">{q.title}</div>
                    <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? "text-purple-100" : "text-slate-500"}`}>
                      {q.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cypher Code Editor & Execution Panel */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white">Cypher Query Terminal</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold">
                    Neo4j v5 Bolt Protocol
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyCypher}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                  >
                    {copiedCypher ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCypher ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handleExecuteCypher}
                    disabled={isExecutingCypher}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <Play className={`w-3.5 h-3.5 ${isExecutingCypher ? "animate-spin" : ""}`} />
                    <span>{isExecutingCypher ? "Executing..." : "Run Cypher Query"}</span>
                  </button>
                </div>
              </div>

              <textarea
                value={customCypher}
                onChange={(e) => setCustomCypher(e.target.value)}
                rows={7}
                className="w-full bg-slate-900 text-emerald-400 p-3 rounded-xl border border-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed"
              />

              <div className="text-[11px] font-sans text-slate-400">
                <strong>Query Explanation:</strong> {selectedCypherQuery.explanation}
              </div>
            </div>

            {/* Query Results */}
            {queryResultJson && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Query Executed in {queryResultJson.query_time_ms}ms
                  </span>
                  <span>{queryResultJson.records_matched} Records Returned</span>
                </div>
                <pre className="p-3 bg-slate-900 rounded-xl text-xs text-purple-300 overflow-x-auto max-h-60 leading-relaxed">
                  {JSON.stringify(queryResultJson, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

