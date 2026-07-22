import React, { useState } from "react";
import {
  FileText,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  Download,
  Sparkles,
  Zap,
  Tag,
  Cpu,
  Calendar,
  User,
  ShieldCheck,
  Thermometer,
  Gauge,
  Activity,
  Layers,
  Wrench,
  BookOpen,
  AlertOctagon,
  RefreshCw,
  FileSpreadsheet,
  Mail,
  Image as ImageIcon,
  PenTool
} from "lucide-react";

export interface ExtractedPipelineData {
  document: {
    filename: string;
    input_type: string;
    processed_by: string;
    ingested_at: string;
    ocr_confidence: number;
  };
  extracted_data: {
    equipment_tags: string[];
    asset_ids: string[];
    dates: string[];
    engineers: string[];
    sop_numbers: string[];
    pressure: string;
    temperature: string;
    flow: string;
    voltage: string;
    current: string;
    failure_type: string;
    spare_parts: string[];
    regulations: string[];
    risk_level: string;
  };
  schema_validation: {
    valid: boolean;
    extracted_fields_count: number;
    missing_fields: string[];
  };
}

const SAMPLE_DOCUMENT_PRESETS = [
  {
    id: "pdf-pid",
    title: "Crude Distillation Unit P&ID Drawing (P-101-A)",
    inputType: "PDFs",
    category: "P&ID Drawings",
    filename: "PND_CDU_TrainA_P101.pdf",
    sampleData: {
      equipment_tags: ["P-101-A", "TK-204-B", "PRV-102", "HE-301"],
      asset_ids: ["CRUDE-DISTILL-UNIT-1", "PROCESS-TRAIN-ALPHA"],
      dates: ["2026-07-15", "2026-07-20"],
      engineers: ["Dr. Aris Thorne (Chief Engineer)", "Marcus Vance (Piping Specialist)"],
      sop_numbers: ["SOP-2024-PUMP-OVERHAUL", "SOP-OISD-118-LOTO"],
      pressure: "24.5 Bar (Design: 30 Bar)",
      temperature: "185.0 °C",
      flow: "450 m³/h",
      voltage: "415V AC (3-Phase)",
      current: "145 Amps",
      failure_type: "Cavitation & Mechanical Seal Face Thermal Degradation",
      spare_parts: ["SKF-6314 Heavy Duty Bearing", "Viton Mechanical Seal Kit MS-101", "Coupling Elastomer Insert"],
      regulations: ["OISD-STD-118", "ISO-55001 Clause 6.2", "PESO Static Vessel Safety"],
      risk_level: "HIGH"
    }
  },
  {
    id: "scanned-image",
    title: "Scanned Ultrasonic NDT Thickness Report",
    inputType: "Scanned Images",
    category: "Inspection Reports",
    filename: "Scanned_NDT_WallThickness_Scan.png",
    sampleData: {
      equipment_tags: ["TK-204-B", "LINE-12-INCH-CS"],
      asset_ids: ["STORAGE-FARM-SOUTH"],
      dates: ["2026-07-18"],
      engineers: ["Sarah Jenkins (NDT Level III Inspector)"],
      sop_numbers: ["SOP-NDT-ULTRASONIC-04"],
      pressure: "12.0 Bar",
      temperature: "65.0 °C",
      flow: "120 m³/h",
      voltage: "N/A (Static Asset)",
      current: "N/A",
      failure_type: "Localized Pitting Corrosion (Shell Bottom)",
      spare_parts: ["Patch Plate A516 Grade 70 Steel", "E7018 Welding Electrodes"],
      regulations: ["API 653 Tank Inspection Standard", "OSHA 1910.119 PSM"],
      risk_level: "MEDIUM"
    }
  },
  {
    id: "excel-matrix",
    title: "Plantwide Telemetry & Spare Parts Matrix (.xlsx)",
    inputType: "Excel",
    category: "Maintenance Reports",
    filename: "Plant_Telemetry_Spares_Q3_2026.xlsx",
    sampleData: {
      equipment_tags: ["C-201-B", "P-102", "V-401"],
      asset_ids: ["HYDROCRACKER-TRAIN-B"],
      dates: ["2026-07-21"],
      engineers: ["Elena Rostova (Reliability Analyst)"],
      sop_numbers: ["SOP-PREDICTIVE-LUBE-99"],
      pressure: "85.2 Bar",
      temperature: "240.5 °C",
      flow: "1200 m³/h",
      voltage: "6.6 kV High Voltage",
      current: "320 Amps",
      failure_type: "Impeller Blade Unbalance & Vibration Spike (8.8 mm/s)",
      spare_parts: ["SKF-7320 Angular Contact Bearing", "Lube Oil Filter Element Cartridge", "Shaft Sleeve Stainless 316"],
      regulations: ["ISO 10816 Vibration Severity", "OISD-STD-124"],
      risk_level: "CRITICAL"
    }
  },
  {
    id: "word-doc",
    title: "Shift Handover & Overhaul Log (.docx)",
    inputType: "Word",
    category: "Maintenance Reports",
    filename: "ShiftHandover_Turbine_Overhaul.docx",
    sampleData: {
      equipment_tags: ["TG-501-GAS-TURBINE"],
      asset_ids: ["POWER-GEN-BLOCK-2"],
      dates: ["2026-07-22"],
      engineers: ["David Chen (Operations Lead)", "Vikram Patel (Instrument Tech)"],
      sop_numbers: ["SOP-TURBINE-STARTUP-2025", "SOP-FIRE-SAFETY-09"],
      pressure: "42.0 Bar",
      temperature: "520.0 °C",
      flow: "890 m³/h",
      voltage: "11 kV Generator Output",
      current: "850 Amps",
      failure_type: "Governor Valve Actuator Drift & High Exhaust Temp Delta",
      spare_parts: ["Servo Actuator Valve Assembly", "Thermocouple Type K Sensors"],
      regulations: ["IEEE 1547 Grid Standard", "NFPA 85 Boiler & Turbine Code"],
      risk_level: "HIGH"
    }
  },
  {
    id: "email-msg",
    title: "Emergency Trip Notification Email (.eml)",
    inputType: "Emails",
    category: "Incidents & Alerts",
    filename: "Alert_EmergencyTrip_Compressor_C101.eml",
    sampleData: {
      equipment_tags: ["C-101-COMPRESSOR"],
      asset_ids: ["ETHYLENE-CRACKER-PLANT"],
      dates: ["2026-07-22"],
      engineers: ["Control Room Operator (Shift B)"],
      sop_numbers: ["SOP-EMERGENCY-SHUTDOWN-01"],
      pressure: "110.0 Bar",
      temperature: "310.0 °C",
      flow: "0 m³/h (Tripped)",
      voltage: "415V AC Control Circuit",
      current: "0 Amps (Tripped)",
      failure_type: "Lube Oil Low Pressure Trip (PRV Stuck Open)",
      spare_parts: ["Pressure Relief Valve Spring Assembly", "O-Ring Viton Kit"],
      regulations: ["OISD-STD-118", "OSHA PSM Standard 1910"],
      risk_level: "CRITICAL"
    }
  }
];

export const DocumentPipelineExtractor: React.FC = () => {
  const [selectedInputType, setSelectedInputType] = useState<string>("PDFs");
  const [activePreset, setActivePreset] = useState(SAMPLE_DOCUMENT_PRESETS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"fields" | "json">("fields");

  const [extractedData, setExtractedData] = useState<ExtractedPipelineData>({
    document: {
      filename: SAMPLE_DOCUMENT_PRESETS[0].filename,
      input_type: SAMPLE_DOCUMENT_PRESETS[0].inputType,
      processed_by: "Atlas Document AI Pipeline v4.2",
      ingested_at: new Date().toISOString(),
      ocr_confidence: 0.994
    },
    extracted_data: SAMPLE_DOCUMENT_PRESETS[0].sampleData,
    schema_validation: {
      valid: true,
      extracted_fields_count: 14,
      missing_fields: []
    }
  });

  const handleRunPipeline = async (preset = activePreset) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/document-pipeline-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentName: preset.filename,
          inputType: preset.inputType,
          content: JSON.stringify(preset.sampleData)
        })
      });

      const data = await res.json();
      setExtractedData(data);
    } catch (err) {
      console.error("Pipeline processing failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DocumentAI_Extraction_${extractedData.document.filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputFormats = [
    { name: "PDFs", icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40" },
    { name: "Scanned Images", icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40" },
    { name: "Excel", icon: FileSpreadsheet, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { name: "Word", icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { name: "Emails", icon: Mail, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
    { name: "P&ID drawings", icon: PenTool, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/40" },
    { name: "Inspection reports", icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
    { name: "Maintenance reports", icon: Wrench, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/40" }
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk.toUpperCase()) {
      case "CRITICAL":
        return "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300";
      case "HIGH":
        return "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300";
      case "MEDIUM":
        return "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300";
      default:
        return "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300";
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white font-mono uppercase tracking-wider">
              Document AI Pipeline Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">14 Structurally Validated Fields</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Universal Document AI Extraction Pipeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Engineered to ingest multimodal technical assets and yield strict, enterprise-ready structured JSON.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleRunPipeline()}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
            <span>{isProcessing ? "Extracting Pipeline..." : "Execute AI Extraction"}</span>
          </button>
        </div>
      </div>

      {/* 8 Supported Input Formats Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-500" /> Multi-Format Ingestion Pipeline (Select Format)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {inputFormats.map((fmt) => {
            const Icon = fmt.icon;
            const isSelected = selectedInputType === fmt.name;
            return (
              <button
                key={fmt.name}
                onClick={() => {
                  setSelectedInputType(fmt.name);
                  const matchingPreset = SAMPLE_DOCUMENT_PRESETS.find(p => p.inputType === fmt.name) || SAMPLE_DOCUMENT_PRESETS[0];
                  setActivePreset(matchingPreset);
                  handleRunPipeline(matchingPreset);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 shadow-xs ring-1 ring-blue-500"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${fmt.bg}`}>
                  <Icon className={`w-4 h-4 ${fmt.color}`} />
                </div>
                <span className={`text-[10px] font-bold text-center truncate w-full font-mono ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"}`}>
                  {fmt.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Test Documents Selector */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Load Test Preset:</span>
          <select
            value={activePreset.id}
            onChange={(e) => {
              const p = SAMPLE_DOCUMENT_PRESETS.find(x => x.id === e.target.value);
              if (p) {
                setActivePreset(p);
                setSelectedInputType(p.inputType);
                handleRunPipeline(p);
              }
            }}
            className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs font-semibold focus:outline-none"
          >
            {SAMPLE_DOCUMENT_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.inputType}] {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3 font-mono text-[11px] text-slate-500">
          <span>Filename: <strong className="text-slate-900 dark:text-white">{activePreset.filename}</strong></span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
            Schema Validated
          </span>
        </div>
      </div>

      {/* Extracted Fields Dashboard / Structured JSON Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab("fields")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === "fields"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>14 Extracted Fields Visualizer</span>
            </button>

            <button
              onClick={() => setActiveTab("json")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === "json"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Structured JSON Output</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyJson}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy JSON"}</span>
            </button>

            <button
              onClick={downloadJson}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 14 Extracted Fields Visualizer Grid */}
        {activeTab === "fields" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
            {/* Field 1: Equipment Tags */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-500" /> 1. Equipment Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedData.extracted_data.equipment_tags.map((t, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-mono text-xs font-bold border border-blue-300 dark:border-blue-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Field 2: Asset IDs */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-500" /> 2. Asset IDs
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedData.extracted_data.asset_ids.map((a, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-mono text-xs font-bold border border-purple-300 dark:border-purple-800">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Field 3: Dates */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" /> 3. Dates
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedData.extracted_data.dates.map((d, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Field 4: Engineers */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" /> 4. Engineers
              </span>
              <div className="space-y-1">
                {extractedData.extracted_data.engineers.map((e, i) => (
                  <div key={i} className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{e}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Field 5: SOP Numbers */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-500" /> 5. SOP Numbers
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedData.extracted_data.sop_numbers.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-mono text-xs font-bold border border-teal-300 dark:border-teal-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Field 6: Pressure */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-600" /> 6. Pressure
              </span>
              <div className="text-sm font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                {extractedData.extracted_data.pressure}
              </div>
            </div>

            {/* Field 7: Temperature */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" /> 7. Temperature
              </span>
              <div className="text-sm font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                {extractedData.extracted_data.temperature}
              </div>
            </div>

            {/* Field 8: Flow */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-500" /> 8. Flow Rate
              </span>
              <div className="text-sm font-extrabold text-cyan-700 dark:text-cyan-300 font-mono">
                {extractedData.extracted_data.flow}
              </div>
            </div>

            {/* Field 9: Voltage */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> 9. Voltage
              </span>
              <div className="text-sm font-extrabold text-amber-700 dark:text-amber-300 font-mono">
                {extractedData.extracted_data.voltage}
              </div>
            </div>

            {/* Field 10: Current */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-500" /> 10. Current (Amps)
              </span>
              <div className="text-sm font-extrabold text-yellow-700 dark:text-yellow-300 font-mono">
                {extractedData.extracted_data.current}
              </div>
            </div>

            {/* Field 11: Failure Type */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 md:col-span-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> 11. Failure Type / Anomaly
              </span>
              <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-lg text-xs font-semibold text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900">
                {extractedData.extracted_data.failure_type}
              </div>
            </div>

            {/* Field 12: Spare Parts */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-indigo-500" /> 12. Required Spare Parts
              </span>
              <div className="space-y-1">
                {extractedData.extracted_data.spare_parts.map((sp, i) => (
                  <div key={i} className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                    {sp}
                  </div>
                ))}
              </div>
            </div>

            {/* Field 13: Regulations */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 13. Regulations & Standards
              </span>
              <div className="space-y-1">
                {extractedData.extracted_data.regulations.map((r, i) => (
                  <div key={i} className="text-xs font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-1.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Field 14: Risk Level */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> 14. Risk Level
              </span>
              <div className={`px-3 py-2 rounded-lg font-mono text-center font-black text-sm border ${getRiskBadge(extractedData.extracted_data.risk_level)}`}>
                {extractedData.extracted_data.risk_level}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Raw Structured JSON Output */}
        {activeTab === "json" && (
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>structured_extraction_output.json</span>
              <span className="text-emerald-400 font-bold">100% Schema Valid</span>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[500px] leading-relaxed">
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
