import React, { useState } from "react";
import {
  X,
  Highlighter,
  Type,
  CheckCircle2,
  Download,
  Save,
  FileText,
  RotateCw,
  Search,
  PenTool,
  Stamp,
  Eye,
  Edit3
} from "lucide-react";

interface AttachedFile {
  name: string;
  size: string;
  type: string;
  base64?: string;
  contentPreview?: string;
}

interface PdfEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: AttachedFile | null;
  onSave: (updatedFile: AttachedFile) => void;
}

export const PdfEditorModal: React.FC<PdfEditorModalProps> = ({
  isOpen,
  onClose,
  file,
  onSave
}) => {
  if (!isOpen || !file) return null;

  const [activeTool, setActiveTool] = useState<"view" | "highlight" | "edit" | "stamp">("view");
  const [stampText, setStampText] = useState<string>("OISD-118 COMPLIANT");
  const [stamps, setStamps] = useState<Array<{ id: string; text: string; x: number; y: number }>>([
    { id: "s1", text: "VERIFIED BY ORION AI", x: 60, y: 40 }
  ]);
  const [annotations, setAnnotations] = useState<Array<{ id: string; text: string; color: string }>>([
    { id: "a1", text: "Bearing replacement required at 8.8 mm/s vibration threshold.", color: "bg-amber-100 text-amber-800 border-amber-300" }
  ]);
  const [newAnnotation, setNewAnnotation] = useState("");
  const [documentBodyText, setDocumentBodyText] = useState<string>(
    file.contentPreview ||
      `INDUSTRIAL EQUIPMENT SPECIFICATION & OVERHAUL PROCEDURE\nDocument: ${file.name}\nStatus: Active / Verified\n\n1.0 OPERATIONAL PARAMETERS\n- Nominal Flow: 450 m³/h @ 2950 RPM\n- Maximum Allowable Vibration: 4.5 mm/s (Alarm at 7.1 mm/s)\n- Current Telemetry: 8.8 mm/s (CRITICAL TRIP LEVEL)\n\n2.0 MAINTENANCE PROCEDURE\n- Isolate drive motor using LOTO procedure SOP-2024-PUMP.\n- Torque mechanical seal bolts to 85 Nm.\n- Inspect SKF-6314 DE bearing for inner race spalling.`
  );
  const [activePage, setActivePage] = useState(1);

  const handleAddAnnotation = () => {
    if (!newAnnotation.trim()) return;
    setAnnotations((prev) => [
      ...prev,
      { id: `ann-${Date.now()}`, text: newAnnotation, color: "bg-blue-100 text-blue-800 border-blue-300" }
    ]);
    setNewAnnotation("");
  };

  const handleAddStampClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "stamp") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStamps((prev) => [
      ...prev,
      { id: `st-${Date.now()}`, text: stampText, x, y }
    ]);
  };

  const handleSaveDocument = () => {
    const updatedFile: AttachedFile = {
      ...file,
      name: file.name.endsWith(".edited.pdf") ? file.name : file.name.replace(/\.[^/.]+$/, "") + ".edited.pdf",
      contentPreview: documentBodyText
    };
    onSave(updatedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden font-sans">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-slate-50 text-slate-900 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg border border-blue-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 truncate max-w-md">{file.name}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-100 text-indigo-700 rounded font-semibold border border-indigo-200">
                  Interactive PDF Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Size: {file.size} • Page {activePage} of 3</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveDocument}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Revisions</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 text-xs shrink-0 flex-wrap">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTool("view")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeTool === "view" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => setActiveTool("edit")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeTool === "edit" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Text</span>
            </button>

            <button
              onClick={() => setActiveTool("highlight")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeTool === "highlight" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
              <span>Highlight</span>
            </button>

            <button
              onClick={() => setActiveTool("stamp")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeTool === "stamp" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Stamp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Stamp</span>
            </button>
          </div>

          {activeTool === "stamp" && (
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-slate-500">Stamp Text:</span>
              <select
                value={stampText}
                onChange={(e) => setStampText(e.target.value)}
                className="px-2 py-1 rounded bg-white border border-slate-200 font-mono text-xs font-bold text-slate-800"
              >
                <option value="OISD-118 COMPLIANT">OISD-118 COMPLIANT</option>
                <option value="VERIFIED BY ORION AI">VERIFIED BY ORION AI</option>
                <option value="URGENT OVERHAUL">URGENT OVERHAUL</option>
                <option value="SAFETY APPROVED">SAFETY APPROVED</option>
              </select>
            </div>
          )}
        </div>

        {/* Main Work Area */}
        <div className="flex-1 flex overflow-hidden bg-slate-100">
          {/* Document Canvas Column */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center">
            {/* Sheet Page Paper Container */}
            <div
              onClick={handleAddStampClick}
              className={`w-full max-w-2xl bg-white shadow-lg border border-slate-300 rounded-lg p-8 min-h-[500px] relative transition-all ${
                activeTool === "stamp" ? "cursor-crosshair ring-2 ring-emerald-400" : ""
              }`}
            >
              {/* Watermark / Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 text-xs font-mono text-slate-400">
                <span>PLANT KNOWLEDGE DOCUMENT</span>
                <span>PAGE {activePage} / 3</span>
              </div>

              {/* Stamps overlay */}
              {stamps.map((s) => (
                <div
                  key={s.id}
                  style={{ top: `${s.y}px`, left: `${s.x}px` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-md border-2 border-emerald-600 bg-emerald-50 text-emerald-700 font-extrabold font-mono text-xs shadow-md tracking-wider uppercase rotate-[-6deg] select-none pointer-events-none"
                >
                  {s.text}
                </div>
              ))}

              {/* Document Text / Editable Area */}
              {activeTool === "edit" ? (
                <textarea
                  value={documentBodyText}
                  onChange={(e) => setDocumentBodyText(e.target.value)}
                  className="w-full h-96 p-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="whitespace-pre-wrap font-mono text-xs text-slate-800 leading-relaxed">
                  {documentBodyText}
                </div>
              )}

              {/* Highlights overlay indicator */}
              {activeTool === "highlight" && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-semibold">
                  ⚡ Highlight Mode Active: Click text sections to add automatic AI markers.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Notes & Revision Log */}
          <div className="w-80 bg-white border-l border-slate-200 p-4 flex flex-col space-y-4 shrink-0 overflow-y-auto">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">
                Document Annotations
              </h3>
              <div className="space-y-2">
                {annotations.map((ann) => (
                  <div key={ann.id} className={`p-2.5 rounded-lg border text-xs leading-snug font-medium ${ann.color}`}>
                    {ann.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-[11px] font-bold text-slate-500 font-mono uppercase">Add Sticky Note</label>
              <textarea
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                placeholder="Type custom note or compliance tag..."
                className="w-full h-20 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddAnnotation}
                className="w-full py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
