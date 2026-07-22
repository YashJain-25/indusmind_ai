export interface IngestionDataRecord {
  id: string;
  sourceType: "Incident Report" | "Near Miss" | "Quality Report" | "Audit Finding" | "Maintenance Record" | "Failure History";
  title: string;
  assetId: string;
  assetName: string;
  unitLocation: string;
  dateRecorded: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  category: fontCategory;
  summary: string;
  tags: string[];
}

type fontCategory =
  | "Mechanical Failure"
  | "Instrumentation & Electrical"
  | "Process Deviation"
  | "Operational & Safety"
  | "Environmental & Quality";

export interface RecurringPatternCluster {
  id: string;
  clusterName: string;
  primaryFailureMode: string;
  occurrencesCount: number;
  sourcesInvolved: string[];
  affectedAssets: string[];
  riskLevel: "Critical" | "High" | "Medium";
  underlyingRootCausePattern: string;
  confidenceScore: number;
}

export interface PredictedIncident {
  id: string;
  targetAsset: string;
  assetLocation: string;
  predictedIncidentType: string;
  estimatedTimeframe: string;
  likelihoodPercent: number;
  leadingIndicators: string[];
  potentialImpactCost: string;
  preventiveAction: string;
  urgencyStatus: "Immediate Action Required" | "Monitor Closely" | "Scheduled Inspection";
}

export interface SafetyAlert {
  id: string;
  alertCode: string;
  title: string;
  severityLevel: "RED ALERT - CRITICAL" | "ORANGE ALERT - HIGH" | "YELLOW ADVISORY";
  issueDate: string;
  targetDepartments: string[];
  triggeringPattern: string;
  mandatoryActions: string[];
  acknowledgedByPlantLead: boolean;
}

export interface KnowledgeSummaryCard {
  id: string;
  title: string;
  equipmentFamily: string;
  problemStatement: string;
  synthesizedLesson: string;
  engineeringStandardUpdate: string;
  financialImpactPrevented: string;
  aiConfidence: number;
}

export interface MLLLMPipelineStep {
  stepNumber: number;
  phaseName: string;
  techStack: string;
  inputData: string;
  processingLogic: string;
  outputArtifact: string;
  iconName: string;
}

// 1. INGESTION DATA RECORDS ACROSS ALL 6 SOURCES
export const INGESTION_RECORDS: IngestionDataRecord[] = [
  {
    id: "INC-2026-881",
    sourceType: "Incident Report",
    title: "Centrifugal Pump P-101 Drive End Bearing Thermal Overload",
    assetId: "P-101",
    assetName: "Primary Crude Hydrotreater Feed Pump",
    unitLocation: "Unit 04 - Hydrotreating",
    dateRecorded: "2026-07-15",
    severity: "Critical",
    category: "Mechanical Failure",
    summary: "Motor tripped on overcurrent due to drive-end SKF 3315 bearing seizure caused by water ingress into oil reservoir past a degraded Viton seal.",
    tags: ["Bearing Seizure", "Vibration", "Seal Failure", "Lube Contamination"]
  },
  {
    id: "NM-2026-304",
    sourceType: "Near Miss",
    title: "Vibration Alarm Override during Unit Startup",
    assetId: "P-101",
    assetName: "Primary Crude Hydrotreater Feed Pump",
    unitLocation: "Unit 04 - Hydrotreating",
    dateRecorded: "2026-06-20",
    severity: "High",
    category: "Operational & Safety",
    summary: "Operator bypassed temporary high-vibration trip for 45 minutes during cold startup without obtaining signed MOC override permit.",
    tags: ["Alarm Override", "Human Factors", "Startup Protocol"]
  },
  {
    id: "QUAL-2026-112",
    sourceType: "Quality Report",
    title: "Off-Spec Diesel Flash Point Deviation (Sub-52°C)",
    assetId: "T-204",
    assetName: "Vacuum Distillation Stripper Column",
    unitLocation: "Unit 02 - Distillation",
    dateRecorded: "2026-07-02",
    severity: "High",
    category: "Process Deviation",
    summary: "Flash point dropped below mandatory 55°C limit due to stripping steam flow controller FIC-202 sticking closed at 18% position.",
    tags: ["Quality Deviation", "Flash Point", "Steam Controller"]
  },
  {
    id: "AUD-2026-044",
    sourceType: "Audit Finding",
    title: "Expired Relief Valve Calibration Certificate on Hydrogen Sphere TK-204",
    assetId: "TK-204",
    assetName: "High Pressure Hydrogen Storage Sphere",
    unitLocation: "Unit 08 - Gas Storage",
    dateRecorded: "2026-07-10",
    severity: "Critical",
    category: "Instrumentation & Electrical",
    summary: "Safety Relief Valve SRV-102 calibration certificate expired 60 days past the mandatory 365-day PESO SMPV Rule 18 limit.",
    tags: ["PESO Compliance", "Relief Valve", "Expired Certification"]
  },
  {
    id: "MAINT-2026-902",
    sourceType: "Maintenance Record",
    title: "Unscheduled Mechanical Seal Flush Water Piping Repair",
    assetId: "P-102B",
    assetName: "Secondary Crude Charge Pump",
    unitLocation: "Unit 04 - Hydrotreating",
    dateRecorded: "2026-05-18",
    severity: "Medium",
    category: "Mechanical Failure",
    summary: "Replaced 3/4-inch Plan 32 seal flush piping elbow due to localized erosion-corrosion pitting.",
    tags: ["Seal Flush", "Piping Erosion", "Unscheduled Maintenance"]
  },
  {
    id: "FAIL-2026-019",
    sourceType: "Failure History",
    title: "Historical 3-Year MTBF Decline on High-Pressure Rotary Pumps",
    assetId: "P-FAMILY-HP",
    assetName: "API 610 Heavy Duty Centrifugal Pumps",
    unitLocation: "Refinery Wide",
    dateRecorded: "2026-04-01",
    severity: "High",
    category: "Mechanical Failure",
    summary: "MTBF dropped from 38 months to 19 months across 14 centrifugal pumps due to recurring seal oil moisture contamination.",
    tags: ["MTBF Trend", "Lube Contamination", "Asset Degradation"]
  }
];

// 2. RECURRING PATTERN CLUSTERS DETECTED BY AI
export const PATTERN_CLUSTERS: RecurringPatternCluster[] = [
  {
    id: "CLUST-01",
    clusterName: "Lube Oil Water Contamination & Bearing Seizure Cascade",
    primaryFailureMode: "Bearing Overheating & Mechanical Seal Ingress",
    occurrencesCount: 8,
    sourcesInvolved: ["Incident Report", "Near Miss", "Maintenance Record", "Failure History"],
    affectedAssets: ["P-101", "P-102B", "P-203A", "C-301"],
    riskLevel: "Critical",
    underlyingRootCausePattern: "Degraded lip seals allow cooling water spray ingress into bearing housings during weekly washdowns, causing accelerated fatigue pitting.",
    confidenceScore: 96.4
  },
  {
    id: "CLUST-02",
    clusterName: "Startup Alarm Override & Unmonitored Transient Thermal Spikes",
    primaryFailureMode: "Human Factors & Interlock Bypass",
    occurrencesCount: 5,
    sourcesInvolved: ["Near Miss", "Audit Finding"],
    affectedAssets: ["P-101", "K-102", "E-201"],
    riskLevel: "High",
    underlyingRootCausePattern: "Operators routinely bypass high vibration and temperature alarms during cold startups due to noisy baseline sensor drift.",
    confidenceScore: 92.1
  },
  {
    id: "CLUST-03",
    clusterName: "Control Valve Sticking & Steam Stripping Quality Fluctuation",
    primaryFailureMode: "Pneumatic Actuator Hysteresis",
    occurrencesCount: 4,
    sourcesInvolved: ["Quality Report", "Maintenance Record"],
    affectedAssets: ["T-204", "T-102", "FIC-202"],
    riskLevel: "Medium",
    underlyingRootCausePattern: "Moisture in instrument air lines causes particulate buildup in valve positioner pilots, locking stripping steam flow.",
    confidenceScore: 89.5
  }
];

// 3. PREDICTED INCIDENTS FORECASTED BY ML
export const PREDICTED_INCIDENTS: PredictedIncident[] = [
  {
    id: "PRED-01",
    targetAsset: "P-102A (Hydrotreater Secondary Charge Pump)",
    assetLocation: "Unit 04 - Hydrotreating",
    predictedIncidentType: "High-Vibration Seizure & Seal Rupture",
    estimatedTimeframe: "Within 14 to 21 Days",
    likelihoodPercent: 88.5,
    leadingIndicators: [
      "2.4x Increase in 1X/2X Vibration Harmonics (DCS Telemetry)",
      "Lube Oil Water Content at 850 PPM (Lab Sample)",
      "3 Near-Miss Log entries regarding washdown water spray"
    ],
    potentialImpactCost: "$420,000 (Downtime + Equipment Replacement)",
    preventiveAction: "Schedule emergency lube oil centrifuging, replace bearing oil seals with labyrinth style guards, and enforce washdown protective covers.",
    urgencyStatus: "Immediate Action Required"
  },
  {
    id: "PRED-02",
    targetAsset: "K-102 Recycle Hydrogen Compressor",
    assetLocation: "Unit 05 - Catalytic Reformer",
    predictedIncidentType: "Dry Gas Seal Gas Differential Pressure Drop",
    estimatedTimeframe: "Within 30 Days",
    likelihoodPercent: 74.2,
    leadingIndicators: [
      "Filter DP rising at 0.15 bar/week",
      "Particulate carryover noted in maintenance lube sample"
    ],
    potentialImpactCost: "$1.2M (Catalyst Deactivation & Unplanned Trip)",
    preventiveAction: "Switch to standby seal gas filter duplex unit and perform online nitrogen purge.",
    urgencyStatus: "Monitor Closely"
  }
];

// 4. SAFETY ALERTS GENERATED
export const SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: "SA-2026-09",
    alertCode: "ALERT-OISD-SAFE-2026-09",
    title: "MANDATORY BAN ON ALARM OVERRIDES DURING PUMP STARTUPS",
    severityLevel: "RED ALERT - CRITICAL",
    issueDate: "2026-07-20",
    targetDepartments: ["Operations", "Maintenance", "Instrument & Control", "EHS"],
    triggeringPattern: "Cluster CLUST-02: 5 unauthorized alarm bypasses during unit cold startups leading to bearing seizure.",
    mandatoryActions: [
      "Immediate audit of all DCS interlock override logs by Shift Engineer",
      "Installation of dual-confirmation key lock switches for vibration trips",
      "Mandatory re-training on Standard Operating Procedure SOP-OPS-044"
    ],
    acknowledgedByPlantLead: true
  },
  {
    id: "SA-2026-10",
    alertCode: "ADVISORY-ENG-2026-10",
    title: "UPGRADE TO LABYRINTH BEARING ISOLATORS FOR ALL API 610 PUMPS",
    severityLevel: "ORANGE ALERT - HIGH",
    issueDate: "2026-07-22",
    targetDepartments: ["Reliability Engineering", "Procurement", "Mechanical Maintenance"],
    triggeringPattern: "Cluster CLUST-01: Water ingress into bearing oil sumps past standard lip seals across 8 centrifugal pumps.",
    mandatoryActions: [
      "Mandatory spec change: Retrofit all API 610 pumps with IP66 metallic labyrinth bearing isolators during next turnaround",
      "Update Plant Maintenance Standard PMS-MECH-102"
    ],
    acknowledgedByPlantLead: false
  }
];

// 5. KNOWLEDGE SUMMARIES & LESSONS CARDS
export const KNOWLEDGE_SUMMARIES: KnowledgeSummaryCard[] = [
  {
    id: "KS-101",
    title: "Water Contamination Risk in API Centrifugal Pump Bearing Reservoirs",
    equipmentFamily: "API 610 Centrifugal Pumps (P-100 Series)",
    problemStatement: "High washdown water pressure and worn elastomeric lip seals created micro-cavities, allowing water vapor to condense inside lube oil sumps, leading to 8 bearing seizures over 24 months.",
    synthesizedLesson: "Elastomeric lip seals are unsuitable for high-pressure hose washdown environments. Labyrinth isolators with magnetic oil drain plugs prevent water contamination and increase MTBF by over 200%.",
    engineeringStandardUpdate: "Plant Engineering Standard Std-2026-Rev4: Mandates Inpro/Seal magnetic labyrinth isolators for all hydrocarbon pumps.",
    financialImpactPrevented: "$1.8 Million in avoided production outages annually",
    aiConfidence: 98.2
  },
  {
    id: "KS-102",
    title: "Preventing Off-Spec Flash Point via Instrument Air Dryer Desiccant Renewal",
    equipmentFamily: "Stripping Columns & Control Valves (T-200 Series)",
    problemStatement: "Saturated instrument air caused pilot valve sticking in steam flow controllers, creating intermittent sub-52°C flash point diesel batches.",
    synthesizedLesson: "Quality deviations in stripping distillation columns are frequently caused by instrument air moisture rather than process fluid instability. Weekly dew point telemetry checks prevent valve hysteresis.",
    engineeringStandardUpdate: "Standard Operating Procedure SOP-INSTR-012: Dew point alarm threshold lowered from -20°C to -40°C PDP.",
    financialImpactPrevented: "$650,000 in re-processing costs",
    aiConfidence: 94.7
  }
];

// 6. ML & LLM PIPELINE STEPS EXPLANATION
export const ML_LLM_PIPELINE_STEPS: MLLLMPipelineStep[] = [
  {
    stepNumber: 1,
    phaseName: "Multi-Source Heterogeneous Data Ingestion",
    techStack: "Apache Kafka / Express / OCR Vision Engine / Gemini 2.5 Flash",
    inputData: "6 Ingestion Streams: Incident Reports, Near Misses, Quality Reports, Audit Findings, Maintenance Records, Failure History",
    processingLogic: "Parses unstructured PDFs, maintenance logs, SAP PM work orders, and DCS alarms into unified JSON Schemas with normalized asset tags and timestamps.",
    outputArtifact: "Standardized Multi-Stream Failure Event Records",
    iconName: "Database"
  },
  {
    stepNumber: 2,
    phaseName: "Domain-Specific Text Vectorization & Embedding",
    techStack: "text-embedding-004 / Pinecone Vector Database",
    inputData: "Normalized Failure Event Text & Metadata",
    processingLogic: "Generates 768-dimensional dense vector embeddings fine-tuned on industrial terminology (API 610, OISD, LOTO, PESO, HIRA, cavitation, fretting corrosion).",
    outputArtifact: "Indexed Spatial Vector Graph in Pinecone DB",
    iconName: "Cpu"
  },
  {
    stepNumber: 3,
    phaseName: "Unsupervised Failure Pattern Clustering & Anomaly Detection",
    techStack: "HDBSCAN / Isolation Forests / Graph Neural Networks",
    inputData: "Dense Vector Embeddings & Asset Telemetry Logs",
    processingLogic: "Groups isolated near-misses and maintenance logs into recurring failure mode clusters without requiring manual tagging. Detects silent cross-equipment correlations.",
    outputArtifact: "Recurring Pattern Clusters (e.g. Water Ingress Cascade)",
    iconName: "Network"
  },
  {
    stepNumber: 4,
    phaseName: "Predictive Incident Forecasting Model",
    techStack: "XGBoost Time-to-Event / LSTM / Survival Analysis Engine",
    inputData: "Telemetry (Vibration, Temp, Pressure) + Historical MTBF Trends",
    processingLogic: "Calculates time-to-incident probabilities (0-100%) by projecting current sensor drift curves against historical cluster degradation curves.",
    outputArtifact: "Predictive Incident Radar & Timeframe Countdown",
    iconName: "TrendingUp"
  },
  {
    stepNumber: 5,
    phaseName: "Gemini 2.5 LLM Synthesis & RAG Guardrails",
    techStack: "Gemini 2.5 Flash / Pinecone Hybrid RAG / Custom Directives",
    inputData: "Matched Failure Clusters + OISD/PESO/ISO Knowledge Base",
    processingLogic: "Synthesizes root cause insights, drafts actionable CAPA plans, updates plant engineering standards, and generates broadcast-ready Safety Alerts with zero-hallucination grounding.",
    outputArtifact: "Safety Alerts, Knowledge Cards, CAPA Recommendations",
    iconName: "Sparkles"
  }
];
