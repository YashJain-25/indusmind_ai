from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# 1. Auth Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# 2. Upload Schemas
class DocumentUploadResponse(BaseModel):
    file_id: str
    filename: str
    file_type: str
    size_bytes: int
    storage_path: str
    status: str = "INGESTED"

# 3. OCR Schemas
class OCRRequest(BaseModel):
    file_id: str
    language: str = "eng"

class OCRResult(BaseModel):
    file_id: str
    ocr_text: str
    confidence: float
    page_count: int
    bounding_boxes_extracted: int

# 4. Entity Extraction Schemas
class EntityExtractRequest(BaseModel):
    text: str
    document_id: Optional[str] = None

class ExtractedEntity(BaseModel):
    name: str
    category: str  # Equipment, Valve, Standard, Regulation, SparePart
    confidence: float
    span: str

class EntityExtractionResponse(BaseModel):
    entities: List[ExtractedEntity]
    parameters: Dict[str, str]
    safety_warnings: List[str]

# 5. Knowledge Graph Schemas
class GraphNode(BaseModel):
    id: str
    label: str
    type: str

class GraphEdge(BaseModel):
    source: str
    target: str
    relation: str

class KnowledgeGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# 6. Vector DB Schemas
class VectorSearchRequest(BaseModel):
    query: str
    top_k: int = 5

class VectorSearchResult(BaseModel):
    doc_id: str
    text_chunk: str
    similarity_score: float
    metadata: Dict[str, Any]

# 7. Chat API Schemas
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_role: Optional[str] = "Plant Engineer"

class ChatResponse(BaseModel):
    answer: str
    confidence_score: float
    sources: List[Dict[str, Any]]
    suggested_actions: List[str]

# 8. Compliance API Schemas
class ComplianceCheckRequest(BaseModel):
    equipment_tag: str
    standard_code: str = "OISD-STD-118"

class ComplianceReportResponse(BaseModel):
    equipment_tag: str
    status: str  # COMPLIANT, NON_COMPLIANT, WARNING
    audit_score: float
    violations: List[str]
    corrective_steps: List[str]

# 9. Maintenance API Schemas
class TelemetryInput(BaseModel):
    equipment_code: str
    vibration_mms: float
    temperature_c: float
    pressure_bar: float
    rpm: float

class MaintenancePredictionResponse(BaseModel):
    equipment_code: str
    failure_probability: float
    remaining_useful_life_days: int
    predicted_failure_mode: str
    recommended_spares: List[Dict[str, Any]]

# 10. Analytics API Schemas
class AnalyticsSummaryResponse(BaseModel):
    total_assets_monitored: int
    overall_health_index: float
    active_p1_work_orders: int
    compliance_rate_percent: float
    weekly_trips_prevented: int
