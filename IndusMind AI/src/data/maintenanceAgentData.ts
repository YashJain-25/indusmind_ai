export interface DataInputCategory {
  id: string;
  name: string;
  iconName: string;
  format: string;
  updateFrequency: string;
  description: string;
  keyFieldsExtracted: string[];
  samplePayload: string;
}

export interface IntelligenceOutputDeliverable {
  id: string;
  name: string;
  iconName: string;
  category: string;
  description: string;
  businessImpact: string;
  sampleOutput: any;
}

export interface AgentWorkflowNode {
  id: string;
  stepNumber: number;
  agentName: string;
  role: string;
  primaryModel: string;
  inputDependencies: string[];
  outputArtifacts: string[];
  description: string;
}

export interface MaintenanceDatabaseSchema {
  tableName: string;
  description: string;
  primaryKey: string;
  columns: { name: string; type: string; constraints: string; description: string }[];
  drizzleCodeSnippet: string;
}

export interface MaintenanceAlgorithm {
  id: string;
  name: string;
  category: "Predictive ML" | "Reliability Math" | "Physics-Informed";
  formulaLatex: string;
  plainFormula: string;
  description: string;
  codeSnippetTS: string;
  variableDefinitions: { name: string; desc: string }[];
}

export const INPUT_DATA_SOURCES: DataInputCategory[] = [
  {
    id: "maint-records",
    name: "Historical Maintenance Records",
    iconName: "History",
    format: "PostgreSQL / SAP PM / Maximo DB",
    updateFrequency: "Batch / Post-Event",
    description: "Historical log of preventive and corrective maintenance events, mean time between failures (MTBF), overhaul frequencies, and component replacement logs.",
    keyFieldsExtracted: ["equipment_id", "failure_date", "component_replaced", "downtime_hours", "mtbf_days", "technician_notes"],
    samplePayload: `{\n  "equipment_id": "P-101-A",\n  "event_type": "Corrective Overhaul",\n  "failure_date": "2025-08-29T14:30:00Z",\n  "component": "Mechanical Seal",\n  "downtime_hours": 8.5,\n  "root_cause_summary": "Thermal cracking on SiC seal face due to dry running."\n}`
  },
  {
    id: "work-orders",
    name: "Work Orders & Labor Logs",
    iconName: "FileCheck",
    format: "REST API / SAP ERP JSON",
    updateFrequency: "Real-time Event Stream",
    description: "Active, pending, and historical work order tickets capturing labor hours, craft specializations required, safety permits, and spare parts consumed.",
    keyFieldsExtracted: ["wo_number", "priority_p1_p4", "assigned_craft", "spare_parts_used", "status", "execution_time_hrs"],
    samplePayload: `{\n  "wo_number": "WO-2026-8812",\n  "equipment_code": "P-101-A",\n  "priority": "P1 - Critical",\n  "type": "Predictive",\n  "parts_reserved": ["SKF-6218-BEARING", "VITON-9921-ORING"],\n  "status": "In Progress"\n}`
  },
  {
    id: "inspection-reports",
    name: "NDT Inspection & Lab Reports",
    iconName: "FileText",
    format: "PDF Documents / OCR JSON",
    updateFrequency: "Weekly / Monthly Audit",
    description: "Unstructured Non-Destructive Testing (NDT) reports including ultrasonic wall thickness (UT) maps, thermography infrared images, oil spectroscopy wear particle counts, and vibration analyst logs.",
    keyFieldsExtracted: ["inspection_date", "ut_wall_thickness_mm", "oil_iron_ppm", "oil_viscosity_cst", "ir_temp_hotspot_c", "analyst_verdict"],
    samplePayload: `{\n  "report_id": "UT-2025-TK204",\n  "inspection_type": "Ultrasonic Thickness",\n  "measurement_mm": 10.8,\n  "nominal_mm": 12.0,\n  "minimum_allowable_mm": 8.5,\n  "oil_sample": { "fe_ppm": 48, "water_ppm": 120 }\n}`
  },
  {
    id: "sensor-telemetry",
    name: "High-Frequency Sensor SCADA Streams",
    iconName: "Activity",
    format: "MQTT / Kafka / OPC-UA Time Series",
    updateFrequency: "100ms - 1s Streaming",
    description: "Real-time IoT telemetry covering 3-axis FFT vibration acceleration (mm/s), bearing temperature (°C), suction/discharge pressure (PSI), shaft RPM, and electrical motor current draw (Amps).",
    keyFieldsExtracted: ["timestamp", "vibration_rms_mms", "bearing_temp_c", "discharge_pressure_psi", "motor_amps", "fft_peak_freq_hz"],
    samplePayload: `{\n  "sensor_id": "IOT-P101A-VIB01",\n  "timestamp": "2026-07-22T10:15:00.120Z",\n  "vibration_rms_mms": 6.84,\n  "bearing_temp_c": 82.4,\n  "pressure_psi": 340.2,\n  "motor_amps": 142.8\n}`
  },
  {
    id: "oem-manuals",
    name: "OEM Technical Manuals & Specs",
    iconName: "BookOpen",
    format: "Vector Embeddings / PDF Manuals",
    updateFrequency: "Static / Document Revision",
    description: "Original Equipment Manufacturer manuals containing design operating limits, clearance thresholds, lubrication schedules, recommended spare parts lists, and explosion diagrams.",
    keyFieldsExtracted: ["oem_brand", "max_operating_temp_c", "max_vibration_alarm_mms", "lubrication_interval_hrs", "torque_ftlbs"],
    samplePayload: `{\n  "manual_id": "OEM-SIEMENS-M401",\n  "vibration_alarm_limit": 7.1,\n  "max_temp_trip": 95.0,\n  "lubricant_spec": "Mobilith SHC 100",\n  "regrease_hours": 2000\n}`
  }
];

export const DELIVERABLE_OUTPUTS: IntelligenceOutputDeliverable[] = [
  {
    id: "out-failure-pred",
    name: "Failure Prediction & Mode Classification",
    iconName: "AlertTriangle",
    category: "Predictive Analytics",
    description: "Predicts specific impending failure modes (e.g. Bearing Inner Raceway Spalling, Mechanical Seal Dry Running) with machine learning probability confidence.",
    businessImpact: "Eliminates unplanned catastrophic trips and prevents collateral damage to surrounding plant trains.",
    sampleOutput: {
      predictedFailureMode: "Outboard Bearing SKF-6218 Fatigue Spalling",
      failureProbability: 94.2,
      timeToFailureHrs: 184,
      severityCategory: "CRITICAL"
    }
  },
  {
    id: "out-rul",
    name: "Remaining Useful Life (RUL) Calculation",
    iconName: "Clock",
    category: "Prognostics",
    description: "Estimates remaining operational hours before component degradation exceeds API safety thresholds using physics-informed degradation models.",
    businessImpact: "Allows engineers to run equipment to maximum safe lifespan without premature part replacement.",
    sampleOutput: {
      rulOperatingHours: 184,
      rulUpperConfidenceHrs: 196,
      rulLowerConfidenceHrs: 172,
      confidenceInterval: "95%"
    }
  },
  {
    id: "out-pm-schedule",
    name: "Dynamic PM & Overhaul Schedule",
    iconName: "Calendar",
    category: "Prescriptive Execution",
    description: "Generates an optimized maintenance window taking plant turnaround schedules, spare parts lead times, and technician availability into account.",
    businessImpact: "Reduces maintenance labor cost by 35% and coordinates repairs with planned production downtime.",
    sampleOutput: {
      recommendedDate: "2026-07-28",
      priority: "P1 - Immediate Action",
      requiredDowntimeHrs: 4.5,
      assignedTechnicianRole: "Senior Millwright / Vibration Analyst"
    }
  },
  {
    id: "out-critical-rank",
    name: "Critical Equipment Ranking Matrix",
    iconName: "TrendingUp",
    category: "Asset Risk Governance",
    description: "Ranks all plant assets on an AI Criticality Matrix based on failure probability, downtime financial impact ($/hr), and environmental safety hazard.",
    businessImpact: "Guides capital expenditure and maintenance focus toward highest-risk plant machinery.",
    sampleOutput: {
      assetRank: 1,
      criticalityClass: "Class A - Mission Critical",
      financialDowntimeCostPerHour: "$18,500/hr",
      compositeRiskScore: 92.4
    }
  },
  {
    id: "out-risk-score",
    name: "Multi-Factor Composite Risk Score",
    iconName: "ShieldAlert",
    category: "Health & Safety Index",
    description: "Computes a real-time 0-100 Risk Score combining sensor anomaly magnitude, historical failure rate, and operating environment stress factors.",
    businessImpact: "Provides plant executive dashboards with transparent, real-time asset health posture.",
    sampleOutput: {
      compositeRiskScore: 92.4,
      vibrationComponentScore: 98.0,
      temperatureComponentScore: 88.5,
      oilWearComponentScore: 90.0,
      status: "HIGH RISK - ACTION REQUIRED"
    }
  },
  {
    id: "out-rca",
    name: "Automated 5-Why Root Cause Analysis",
    iconName: "Activity",
    category: "Diagnostic Engineering",
    description: "Synthesizes sensor timelines with past maintenance logs to construct an automated 5-Why root cause chain explaining why degradation occurred.",
    businessImpact: "Accelerates root cause investigation time from days to minutes and prevents recurring failures.",
    sampleOutput: {
      rootCauseSummary: "Diaphragm fatigue rupture on biocide dosing pump DP-12 leading to cooling water bio-fouling and bearing overheating.",
      fiveWhyChain: [
        "1. Why trip? Bearing temp exceeded 85°C limit.",
        "2. Why hot? Cooling water flow degraded from 120 GPM to 22 GPM.",
        "3. Why flow dropped? Strainer ST-301 clogged with bio-fouling.",
        "4. Why bio-fouling? Biocide dosing pump DP-12 stopped running.",
        "5. ROOT CAUSE: DP-12 elastomer diaphragm ruptured due to exceeding 12-month service limit."
      ]
    }
  }
];

export const MULTI_AGENT_WORKFLOW: AgentWorkflowNode[] = [
  {
    id: "agent-1",
    stepNumber: 1,
    agentName: "Data Ingestion & Fusion Agent",
    role: "Multimodal Data ETL & Normalization",
    primaryModel: "Python Pandas / Spark + Unstructured OCR Loader",
    inputDependencies: ["SCADA MQTT Streams", "SAP Work Orders", "PDF NDT Reports"],
    outputArtifacts: ["Unified Sensor Engine Frame", "Standardized Document JSON Payload"],
    description: "Ingests high-frequency MQTT sensor time-series, parses PDF inspection reports using OCR vision models, and extracts active SAP work orders into a unified data frame."
  },
  {
    id: "agent-2",
    stepNumber: 2,
    agentName: "SCADA Telemetry Anomaly Agent",
    role: "Vibration FFT & Time-Series Spectral Analysis",
    primaryModel: "Isolation Forest + Autoencoder Neural Network",
    inputDependencies: ["Unified Sensor Engine Frame"],
    outputArtifacts: ["Vibration Anomaly Score", "FFT Harmonic Peak Vectors"],
    description: "Processes 3-axis vibration acceleration signals and bearing temperatures, running FFT spectral decomposition to isolate inner/outer race bearing frequencies."
  },
  {
    id: "agent-3",
    stepNumber: 3,
    agentName: "Physics-Informed Prognostics (RUL) Agent",
    role: "Weibull Hazard & Remaining Useful Life Estimation",
    primaryModel: "Proportional Hazards Model (PHM) + PyTorch",
    inputDependencies: ["FFT Harmonic Peak Vectors", "OEM Manual Specs"],
    outputArtifacts: ["RUL Operational Hours", "Degradation Trajectory Curve"],
    description: "Combines real-time sensor degradation with Weibull hazard distribution curves to compute Remaining Useful Life (RUL) in operating hours with 95% confidence intervals."
  },
  {
    id: "agent-4",
    stepNumber: 4,
    agentName: "Graph RAG & OEM Knowledge Agent",
    role: "Knowledge Graph Traversal & Hybrid Context Search",
    primaryModel: "Gemini 2.5 Flash + Neo4j / Pinecone Hybrid Retriever",
    inputDependencies: ["RUL Operational Hours", "OEM PDF Embeddings"],
    outputArtifacts: ["Retrieved OEM Clearance Limits", "Matched Historical RCA Tickets"],
    description: "Queries Pinecone vector store and Neo4j asset knowledge graph to extract OEM clearance tolerances, torque specs, and historical failure mode matches."
  },
  {
    id: "agent-5",
    stepNumber: 5,
    agentName: "Root Cause Synthesis Agent",
    role: "5-Why Reasoning & Composite Risk Computation",
    primaryModel: "Gemini 2.5 Flash (Temperature = 0.0)",
    inputDependencies: ["Retrieved OEM Clearance Limits", "Vibration Anomaly Score"],
    outputArtifacts: ["Automated 5-Why RCA Chain", "Composite Risk Score (0-100)"],
    description: "Synthesizes multi-source findings into an automated 5-Why root cause chain and computes the multi-factor Equipment Risk Index."
  },
  {
    id: "agent-6",
    stepNumber: 6,
    agentName: "Prescriptive PM Scheduler Agent",
    role: "Work Order Draft & Spare Parts Reservation",
    primaryModel: "Gemini 2.5 Flash Structured Output (Zod Schema)",
    inputDependencies: ["Automated 5-Why RCA Chain", "SAP Inventory API"],
    outputArtifacts: ["Draft Work Order WO-2026", "SAP Warehouse Pick Slip"],
    description: "Generates an optimized preventive maintenance work order, drafts LOTO safety protocols, and reserves required replacement bearings in SAP ERP."
  }
];

export const DATABASE_SCHEMAS: MaintenanceDatabaseSchema[] = [
  {
    tableName: "equipment_assets",
    description: "Master registry for physical plant equipment, criticalities, and operating parameters.",
    primaryKey: "id (UUID)",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Unique asset identifier" },
      { name: "equipment_code", type: "VARCHAR(64)", constraints: "UNIQUE, NOT NULL", description: "Tag code e.g. P-101-A" },
      { name: "name", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Descriptive asset name" },
      { name: "criticality_class", type: "VARCHAR(16)", constraints: "NOT NULL", description: "Class A, Class B, Class C" },
      { name: "downtime_cost_per_hr", type: "NUMERIC(10,2)", constraints: "NOT NULL", description: "Financial cost of downtime in USD/hr" },
      { name: "health_score", type: "INTEGER", constraints: "DEFAULT 100", description: "Current asset health index (0-100)" }
    ],
    drizzleCodeSnippet: `import { pgTable, uuid, varchar, numeric, integer, timestamp } from "drizzle-orm/pg-core";

export const equipmentAssets = pgTable("equipment_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  equipmentCode: varchar("equipment_code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  criticalityClass: varchar("criticality_class", { length: 16 }).notNull(),
  downtimeCostPerHr: numeric("downtime_cost_per_hr", { precision: 10, scale: 2 }).notNull(),
  healthScore: integer("health_score").default(100).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});`
  },
  {
    tableName: "sensor_telemetry",
    description: "High-frequency SCADA time-series telemetry records for vibration, temperature, pressure.",
    primaryKey: "id (BIGINT)",
    columns: [
      { name: "id", type: "BIGSERIAL", constraints: "PRIMARY KEY", description: "Auto-increment ID" },
      { name: "equipment_code", type: "VARCHAR(64)", constraints: "REFERENCES equipment_assets", description: "Foreign key tag" },
      { name: "timestamp", type: "TIMESTAMPTZ", constraints: "NOT NULL", description: "Telemetry timestamp" },
      { name: "vibration_rms_mms", type: "DOUBLE PRECISION", constraints: "NOT NULL", description: "Overall 3-axis vibration velocity" },
      { name: "bearing_temp_c", type: "DOUBLE PRECISION", constraints: "NOT NULL", description: "Outboard bearing temp" },
      { name: "discharge_pressure_psi", type: "DOUBLE PRECISION", constraints: "NOT NULL", description: "Operating discharge pressure" },
      { name: "anomaly_score", type: "DOUBLE PRECISION", constraints: "DEFAULT 0.0", description: "Isolation Forest anomaly rating" }
    ],
    drizzleCodeSnippet: `export const sensorTelemetry = pgTable("sensor_telemetry", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  equipmentCode: varchar("equipment_code", { length: 64 }).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  vibrationRmsMms: doublePrecision("vibration_rms_mms").notNull(),
  bearingTempC: doublePrecision("bearing_temp_c").notNull(),
  dischargePressurePsi: doublePrecision("discharge_pressure_psi").notNull(),
  anomalyScore: doublePrecision("anomaly_score").default(0.0)
});`
  },
  {
    tableName: "rul_predictions",
    description: "Model prediction outputs for Remaining Useful Life, failure mode probability, and risk scores.",
    primaryKey: "id (UUID)",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Prediction record ID" },
      { name: "equipment_code", type: "VARCHAR(64)", constraints: "NOT NULL", description: "Asset tag" },
      { name: "predicted_failure_mode", type: "TEXT", constraints: "NOT NULL", description: "Isolated failure mode" },
      { name: "failure_probability", type: "NUMERIC(5,2)", constraints: "NOT NULL", description: "ML confidence percentage (e.g. 94.20)" },
      { name: "rul_operating_hours", type: "INTEGER", constraints: "NOT NULL", description: "Estimated remaining hours" },
      { name: "composite_risk_score", type: "NUMERIC(5,2)", constraints: "NOT NULL", description: "0-100 composite risk rating" },
      { name: "rca_json", type: "JSONB", constraints: "NOT NULL", description: "Structured 5-Why RCA chain" }
    ],
    drizzleCodeSnippet: `export const rulPredictions = pgTable("rul_predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  equipmentCode: varchar("equipment_code", { length: 64 }).notNull(),
  predictedFailureMode: text("predicted_failure_mode").notNull(),
  failureProbability: numeric("failure_probability", { precision: 5, scale: 2 }).notNull(),
  rulOperatingHours: integer("rul_operating_hours").notNull(),
  compositeRiskScore: numeric("composite_risk_score", { precision: 5, scale: 2 }).notNull(),
  rcaJson: jsonb("rca_json").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});`
  }
];

export const MAINTENANCE_ALGORITHMS: MaintenanceAlgorithm[] = [
  {
    id: "alg-weibull",
    name: "Weibull Distribution Hazard Rate Equation",
    category: "Reliability Math",
    formulaLatex: "h(t) = \\frac{\\beta}{\\eta} \\left( \\frac{t}{\\eta} \\right)^{\\beta - 1}",
    plainFormula: "h(t) = (beta / eta) * (t / eta)^(beta - 1)",
    description: "Calculates the instantaneous failure hazard rate h(t) over time t, where beta (β) is the shape parameter (β > 1 indicates wear-out failure) and eta (η) is the scale parameter (characteristic life).",
    codeSnippetTS: `// Weibull Hazard Rate Function
export function calculateWeibullHazard(tOperatingHours: number, betaShape: number, etaScale: number): number {
  if (tOperatingHours <= 0 || etaScale <= 0) return 0;
  const hazard = (betaShape / etaScale) * Math.pow(tOperatingHours / etaScale, betaShape - 1);
  return hazard; // Returns instantaneous failure rate per hour
}`,
    variableDefinitions: [
      { name: "t", desc: "Current cumulative operating hours" },
      { name: "β (beta)", desc: "Shape parameter (>1 = wear-out phase, =1 = random, <1 = infant mortality)" },
      { name: "η (eta)", desc: "Characteristic life parameter (hours at 63.2% failure probability)" }
    ]
  },
  {
    id: "alg-rul",
    name: "Physics-Informed Remaining Useful Life (RUL) Formula",
    category: "Physics-Informed",
    formulaLatex: "RUL(t) = \\eta \\cdot \\left[ -\\ln(R_{threshold}) \\right]^{1/\\beta} - t_{current}",
    plainFormula: "RUL(t) = eta * (-ln(R_threshold))^(1 / beta) - t_current",
    description: "Derives remaining operational hours RUL(t) until component reliability drops below the critical safety threshold (e.g. R_threshold = 0.10).",
    codeSnippetTS: `// Physics-Informed RUL Calculation
export function calculateRULHours(
  tCurrent: number,
  betaShape: number,
  etaScale: number,
  reliabilityThreshold = 0.10
): number {
  const tFail = etaScale * Math.pow(-Math.log(reliabilityThreshold), 1 / betaShape);
  const rulHours = Math.max(0, tFail - tCurrent);
  return Math.round(rulHours);
}`,
    variableDefinitions: [
      { name: "R_threshold", desc: "Critical reliability limit (e.g. 0.10 for 10% minimum reliability)" },
      { name: "t_current", desc: "Current elapsed operating hours on component" }
    ]
  },
  {
    id: "alg-composite-risk",
    name: "Multi-Factor Composite Asset Risk Index",
    category: "Predictive ML",
    formulaLatex: "Risk = (0.35 \\times P_{failure}) + (0.35 \\times Criticality) + (0.30 \\times Anomaly_{sensor})",
    plainFormula: "Risk = (0.35 * P_failure) + (0.35 * Criticality) + (0.30 * Anomaly_sensor)",
    description: "Computes a weighted 0-100 composite risk score balancing predicted ML failure probability, business criticality financial multiplier, and SCADA sensor anomaly scores.",
    codeSnippetTS: `// Composite Asset Risk Index Calculation
export function calculateCompositeRiskScore(
  failureProbPct: number, // 0 - 100
  criticalityScore: number, // 0 - 100 (Class A = 100, B = 60, C = 30)
  sensorAnomalyPct: number // 0 - 100
): number {
  const risk = (0.35 * failureProbPct) + (0.35 * criticalityScore) + (0.30 * sensorAnomalyPct);
  return Math.min(100, Math.round(risk * 10) / 10);
}`,
    variableDefinitions: [
      { name: "P_failure", desc: "Probability of failure predicted by ML classifier (0-100%)" },
      { name: "Criticality", desc: "Asset criticality ranking score (0-100)" },
      { name: "Anomaly_sensor", desc: "SCADA IoT sensor anomaly magnitude (0-100)" }
    ]
  }
];

export const MAINTENANCE_SYSTEM_PROMPTS = {
  masterAgentPrompt: `You are Sentinel™, an Enterprise Predictive Maintenance Intelligence AI Agent.
Your mandate is to convert multi-source asset inputs—SCADA time-series telemetry, SAP work order histories, PDF inspection reports, and OEM manuals—into precise, actionable reliability deliverables.

OUTPUT REQUIREMENTS:
1. FAILURE PREDICTION: Isolate specific component failure modes (e.g., Bearing Inner Raceway Spalling, Impeller Cavitation, Mechanical Seal Dry Running) with explicit probability scores.
2. REMAINING USEFUL LIFE (RUL): State remaining operating hours with 95% confidence bounds derived from Weibull degradation parameters.
3. MAINTENANCE SCHEDULE: Recommend exact PM execution dates, required downtime windows, assigned craft roles, and priority tags (P1 to P4).
4. CRITICAL EQUIPMENT RANKING: Rank asset risk score on a 0-100 scale considering financial downtime cost ($/hr).
5. ROOT CAUSE ANALYSIS: Construct a strict 5-Why logic chain leading to systemic corrective actions.
6. SPARE PARTS RESERVATION: Generate exact OEM part numbers and warehouse bin locations.`,

  rulPrompt: `Calculate Remaining Useful Life (RUL) for Equipment Tag {equipment_code}.
Input Parameters:
- Current Run Hours: {run_hours} hrs
- 3-Axis FFT Vibration RMS: {vibration_mms} mm/s (OEM Limit: {oem_vib_limit} mm/s)
- Bearing Temperature: {bearing_temp} °C (OEM Limit: {oem_temp_limit} °C)
- Oil Wear Metals: {fe_ppm} ppm Iron

Task:
Compute RUL in operating hours using physics-informed degradation modeling. Output confidence interval bounds and degradation trajectory.`,

  rcaPrompt: `Perform a 5-Why Root Cause Analysis for recent trip on {equipment_code}.
Telemetry Log:
{telemetry_snippet}

Work Order History:
{wo_history_snippet}

Output a structured 5-Why chain identifying the physical root cause, operational contributing factor, and systemic PM interval correction.`
};
