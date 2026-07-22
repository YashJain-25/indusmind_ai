export type UserRole =
  | 'Plant Manager'
  | 'Operations Manager'
  | 'Reliability Engineer'
  | 'Maintenance Engineer'
  | 'Field Technician'
  | 'Compliance Officer'
  | 'Safety Officer'
  | 'Quality Engineer'
  | 'Executive Leadership';

export type AppModule =
  | 'login'
  | 'dashboard'
  | 'documents'
  | 'graph'
  | 'copilot'
  | 'compliance'
  | 'maintenance'
  | 'rca'
  | 'reports'
  | 'analytics'
  | 'admin'
  | 'fastapi'
  | 'lessons'
  | 'twin'
  | 'automation'
  | 'audit'
  | 'notifications'
  | 'mobile';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  plantLocation: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  codeName: string;
  role: string;
  status: 'active' | 'processing' | 'standby' | 'warning';
  lastAction: string;
  latencyMs: number;
  accuracyRate: number;
  iconName: string;
  color: string;
}

export interface IndustrialDocument {
  id: string;
  title: string;
  category: 'SOP' | 'P&ID' | 'Inspection Report' | 'Maintenance Log' | 'Manual' | 'Regulatory Standard' | 'CAD Drawing';
  fileType: 'pdf' | 'docx' | 'image' | 'cad' | 'email';
  status: 'Ingested & Indexed' | 'Processing' | 'Pending Vectorization';
  equipmentId?: string;
  extractedEntities: string[];
  summary: string;
  confidence: number;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  pageCount?: number;
  fileUrl?: string;
}

export interface EquipmentTwin {
  id: string;
  code: string;
  name: string;
  type: 'Centrifugal Pump' | 'Gas Turbine' | 'Heat Exchanger' | 'Reciprocating Compressor' | 'Control Valve' | 'Boiler';
  plant: string;
  location: string;
  status: 'Optimal' | 'Warning' | 'Critical' | 'Maintenance';
  healthScore: number; // 0-100
  rulDays: number;
  vibration: number; // mm/s
  vibrationMax: number;
  temperature: number; // °C
  temperatureMax: number;
  pressure: number; // Bar
  pressureMax: number;
  rpm: number;
  lastMaintenance: string;
  nextMaintenance: string;
  linkedSop: string;
  spareParts: { code: string; name: string; Qty: number; leadTimeDays: number }[];
  model3DUrl?: string;
  sensorHistory: { timestamp: string; vibration: number; temperature: number; pressure: number }[];
}

export interface WorkOrder {
  id: string;
  orderId: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  priority: 'P1 - Critical' | 'P2 - High' | 'P3 - Medium' | 'P4 - Routine';
  status: 'Open' | 'In Progress' | 'Awaiting Spares' | 'Completed';
  assignedTo: string;
  description: string;
  recommendedSpares: string[];
  dueDate: string;
  createdAt: string;
  type: 'Predictive' | 'Preventive' | 'Breakdown' | 'Compliance';
}

export interface IncidentRecord {
  id: string;
  title: string;
  equipmentCode: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Investigating' | 'RCA Completed' | 'CAPA Implemented';
  rootCause?: string;
  fiveWhys?: { step: number; question: string; answer: string }[];
  fishbone?: Record<string, string[]>;
  capa?: { type: string; action: string; owner: string; timeline: string }[];
  reportedBy: string;
  timestamp: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'Equipment' | 'Plant' | 'Vendor' | 'Document' | 'Incident' | 'Technician' | 'Regulation';
  subText?: string;
  status?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'INSTALLED_IN' | 'HAS_MANUAL' | 'FAILED_DUE_TO' | 'REFERENCES' | 'PERFORMED_BY' | 'GOVERNED_BY';
}

export interface ComplianceItem {
  id: string;
  regulation: 'Factory Act Sec 31' | 'OISD-STD-118' | 'PESO Static Vessel Rules' | 'ISO 55001' | 'SOP-2024 Safety';
  clause: string;
  description: string;
  status: 'Compliant' | 'Gap Detected' | 'Audit Pending' | 'Overdue Check';
  riskLevel: 'Low' | 'Medium' | 'High';
  evidenceDoc?: string;
  lastAudited: string;
  nextAuditDate: string;
}

export interface LessonItem {
  id: string;
  title: string;
  equipmentCategory: string;
  failurePattern: string;
  rootCause: string;
  keyTakeaway: string;
  occurrencesCount: number;
  plantsAffected: string[];
  dateLogged: string;
}

export interface WorkflowRule {
  id: string;
  title: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
  executionCount: number;
  lastTriggered?: string;
}

export interface AgentActivityLog {
  id: string;
  agentName: string;
  agentCode: string;
  action: string;
  target: string;
  status: 'success' | 'warning' | 'info' | 'error';
  details: string;
  timestamp: string;
}
