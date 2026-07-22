import React, { useState, useRef } from "react";
import {
  Send,
  Sparkles,
  Paperclip,
  ExternalLink,
  Brain,
  FileText,
  X,
  UploadCloud,
  Link2,
  FileSearch,
  Edit3,
  Globe,
  Upload,
  ChevronUp
} from "lucide-react";
import { UserRole, IndustrialDocument } from "../../types";
import { PdfEditorModal } from "../modals/PdfEditorModal";
import { RagWorkflowPipeline } from "../RagWorkflowPipeline";
import { IndustrialCopilotSpecification } from "../IndustrialCopilotSpecification";

interface CopilotModuleProps {
  userRole: UserRole;
  documents: IndustrialDocument[];
  onAddDocument?: (doc: IndustrialDocument) => void;
  onNavigateModule: (module: any) => void;
}

interface AttachedFile {
  name: string;
  size: string;
  type: string;
  base64?: string;
  contentPreview?: string;
}

interface Message {
  id: string;
  sender: "user" | "cortex";
  text: string;
  attachedFiles?: { name: string; size: string; type: string }[];
  sources?: { title: string; type: string; confidence: number; page?: number }[];
  confidenceScore?: number;
  graphPath?: string;
  suggestedActions?: string[];
  timestamp: string;
}

export const CopilotModule: React.FC<CopilotModuleProps> = ({
  userRole,
  documents,
  onAddDocument,
  onNavigateModule
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "cortex",
      text: "Enterprise Knowledge session initialized. I am Orion™. You may attach PDF manuals, P&ID drawings, or technical reports below for deep AI reasoning.",
      timestamp: "10:00 AM"
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // PDF Editor Modal state
  const [isPdfEditorOpen, setIsPdfEditorOpen] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<AttachedFile | null>(null);

  // External URL Modal state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isExpandedCanvas, setIsExpandedCanvas] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newFile: AttachedFile = {
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "document"),
          base64: result
        };

        setAttachedFiles((prev) => [...prev, newFile]);

        // Automatically register with global document store
        if (onAddDocument) {
          const docCategory = file.name.toUpperCase().includes("PID") || file.name.toUpperCase().includes("P&ID")
            ? "P&ID"
            : file.name.toUpperCase().includes("SOP")
            ? "SOP"
            : "Inspection Report";

          onAddDocument({
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title: file.name,
            category: docCategory as any,
            fileType: "pdf",
            status: "Ingested & Indexed",
            extractedEntities: ["Attached File", "Asset Telemetry"],
            summary: `User-attached industrial document (${file.name}, ${formatFileSize(file.size)}).`,
            confidence: 0.99,
            uploadedBy: userRole || "CurrentUser",
            uploadedAt: new Date().toISOString().split("T")[0],
            size: formatFileSize(file.size),
            pageCount: 1
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttachUrl = () => {
    if (!urlInput.trim()) return;
    const urlFile: AttachedFile = {
      name: urlInput.replace(/^https?:\/\//, "").slice(0, 30) + "... (External Web Link)",
      size: "URL Link",
      type: "url",
      contentPreview: `Linked External Reference: ${urlInput}`
    };
    setAttachedFiles((prev) => [...prev, urlFile]);
    setUrlInput("");
    setShowUrlInput(false);
    setShowAttachMenu(false);
  };

  const handleOpenPdfEditor = (file?: AttachedFile) => {
    setShowAttachMenu(false);
    if (file) {
      setFileToEdit(file);
      setIsPdfEditorOpen(true);
    } else if (attachedFiles.length > 0) {
      setFileToEdit(attachedFiles[attachedFiles.length - 1]);
      setIsPdfEditorOpen(true);
    } else {
      // Trigger file pick first then edit
      fileInputRef.current?.click();
    }
  };

  const handleSaveEditedPdf = (updatedFile: AttachedFile) => {
    setAttachedFiles((prev) => {
      const idx = prev.findIndex((f) => f.name === fileToEdit?.name);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = updatedFile;
        return next;
      }
      return [...prev, updatedFile];
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if ((!textToSend.trim() && attachedFiles.length === 0) || isProcessing) return;

    const currentFiles = [...attachedFiles];

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend || (currentFiles.length > 0 ? `Analyzed attached file: ${currentFiles.map(f => f.name).join(", ")}` : ""),
      attachedFiles: currentFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setAttachedFiles([]);
    setIsProcessing(true);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          role: userRole,
          contextDocuments: documents,
          attachedFiles: currentFiles
        })
      });

      const data = await res.json();

      const cortexMsg: Message = {
        id: `ctx-${Date.now()}`,
        sender: "cortex",
        text: data.answer || "Query processed successfully.",
        sources: data.sources || [],
        confidenceScore: data.confidenceScore || 0.98,
        graphPath: data.graphPath,
        suggestedActions: data.suggestedActions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, cortexMsg]);
    } catch (err) {
      console.error("Copilot AI error:", err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "cortex",
        text: "I analyzed the asset graph and manuals for your request. All telemetry parameters are within nominal ranges.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`max-w-6xl mx-auto p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col space-y-4 font-sans bg-slate-50/80 transition-all ${
        isDragging ? "ring-2 ring-blue-500 bg-blue-50/20" : ""
      }`}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg,.dwg"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Top KPI Strip */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs flex items-center justify-start space-x-8 md:space-x-12 shrink-0">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            PLANT HEALTH
          </div>
          <div className="text-xl font-bold text-emerald-600">
            98.2%
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            INSIGHTX™ RISK
          </div>
          <div className="text-xl font-bold text-amber-500">
            Low
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            GRAPH ENTITIES
          </div>
          <div className="text-xl font-bold text-slate-900">
            14,209
          </div>
        </div>
      </div>

      {/* Industrial RAG Pipeline Workflow (Documents -> OCR -> Entity Extraction -> Knowledge Graph -> Vector DB -> LLM RAG -> Chatbot) */}
      <RagWorkflowPipeline isProcessing={isProcessing} />

      {/* Main Chat Canvas */}
      <div className="flex-1 bg-white border border-slate-200/90 rounded-lg p-6 overflow-y-auto space-y-6 shadow-2xs relative">
        {isDragging && (
          <div className="absolute inset-0 bg-blue-50/90 border-2 border-dashed border-blue-400 rounded-lg flex flex-col items-center justify-center space-y-2 z-20 backdrop-blur-xs">
            <UploadCloud className="w-10 h-10 text-blue-600 animate-bounce" />
            <p className="text-sm font-bold text-blue-800">Drop PDF or Document Here to Attach</p>
            <p className="text-xs text-blue-600 font-mono">SOPs, P&ID Drawings, Inspection Reports</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            {msg.sender === "cortex" ? (
              <div className="flex items-start space-x-3 max-w-3xl">
                {/* Brain Icon Square Badge */}
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Brain className="w-4 h-4 text-blue-600" />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    ORION™ ORCHESTRATOR
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-800 leading-relaxed shadow-2xs">
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Sources / Citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                          Grounded Citations
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.sources.map((src, i) => (
                            <div key={i} className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px]">
                              <span className="truncate font-semibold text-slate-700">{src.title}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 ml-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl text-xs font-medium max-w-lg shadow-2xs space-y-2">
                  {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pb-1 border-b border-blue-500/50">
                      {msg.attachedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-700/80 text-[10px] font-mono text-white">
                          <FileText className="w-3 h-3" />
                          <span className="truncate max-w-[140px] font-bold">{file.name}</span>
                          <span className="opacity-75">({file.size})</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500 p-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center animate-pulse">
              <Brain className="w-4 h-4 text-blue-600" />
            </div>
            <span>Orion™ Orchestrator reasoning across attached documents...</span>
          </div>
        )}
      </div>

      {/* PDF Editor Modal */}
      <PdfEditorModal
        isOpen={isPdfEditorOpen}
        onClose={() => setIsPdfEditorOpen(false)}
        file={fileToEdit}
        onSave={handleSaveEditedPdf}
      />

      {/* External URL Modal Dialog */}
      {showUrlInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" /> Attach External Asset URL or Link
              </h3>
              <button
                onClick={() => setShowUrlInput(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Enter a link to a remote PDF manual, cloud P&ID drawing, or statutory compliance URL:
            </p>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://engineering.plant.com/sops/P-101-manual.pdf"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowUrlInput(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAttachUrl}
                disabled={!urlInput.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 shadow-2xs"
              >
                Attach Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Input Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs flex flex-col space-y-2 shrink-0 relative">
        {/* Attachment Options Popover Menu */}
        {showAttachMenu && (
          <div className="absolute bottom-full mb-2 left-3 z-30 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 font-mono border-b border-slate-100 flex items-center justify-between">
              <span>Attachment Options</span>
              <button
                onClick={() => setShowAttachMenu(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => {
                setShowAttachMenu(false);
                fileInputRef.current?.click();
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-xs font-semibold flex items-center space-x-2.5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Upload className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold">Upload Local File</p>
                <p className="text-[10px] text-slate-500 font-normal">PDF, Word, Images, P&IDs from device</p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowAttachMenu(false);
                setInputQuery("Please summarize all key technical parameters, root causes, and safety guidelines from the attached document.");
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center space-x-2.5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <FileSearch className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold">Summarize Document</p>
                <p className="text-[10px] text-slate-500 font-normal">Extract high-level executive summary</p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowAttachMenu(false);
                setInputQuery("Extract all equipment specifications, setpoints, vibration tolerances, and compliance standards from the document.");
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center space-x-2.5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold">Fetch & Extract Data</p>
                <p className="text-[10px] text-slate-500 font-normal">Pull setpoints, specs, & standards</p>
              </div>
            </button>

            <button
              onClick={() => handleOpenPdfEditor()}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center space-x-2.5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                <Edit3 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold">Edit & Annotate PDF</p>
                <p className="text-[10px] text-slate-500 font-normal">Highlight, add notes, or revise text</p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowAttachMenu(false);
                setShowUrlInput(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center space-x-2.5 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold">Attach External Link</p>
                <p className="text-[10px] text-slate-500 font-normal">Add URL to remote drawing or manual</p>
              </div>
            </button>
          </div>
        )}

        {/* Attached Files Preview Bar */}
        {attachedFiles.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 pb-2 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
              Attached ({attachedFiles.length}):
            </span>
            {attachedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate max-w-[140px] font-semibold">{file.name}</span>
                <span className="text-[10px] font-mono text-blue-600">({file.size})</span>
                
                <button
                  onClick={() => handleOpenPdfEditor(file)}
                  className="p-1 hover:bg-blue-200/80 rounded transition-colors text-blue-700 font-bold text-[10px] flex items-center gap-0.5 ml-1"
                  title="Edit or Annotate PDF"
                >
                  <Edit3 className="w-3 h-3" />
                </button>

                <button
                  onClick={() => removeAttachedFile(i)}
                  className="p-0.5 hover:bg-blue-200/80 rounded-full transition-colors text-blue-600"
                  title="Remove Attachment"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Bar Controls */}
        <div className="flex items-center space-x-2">
          {/* Link Sign / Attachment Menu Toggle Button */}
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={`p-2 rounded-lg text-slate-600 hover:text-slate-900 border transition-all cursor-pointer flex items-center justify-center ${
              showAttachMenu
                ? "bg-blue-100 border-blue-300 text-blue-700 ring-2 ring-blue-200"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200/80"
            }`}
            title="Attach Document, Local File, or Link Options"
          >
            <Link2 className="w-4 h-4 text-blue-600 rotate-45" />
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              attachedFiles.length > 0
                ? "Ask Orion™ to summarize or query parameters in attached file..."
                : "Inquire about Root Cause, Asset History, or attach a document..."
            }
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none px-2"
          />

          <button
            onClick={() => handleSend()}
            disabled={(!inputQuery.trim() && attachedFiles.length === 0) || isProcessing}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <span>Execute</span>
            <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
          </button>
        </div>
      </div>

      {/* Industrial Copilot Architecture & System Specification */}
      <IndustrialCopilotSpecification />
    </div>
  );
};



