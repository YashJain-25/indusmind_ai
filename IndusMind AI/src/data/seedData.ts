import {
  AgentStatus,
  IndustrialDocument,
  EquipmentTwin,
  WorkOrder,
  IncidentRecord,
  GraphNode,
  GraphEdge,
  ComplianceItem,
  LessonItem,
  WorkflowRule,
  AgentActivityLog
} from "../types";

export const INITIAL_AGENTS: AgentStatus[] = [
  {
    id: "agent-1",
    name: "Orion™",
    codeName: "Orchestrator AI",
    role: "System Agent Multi-Dispatcher",
    status: "active",
    lastAction: "Dispatched Sentinel alert to Field Technician Mobile app",
    latencyMs: 14,
    accuracyRate: 99.8,
    iconName: "Cpu",
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "agent-2",
    name: "Atlas Extract™",
    codeName: "Doc Intelligence",
    role: "OCR, CAD & P&ID Vision Pipeline",
    status: "active",
    lastAction: "Indexed 14 pages of SOP-2024-PUMP with 98% entity accuracy",
    latencyMs: 42,
    accuracyRate: 98.5,
    iconName: "FileSearch",
    color: "from-emerald-600 to-teal-600"
  },
  {
    id: "agent-3",
    name: "PulseGraph™",
    codeName: "Knowledge Graph Engine",
    role: "Cross-Asset Neural Knowledge Synthesizer",
    status: "active",
    lastAction: "Updated 84 relationships linking P-101 to OISD-118",
    latencyMs: 28,
    accuracyRate: 99.1,
    iconName: "Network",
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: "agent-4",
    name: "Cortex™",
    codeName: "Enterprise Copilot",
    role: "Explainable Industrial RAG Reasoning",
    status: "active",
    lastAction: "Answered 12 operational queries with exact page citations",
    latencyMs: 65,
    accuracyRate: 97.9,
    iconName: "Bot",
    color: "from-cyan-600 to-blue-600"
  },
  {
    id: "agent-5",
    name: "Sentinel™",
    codeName: "Predictive Maintenance",
    role: "FFT Vibration & RUL Anomaly Engine",
    status: "warning",
    lastAction: "Flagged Pump P-101 vibration excursion (8.8 mm/s)",
    latencyMs: 19,
    accuracyRate: 96.8,
    iconName: "Activity",
    color: "from-amber-600 to-orange-600"
  },
  {
    id: "agent-6",
    name: "Guardian™",
    codeName: "Compliance AI",
    role: "Regulatory & Statutory Audit Inspector",
    status: "active",
    lastAction: "Verified 32 PESO static vessel safety clauses",
    latencyMs: 31,
    accuracyRate: 99.4,
    iconName: "ShieldCheck",
    color: "from-red-600 to-rose-600"
  },
  {
    id: "agent-7",
    name: "Echo™",
    codeName: "Lessons Learned",
    role: "Historical Pattern & Failure Memory",
    status: "active",
    lastAction: "Detected 3 recurring seal failures across Plant 02 and Plant 04",
    latencyMs: 38,
    accuracyRate: 95.2,
    iconName: "History",
    color: "from-violet-600 to-purple-600"
  },
  {
    id: "agent-8",
    name: "Scout™",
    codeName: "Field Assistant",
    role: "Mobile QR & Voice Assistant",
    status: "active",
    lastAction: "Synced 4 offline technician maintenance check logs",
    latencyMs: 22,
    accuracyRate: 98.9,
    iconName: "Smartphone",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "agent-9",
    name: "InsightX™",
    codeName: "Executive AI",
    role: "Enterprise KPI & Risk Analytics",
    status: "active",
    lastAction: "Generated Q3 MTBF Reliability & Cost Report",
    latencyMs: 45,
    accuracyRate: 99.0,
    iconName: "BarChart3",
    color: "from-fuchsia-600 to-pink-600"
  }
];

export const INITIAL_EQUIPMENT: EquipmentTwin[] = [
  {
    id: "eq-1",
    code: "P-101",
    name: "Primary Boiler Feed Centrifugal Pump",
    type: "Centrifugal Pump",
    plant: "Gujarat Refinery - Plant 04",
    location: "Pump Bay 02 - Grid B4",
    status: "Warning",
    healthScore: 68,
    rulDays: 14,
    vibration: 8.8,
    vibrationMax: 4.5,
    temperature: 88.5,
    temperatureMax: 80.0,
    pressure: 24.2,
    pressureMax: 30.0,
    rpm: 2950,
    lastMaintenance: "2026-05-12",
    nextMaintenance: "2026-07-28",
    linkedSop: "SOP-2024-PUMP-OVERHAUL.pdf",
    spareParts: [
      { code: "SKF-6314", name: "Heavy Duty Drive-End Ball Bearing", Qty: 4, leadTimeDays: 2 },
      { code: "MS-VITON-101", name: "Double-Lip Viton Mechanical Seal", Qty: 2, leadTimeDays: 1 }
    ],
    sensorHistory: [
      { timestamp: "08:00", vibration: 4.1, temperature: 72, pressure: 24.0 },
      { timestamp: "10:00", vibration: 5.2, temperature: 76, pressure: 24.1 },
      { timestamp: "12:00", vibration: 6.8, temperature: 81, pressure: 24.0 },
      { timestamp: "14:00", vibration: 7.9, temperature: 85, pressure: 24.2 },
      { timestamp: "16:00", vibration: 8.8, temperature: 88.5, pressure: 24.2 }
    ]
  },
  {
    id: "eq-2",
    code: "T-200",
    name: "Heavy Duty Gas Turbine Generator Unit 2",
    type: "Gas Turbine",
    plant: "Gujarat Refinery - Plant 04",
    location: "Power Generation Block A",
    status: "Optimal",
    healthScore: 94,
    rulDays: 180,
    vibration: 1.8,
    vibrationMax: 3.5,
    temperature: 420.0,
    temperatureMax: 550.0,
    pressure: 14.5,
    pressureMax: 20.0,
    rpm: 5400,
    lastMaintenance: "2026-06-01",
    nextMaintenance: "2026-11-15",
    linkedSop: "SOP-TURBINE-INSPECTION-REV3.pdf",
    spareParts: [
      { code: "GT-FL-90", name: "Turbine Fuel Nozzle Filter Element", Qty: 12, leadTimeDays: 5 }
    ],
    sensorHistory: [
      { timestamp: "08:00", vibration: 1.7, temperature: 415, pressure: 14.4 },
      { timestamp: "12:00", vibration: 1.8, temperature: 418, pressure: 14.5 },
      { timestamp: "16:00", vibration: 1.8, temperature: 420, pressure: 14.5 }
    ]
  },
  {
    id: "eq-3",
    code: "HX-402",
    name: "Shell & Tube Crude Pre-Heater Heat Exchanger",
    type: "Heat Exchanger",
    plant: "Mumbai Processing Hub",
    location: "Distillation Unit 01",
    status: "Optimal",
    healthScore: 91,
    rulDays: 120,
    vibration: 0.8,
    vibrationMax: 2.0,
    temperature: 165.0,
    temperatureMax: 220.0,
    pressure: 18.0,
    pressureMax: 25.0,
    rpm: 0,
    lastMaintenance: "2026-04-10",
    nextMaintenance: "2026-09-30",
    linkedSop: "SOP-HX-CLEANING-PROC.pdf",
    spareParts: [
      { code: "GSK-HX-400", name: "High-Temp Spiral Wound Gasket", Qty: 8, leadTimeDays: 3 }
    ],
    sensorHistory: [
      { timestamp: "08:00", vibration: 0.8, temperature: 164, pressure: 18.0 },
      { timestamp: "16:00", vibration: 0.8, temperature: 165, pressure: 18.0 }
    ]
  },
  {
    id: "eq-4",
    code: "C-301",
    name: "High Pressure Reciprocating Hydrogen Compressor",
    type: "Reciprocating Compressor",
    plant: "Gujarat Refinery - Plant 04",
    location: "Hydrocracker Block C",
    status: "Critical",
    healthScore: 42,
    rulDays: 5,
    vibration: 12.4,
    vibrationMax: 7.0,
    temperature: 112.0,
    temperatureMax: 95.0,
    pressure: 68.5,
    pressureMax: 75.0,
    rpm: 1450,
    lastMaintenance: "2026-03-22",
    nextMaintenance: "2026-07-25",
    linkedSop: "SOP-COMPRESSOR-SAFETY-VALVE.pdf",
    spareParts: [
      { code: "VLV-C301", name: "Suction Valve Assembly High Pressure", Qty: 2, leadTimeDays: 4 },
      { code: "RING-PISTON-301", name: "PTFE Rider Ring Set", Qty: 6, leadTimeDays: 2 }
    ],
    sensorHistory: [
      { timestamp: "08:00", vibration: 9.2, temperature: 98, pressure: 67.0 },
      { timestamp: "12:00", vibration: 10.8, temperature: 105, pressure: 68.0 },
      { timestamp: "16:00", vibration: 12.4, temperature: 112, pressure: 68.5 }
    ]
  }
];

export const INITIAL_DOCUMENTS: IndustrialDocument[] = [
  {
    id: "doc-1",
    title: "SOP-2024-PUMP: Centrifugal Boiler Pump Overhaul Procedure",
    category: "SOP",
    fileType: "pdf",
    status: "Ingested & Indexed",
    equipmentId: "P-101",
    extractedEntities: ["P-101", "SKF-6314", "LOTO Safety", "Vibration Limit 4.5 mm/s", "OISD-STD-118"],
    summary: "Complete operational overhaul checklist for boiler feed pumps. Includes alignment protocols, mechanical seal replacement steps, torque specs (120 Nm), and grease repacking schedules.",
    confidence: 0.98,
    uploadedBy: "Reliability Lead",
    uploadedAt: "2026-07-15",
    size: "4.2 MB",
    pageCount: 18
  },
  {
    id: "doc-2",
    title: "P&ID-PID-4021: Boiler Feedwater Piping and Instrumentation Diagram",
    category: "P&ID",
    fileType: "cad",
    status: "Ingested & Indexed",
    equipmentId: "P-101",
    extractedEntities: ["P-101", "PRV-102", "FIT-204", "PT-109", "Recirculation Line"],
    summary: "Engineering P&ID diagram showing suction piping, strainer line, bypass recirculation valve PRV-102, and downstream pressure transmitter PT-109.",
    confidence: 0.96,
    uploadedBy: "Drafting Department",
    uploadedAt: "2026-07-10",
    size: "12.8 MB",
    pageCount: 1
  },
  {
    id: "doc-3",
    title: "ML-904: Vibration & Infrared Thermography Inspection Report",
    category: "Inspection Report",
    fileType: "pdf",
    status: "Ingested & Indexed",
    equipmentId: "P-101",
    extractedEntities: ["P-101", "Drive-End Bearing", "8.8 mm/s Peak", "88.5°C Hotspot"],
    summary: "FFT spectrum shows 1X and 2X rotational peaks indicative of bearing inner race pitting and angular shaft misalignment on P-101.",
    confidence: 0.99,
    uploadedBy: "Vibration Tech Team",
    uploadedAt: "2026-07-21",
    size: "2.1 MB",
    pageCount: 6
  },
  {
    id: "doc-4",
    title: "OISD-STD-118: Oil Industry Safety Directorate Lubrication Rules",
    category: "Regulatory Standard",
    fileType: "pdf",
    status: "Ingested & Indexed",
    extractedEntities: ["ISO VG 68", "Moisture Limit 200 PPM", "Quarterly Sampling"],
    summary: "Mandatory statutory safety standard for hydrocarbon plant rotating equipment lubrication testing, containment, and waste oil handling.",
    confidence: 0.99,
    uploadedBy: "Compliance Admin",
    uploadedAt: "2026-06-01",
    size: "8.5 MB",
    pageCount: 42
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: "wo-1",
    orderId: "WO-2026-8891",
    equipmentId: "eq-1",
    equipmentCode: "P-101",
    equipmentName: "Primary Boiler Feed Centrifugal Pump",
    priority: "P1 - Critical",
    status: "Open",
    assignedTo: "Rajesh Kumar (Senior Technician)",
    description: "Emergency bearing replacement and laser alignment based on Sentinel AI vibration alert (8.8 mm/s).",
    recommendedSpares: ["SKF-6314 Heavy Duty Bearing", "Viton Mechanical Seal Kit"],
    dueDate: "2026-07-24",
    createdAt: "2026-07-22",
    type: "Predictive"
  },
  {
    id: "wo-2",
    orderId: "WO-2026-8802",
    equipmentId: "eq-4",
    equipmentCode: "C-301",
    equipmentName: "High Pressure Reciprocating Compressor",
    priority: "P1 - Critical",
    status: "In Progress",
    assignedTo: "Vikram Singh (Mechanical Specialist)",
    description: "Inspect suction valves and replace PTFE rider ring set due to high vibration (12.4 mm/s).",
    recommendedSpares: ["VLV-C301 Suction Valve", "RING-PISTON-301"],
    dueDate: "2026-07-23",
    createdAt: "2026-07-21",
    type: "Breakdown"
  },
  {
    id: "wo-3",
    orderId: "WO-2026-8710",
    equipmentId: "eq-2",
    equipmentCode: "T-200",
    equipmentName: "Gas Turbine Generator Unit 2",
    priority: "P4 - Routine",
    status: "Awaiting Spares",
    assignedTo: "Amit Sharma (Electrical Lead)",
    description: "Routine quarterly fuel nozzle filter replacement and calibration check.",
    recommendedSpares: ["GT-FL-90 Filter Element"],
    dueDate: "2026-08-01",
    createdAt: "2026-07-18",
    type: "Preventive"
  }
];

export const INITIAL_GRAPH_NODES: GraphNode[] = [
  { id: "node-1", label: "Pump P-101", type: "Equipment", subText: "Boiler Feed Pump", status: "Warning", x: 150, y: 150 },
  { id: "node-2", label: "Plant 04", type: "Plant", subText: "Gujarat Refinery", status: "Optimal", x: 400, y: 80 },
  { id: "node-3", label: "SOP-2024-PUMP", type: "Document", subText: "Overhaul Manual", status: "Optimal", x: 120, y: 320 },
  { id: "node-4", label: "OISD-STD-118", type: "Regulation", subText: "Safety Directorate", status: "Optimal", x: 380, y: 350 },
  { id: "node-5", label: "SKF Bearings", type: "Vendor", subText: "Tier 1 Supplier", status: "Optimal", x: 620, y: 180 },
  { id: "node-6", label: "High Vibration Incident", type: "Incident", subText: "8.8 mm/s Peak", status: "Warning", x: 300, y: 220 },
  { id: "node-7", label: "Rajesh Kumar", type: "Technician", subText: "Senior Tech", status: "Optimal", x: 550, y: 310 }
];

export const INITIAL_GRAPH_EDGES: GraphEdge[] = [
  { id: "edge-1", source: "node-1", target: "node-2", relationship: "INSTALLED_IN" },
  { id: "edge-2", source: "node-1", target: "node-3", relationship: "HAS_MANUAL" },
  { id: "edge-3", source: "node-1", target: "node-6", relationship: "FAILED_DUE_TO" },
  { id: "edge-4", source: "node-3", target: "node-4", relationship: "REFERENCES" },
  { id: "edge-5", source: "node-5", target: "node-1", relationship: "GOVERNED_BY" },
  { id: "edge-6", source: "node-7", target: "node-1", relationship: "PERFORMED_BY" }
];

export const INITIAL_COMPLIANCE: ComplianceItem[] = [
  {
    id: "comp-1",
    regulation: "Factory Act Sec 31",
    clause: "Clause 31(2) Pressure Plant Vessel Testing",
    description: "Mandatory hydro-testing and safety valve calibration every 12 months for pressure vessels operating >1.5 Bar.",
    status: "Compliant",
    riskLevel: "Low",
    evidenceDoc: "Cert-PV-2025-Hydro.pdf",
    lastAudited: "2026-05-10",
    nextAuditDate: "2027-05-10"
  },
  {
    id: "comp-2",
    regulation: "OISD-STD-118",
    clause: "Section 4.1 Oil Condition Monitoring",
    description: "Quarterly oil viscosity and moisture analysis for all critical rotating pumps and compressors.",
    status: "Gap Detected",
    riskLevel: "High",
    evidenceDoc: "ML-904-Oil-Log.pdf",
    lastAudited: "2026-07-20",
    nextAuditDate: "2026-08-01"
  },
  {
    id: "comp-3",
    regulation: "PESO Static Vessel Rules",
    clause: "Rule 18 Gas Storage Inspection",
    description: "Periodic non-destructive thickness testing (NDT) for LPG/Hydrogen pressurized tanks.",
    status: "Audit Pending",
    riskLevel: "Medium",
    evidenceDoc: "NDT-Report-C301.pdf",
    lastAudited: "2025-11-15",
    nextAuditDate: "2026-07-30"
  }
];

export const INITIAL_LESSONS: LessonItem[] = [
  {
    id: "les-1",
    title: "Centrifugal Pump Mechanical Seal Thermal Breakdown under High Washdown",
    equipmentCategory: "Centrifugal Pumps",
    failurePattern: "Repeated moisture ingress past single-lip rubber seal causing bearing corrosion",
    rootCause: "Standard rubber oil seal degraded due to caustic washdown spray",
    keyTakeaway: "Upgrade all refinery washdown zone pumps to Viton double-lip labyrinth seals",
    occurrencesCount: 4,
    plantsAffected: ["Gujarat Refinery Plant 04", "Mumbai Processing Hub"],
    dateLogged: "2026-06-18"
  },
  {
    id: "les-2",
    title: "Reciprocating Compressor Suction Valve Fatigue Failure",
    equipmentCategory: "Compressors",
    failurePattern: "Sudden pressure drop and temperature rise (>110°C) on cylinder 2",
    rootCause: "Metallic valve plate micro-fracture from liquid carryover in suction gas line",
    keyTakeaway: "Install continuous knock-out pot level transmitter with automatic trip interlock",
    occurrencesCount: 2,
    plantsAffected: ["Gujarat Refinery Plant 04"],
    dateLogged: "2026-05-02"
  }
];

export const INITIAL_RULES: WorkflowRule[] = [
  {
    id: "rule-1",
    title: "Critical Vibration Anomaly Work Order Trigger",
    trigger: "Equipment Vibration > 7.5 mm/s",
    condition: "Health Score < 70%",
    action: "Trigger Sentinel AI -> Auto-create P1 Work Order -> Alert Field Technician Scout™",
    enabled: true,
    executionCount: 18,
    lastTriggered: "10 mins ago"
  },
  {
    id: "rule-2",
    title: "Compliance Gap Audit Escalation",
    trigger: "Compliance Status == 'Gap Detected'",
    condition: "Risk Level == 'High'",
    action: "Notify Compliance Officer -> Generate Audit Evidence Package -> Pin to Command Center",
    enabled: true,
    executionCount: 4,
    lastTriggered: "2 hours ago"
  },
  {
    id: "rule-3",
    title: "Document Ingestion Knowledge Graph Auto-Index",
    trigger: "New SOP / Drawing Ingested",
    condition: "Extraction Confidence > 90%",
    action: "Pass to Atlas Extract™ -> Update PulseGraph™ Links -> Re-index Cortex RAG Engine",
    enabled: true,
    executionCount: 52,
    lastTriggered: "Yesterday"
  }
];

export const INITIAL_ACTIVITY_LOGS: AgentActivityLog[] = [
  {
    id: "act-1",
    agentName: "Sentinel™",
    agentCode: "PRED_AI",
    action: "Vibration FFT Threshold Violation",
    target: "Pump P-101",
    status: "warning",
    details: "Detected 8.8 mm/s vibration at 2950 RPM. Generated predictive failure alert.",
    timestamp: "10:42 AM"
  },
  {
    id: "act-2",
    agentName: "Atlas Extract™",
    agentCode: "DOC_AI",
    action: "Document Vectorization Completed",
    target: "SOP-2024-PUMP.pdf",
    status: "success",
    details: "Extracted 18 pages, 14 entities, 5 safety warnings, and 3 key pressure specs.",
    timestamp: "10:15 AM"
  },
  {
    id: "act-3",
    agentName: "Guardian™",
    agentCode: "COMP_AI",
    action: "Statutory Gap Detected",
    target: "OISD-STD-118",
    status: "warning",
    details: "Moisture content in P-101 lube oil log exceeds 200 PPM ceiling limit.",
    timestamp: "09:30 AM"
  },
  {
    id: "act-4",
    agentName: "PulseGraph™",
    agentCode: "GRAPH_AI",
    action: "Knowledge Graph Link Synced",
    target: "P-101 -> SOP-2024 -> SKF Bearings",
    status: "info",
    details: "Added 6 cross-functional neural nodes and 8 relationship edges in graph database.",
    timestamp: "09:05 AM"
  }
];
