import React, { useState, useRef } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Sparkles,
  Tag,
  ShieldAlert,
  Search,
  Eye,
  Plus,
  RefreshCw,
  Paperclip
} from "lucide-react";
import { IndustrialDocument } from "../../types";
import { RagWorkflowPipeline } from "../RagWorkflowPipeline";
import { DocumentPipelineExtractor } from "./DocumentPipelineExtractor";
import { ProductionRagPipelineExplorer } from "../ProductionRagPipelineExplorer";

interface DocumentModuleProps {
  documents: IndustrialDocument[];
  onAddDocument: (doc: IndustrialDocument) => void;
}

export const DocumentIntelligenceModule: React.FC<DocumentModuleProps> = ({
  documents,
  onAddDocument
}) => {
  const [selectedDoc, setSelectedDoc] = useState<IndustrialDocument | null>(documents[0] || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isExtracting, setIsExtracting] = useState(false);

  // Manual & File Upload state
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState<any>("SOP");
  const [docContent, setDocContent] = useState("");
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState<string>("2.4 MB");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocTitle(file.name);
      setFileSizeStr(formatFileSize(file.size));
      const reader = new FileReader();
      reader.onload = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.extractedEntities.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "All" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSimulateIngest = async () => {
    if (!docTitle.trim()) return;
    setIsExtracting(true);

    try {
      const res = await fetch("/api/ai/document-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentName: docTitle,
          fileType: "pdf",
          content: docContent,
          imageBase64: fileBase64
        })
      });

      const extracted = await res.json();

      const newDoc: IndustrialDocument = {
        id: `doc-${Date.now()}`,
        title: extracted.documentTitle || docTitle,
        category: docCategory,
        fileType: "pdf",
        status: "Ingested & Indexed",
        extractedEntities: extracted.entities?.map((e: any) => e.name) || ["P-101", "Overhaul Checklist"],
        summary: extracted.summary || "Extracted industrial manual SOP parameters.",
        confidence: extracted.confidenceScore || 0.98,
        uploadedBy: "CurrentUser",
        uploadedAt: new Date().toISOString().split("T")[0],
        size: fileSizeStr,
        pageCount: 1
      };

      onAddDocument(newDoc);
      setSelectedDoc(newDoc);
      setDocTitle("");
      setDocContent("");
      setFileBase64(null);
    } catch (err) {
      console.error("Document extraction error:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Atlas Extract™ Universal Document Intelligence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              OCR, Vision & Entity Extraction for Engineering Drawings, P&IDs, Inspection Reports, SOPs & Manuals.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs rounded-full font-bold">
            {documents.length} Ingested Files
          </span>
        </div>
      </div>

      {/* 12-Step Production RAG Pipeline Explorer */}
      <ProductionRagPipelineExplorer />

      {/* RAG Pipeline Architectural Flow */}
      <RagWorkflowPipeline isProcessing={isExtracting} />

      {/* Universal Document AI Extraction Pipeline (14 Fields + JSON) */}
      <DocumentPipelineExtractor />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File List & Ingest Box */}
        <div className="lg:col-span-5 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg,.dwg"
            className="hidden"
          />

          {/* Quick Ingest Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-slate-50 text-slate-900 border border-indigo-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 font-mono">
                <Upload className="w-4 h-4 text-indigo-600" /> Ingest Industrial Document
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-[10px] font-bold font-mono flex items-center gap-1 border border-slate-200 shadow-2xs cursor-pointer transition-colors"
              >
                <Paperclip className="w-3 h-3 text-blue-600" />
                <span>Select PDF File</span>
              </button>
            </div>

            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Document Title (or select file above)"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
              >
                <option value="SOP">SOP Manual</option>
                <option value="P&ID">P&ID Diagram</option>
                <option value="Inspection Report">Inspection Log</option>
                <option value="Regulatory Standard">Regulatory Rule</option>
              </select>

              <button
                onClick={handleSimulateIngest}
                disabled={!docTitle.trim() || isExtracting}
                className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExtracting ? "Extracting..." : "Run AI Ingest"}</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, equipment or tag..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
              {["All", "SOP", "P&ID", "Inspection Report", "Regulatory Standard"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap text-[11px] transition-colors ${
                    categoryFilter === cat
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Document File Cards */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {doc.title}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {doc.category} • {doc.size}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {Math.round(doc.confidence * 100)}% Match
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Document Detail & AI Extractions */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                    {selectedDoc.category}
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedDoc.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Uploaded by {selectedDoc.uploadedBy} on {selectedDoc.uploadedAt}
                  </p>
                </div>

                <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 hover:bg-slate-200">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Original</span>
                </button>
              </div>

              {/* AI Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Atlas™ AI Extracted Summary
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  {selectedDoc.summary}
                </div>
              </div>

              {/* Extracted Entities */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-blue-500" /> Extracted Industrial Entities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDoc.extractedEntities.map((entity, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono text-xs font-semibold"
                    >
                      {entity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Knowledge Graph Mapping Info */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-slate-50 text-slate-900 border border-blue-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-900 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PulseGraph™ Knowledge Neural Link
                  </span>
                  <span className="text-[10px] text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full font-mono font-bold border border-indigo-200">Synced</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  This document is linked to 14 Equipment Twins, 3 Failure Incident reports, and 2 Statutory Regulations in the knowledge graph.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              Select a document to inspect AI OCR extractions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
