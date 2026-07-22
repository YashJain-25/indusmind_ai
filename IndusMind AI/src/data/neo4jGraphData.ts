export interface Neo4jNodeType {
  label: string;
  category: string;
  description: string;
  keyProperties: string[];
  example: string;
}

export interface Neo4jRelationshipType {
  type: string;
  sourceNode: string;
  targetNode: string;
  description: string;
  example: string;
}

export interface CypherQuerySample {
  id: string;
  title: string;
  category: string;
  description: string;
  cypher: string;
  explanation: string;
  nodesInvolved: string[];
}

export const NEO4J_NODE_TYPES: Neo4jNodeType[] = [
  {
    label: "Equipment",
    category: "Physical Assets",
    description: "Base top-level asset or process unit in the plant (e.g., Crude Distillation Train Alpha).",
    keyProperties: ["id: STRING", "tag: STRING", "name: STRING", "location: STRING", "criticality: STRING"],
    example: "Equipment {id: 'EQ-CDU-01', tag: 'CDU-100', name: 'Crude Distillation Unit 1'}"
  },
  {
    label: "Pump",
    category: "Rotating Machinery",
    description: "Centrifugal or positive displacement pump equipment entity.",
    keyProperties: ["tag: STRING", "flowRate: FLOAT", "headMeters: FLOAT", "rpm: INT", "healthScore: FLOAT"],
    example: "Pump:Equipment {tag: 'P-101-A', name: 'Crude Feed Pump A', healthScore: 78.5}"
  },
  {
    label: "Valve",
    category: "Piping & Valves",
    description: "Control, pressure relief, or isolation valve installed in process lines.",
    keyProperties: ["tag: STRING", "valveType: STRING", "pressureRating: STRING", "sizeInches: FLOAT"],
    example: "Valve:Equipment {tag: 'PRV-102', valveType: 'Pressure Relief Valve', setPressureBar: 30.0}"
  },
  {
    label: "Motor",
    category: "Electrical Drivers",
    description: "Electric motor driver coupled to pumps, compressors, or blowers.",
    keyProperties: ["tag: STRING", "powerKw: FLOAT", "voltage: STRING", "currentAmps: FLOAT"],
    example: "Motor:Equipment {tag: 'M-101-A', powerKw: 250.0, voltage: '415V', currentAmps: 145.0}"
  },
  {
    label: "Compressor",
    category: "Rotating Machinery",
    description: "Gas compressor unit or multi-stage turbine-driven compressor.",
    keyProperties: ["tag: STRING", "stages: INT", "dischargePressureBar: FLOAT", "gasType: STRING"],
    example: "Compressor:Equipment {tag: 'C-201-B', dischargePressureBar: 85.2, gasType: 'Hydrogen'}"
  },
  {
    label: "Technician",
    category: "Workforce",
    description: "Plant maintenance technician executing field work orders and replacements.",
    keyProperties: ["id: STRING", "name: STRING", "trade: STRING", "badgeNumber: STRING"],
    example: "Technician {id: 'TECH-88', name: 'James Miller', trade: 'Mechanical Fitter'}"
  },
  {
    label: "Engineer",
    category: "Workforce",
    description: "Reliability, integrity, or plant lead engineer authorizing maintenance & SOPs.",
    keyProperties: ["id: STRING", "name: STRING", "specialization: STRING", "certLevel: STRING"],
    example: "Engineer {id: 'ENG-01', name: 'Dr. Aris Thorne', certLevel: 'ISO 18436 Cat III'}"
  },
  {
    label: "Inspection",
    category: "Quality & Integrity",
    description: "NDT inspection, thermography scan, or vibration analysis event.",
    keyProperties: ["id: STRING", "date: DATE", "method: STRING", "passed: BOOLEAN", "findings: STRING"],
    example: "Inspection {id: 'INSP-991', method: 'Ultrasonic Wall Thickness', passed: false}"
  },
  {
    label: "Maintenance",
    category: "Operations",
    description: "Preventive, predictive, or corrective maintenance intervention event.",
    keyProperties: ["id: STRING", "workOrder: STRING", "type: STRING", "costUsd: FLOAT", "completedDate: DATE"],
    example: "Maintenance {workOrder: 'WO-8841', type: 'Bearing Replacement & Realignment'}"
  },
  {
    label: "Failure",
    category: "Anomalies",
    description: "Specific root failure mode (e.g. bearing race fatigue, seal degradation, pitting).",
    keyProperties: ["code: STRING", "failureMode: STRING", "category: STRING", "severity: STRING"],
    example: "Failure {code: 'FAIL-BEAR-04', failureMode: 'Drive-End Bearing Fatigue Pitting'}"
  },
  {
    label: "Incident",
    category: "Safety & Trips",
    description: "Unplanned plant shutdown, emergency trip, or hazardous leak event.",
    keyProperties: ["id: STRING", "timestamp: DATETIME", "title: STRING", "downtimeHours: FLOAT"],
    example: "Incident {id: 'INC-2026-09', title: 'High Vibration Trip on Feed Pump P-101-A'}"
  },
  {
    label: "Manual",
    category: "Documents",
    description: "Original OEM equipment technical specification manual.",
    keyProperties: ["id: STRING", "title: STRING", "oemName: STRING", "revision: STRING"],
    example: "Manual {docId: 'DOC-MAN-SKF-101', oemName: 'Flowserve / SKF Bearings'}"
  },
  {
    label: "SOP",
    category: "Documents",
    description: "Standard Operating Procedure for isolation, repair, or operation.",
    keyProperties: ["sopNumber: STRING", "title: STRING", "lotoRequired: BOOLEAN"],
    example: "SOP {sopNumber: 'SOP-2024-PUMP-OVERHAUL', title: 'Centrifugal Pump Seal Overhaul'}"
  },
  {
    label: "Regulation",
    category: "Compliance",
    description: "Statutory safety code or environmental mandate (OISD, API, OSHA, PESO).",
    keyProperties: ["code: STRING", "clause: STRING", "governingBody: STRING", "title: STRING"],
    example: "Regulation {code: 'OISD-STD-118', clause: 'Section 4.2 Lube & Isolation'}"
  }
];

export const NEO4J_RELATIONSHIPS: Neo4jRelationshipType[] = [
  { type: "HAS_COMPONENT", sourceNode: "Equipment", targetNode: "Pump / Valve / Compressor", description: "Parent asset contains sub-equipment components", example: "(EQ-CDU-01)-[:HAS_COMPONENT]->(P-101-A)" },
  { type: "DRIVEN_BY", sourceNode: "Pump / Compressor", targetNode: "Motor", description: "Equipment is powered by electric motor driver", example: "(P-101-A)-[:DRIVEN_BY]->(M-101-A)" },
  { type: "INSPECTED_BY", sourceNode: "Equipment", targetNode: "Inspection", description: "Equipment underwent an inspection record", example: "(P-101-A)-[:INSPECTED_BY]->(INSP-991)" },
  { type: "CONDUCTED_BY", sourceNode: "Inspection / Maintenance", targetNode: "Technician / Engineer", description: "Work performed by specific personnel", example: "(INSP-991)-[:CONDUCTED_BY]->(TECH-88)" },
  { type: "MAINTAINED_VIA", sourceNode: "Equipment", targetNode: "Maintenance", description: "Maintenance record linked to equipment", example: "(P-101-A)-[:MAINTAINED_VIA]->(WO-8841)" },
  { type: "EXHIBITED_FAILURE", sourceNode: "Equipment / Incident", targetNode: "Failure", description: "Equipment or incident manifested specific failure mode", example: "(INC-2026-09)-[:EXHIBITED_FAILURE]->(FAIL-BEAR-04)" },
  { type: "TRIGGERED_INCIDENT", sourceNode: "Failure", targetNode: "Incident", description: "Failure mode triggered an emergency plant trip", example: "(FAIL-BEAR-04)-[:TRIGGERED_INCIDENT]->(INC-2026-09)" },
  { type: "GOVERNED_BY", sourceNode: "SOP / Maintenance", targetNode: "Regulation", description: "Operating procedure mandated by statutory regulation", example: "(SOP-PUMP-OVERHAUL)-[:GOVERNED_BY]->(OISD-STD-118)" },
  { type: "DOCUMENTS", sourceNode: "Manual / SOP", targetNode: "Equipment", description: "Manual or SOP details technical guidelines for equipment", example: "(DOC-MAN-SKF)-[:DOCUMENTS]->(P-101-A)" },
  { type: "APPROVED_BY", sourceNode: "SOP / Maintenance", targetNode: "Engineer", description: "Work or procedure authorized by engineer", example: "(WO-8841)-[:APPROVED_BY]->(ENG-01)" }
];

export const NEO4J_FULL_CYPHER_SCHEMA = `// ====================================================================
// INDUSMIND AI INDUSTRIAL KNOWLEDGE GRAPH - NEO4J CYPHER SCHEMA DDL
// Multi-Label Hierarchy, Constraints & Vector/Spatial Indexes
// ====================================================================

// 1. CONSTRAINTS & UNIQUE INDEXES
CREATE CONSTRAINT equipment_tag_unique IF NOT EXISTS
FOR (e:Equipment) REQUIRE e.tag IS UNIQUE;

CREATE CONSTRAINT technician_badge_unique IF NOT EXISTS
FOR (t:Technician) REQUIRE t.badgeNumber IS UNIQUE;

CREATE CONSTRAINT engineer_id_unique IF NOT EXISTS
FOR (eng:Engineer) REQUIRE eng.id IS UNIQUE;

CREATE CONSTRAINT sop_number_unique IF NOT EXISTS
FOR (s:SOP) REQUIRE s.sopNumber IS UNIQUE;

CREATE CONSTRAINT regulation_code_unique IF NOT EXISTS
FOR (r:Regulation) REQUIRE r.code IS UNIQUE;

// 2. SEARCH & RANGE INDEXES
CREATE INDEX equipment_health_idx IF NOT EXISTS
FOR (e:Equipment) ON (e.healthScore);

CREATE INDEX incident_timestamp_idx IF NOT EXISTS
FOR (i:Incident) ON (i.timestamp);

// 3. SAMPLE DATA SEEDING (NODES & RELATIONSHIPS)
CREATE (cdu:Equipment {id: 'EQ-CDU-01', tag: 'CDU-100', name: 'Crude Distillation Unit 1', location: 'Zone A', criticality: 'CRITICAL'})

CREATE (pump:Pump:Equipment {tag: 'P-101-A', name: 'Crude Feed Centrifugal Pump A', flowRate: 450.0, healthScore: 68.2})
CREATE (motor:Motor:Equipment {tag: 'M-101-A', name: 'Pump Drive Motor 250kW', voltage: '415V', currentAmps: 145.0})
CREATE (valve:Valve:Equipment {tag: 'PRV-102', name: 'Pump Suction Safety Relief Valve', setPressureBar: 30.0})
CREATE (comp:Compressor:Equipment {tag: 'C-201-B', name: 'Hydrogen Recycle Compressor', dischargePressureBar: 85.2})

CREATE (tech:Technician {id: 'TECH-88', name: 'Marcus Vance', badgeNumber: 'T-8812', trade: 'Vibration Analyst'})
CREATE (eng:Engineer {id: 'ENG-01', name: 'Dr. Aris Thorne', certLevel: 'ISO 18436 Cat III', specialization: 'Rotary Equipment'})

CREATE (insp:Inspection {id: 'INSP-991', date: '2026-07-15', method: 'Ultrasonic Bearing Scan', passed: false})
CREATE (maint:Maintenance {id: 'MAINT-8841', workOrder: 'WO-8841', type: 'Bearing Overhaul', costUsd: 14500.0})
CREATE (fail:Failure {code: 'FAIL-BEAR-04', failureMode: 'Drive-End Bearing Race Pitting', category: 'Mechanical Fatigue'})
CREATE (inc:Incident {id: 'INC-2026-09', title: 'Emergency High-Vibration Trip on P-101-A', downtimeHours: 4.5, timestamp: datetime('2026-07-22T02:15:00Z')})

CREATE (man:Manual {docId: 'DOC-SKF-101', title: 'SKF Heavy Duty Bearing Installation Manual', oemName: 'SKF Bearings'})
CREATE (sop:SOP {sopNumber: 'SOP-2024-PUMP-OVERHAUL', title: 'Standard Pump Mechanical Seal Overhaul', lotoRequired: true})
CREATE (reg:Regulation {code: 'OISD-STD-118', governingBody: 'OISD', clause: 'Clause 4.2 Lube Safety', title: 'Pressure Vessel Lube Regulations'})

// RELATIONSHIPS
CREATE (cdu)-[:HAS_COMPONENT]->(pump)
CREATE (cdu)-[:HAS_COMPONENT]->(comp)
CREATE (pump)-[:DRIVEN_BY]->(motor)
CREATE (pump)-[:HAS_COMPONENT]->(valve)

CREATE (pump)-[:INSPECTED_BY]->(insp)
CREATE (insp)-[:CONDUCTED_BY]->(tech)

CREATE (pump)-[:EXHIBITED_FAILURE]->(fail)
CREATE (fail)-[:TRIGGERED_INCIDENT]->(inc)
CREATE (inc)-[:MAINTAINED_VIA]->(maint)
CREATE (maint)-[:CONDUCTED_BY]->(tech)
CREATE (maint)-[:APPROVED_BY]->(eng)

CREATE (maint)-[:FOLLOWS_SOP]->(sop)
CREATE (sop)-[:GOVERNED_BY]->(reg)
CREATE (man)-[:DOCUMENTS]->(pump);
`;

export const CYPHER_QUERIES_CATALOG: CypherQuerySample[] = [
  {
    id: "root-cause-analysis",
    title: "1. Multi-Hop Incident Root Cause Analysis (Incident → Failure → SOP → Regulation)",
    category: "Incident Analysis",
    description: "Traverse from a emergency plant trip to identify the root failure mode, assigned engineers, governing SOP, and statutory regulations.",
    cypher: `MATCH (inc:Incident {id: 'INC-2026-09'})<-[:TRIGGERED_INCIDENT]-(fail:Failure)<-[:EXHIBITED_FAILURE]-(eq:Equipment)
MATCH (inc)-[:MAINTAINED_VIA]->(maint:Maintenance)-[:FOLLOWS_SOP]->(sop:SOP)-[:GOVERNED_BY]->(reg:Regulation)
MATCH (maint)-[:APPROVED_BY]->(eng:Engineer)
RETURN eq.tag AS EquipmentTag, fail.failureMode AS RootCause, inc.title AS IncidentTitle, 
       sop.sopNumber AS SOPCode, reg.code AS StatutoryStandard, eng.name AS LeadEngineer;`,
    explanation: "Multi-hop graph traversal combining 5 node labels to expose full compliance and operational lineage.",
    nodesInvolved: ["Incident", "Failure", "Equipment", "Maintenance", "SOP", "Regulation", "Engineer"]
  },
  {
    id: "equipment-subsystem-tree",
    title: "2. Equipment Subsystem Hierarchy (Equipment → Pump → Valve → Motor)",
    category: "Asset Management",
    description: "Query all sub-components, driver motors, and safety valves attached to a major plant processing asset.",
    cypher: `MATCH (parent:Equipment {tag: 'CDU-100'})-[:HAS_COMPONENT*1..2]->(child:Equipment)
OPTIONAL MATCH (child)-[:DRIVEN_BY]->(motor:Motor)
RETURN parent.name AS Unit, child.tag AS SubComponent, child.healthScore AS HealthScore, motor.tag AS DriverMotor;`,
    explanation: "Variable length relationship matching (*1..2) to extract nested equipment component trees.",
    nodesInvolved: ["Equipment", "Pump", "Valve", "Motor"]
  },
  {
    id: "failed-inspections-technician",
    title: "3. Failed Inspection Audit & Technician Duty Trace",
    category: "Workforce & Quality",
    description: "Find all failed NDT inspections in the last 30 days, the inspecting technician, and linked maintenance work orders.",
    cypher: `MATCH (eq:Equipment)-[:INSPECTED_BY]->(insp:Inspection {passed: false})-[:CONDUCTED_BY]->(tech:Technician)
OPTIONAL MATCH (eq)-[:MAINTAINED_VIA]->(maint:Maintenance)
RETURN eq.tag AS EquipmentTag, insp.method AS Method, tech.name AS Technician, 
       tech.trade AS Specialty, maint.workOrder AS WorkOrderCode;`,
    explanation: "Filters failed inspection records and traces accountability through technicians to corrective work orders.",
    nodesInvolved: ["Equipment", "Inspection", "Technician", "Maintenance"]
  },
  {
    id: "compliance-gap-detector",
    title: "4. Regulatory Compliance Gap Inspector (Unlinked SOPs)",
    category: "Compliance & Safety",
    description: "Identify all active plant SOPs and maintenance procedures that do NOT link to mandatory regulations.",
    cypher: `MATCH (sop:SOP)
WHERE NOT (sop)-[:GOVERNED_BY]->(:Regulation)
RETURN sop.sopNumber AS UncompliantSOP, sop.title AS SOPTitle, sop.lotoRequired AS LOTO_Required;`,
    explanation: "Uses negative pattern matching (WHERE NOT) to uncover compliance audit gaps.",
    nodesInvolved: ["SOP", "Regulation"]
  },
  {
    id: "criticality-vulnerability-index",
    title: "5. High Criticality Assets with High Vibration or Low Health",
    category: "Predictive AI",
    description: "Retrieve critical assets with health scores below 80 or pending unresolved failure modes.",
    cypher: `MATCH (eq:Equipment)
WHERE eq.criticality = 'CRITICAL' AND eq.healthScore < 80.0
OPTIONAL MATCH (eq)-[:EXHIBITED_FAILURE]->(fail:Failure)
RETURN eq.tag AS AssetTag, eq.name AS AssetName, eq.healthScore AS Health, fail.failureMode AS PendingFailure
ORDER BY eq.healthScore ASC;`,
    explanation: "Filters high-risk equipment needing immediate predictive maintenance intervention.",
    nodesInvolved: ["Equipment", "Failure"]
  }
];
