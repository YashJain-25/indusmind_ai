export interface DomainQueryExample {
  id: string;
  domain: "Maintenance" | "Safety" | "Equipment History" | "SOP Lookup" | "Manual Lookup" | "Inspection History" | "Previous Failures" | "Spare Parts" | "Root Cause Analysis";
  query: string;
  retrievedContext: {
    sourceDoc: string;
    pageNumber: number;
    equipmentTag?: string;
    excerpt: string;
  }[];
  copilotResponse: string;
  citations: {
    title: string;
    page: number;
    section: string;
    verbatimQuote: string;
  }[];
  confidenceScore: number;
  groundingStatus: "HIGH_CONFIDENCE" | "MEDIUM_CONFIDENCE" | "REQUIRES_REVIEW";
  suggestedActions: string[];
}

export const INDUSTRIAL_SYSTEM_PROMPT = `You are Orion™, an Enterprise Industrial Reliability & Plant Safety AI Copilot.
Your primary role is to assist plant reliability engineers, field technicians, safety managers, and maintenance personnel by providing high-precision, grounded answers strictly derived from ingested plant documentation, P&IDs, SOPs, OEM manuals, and maintenance logs.

STRICT OPERATIONAL DIRECTIVES & GROUNDING RULES:
1. ZERO HALLUCINATION MANDATE: Base all answers strictly on the retrieved document context. Never speculate, estimate setpoints, or infer safety limits not explicitly stated in context.
2. CITATION MANDATE: Every claim, setpoint, torque spec, or procedure step MUST contain an inline citation matching [Doc Name, Page X, Section Y].
3. SAFETY OVERRIDE: If a query involves high-risk maintenance (LOTO, hot work, high-pressure line breaks), ALWAYS append explicit Safety Precautions and Personal Protective Equipment (PPE) requirements upfront.
4. UNCERTAINTY PROTOCOL: If the retrieved documents do not contain sufficient evidence to answer a query, state explicitly: "I cannot verify this specification or procedure in the current ingested plant archive. Please consult the Lead Reliability Engineer."
5. EQUIPMENT TAG MATCHING: Maintain strict precision with alphanumeric equipment tag codes (e.g., P-101-A vs P-101-B). Do not blend maintenance histories between sister equipment trains.

RESPONSE STRUCTURE FORMAT:
- Executive Summary / Answer Direct
- Step-by-Step Procedure or Specifications (Numbered)
- Required Spare Parts & Tooling (if applicable)
- Safety & LOTO Requirements
- Inline Source Citations & Confidence Score breakdown`;

export const PROMPT_ENGINEERING_STRATEGY = [
  {
    title: "Domain Classification & Router Prompting",
    description: "Uses zero-shot structured output classification to route queries into domain-specific vector/graph namespaces (e.g., #SOP, #Maintenance, #Parts, #RCA).",
    example: "Classify query into ['MAINTENANCE', 'SAFETY', 'PARTS', 'RCA', 'SOP'] -> Output: 'MAINTENANCE' with target tag 'P-101-A'."
  },
  {
    title: "Chain-of-Thought (CoT) for Root Cause Analysis",
    description: "Forces the LLM to analyze symptom timelines, telemetry anomalies, and failure modes step-by-step prior to synthesizing the final RCA summary.",
    example: "Step 1: Identify observed symptoms. Step 2: Correlate with historical failure logs. Step 3: Compare against OEM operating limits. Step 4: Output primary root cause."
  },
  {
    title: "Negative Constraints & Safety Guardrails",
    description: "Strictly forbids hallucinating pressure limits, electrical ratings, or torque specifications when not found in retrieved chunks.",
    example: "CRITICAL: If torque specification is missing from context, do NOT output standard estimates. State 'Torque specification unavailable in SOP-2024'."
  },
  {
    title: "Few-Shot Technical In-Context Examples",
    description: "Provides 2-3 structured examples in the prompt showing exact citation syntax and tabular formatting for spare parts lists.",
    example: "Input: 'What seals are needed for P-101-A?' -> Output: '| Part # | Description | Qty | [SOP-118, Pg 12] |'"
  }
];

export const CONVERSATION_FLOW_STEPS = [
  {
    step: 1,
    name: "Query Ingestion & Intent Classification",
    desc: "Extracts equipment tags (P-101-A), domain type (Maintenance/Safety/Parts), and query urgency."
  },
  {
    step: 2,
    name: "Hybrid Retrieval & Graph Expansion",
    desc: "Queries Pinecone/Qdrant vector store and Neo4j Knowledge Graph simultaneously for related SOPs, parts, and past RCA tickets."
  },
  {
    step: 3,
    name: "Cross-Encoder Re-Ranking",
    desc: "Scores candidate chunks with Cohere Rerank v3.5 to filter top-4 highest relevance context blocks."
  },
  {
    step: 4,
    name: "Grounded Generation & Citation Verification",
    desc: "Invokes Gemini 2.5 Flash at temperature=0.0 with strict system prompt grounding constraints."
  },
  {
    step: 5,
    name: "Faithfulness & Safety Gate Evaluation",
    desc: "Calculates confidence score (0-100%). If <80%, attaches warning banner and flags for human engineer review."
  }
];

export const FALLBACK_RESPONSES = [
  {
    condition: "Low Context Similarity (< 70%)",
    trigger: "Query seeks equipment not in the vector database.",
    response: "⚠️ Low Grounding Confidence: I could not locate matching technical manuals or SOPs for Equipment Tag 'C-302-B' in the active plant document archive. Please verify the tag number or upload the relevant OEM documentation.",
    action: "Prompt user to upload PDF OEM manual."
  },
  {
    condition: "Safety Risk Ambiguity",
    trigger: "High pressure LOTO procedure missing critical step details.",
    response: "⛔ Safety Hold: The ingested SOP (SOP-PUMP-2021) contains ambiguous isolation steps for line break operations. Do NOT proceed without physical verification from the Shift Safety Supervisor.",
    action: "Trigger Safety Incident Escalation Ticket."
  },
  {
    condition: "Conflicting Manual Revisions",
    trigger: "2018 SOP and 2026 SOP give different pressure limits.",
    response: "⚠️ Revision Conflict Detected: SOP-2018 (Page 4) specifies max pressure as 450 PSI, while SOP-2026 (Page 2) specifies 420 PSI. Defaulting to active 2026 Rev B standard (420 PSI).",
    action: "Highlight revision conflict badge in UI."
  }
];

export const DOMAIN_EXAMPLES: DomainQueryExample[] = [
  {
    id: "ex-maint",
    domain: "Maintenance",
    query: "What is the complete overhaul torque procedure for Crude Charge Pump P-101-A mechanical seals?",
    retrievedContext: [
      {
        sourceDoc: "SOP-PUMP-OVERHAUL-2024.pdf",
        pageNumber: 14,
        equipmentTag: "P-101-A",
        excerpt: "Mechanical seal gland bolts for P-101-A must be torqued in a criss-cross pattern to 45 ft-lbs (61 Nm) using a calibrated torque wrench. Replace O-ring seal P/N Viton-9921 during every reassembly."
      }
    ],
    copilotResponse: "### Maintenance Torque Procedure for Crude Charge Pump P-101-A\n\nTo perform mechanical seal overhaul on **P-101-A**:\n\n1. Clean gland mating surfaces and inspect sleeve for pitting [SOP-PUMP-OVERHAUL-2024.pdf, Page 14].\n2. Install new Viton-9921 O-ring seal [SOP-PUMP-OVERHAUL-2024.pdf, Page 14].\n3. Tighten gland bolts in a 4-point criss-cross pattern incrementally (15 → 30 → 45 ft-lbs).\n4. Final torque setting: **45 ft-lbs (61 Nm)** [SOP-PUMP-OVERHAUL-2024.pdf, Page 14].\n\n**Required Tools:** Calibrated Torque Wrench (10-100 ft-lbs), Viton-9921 O-Ring Kit.",
    citations: [
      {
        title: "SOP-PUMP-OVERHAUL-2024.pdf",
        page: 14,
        section: "Section 3.2: Mechanical Seal Installation",
        verbatimQuote: "Mechanical seal gland bolts for P-101-A must be torqued in a criss-cross pattern to 45 ft-lbs (61 Nm)."
      }
    ],
    confidenceScore: 98.2,
    groundingStatus: "HIGH_CONFIDENCE",
    suggestedActions: ["Create Work Order Ticket", "Order Viton-9921 O-Ring Kit", "View P-101-A Maintenance History"]
  },
  {
    id: "ex-safety",
    domain: "Safety",
    query: "What LOTO and PPE requirements are mandatory before breaking flange connections on Ammonia Line AL-402?",
    retrievedContext: [
      {
        sourceDoc: "PLANT-SAFETY-SOP-LOTO-2026.pdf",
        pageNumber: 8,
        equipmentTag: "AL-402",
        excerpt: "Ammonia Line AL-402 operates at high toxicity. LOTO requires double block and bleed isolation with lock/tag on Valves V-401 and V-402. PPE mandatory: Level B Vapor Suit, Full-face respirator with K2 cartridges, Nitrile gloves."
      }
    ],
    copilotResponse: "### Mandatory LOTO & PPE Protocol for Ammonia Line AL-402\n\n⛔ **HIGH HAZARD WARNING: Ammonia Line Isolation**\n\n**LOTO Isolation Procedure:**\n- Apply Double Block and Bleed (DBB) isolation on Valves **V-401** and **V-402** [PLANT-SAFETY-SOP-LOTO-2026.pdf, Page 8].\n- Depressurize line through Bleed Valve BV-402 to flare header until pressure gauge reads 0.0 PSIG.\n\n**Mandatory PPE:**\n- Level B Chemical Vapor Suit [PLANT-SAFETY-SOP-LOTO-2026.pdf, Page 8]\n- Full-face PAPR respirator with K2 Ammonia cartridges\n- Heavy-duty Nitrile chemical gloves",
    citations: [
      {
        title: "PLANT-SAFETY-SOP-LOTO-2026.pdf",
        page: 8,
        section: "Section 4: Hazardous Chemical Line Breaking",
        verbatimQuote: "LOTO requires double block and bleed isolation with lock/tag on Valves V-401 and V-402. PPE mandatory: Level B Vapor Suit..."
      }
    ],
    confidenceScore: 99.4,
    groundingStatus: "HIGH_CONFIDENCE",
    suggestedActions: ["Generate LOTO Permit Checklist", "Notify Safety Supervisor", "Verify Ammonia Sensor Calibration"]
  },
  {
    id: "ex-eq-history",
    domain: "Equipment History",
    query: "Show me the last 12 months maintenance and repair history for Boiler Feedwater Pump BFW-201.",
    retrievedContext: [
      {
        sourceDoc: "EQUIPMENT-LOG-BFW201-2025.pdf",
        pageNumber: 3,
        equipmentTag: "BFW-201",
        excerpt: "BFW-201 History: Jan 2025: Routine bearing repacking. May 2025: High vibration alarm triggered (7.2 mm/s). Replaced outboard bearing SKF-6218. Oct 2025: Impeller clearance adjusted during annual turn-around."
      }
    ],
    copilotResponse: "### 12-Month Maintenance History for BFW-201\n\n- **Jan 15, 2025:** Routine preventive maintenance and bearing repacking [LOG-BFW201, Page 3].\n- **May 22, 2025:** High vibration trip (7.2 mm/s peak velocity). Replaced outboard bearing with SKF-6218 [LOG-BFW201, Page 3].\n- **Oct 10, 2025:** Annual turnaround overhaul; impeller wear ring clearances adjusted to 0.15mm specification.\n\n**Cumulative Downtime:** 14.5 hours | **MTBF:** 2,140 operating hours.",
    citations: [
      {
        title: "EQUIPMENT-LOG-BFW201-2025.pdf",
        page: 3,
        section: "Maintenance Event Log",
        verbatimQuote: "May 2025: High vibration alarm triggered (7.2 mm/s). Replaced outboard bearing SKF-6218."
      }
    ],
    confidenceScore: 96.8,
    groundingStatus: "HIGH_CONFIDENCE",
    suggestedActions: ["View Vibration Analysis Trend Graph", "Schedule Next PM Inspection", "Check SKF-6218 Stock"]
  },
  {
    id: "ex-sop",
    domain: "SOP Lookup",
    query: "Where do I find the emergency shutdown procedure SOP for Reactor Train R-301?",
    retrievedContext: [
      {
        sourceDoc: "SOP-EMERGENCY-SHUTDOWN-R301.pdf",
        pageNumber: 1,
        equipmentTag: "R-301",
        excerpt: "SOP-ESD-301 Rev 4: Emergency Shutdown for Reactor R-301. Step 1: Hit ESD Button ESD-301-A on Console B. Step 2: Close feed valve FV-301. Step 3: Initiate Nitrogen purge gas valve PV-305."
      }
    ],
    copilotResponse: "### Emergency Shutdown SOP (SOP-ESD-301 Rev 4)\n\n**Document Reference:** `SOP-EMERGENCY-SHUTDOWN-R301.pdf` (Active Revision B, Approved July 2025)\n\n**Immediate ESD Sequence:**\n1. Press Console B physical ESD Button **ESD-301-A** [SOP-ESD-301, Page 1].\n2. Verify automatic closure of Feed Cutoff Valve **FV-301** (<2.0 seconds response).\n3. Open Nitrogen Purge Valve **PV-305** to inert reactor vessel atmosphere [SOP-ESD-301, Page 1].",
    citations: [
      {
        title: "SOP-EMERGENCY-SHUTDOWN-R301.pdf",
        page: 1,
        section: "Section 1: ESD Initiation Sequence",
        verbatimQuote: "Step 1: Hit ESD Button ESD-301-A on Console B. Step 2: Close feed valve FV-301."
      }
    ],
    confidenceScore: 99.1,
    groundingStatus: "HIGH_CONFIDENCE",
    suggestedActions: ["Open PDF SOP Viewer", "Verify ESD Alarm Telemetry", "Acknowledge ESD Drill Log"]
  },
  {
    id: "ex-manual",
    domain: "Manual Lookup",
    query: "What is the recommended lubrication grease grade and replacement frequency for Siemens Motor M-401?",
    retrievedContext: [
      {
        sourceDoc: "OEM-SIEMENS-M401-MANUAL.pdf",
        pageNumber: 28,
        equipmentTag: "M-401",
        excerpt: "Motor M-401 (150kW) Lubrication Table: Use Mobilith SHC 100 synthetic grease. Quantity: 35g per bearing housing. Regreasing Interval: Every 2,000 operating hours or 6 months under continuous load."
      }
    ],
    copilotResponse: "### Lubrication Specifications for Siemens Motor M-401\n\nAccording to OEM Siemens Operating Manual [OEM-SIEMENS-M401-MANUAL.pdf, Page 28]:\n\n- **Grease Grade:** Mobilith SHC 100 Synthetic Grease\n- **Fill Quantity:** 35 grams per bearing housing\n- **Regreasing Interval:** Every **2,000 operating hours** (or 6 months, whichever occurs first)\n- **Caution:** Clean grease nipples with lint-free cloth prior to injection to prevent grit contamination.",
    citations: [
      {
        title: "OEM-SIEMENS-M401-MANUAL.pdf",
        page: 28,
        section: "Chapter 6: Bearing Maintenance & Lubrication",
        verbatimQuote: "Use Mobilith SHC 100 synthetic grease. Quantity: 35g per bearing housing. Regreasing Interval: Every 2,000 operating hours."
      }
    ],
    confidenceScore: 97.5,
    groundingStatus: "HIGH_CONFIDENCE",
    suggestedActions: ["Order Mobilith SHC 100", "Add Regreasing Task to SAP PM", "View Motor Run Hours Counter"]
  },
  {
    id: "ex-inspection",
    domain: "Inspection History",
    query: "What were the wall thickness ultrasonic inspection results for Storage Tank TK-204 during the last audit?",
    retrievedContext: [
      {
        sourceDoc: "UT-INSPECTION-TK204-2025.pdf",
        pageNumber: 6,
        equipmentTag: "TK-204",
        excerpt: "UT Inspection Date: November 2025. Shell Ring 1: 12.4mm (Nominal 12.5mm). Shell Ring 2: 10.8mm (Nominal 12.0mm - Corrosion Rate: 0.12mm/yr). Minimum allowable t_min = 8.5mm. Remaining life calculated at 19.1 years."
      }
    ],
    copilotResponse: "### Ultrasonic Wall Thickness Inspection (Tank TK-204)\n\n**Inspection Date:** November 14, 2025 [UT-INSPECTION-TK204-2025.pdf, Page 6]\n\n- **Shell Ring 1:** 12.4 mm (Nominal: 12.5 mm, negligible loss)\n- **Shell Ring 2 (Active Area):** **10.8 mm** (Nominal: 12.0 mm)\n- **Measured Corrosion Rate:** 0.12 mm/year [UT-INSPECTION-TK204-2025.pdf, Page 6]\n- **Minimum Required Wall (`t_min`):** 8.5 mm (API 653 Standard)\n- **Estimated Remaining Service Life:** **19.1 Years** (Next UT due Nov 2028).",
    citations: [
      {
        title: "UT-INSPECTION-TK204-2025.pdf",
        page: 6,
        section: "API 653 Thickness Measurement Report",
        verbatimQuote: "Shell Ring 2: 10.8mm (Nominal 12.0mm - Corrosion Rate: 0.12mm/yr). Minimum allowable t_min = 8.5mm."
      }
    ],
    confidenceScore: 98.9,
    groundingStatus: "HIGH_CONFIDENCE",
    suggestedActions: ["Download Full UT PDF Report", "Schedule 2028 UT Re-test", "Update API 653 Compliance Registry"]
  },
  {
    id: "ex-failures",
    domain: "Previous Failures",
    query: "Have we experienced repeated seal failure modes on Pump P-101-A, and what was the root cause identified?",
    retrievedContext: [
      {
        sourceDoc: "FAILURE-ANALYSIS-P101A-2025.pdf",
        pageNumber: 2,
        equipmentTag: "P-101-A",
        excerpt: "Incident Report INC-2025-089: Pump P-101-A experienced dual mechanical seal failure twice in 6 months (March & August 2025). Failure mode: Thermal cracking of silicon carbide seal faces caused by dry running during fluid priming transitions."
      }
    ],
    copilotResponse: "### Historical Failure Analysis for Pump P-101-A\n\n**Recurring Failure Event:** Dual Mechanical Seal Thermal Cracking (2 incidents in 2025: March 12 & August 29) [FAILURE-ANALYSIS-P101A-2025.pdf, Page 2].\n\n**Identified Root Cause:**\n- Thermal shock and heat checking on Silicon Carbide seal faces due to **temporary dry running** during suction line priming transitions.\n\n**Corrective Countermeasures Implemented:**\n1. Installed Low Suction Pressure Interlock Switch **PSL-101-B** to trip motor before dry running.\n2. Mandated 5-minute suction venting procedure in revised SOP-118.",
    citations: [
      {
        title: "FAILURE-ANALYSIS-P101A-2025.pdf",
        page: 2,
        section: "RCA Incident INC-2025-089 Summary",
        verbatimQuote: "Failure mode: Thermal cracking of silicon carbide seal faces caused by dry running during fluid priming transitions."
      }
    ],
    confidenceScore: 97.8,
    groundingStatus: "HIGH_CONFIDENCE",
    suggestedActions: ["Check PSL-101-B Sensor Calibration", "Review INC-2025-089 RCA Ticket", "Inspect Suction Priming Line"]
  },
  {
    id: "ex-spare-parts",
    domain: "Spare Parts",
    query: "List the part numbers, descriptions, and warehouse bin locations for emergency spare parts required for Valve V-102 overhaul.",
    retrievedContext: [
      {
        sourceDoc: "PARTS-CATALOG-VALVES-2026.pdf",
        pageNumber: 42,
        equipmentTag: "V-102",
        excerpt: "Valve V-102 (6-inch Fisher Control Valve) Repair Kit P/N: FK-V102-6IN. Includes: PTFE Packing Set (P/N 12B8891X012, Qty 1, Bin B-14), Stainless Gasket (P/N 1U2201, Qty 2, Bin C-02), Valve Stem (P/N 2U8890, Qty 1, Bin B-18)."
      }
    ],
    copilotResponse: "### Bill of Materials & Spare Parts for Valve V-102 Repair\n\n**Fisher 6-inch Control Valve V-102 Overhaul Kit (P/N: `FK-V102-6IN`)** [PARTS-CATALOG-VALVES-2026.pdf, Page 42]:\n\n| Part Number | Description | Required Qty | Warehouse Bin Location | Stock Availability |\n| :--- | :--- | :---: | :---: | :---: |\n| `12B8891X012` | PTFE V-Ring Packing Set | 1 | **Bin B-14** | 4 Kits in Stock |\n| `1U2201` | 316SS Spiral Wound Gasket | 2 | **Bin C-02** | 12 Units in Stock |\n| `2U8890` | Hardened 316SS Valve Stem | 1 | **Bin B-18** | 2 Units in Stock |",
    citations: [
      {
        title: "PARTS-CATALOG-VALVES-2026.pdf",
        page: 42,
        section: "Section 8: Fisher Control Valve Repair Kits",
        verbatimQuote: "PTFE Packing Set (P/N 12B8891X012, Qty 1, Bin B-14), Stainless Gasket (P/N 1U2201, Qty 2, Bin C-02)..."
      }
    ],
    confidenceScore: 99.0,
    groundingStatus: "HIGH_CONFIDENCE",
    suggestedActions: ["Reserve Parts in SAP ERP", "Generate Pick Slip for Warehouse", "View Valve V-102 Drawing"]
  },
  {
    id: "ex-rca",
    domain: "Root Cause Analysis",
    query: "Perform a 5-Why Root Cause Analysis for yesterday's trip on Compressors C-301-A.",
    retrievedContext: [
      {
        sourceDoc: "RCA-INCIDENT-C301A-JULY2026.pdf",
        pageNumber: 1,
        equipmentTag: "C-301-A",
        excerpt: "5-Why Analysis C-301-A Trip: 1. Why trip? High discharge temperature (185°C). 2. Why high temp? Intercooler IC-301 cooling water flow dropped. 3. Why flow dropped? Strainer ST-301 clogged with bio-fouling. 4. Why clogged? Biocide dosing pump DP-12 failed 3 days ago. 5. Why DP-12 failed? Diaphragm rupture due to fatigue beyond 12-month service limit."
      }
    ],
    copilotResponse: "### 5-Why Root Cause Analysis (Compressor C-301-A Trip)\n\n**Incident Summary:** High discharge temperature trip (185°C) on Compressor C-301-A [RCA-INCIDENT-C301A-JULY2026.pdf, Page 1].\n\n**5-Why Logic Decomposition:**\n1. **Why did C-301-A trip?** High discharge gas temperature exceeded 180°C threshold.\n2. **Why was discharge gas hot?** Intercooler IC-301 cooling water flow degraded from 120 GPM to 22 GPM.\n3. **Why did cooling water flow drop?** Cooling water strainer **ST-301** was severely clogged with bio-fouling scale.\n4. **Why did bio-fouling form?** Cooling tower biocide dosing pump **DP-12** stopped running 72 hours prior.\n5. **ROOT CAUSE:** Biocide pump DP-12 elastomer diaphragm ruptured due to exceeding its mandatory 12-month PM replacement schedule.\n\n**Systemic Action Item:** Update SAP PM to auto-trigger DP-12 diaphragm replacement every 10 months.",
    citations: [
      {
        title: "RCA-INCIDENT-C301A-JULY2026.pdf",
        page: 1,
        section: "5-Why Cause Map & Root Cause Findings",
        verbatimQuote: "Root Cause: Diaphragm rupture due to fatigue beyond 12-month service limit."
      }
    ],
    confidenceScore: 98.7,
    groundingStatus: "HIGH_CONFIDENCE",
    suggestedActions: ["Create CAPA Correction Ticket", "Update SAP PM Interval for DP-12", "Notify Reliability Manager"]
  }
];
