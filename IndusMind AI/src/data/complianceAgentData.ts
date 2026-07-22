export interface RegulatoryStandardFramework {
  id: string;
  code: string;
  title: string;
  authority: string;
  category: "Safety & Factories" | "Oil & Gas Safety" | "Explosives & Pressure" | "ISO Management" | "Environmental";
  keyClauses: { clauseId: string; clauseTitle: string; statutoryRequirement: string; mandatoryDocRequired: string }[];
}

export interface ComplianceGapItem {
  id: string;
  standardCode: string;
  clauseId: string;
  clauseTitle: string;
  uploadedDocumentRef: string;
  observedCondition: string;
  severity: "CRITICAL" | "MAJOR" | "MINOR";
  complianceStatus: "Compliant" | "Gap Detected" | "Missing Document" | "Under Review";
  correctiveAction: string;
  penaltyRisk: string;
}

export interface MissingDocumentAlert {
  id: string;
  documentTitle: string;
  regulatoryAuthority: string;
  mandatingRule: string;
  renewalFrequency: string;
  operationalImpact: string;
  status: "Missing" | "Expiring Soon" | "Verified";
}

export interface ComplianceAuditChecklistItem {
  id: string;
  standard: string;
  clauseRef: string;
  verificationQuestion: string;
  verificationMethod: "OCR Document Audit" | "Visual Inspection Log" | "Third-Party Certificate" | "SCADA Automated Check";
  complianceScoreImpactPoints: number;
  status: "PASS" | "FAIL" | "PARTIAL" | "NOT_CHECKED";
  evidenceDocName: string;
}

export interface ComplianceAgentWorkflowNode {
  stepNumber: number;
  agentName: string;
  role: string;
  modelEngine: string;
  inputDependencies: string[];
  outputArtifacts: string[];
  description: string;
}

export interface CompliancePromptTemplate {
  key: string;
  title: string;
  description: string;
  promptText: string;
}

export const REGULATORY_FRAMEWORKS: RegulatoryStandardFramework[] = [
  {
    id: "factory-act-1948",
    code: "Factory Act 1948",
    title: "The Factories Act, 1948 & State Factory Rules",
    authority: "Directorate of Industrial Safety & Health (DISH)",
    category: "Safety & Factories",
    keyClauses: [
      {
        clauseId: "Section 21",
        clauseTitle: "Fencing of Machinery & Safety Guards",
        statutoryRequirement: "Every dangerous part of moving machinery, flywheels, and prime movers must be securely fenced by safeguards of substantial construction.",
        mandatoryDocRequired: "Form 8 - Register of Dangerous Machine Operators & Guard Inspection Logs"
      },
      {
        clauseId: "Section 31",
        clauseTitle: "Pressure Plant Testing & Safety Relief",
        statutoryRequirement: "Every plant or vessel operated at pressure above atmospheric must be hydrotested once every 12 months by a Competent Person.",
        mandatoryDocRequired: "Form 11 - Competent Person Inspection Certificate for Pressure Vessels"
      },
      {
        clauseId: "Section 38",
        clauseTitle: "Precautions in Case of Fire & Means of Escape",
        statutoryRequirement: "Adequate means of escape in case of fire, quarterly fire drills, and certified fire suppression layout drawings.",
        mandatoryDocRequired: "Fire NOC & Quarterly Mock Drill Log Register"
      }
    ]
  },
  {
    id: "oisd-standards",
    code: "OISD Standards",
    title: "Oil Industry Safety Directorate (OISD) Safety Rules",
    authority: "Ministry of Petroleum & Natural Gas (MoPNG)",
    category: "Oil & Gas Safety",
    keyClauses: [
      {
        clauseId: "OISD-STD-118",
        clauseTitle: "Layouts for Oil & Gas Installations",
        statutoryRequirement: "Minimum safety distances between storage tanks, hydrocarbon pumps, and control rooms must satisfy fire separation tables.",
        mandatoryDocRequired: "Certified Plant Plot Plan & Hazardous Area Classification Map"
      },
      {
        clauseId: "OISD-STD-116",
        clauseTitle: "Fire Protection Facilities for Refineries & Terminals",
        statutoryRequirement: "Dual independent fire water pump capacity capable of supplying 120% peak design demand for 4 consecutive hours.",
        mandatoryDocRequired: "Fire Water Pump Annual Performance Test Curve & Logbook"
      },
      {
        clauseId: "OISD-STD-105",
        clauseTitle: "Work Permit System for Hydrocarbon Plants",
        statutoryRequirement: "Mandatory Hot Work, Cold Work, Confined Space Entry, and LOTO work permits signed by authorized safety officers.",
        mandatoryDocRequired: "Digitized Work Permit Register & Gas Testing Certificates"
      }
    ]
  },
  {
    id: "peso-rules",
    code: "PESO Rules",
    title: "Petroleum & Explosives Safety Organization (PESO)",
    authority: "Chief Controller of Explosives (CCoE / PESO)",
    category: "Explosives & Pressure",
    keyClauses: [
      {
        clauseId: "SMPV Rule 18",
        clauseTitle: "Periodic Testing of Pressure Vessels",
        statutoryRequirement: "Static pressure vessels (LPG, Hydrogen, Ammonia) must undergo hydrotest every 5 years and safety valve calibration every 12 months.",
        mandatoryDocRequired: "PESO Form III-B Hydrotest & Relief Valve Calibration Certificate"
      },
      {
        clauseId: "Petroleum Rule 124",
        clauseTitle: "Storage License for Petroleum Class A & B",
        statutoryRequirement: "Valid PESO License for bulk storage of flammable liquids with approved flame arrestors and electrical hazard zone certification.",
        mandatoryDocRequired: "PESO Petroleum Storage License (Form XIV) & DGMS Electrical Certificate"
      }
    ]
  },
  {
    id: "iso-standards",
    code: "ISO Standards",
    title: "ISO 45001, 14001, 55001 & 9001 Management Systems",
    authority: "International Organization for Standardization",
    category: "ISO Management",
    keyClauses: [
      {
        clauseId: "ISO 45001:6.1.2",
        clauseTitle: "Hazard Identification & Risk Assessment (HIRA)",
        statutoryRequirement: "Proactive identification of OH&S hazards and establishment of risk controls prior to operational changes.",
        mandatoryDocRequired: "Comprehensive Plant HIRA Register & Management of Change (MOC) Logs"
      },
      {
        clauseId: "ISO 14001:8.2",
        clauseTitle: "Emergency Preparedness & Environmental Response",
        statutoryRequirement: "Documented emergency response plans for hazardous chemical spills, toxic gas release, and effluent overflows.",
        mandatoryDocRequired: "On-Site Emergency Management Plan (OEMP) & Off-Site Response Protocol"
      },
      {
        clauseId: "ISO 55001:8.1",
        clauseTitle: "Asset Operational Control & Critical Maintenance",
        statutoryRequirement: "Documented maintenance execution plans for all critical assets to prevent environmental or safety failures.",
        mandatoryDocRequired: "Asset Criticality Matrix & Preventive Maintenance Audit Log"
      }
    ]
  },
  {
    id: "environmental-rules",
    code: "Environmental Rules",
    title: "CPCB / SPCB Environmental & Waste Management Rules",
    authority: "Central Pollution Control Board (CPCB) & SPCB",
    category: "Environmental",
    keyClauses: [
      {
        clauseId: "Water Act Sec 25",
        clauseTitle: "Consent to Operate (CTO) Effluent Treatment",
        statutoryRequirement: "Effluent discharge parameters (BOD < 30mg/L, COD < 250mg/L, Heavy Metals) must remain within SPCB limits with online CPCB telemetry.",
        mandatoryDocRequired: "Valid SPCB Consent to Operate (CTO) & Monthly ETP Water Test Lab Report"
      },
      {
        clauseId: "Hazardous Waste R9",
        clauseTitle: "Manifest for Hazardous Waste Transport & Storage",
        statutoryRequirement: "Hazardous chemical sludge and waste oil must be tracked via 7-copy Form 10 manifests and stored in designated paved, covered areas.",
        mandatoryDocRequired: "Form 10 Manifest Copies & SPCB Hazardous Waste Authorization Certificate"
      }
    ]
  }
];

export const COMPLIANCE_GAPS: ComplianceGapItem[] = [
  {
    id: "gap-01",
    standardCode: "PESO SMPV Rule 18",
    clauseId: "Rule 18(1)",
    clauseTitle: "Safety Relief Valve Annual Calibration",
    uploadedDocumentRef: "Calibration_Log_TK204_2024.pdf",
    observedCondition: "Safety Valve SRV-102 on Hydrogen Sphere TK-204 was last calibrated 14 months ago (Expired 60 days past statutory limit).",
    severity: "CRITICAL",
    complianceStatus: "Gap Detected",
    correctiveAction: "Isolate TK-204 SRV-102 using interlocked dual relief manifold, recalibrate valve at PESO-approved test bench, and upload Form III-B certificate.",
    penaltyRisk: "Immediate PESO License Suspension & Plant Shutdown Notice"
  },
  {
    id: "gap-02",
    standardCode: "Factory Act 1948",
    clauseId: "Section 31",
    clauseTitle: "Pressure Plant Hydrotest Certificate",
    uploadedDocumentRef: "Form11_Steam_Boiler_2025.pdf",
    observedCondition: "Steam Header SH-101 Form 11 certificate is missing signature from a certified DISH Competent Person.",
    severity: "CRITICAL",
    complianceStatus: "Gap Detected",
    correctiveAction: "Schedule DISH-approved Competent Person inspection for NDT thickness test and re-issue Form 11.",
    penaltyRisk: "Prosecution under Section 92 of Factory Act (Up to ₹2 Lakh fine / 2 yrs imprisonment)"
  },
  {
    id: "gap-03",
    standardCode: "OISD-STD-116",
    clauseId: "Section 6.2",
    clauseTitle: "Fire Water Pump Independent Power Source",
    uploadedDocumentRef: "Fire_System_P&ID_Rev4.pdf",
    observedCondition: "Secondary fire water pump FW-P02 is powered by the main electrical grid without an isolated emergency diesel driver.",
    severity: "MAJOR",
    complianceStatus: "Gap Detected",
    correctiveAction: "Install 450 HP auto-starting diesel engine driver for FW-P02 with 8-hour dedicated fuel tank.",
    penaltyRisk: "Rejection of OISD Safety Clearance during annual audit"
  },
  {
    id: "gap-04",
    standardCode: "Hazardous Waste Rules",
    clauseId: "Rule 9(2)",
    clauseTitle: "Hazardous Waste Storage Area Labeling",
    uploadedDocumentRef: "EHS_Site_Audit_Photo_Jan2026.png",
    observedCondition: "Waste Oil drums stored in Sector 4 lack yellow fluorescent hazard placards and containment dike capacity is under 110%.",
    severity: "MINOR",
    complianceStatus: "Gap Detected",
    correctiveAction: "Apply standardized Form 8 hazard stickers and install secondary concrete spill containment bund.",
    penaltyRisk: "SPCB Notice & Environmental Damage Compensation Levy"
  }
];

export const MISSING_DOCUMENTS: MissingDocumentAlert[] = [
  {
    id: "doc-missing-01",
    documentTitle: "PESO Form III-B Hydrotest Certificate (TK-204)",
    regulatoryAuthority: "PESO CCoE",
    mandatingRule: "SMPV (Unfired Pressure Vessels) Rules 2016, Rule 18",
    renewalFrequency: "Annual (365 Days)",
    operationalImpact: "LPG & Hydrogen sphere operation non-compliant. High risk of regulatory seal.",
    status: "Missing"
  },
  {
    id: "doc-missing-02",
    documentTitle: "SPCB Hazardous Waste Authorization Form 2",
    regulatoryAuthority: "State Pollution Control Board",
    mandatingRule: "Hazardous & Other Wastes Management Rules 2016",
    renewalFrequency: "5-Year License (Expiring in 18 Days)",
    operationalImpact: "Cannot transport spent catalyst or oily sludge legally.",
    status: "Expiring Soon"
  },
  {
    id: "doc-missing-03",
    documentTitle: "Factory Act Form 8 - Dangerous Machinery Guard Inspection",
    regulatoryAuthority: "Inspectorate of Factories (DISH)",
    mandatingRule: "Factories Act 1948, Section 21",
    renewalFrequency: "Monthly Internal Audit",
    operationalImpact: "Non-compliance during unannounced DISH safety inspection.",
    status: "Missing"
  }
];

export const AUDIT_CHECKLIST_DATA: ComplianceAuditChecklistItem[] = [
  {
    id: "chk-01",
    standard: "Factory Act 1948",
    clauseRef: "Sec 21",
    verificationQuestion: "Are interlocked physical guards installed on high-speed coupling shafts?",
    verificationMethod: "OCR Document Audit",
    complianceScoreImpactPoints: 15,
    status: "PASS",
    evidenceDocName: "Machine_Guard_Audit_Photos_2025.pdf"
  },
  {
    id: "chk-02",
    standard: "PESO Rules",
    clauseRef: "SMPV R18",
    verificationQuestion: "Is safety relief valve calibration certificate valid within last 12 months?",
    verificationMethod: "Third-Party Certificate",
    complianceScoreImpactPoints: 25,
    status: "FAIL",
    evidenceDocName: "Calibration_Log_TK204_2024.pdf"
  },
  {
    id: "chk-03",
    standard: "OISD-STD-118",
    clauseRef: "Sec 4.1",
    verificationQuestion: "Is 15-meter clearance maintained between LPG bullets and process units?",
    verificationMethod: "Visual Inspection Log",
    complianceScoreImpactPoints: 20,
    status: "PASS",
    evidenceDocName: "Plot_Plan_Approved_2024.pdf"
  },
  {
    id: "chk-04",
    standard: "ISO 45001",
    clauseRef: "Clause 6.1.2",
    verificationQuestion: "Has HIRA register been updated after last process modification?",
    verificationMethod: "OCR Document Audit",
    complianceScoreImpactPoints: 20,
    status: "PASS",
    evidenceDocName: "HIRA_Register_Rev8_2025.pdf"
  },
  {
    id: "chk-05",
    standard: "Environmental Rules",
    clauseRef: "Water Act Sec 25",
    verificationQuestion: "Is online CPCB continuous effluent monitoring system (CEMS) online and sending live data?",
    verificationMethod: "SCADA Automated Check",
    complianceScoreImpactPoints: 20,
    status: "PARTIAL",
    evidenceDocName: "CEMS_Telemetry_Log_Jan2026.csv"
  }
];

export const COMPLIANCE_WORKFLOW: ComplianceAgentWorkflowNode[] = [
  {
    stepNumber: 1,
    agentName: "Multimodal Document Parsing Agent",
    role: "OCR Extraction & Structural Ingestion",
    modelEngine: "Gemini 2.5 Flash Vision + PyTesseract OCR",
    inputDependencies: ["Uploaded PDF Certificates", "Engineering Drawings (CAD)", "Plant Inspection Photos"],
    outputArtifacts: ["Extracted Document Metadata JSON", "Key Date/Valuation Entities"],
    description: "Parses uploaded industrial documents, certificates, CAD plot plans, and PDF test reports using multi-page layout OCR and entity identification."
  },
  {
    stepNumber: 2,
    agentName: "Regulatory Knowledge Base Graph Agent",
    role: "Statutory Clause Traversal & Vector Search",
    modelEngine: "Gemini 2.5 Flash + Pinecone / Neo4j Graph DB",
    inputDependencies: ["Extracted Document Metadata JSON", "Factory Act / OISD / PESO Corpus"],
    outputArtifacts: ["Matched Statutory Clauses", "Mandatory Evidence Criteria"],
    description: "Matches extracted document entities against the comprehensive Statutory Corpus (Factory Act, OISD, PESO, ISO, CPCB Rules) using hybrid dense-sparse vector search."
  },
  {
    stepNumber: 3,
    agentName: "Clause Gap & Discrepancy Analysis Agent",
    role: "Statutory Verification & Severity Scoring",
    modelEngine: "Gemini 2.5 Flash (Strict Grounding)",
    inputDependencies: ["Matched Statutory Clauses", "Extracted Document Metadata JSON"],
    outputArtifacts: ["Gap Analysis Matrix", "Severity Category (Critical/Major/Minor)"],
    description: "Compares document clauses against statutory requirements to flag expired certificates, missing safety signatures, and non-compliant physical parameters."
  },
  {
    stepNumber: 4,
    agentName: "Missing Document & Renewal Tracker Agent",
    role: "Mandatory Registry Audit",
    modelEngine: "Rule-Based Engine + Gemini Reasoner",
    inputDependencies: ["Plant Asset Master List", "Extracted Document Metadata JSON"],
    outputArtifacts: ["Missing Document Alerts", "Renewal Countdown Timers"],
    description: "Audits asset lists against mandatory statutory document checklists to identify unsubmitted or missing Form 11, Form 8, or PESO Form III-B certificates."
  },
  {
    stepNumber: 5,
    agentName: "Audit Evidence Package & Score Engine Agent",
    role: "Compliance Scoring & Chain of Custody Packaging",
    modelEngine: "Gemini 2.5 Flash + PDF Kit Generator",
    inputDependencies: ["Gap Analysis Matrix", "Missing Document Alerts"],
    outputArtifacts: ["Composite Compliance Score (84.5%)", "Zip/PDF Audit Evidence Package"],
    description: "Computes the weighted 0-100 Compliance Index and compiles verified evidence documents into a tamper-evident ZIP/PDF package for statutory auditors."
  }
];

export const COMPLIANCE_PROMPT_ENGINEERING: CompliancePromptTemplate[] = [
  {
    key: "zero-hallucination-audit",
    title: "Zero-Hallucination Regulatory Audit Prompt Directive",
    description: "Forces Gemini to ground all compliance verdicts strictly in uploaded documents and statutory clause text without making external assumptions.",
    promptText: `You are Guardian™, a Lead Industrial Statutory Auditor specializing in Indian Factory Rules, OISD Standards, PESO SMPV Rules, and ISO 45001.

SYSTEM DIRECTIVES:
1. STRICT GROUNDING: Evaluate uploaded documents against mandatory clauses in [Factory Act 1948], [OISD-STD-118/116/105], [PESO SMPV Rules], [ISO 45001/14001], and [CPCB Environmental Rules].
2. VERIFY DATES & SIGNATURES: Check if test certificates are within 365 days of issuance and signed by a DISH/PESO Competent Person.
3. SEVERITY CLASSIFICATION:
   - CRITICAL: Violation causing immediate statutory shutdown, explosion risk, or license revocation.
   - MAJOR: Missing certification or design deviation rectifiable within 30 days.
   - MINOR: Administrative labeling or minor documentation omission.
4. CITATION REQUIREMENT: Provide verbatim clause numbers (e.g., PESO SMPV Rule 18(1)) for every gap detected.`
  },
  {
    key: "gap-analysis-generator",
    title: "Structured Clause Gap Analysis Generator Prompt",
    description: "Extracts clause-level gaps, observed vs required states, and precise corrective action steps in structured JSON format.",
    promptText: `Compare the provided Document Chunk [Text/Image] against Standard Clause {clause_number} from {standard_name}.

Output JSON Schema:
{
  "standard_code": "PESO SMPV Rule 18",
  "clause_id": "Rule 18(1)",
  "observed_condition": "Text extracted from uploaded doc...",
  "statutory_requirement": "Exact statutory limit...",
  "severity": "CRITICAL",
  "compliance_status": "Gap Detected",
  "corrective_action": "Engineering step to achieve compliance...",
  "penalty_risk": "Statutory fine or closure notice details..."
}`
  }
];
