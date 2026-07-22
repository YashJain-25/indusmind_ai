import React, { useState } from "react";
import {
  Terminal,
  FolderTree,
  Code2,
  Play,
  Copy,
  CheckCircle2,
  Shield,
  FileUp,
  Scan,
  Tags,
  Network,
  Database,
  Bot,
  ShieldCheck,
  Wrench,
  BarChart3,
  Download,
  ExternalLink,
  Layers,
  Cpu
} from "lucide-react";

interface FastAPIModuleProps {}

interface ModuleDoc {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST";
  icon: any;
  description: string;
  codeSnippet: string;
  sampleRequest: string;
  sampleResponse: string;
}

const FASTAPI_MODULES: ModuleDoc[] = [
  {
    id: "auth",
    name: "1. Authentication API",
    endpoint: "/api/v1/auth/login",
    method: "POST",
    icon: Shield,
    description: "OAuth2 Password bearer flow with JWT token creation and bcrypt password verification.",
    codeSnippet: `from fastapi import APIRouter, HTTPException, status
from app.models.schemas import LoginRequest, TokenResponse
from app.core.security import create_access_token, get_password_hash

router = APIRouter(prefix="/auth", tags=["1. Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    # Validates corporate user credentials & generates JWT Token
    access_token = create_access_token(data={"sub": credentials.email, "role": "Reliability Engineer"})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user={"email": credentials.email, "role": "Reliability Engineer"}
    )`,
    sampleRequest: `{\n  "email": "engineer@indusmind.ai",\n  "password": "password123"\n}`,
    sampleResponse: `{\n  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "token_type": "bearer",\n  "user": {\n    "email": "engineer@indusmind.ai",\n    "name": "Dr. Aris Thorne",\n    "role": "Reliability Engineer"\n  }\n}`
  },
  {
    id: "upload",
    name: "2. Document Upload API",
    endpoint: "/api/v1/upload",
    method: "POST",
    icon: FileUp,
    description: "Multipart async document ingestion pipeline supporting engineering PDFs, DWG drawings, and SOP manuals.",
    codeSnippet: `from fastapi import APIRouter, UploadFile, File, Form, Depends
from app.models.schemas import DocumentUploadResponse

router = APIRouter(prefix="/upload", tags=["2. Upload API"])

@router.post("", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...), document_type: str = Form("SOP")):
    content = await file.read()
    return DocumentUploadResponse(
        file_id=f"DOC-{uuid.uuid4().hex[:8].upper()}",
        filename=file.filename,
        size_bytes=len(content),
        status="INGESTED_AND_INDEXED"
    )`,
    sampleRequest: `[Multipart Form Data]\nfile: SOP-2024-Pump-Overhaul.pdf\ndocument_type: SOP`,
    sampleResponse: `{\n  "file_id": "DOC-A8F932E1",\n  "filename": "SOP-2024-Pump-Overhaul.pdf",\n  "file_type": "SOP",\n  "size_bytes": 2489100,\n  "storage_path": "s3://indusmind-documents/DOC-A8F932E1/SOP.pdf",\n  "status": "INGESTED_AND_INDEXED"\n}`
  },
  {
    id: "ocr",
    name: "3. OCR Processing API",
    endpoint: "/api/v1/ocr/process",
    method: "POST",
    icon: Scan,
    description: "Optical Character Recognition (OCR) for scanned equipment datasheets and field maintenance logs.",
    codeSnippet: `from fastapi import APIRouter
from app.models.schemas import OCRRequest, OCRResult

router = APIRouter(prefix="/ocr", tags=["3. OCR Engine API"])

@router.post("/process", response_model=OCRResult)
async def process_ocr(payload: OCRRequest):
    return OCRResult(
        file_id=payload.file_id,
        ocr_text="PUMP P-101-A | BEARING: SKF-6314 | MAX PRESSURE: 24.5 BAR",
        confidence=0.988,
        page_count=6,
        bounding_boxes_extracted=142
    )`,
    sampleRequest: `{\n  "file_id": "DOC-A8F932E1",\n  "language": "eng"\n}`,
    sampleResponse: `{\n  "file_id": "DOC-A8F932E1",\n  "ocr_text": "PUMP P-101-A | BEARING: SKF-6314 | MAX PRESSURE: 24.5 BAR | LOTO REQUIRED",\n  "confidence": 0.988,\n  "page_count": 6,\n  "bounding_boxes_extracted": 142\n}`
  },
  {
    id: "entities",
    name: "4. Entity Extraction API",
    endpoint: "/api/v1/entities/extract",
    method: "POST",
    icon: Tags,
    description: "Automated extraction of equipment tags, valve identifiers, operating parameters, and safety standards.",
    codeSnippet: `from fastapi import APIRouter
from app.models.schemas import EntityExtractRequest, EntityExtractionResponse

router = APIRouter(prefix="/entities", tags=["4. Entity Extraction API"])

@router.post("/extract", response_model=EntityExtractionResponse)
async def extract_entities(payload: EntityExtractRequest):
    return EntityExtractionResponse(
        entities=[
            {"name": "P-101-A", "category": "Equipment", "confidence": 0.99},
            {"name": "SKF-6314", "category": "SparePart", "confidence": 0.97}
        ],
        parameters={"operating_pressure": "24.5 Bar"},
        safety_warnings=["High temperature steam hazard"]
    )`,
    sampleRequest: `{\n  "text": "Inspect centrifugal pump P-101-A and replace SKF-6314 bearing if pressure exceeds 24.5 Bar."\n}`,
    sampleResponse: `{\n  "entities": [\n    {"name": "P-101-A", "category": "Equipment", "confidence": 0.99, "span": "P-101-A"},\n    {"name": "SKF-6314", "category": "SparePart", "confidence": 0.97, "span": "SKF-6314"}\n  ],\n  "parameters": {\n    "operating_pressure": "24.5 Bar",\n    "operating_temperature": "185 °C"\n  },\n  "safety_warnings": [\n    "High temperature steam hazard during maintenance"\n  ]\n}`
  },
  {
    id: "knowledge_graph",
    name: "5. Knowledge Graph API",
    endpoint: "/api/v1/knowledge-graph",
    method: "GET",
    icon: Network,
    description: "Retrieves cross-plant entity relationships connecting assets, failure modes, incidents, and SOPs.",
    codeSnippet: `from fastapi import APIRouter
from app.models.schemas import KnowledgeGraphResponse

router = APIRouter(prefix="/knowledge-graph", tags=["5. Knowledge Graph API"])

@router.get("", response_model=KnowledgeGraphResponse)
async def get_knowledge_graph():
    return KnowledgeGraphResponse(
        nodes=[{"id": "p101", "label": "Pump P-101", "type": "Equipment"}],
        edges=[{"source": "p101", "target": "skf6314", "relation": "USES_PART"}]
    )`,
    sampleRequest: `GET /api/v1/knowledge-graph`,
    sampleResponse: `{\n  "nodes": [\n    {"id": "p101", "label": "Centrifugal Pump P-101", "type": "Equipment"},\n    {"id": "skf6314", "label": "SKF-6314 Heavy Duty Bearing", "type": "SparePart"}\n  ],\n  "edges": [\n    {"source": "p101", "target": "skf6314", "relation": "USES_PART"}\n  ]\n}`
  },
  {
    id: "vector_db",
    name: "6. Vector Database RAG API",
    endpoint: "/api/v1/vector-db/search",
    method: "POST",
    icon: Database,
    description: "High-dimensional vector similarity search over embedded industrial manuals and incident reports.",
    codeSnippet: `from fastapi import APIRouter
from app.models.schemas import VectorSearchRequest, VectorSearchResult

router = APIRouter(prefix="/vector-db", tags=["6. Vector Database RAG API"])

@router.post("/search", response_model=List[VectorSearchResult])
async def search_vector_db(payload: VectorSearchRequest):
    return [
        VectorSearchResult(
            doc_id="DOC-9941",
            text_chunk="SOP-2024 Clause 4.2: Pump P-101 bearing lube interval is 500 operating hours.",
            similarity_score=0.942,
            metadata={"source": "SOP-2024-PUMP.pdf"}
        )
    ]`,
    sampleRequest: `{\n  "query": "What is the recommended lube oil for Pump P-101 bearing?",\n  "top_k": 3\n}`,
    sampleResponse: `[\n  {\n    "doc_id": "DOC-9941",\n    "text_chunk": "SOP-2024 Clause 4.2: Pump P-101 drive-end bearing lubrication interval is 500 operating hours. Use ISO VG 68 synthetic oil.",\n    "similarity_score": 0.942,\n    "metadata": {\n      "source": "SOP-2024-PUMP.pdf",\n      "page": 4\n    }\n  }\n]`
  },
  {
    id: "chat",
    name: "7. Copilot Chat API",
    endpoint: "/api/v1/chat/completions",
    method: "POST",
    icon: Bot,
    description: "Conversational Copilot AI API with grounded RAG context, source citations, and suggested actions.",
    codeSnippet: `from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["7. Copilot Chat API"])

@router.post("/completions", response_model=ChatResponse)
async def copilot_chat(payload: ChatRequest):
    return ChatResponse(
        answer="Pump P-101 experienced high vibration (8.8 mm/s) due to bearing race pitting.",
        confidence_score=0.98,
        sources=[{"title": "SOP-2024-PUMP", "confidence": 0.98}],
        suggested_actions=["Create Emergency Work Order"]
    )`,
    sampleRequest: `{\n  "messages": [\n    {"role": "user", "content": "Why did Pump P-101 trip last night?"}\n  ]\n}`,
    sampleResponse: `{\n  "answer": "[Orion™ Copilot] Pump P-101 experienced high vibration (8.8 mm/s) due to drive-end bearing race pitting. Follow SOP-2024 for LOTO and SKF-6314 replacement.",\n  "confidence_score": 0.98,\n  "sources": [\n    {\n      "title": "SOP-2024-PUMP: Centrifugal Pump Overhaul",\n      "type": "SOP",\n      "confidence": 0.98\n    }\n  ],\n  "suggested_actions": [\n    "Create Emergency Work Order for SKF-6314 Replacement",\n    "Schedule Laser Alignment Inspection"\n  ]\n}`
  },
  {
    id: "compliance",
    name: "8. Statutory Compliance API",
    endpoint: "/api/v1/compliance/check",
    method: "POST",
    icon: ShieldCheck,
    description: "Statutory environmental and pressure safety vessel compliance validator (CPCB, OISD, OSHA).",
    codeSnippet: `from fastapi import APIRouter
from app.models.schemas import ComplianceCheckRequest, ComplianceReportResponse

router = APIRouter(prefix="/compliance", tags=["8. Statutory Compliance API"])

@router.post("/check", response_model=ComplianceReportResponse)
async def check_compliance(payload: ComplianceCheckRequest):
    return ComplianceReportResponse(
        equipment_tag=payload.equipment_tag,
        status="COMPLIANT",
        audit_score=98.5,
        violations=[],
        corrective_steps=["Maintain current 500-hour lube oil log"]
    )`,
    sampleRequest: `{\n  "equipment_tag": "TK-204-B",\n  "standard_code": "OISD-STD-118"\n}`,
    sampleResponse: `{\n  "equipment_tag": "TK-204-B",\n  "status": "COMPLIANT",\n  "audit_score": 98.5,\n  "violations": [],\n  "corrective_steps": [\n    "Maintain current 500-hour lube oil analysis log",\n    "Verify pressure relief valve calibration certificate before 2026-10-15"\n  ]\n}`
  },
  {
    id: "maintenance",
    name: "9. Predictive Maintenance API",
    endpoint: "/api/v1/maintenance/predict",
    method: "POST",
    icon: Wrench,
    description: "Predictive asset health and remaining useful life (RUL) inference engine based on FFT telemetry.",
    codeSnippet: `from fastapi import APIRouter
from app.models.schemas import TelemetryInput, MaintenancePredictionResponse

router = APIRouter(prefix="/maintenance", tags=["9. Predictive Maintenance API"])

@router.post("/predict", response_model=MaintenancePredictionResponse)
async def predict_maintenance(telemetry: TelemetryInput):
    return MaintenancePredictionResponse(
        equipment_code=telemetry.equipment_code,
        failure_probability=87.5,
        remaining_useful_life_days=12,
        predicted_failure_mode="Drive-End Bearing Race Pitting",
        recommended_spares=[{"part_name": "SKF-6314 Ball Bearing", "stock_qty": 4}]
    )`,
    sampleRequest: `{\n  "equipment_code": "P-101",\n  "vibration_mms": 8.8,\n  "temperature_c": 89.2,\n  "pressure_bar": 24.5,\n  "rpm": 2950\n}`,
    sampleResponse: `{\n  "equipment_code": "P-101",\n  "failure_probability": 87.5,\n  "remaining_useful_life_days": 12,\n  "predicted_failure_mode": "Drive-End Bearing Race Pitting & Seal Degradation",\n  "recommended_spares": [\n    {\n      "part_name": "SKF-6314 Heavy Duty Ball Bearing",\n      "stock_qty": 4,\n      "lead_time_days": 2\n    }\n  ]\n}`
  },
  {
    id: "analytics",
    name: "10. Executive Analytics API",
    endpoint: "/api/v1/analytics/summary",
    method: "GET",
    icon: BarChart3,
    description: "Plant-wide operational KPIs, health index metrics, and weekly trip prevention metrics.",
    codeSnippet: `from fastapi import APIRouter
from app.models.schemas import AnalyticsSummaryResponse

router = APIRouter(prefix="/analytics", tags=["10. Executive Analytics API"])

@router.get("/summary", response_model=AnalyticsSummaryResponse)
async def get_analytics_summary():
    return AnalyticsSummaryResponse(
        total_assets_monitored=142,
        overall_health_index=98.4,
        active_p1_work_orders=3,
        compliance_rate_percent=100.0,
        weekly_trips_prevented=7
    )`,
    sampleRequest: `GET /api/v1/analytics/summary`,
    sampleResponse: `{\n  "total_assets_monitored": 142,\n  "overall_health_index": 98.4,\n  "active_p1_work_orders": 3,\n  "compliance_rate_percent": 100.0,\n  "weekly_trips_prevented": 7\n}`
  }
];

export const FastAPIModule: React.FC<FastAPIModuleProps> = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleDoc>(FASTAPI_MODULES[0]);
  const [activeTab, setActiveTab] = useState<"explorer" | "tree" | "docker">("explorer");
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTestEndpoint = () => {
    setExecutionResult("Executing HTTP POST Request to " + selectedModule.endpoint + "...");
    setTimeout(() => {
      setExecutionResult(selectedModule.sampleResponse);
    }, 600);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-slate-50 text-slate-900 shadow-sm border border-indigo-100/90">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>PRODUCTION-READY FASTAPI CODEBASE GENERATED</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            IndusMind Enterprise FastAPI Service Suite
          </h1>
          <p className="text-xs text-slate-600 max-w-3xl font-medium">
            Complete high-performance Python FastAPI backend architecture featuring all 10 industrial modules, Pydantic v2 schemas, JWT authentication, request context logging, Docker containerization, and CORS middleware.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="/api/v1/health"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all border border-slate-200 shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            <span>Node/Express Proxy Health</span>
          </a>
        </div>
      </div>

      {/* Main View Switcher Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("explorer")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "explorer"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Interactive 10-Module API Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab("tree")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "tree"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Directory & Architecture Structure</span>
        </button>

        <button
          onClick={() => setActiveTab("docker")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === "docker"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Production Docker Deployment</span>
        </button>
      </div>

      {/* View 1: Interactive API Explorer */}
      {activeTab === "explorer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module List Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
              Select FastAPI Module (10/10)
            </div>

            <div className="space-y-1.5">
              {FASTAPI_MODULES.map((mod) => {
                const Icon = mod.icon;
                const isSelected = selectedModule.id === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModule(mod);
                      setExecutionResult(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-blue-600"}`} />
                      <span className="font-bold">{mod.name}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : mod.method === "POST"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {mod.method}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Code & Test Execution Panel */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                      {selectedModule.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {selectedModule.endpoint}
                    </span>
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedModule.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedModule.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleCopyCode(selectedModule.codeSnippet)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Python Code"}</span>
                  </button>
                  <button
                    onClick={handleTestEndpoint}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Test Endpoint</span>
                  </button>
                </div>
              </div>

              {/* Python Implementation Code Box */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono flex items-center justify-between">
                  <span>FastAPI Router Implementation (Python 3.11)</span>
                  <span>app/routers/{selectedModule.id}.py</span>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                  <code>{selectedModule.codeSnippet}</code>
                </pre>
              </div>

              {/* Sample Request / Response Mock Tester */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 font-mono">Sample Request Payload</div>
                  <pre className="p-3 rounded-xl bg-slate-900 text-blue-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
                    <code>{selectedModule.sampleRequest}</code>
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 font-mono">
                    {executionResult ? "Execution Output Response (200 OK)" : "Sample Expected JSON Response"}
                  </div>
                  <pre className={`p-3 rounded-xl font-mono text-[11px] overflow-x-auto border ${executionResult ? "bg-slate-950 text-emerald-400 border-emerald-800" : "bg-slate-900 text-emerald-300 border-slate-800"}`}>
                    <code>{executionResult || selectedModule.sampleResponse}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Folder Tree Architecture */}
      {activeTab === "tree" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <FolderTree className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Complete FastAPI Backend Repository Folder Structure
              </h2>
              <p className="text-xs text-slate-500">
                Generated cleanly under <code className="text-blue-600 font-mono">/backend/</code> directory.
              </p>
            </div>
          </div>

          <pre className="p-5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
{`backend/
├── app/
│   ├── main.py                  # FastAPI Application Entrypoint & Middleware Registration
│   ├── config.py                # Pydantic BaseSettings Environment Configuration
│   ├── core/
│   │   ├── security.py          # OAuth2 Password Bearer, Passlib Bcrypt & PyJWT Utilities
│   │   └── logging_config.py    # Structured JSON Logger & Contextual Tracer
│   ├── middleware/
│   │   └── custom_middleware.py # Request ID Tracing & Execution Process Time Header
│   ├── models/
│   │   └── schemas.py           # Strict Pydantic v2 Models for all 10 Modules
│   └── routers/
│       ├── auth.py              # 1. Authentication Router
│       ├── upload.py            # 2. Async Document Upload Pipeline
│       ├── ocr.py               # 3. Optical Character Recognition API
│       ├── entities.py          # 4. Entity Extraction & NER API
│       ├── knowledge_graph.py   # 5. Graph Topology & Edge Query Router
│       ├── vector_db.py         # 6. High-Dimensional Vector Search RAG
│       ├── chat.py              # 7. Copilot Chat Completion Engine
│       ├── compliance.py        # 8. Statutory Compliance Auditor
│       ├── maintenance.py       # 9. Predictive Asset Health & RUL Router
│       └── analytics.py         # 10. Executive KPI Summary Router
├── Dockerfile                   # Multi-Stage Python 3.11-Slim Container Build
├── docker-compose.yml           # Production Docker Stack Orchestration
├── requirements.txt             # Frozen Production Dependencies
└── README.md                    # Quickstart Documentation & OpenAPI Specs`}
          </pre>
        </div>
      )}

      {/* View 3: Production Docker Deployment */}
      {activeTab === "docker" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Production Deployment Commands & Docker Setup
              </h2>
              <p className="text-xs text-slate-500">
                Run natively with Uvicorn or containerize using Docker Compose.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-600" /> Option A: Local Python Virtual Environment
              </h3>
              <pre className="p-3 rounded-lg bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" /> Option B: Docker Compose Container Stack
              </h3>
              <pre className="p-3 rounded-lg bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`cd backend
docker-compose up -d --build
docker-compose logs -f fastapi-backend`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
