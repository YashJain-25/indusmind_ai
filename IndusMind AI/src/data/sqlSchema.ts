export interface SchemaTableDef {
  name: string;
  category: string;
  description: string;
  columns: { name: string; type: string; constraints: string; description: string }[];
  indexes: string[];
  foreignKeys: string[];
}

export const SQL_SCHEMA_TABLES: SchemaTableDef[] = [
  {
    name: "users",
    category: "Authentication & Security",
    description: "Stores system users, credentials hash, assigned roles, and plant location scoping.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique user identity" },
      { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE NOT NULL", description: "User email address" },
      { name: "password_hash", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Encrypted password hash" },
      { name: "full_name", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Engineer or manager name" },
      { name: "role", type: "VARCHAR(50)", constraints: "NOT NULL", description: "RBAC role (Plant Manager, Reliability Engineer, etc.)" },
      { name: "plant_location", type: "VARCHAR(100)", constraints: "NOT NULL", description: "Assigned plant facility or refinery zone" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "User creation timestamp" }
    ],
    indexes: ["CREATE INDEX idx_users_email ON users(email);", "CREATE INDEX idx_users_role ON users(role);"],
    foreignKeys: []
  },
  {
    name: "documents",
    category: "Document Intelligence",
    description: "Catalog of ingested manuals, P&IDs, SOPs, CAD prints, and inspection PDFs.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique document identifier" },
      { name: "title", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Document title" },
      { name: "category", type: "VARCHAR(100)", constraints: "NOT NULL", description: "SOP, P&ID, Manual, Inspection, CAD" },
      { name: "file_type", type: "VARCHAR(20)", constraints: "NOT NULL", description: "PDF, DOCX, CAD, PNG, CSV" },
      { name: "storage_url", type: "TEXT", constraints: "NOT NULL", description: "Cloud storage S3/GCS bucket link" },
      { name: "extracted_text", type: "TEXT", constraints: "NULL", description: "Clean OCR optical text output" },
      { name: "metadata", type: "JSONB", constraints: "DEFAULT '{}'", description: "Revision, author, approval, tags" },
      { name: "uploaded_by", type: "UUID", constraints: "REFERENCES users(id)", description: "Uploader user ID" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Ingestion timestamp" }
    ],
    indexes: ["CREATE INDEX idx_documents_category ON documents(category);", "CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);"],
    foreignKeys: ["FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL"]
  },
  {
    name: "assets",
    category: "Asset Management",
    description: "High-level plant site assets, operational units, and processing trains.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique asset group ID" },
      { name: "asset_tag", type: "VARCHAR(100)", constraints: "UNIQUE NOT NULL", description: "Site tag code (e.g. CRUDE-DISTILL-UNIT-1)" },
      { name: "name", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Descriptive unit name" },
      { name: "plant_location", type: "VARCHAR(100)", constraints: "NOT NULL", description: "Facility location identifier" },
      { name: "criticality", type: "VARCHAR(50)", constraints: "NOT NULL", description: "High, Critical, Medium, Low" },
      { name: "status", type: "VARCHAR(50)", constraints: "DEFAULT 'Operational'", description: "Operational, Degraded, Shutdown" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Registration timestamp" }
    ],
    indexes: ["CREATE INDEX idx_assets_asset_tag ON assets(asset_tag);", "CREATE INDEX idx_assets_criticality ON assets(criticality);"],
    foreignKeys: []
  },
  {
    name: "equipment",
    category: "Asset Management",
    description: "Specific physical machinery, pumps, turbines, heat exchangers, valves.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique equipment ID" },
      { name: "equipment_code", type: "VARCHAR(100)", constraints: "UNIQUE NOT NULL", description: "Tag code (e.g., P-101-A)" },
      { name: "asset_id", type: "UUID", constraints: "REFERENCES assets(id)", description: "Parent asset unit ID" },
      { name: "name", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Machinery name" },
      { name: "equipment_type", type: "VARCHAR(100)", constraints: "NOT NULL", description: "Centrifugal Pump, Gas Turbine, etc." },
      { name: "health_score", type: "NUMERIC(5,2)", constraints: "DEFAULT 100.00", description: "0-100 real-time health rating" },
      { name: "vibration_mm_s", type: "NUMERIC(6,3)", constraints: "DEFAULT 0.000", description: "Live vibration level" },
      { name: "temperature_c", type: "NUMERIC(6,2)", constraints: "DEFAULT 0.00", description: "Live bearing temp" },
      { name: "linked_sop_id", type: "UUID", constraints: "REFERENCES documents(id)", description: "Primary operating SOP" },
      { name: "updated_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Last sensor update" }
    ],
    indexes: ["CREATE INDEX idx_equipment_code ON equipment(equipment_code);", "CREATE INDEX idx_equipment_asset_id ON equipment(asset_id);"],
    foreignKeys: [
      "FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE",
      "FOREIGN KEY (linked_sop_id) REFERENCES documents(id) ON DELETE SET NULL"
    ]
  },
  {
    name: "engineers",
    category: "Workforce & Operations",
    description: "Specialized maintenance engineers, reliability specialists, and technicians.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique engineer ID" },
      { name: "user_id", type: "UUID", constraints: "REFERENCES users(id)", description: "Linked system user account" },
      { name: "specialization", type: "VARCHAR(100)", constraints: "NOT NULL", description: "Vibration Analysis, Rotary Equipment, Instrumentation" },
      { name: "certification_level", type: "VARCHAR(50)", constraints: "NOT NULL", description: "ISO 18436 Cat III, Senior Specialist" },
      { name: "years_experience", type: "INT", constraints: "NOT NULL", description: "Years in plant maintenance" },
      { name: "is_active", type: "BOOLEAN", constraints: "DEFAULT TRUE", description: "Active on-duty status" }
    ],
    indexes: ["CREATE INDEX idx_engineers_user_id ON engineers(user_id);"],
    foreignKeys: ["FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"]
  },
  {
    name: "maintenance_records",
    category: "Maintenance Operations",
    description: "Historical overhaul logs, component replacements, and lubrication records.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique record ID" },
      { name: "equipment_id", type: "UUID", constraints: "REFERENCES equipment(id)", description: "Serviced machinery" },
      { name: "maintenance_type", type: "VARCHAR(50)", constraints: "NOT NULL", description: "Preventive, Predictive, Overhaul, Emergency" },
      { name: "performed_by", type: "UUID", constraints: "REFERENCES engineers(id)", description: "Lead technician/engineer" },
      { name: "findings", type: "TEXT", constraints: "NOT NULL", description: "Inspection findings and replacement parts" },
      { name: "cost_usd", type: "NUMERIC(10,2)", constraints: "DEFAULT 0.00", description: "Maintenance expenditure" },
      { name: "completed_at", type: "TIMESTAMPTZ", constraints: "NOT NULL", description: "Completion timestamp" }
    ],
    indexes: ["CREATE INDEX idx_maint_equipment ON maintenance_records(equipment_id);", "CREATE INDEX idx_maint_engineer ON maintenance_records(performed_by);"],
    foreignKeys: [
      "FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE",
      "FOREIGN KEY (performed_by) REFERENCES engineers(id) ON DELETE SET NULL"
    ]
  },
  {
    name: "work_orders",
    category: "Maintenance Operations",
    description: "Active work tasks, spare parts allocations, and emergency dispatches.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique internal ID" },
      { name: "order_code", type: "VARCHAR(50)", constraints: "UNIQUE NOT NULL", description: "Human code (e.g. WO-8841)" },
      { name: "equipment_id", type: "UUID", constraints: "REFERENCES equipment(id)", description: "Target machinery ID" },
      { name: "priority", type: "VARCHAR(50)", constraints: "NOT NULL", description: "P1 - Critical, P2 - High, P3 - Medium" },
      { name: "status", type: "VARCHAR(50)", constraints: "DEFAULT 'Open'", description: "Open, In Progress, Completed, Cancelled" },
      { name: "assigned_engineer_id", type: "UUID", constraints: "REFERENCES engineers(id)", description: "Assigned lead" },
      { name: "description", type: "TEXT", constraints: "NOT NULL", description: "Task instructions and SOP citations" },
      { name: "due_date", type: "TIMESTAMPTZ", constraints: "NOT NULL", description: "Required completion deadline" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Creation timestamp" }
    ],
    indexes: ["CREATE INDEX idx_wo_equipment ON work_orders(equipment_id);", "CREATE INDEX idx_wo_status ON work_orders(status);"],
    foreignKeys: [
      "FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE",
      "FOREIGN KEY (assigned_engineer_id) REFERENCES engineers(id) ON DELETE SET NULL"
    ]
  },
  {
    name: "inspection_reports",
    category: "Quality & Safety",
    description: "NDT, thermography, vibration analysis, and wall-thickness inspection logs.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Report identifier" },
      { name: "equipment_id", type: "UUID", constraints: "REFERENCES equipment(id)", description: "Inspected equipment ID" },
      { name: "inspector_name", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Inspector name or agency" },
      { name: "methodology", type: "VARCHAR(100)", constraints: "NOT NULL", description: "Ultrasonic Thickness, Thermography, Vibration" },
      { name: "pass_status", type: "BOOLEAN", constraints: "NOT NULL", description: "Pass / Fail boolean flag" },
      { name: "observations", type: "TEXT", constraints: "NOT NULL", description: "Detailed technician observations" },
      { name: "attachment_doc_id", type: "UUID", constraints: "REFERENCES documents(id)", description: "PDF report attachment" },
      { name: "inspected_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Inspection timestamp" }
    ],
    indexes: ["CREATE INDEX idx_inspection_equipment ON inspection_reports(equipment_id);"],
    foreignKeys: [
      "FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE",
      "FOREIGN KEY (attachment_doc_id) REFERENCES documents(id) ON DELETE SET NULL"
    ]
  },
  {
    name: "compliance_reports",
    category: "Compliance & Regulations",
    description: "Statutory environmental, fire safety, and pressure vessel compliance audits.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique compliance audit ID" },
      { name: "audit_title", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Audit name" },
      { name: "regulation_id", type: "UUID", constraints: "NOT NULL", description: "Governing regulation ID" },
      { name: "status", type: "VARCHAR(50)", constraints: "NOT NULL", description: "Compliant, Non-Compliant, Gap Detected" },
      { name: "risk_level", type: "VARCHAR(20)", constraints: "NOT NULL", description: "Low, Medium, High, Critical" },
      { name: "auditor_user_id", type: "UUID", constraints: "REFERENCES users(id)", description: "Compliance officer" },
      { name: "findings_summary", type: "TEXT", constraints: "NOT NULL", description: "Gaps and corrective directives" },
      { name: "audit_date", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Audit completion timestamp" }
    ],
    indexes: ["CREATE INDEX idx_compliance_status ON compliance_reports(status);"],
    foreignKeys: ["FOREIGN KEY (auditor_user_id) REFERENCES users(id) ON DELETE SET NULL"]
  },
  {
    name: "incidents",
    category: "Safety & Root Cause Analysis",
    description: "Emergency trips, catastrophic failures, leaks, and near-miss event records.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Incident ID" },
      { name: "title", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Short incident summary" },
      { name: "equipment_id", type: "UUID", constraints: "REFERENCES equipment(id)", description: "Failed machine ID" },
      { name: "severity", type: "VARCHAR(20)", constraints: "NOT NULL", description: "Critical, Major, Minor" },
      { name: "root_cause_summary", type: "TEXT", constraints: "NULL", description: "Synthesized root cause" },
      { name: "five_whys_json", type: "JSONB", constraints: "DEFAULT '[]'", description: "5 Whys root cause tree" },
      { name: "fishbone_json", type: "JSONB", constraints: "DEFAULT '{}'", description: "Ishikawa cause categories" },
      { name: "reported_by", type: "UUID", constraints: "REFERENCES users(id)", description: "Reporter ID" },
      { name: "occurred_at", type: "TIMESTAMPTZ", constraints: "NOT NULL", description: "Event timestamp" }
    ],
    indexes: ["CREATE INDEX idx_incidents_equipment ON incidents(equipment_id);", "CREATE INDEX idx_incidents_severity ON incidents(severity);"],
    foreignKeys: [
      "FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE",
      "FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL"
    ]
  },
  {
    name: "regulations",
    category: "Compliance & Regulations",
    description: "Statutory standards (OISD, ISO, OSHA, PESO) and factory safety rules.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique regulation ID" },
      { name: "code", type: "VARCHAR(100)", constraints: "UNIQUE NOT NULL", description: "Standard code (e.g. OISD-STD-118)" },
      { name: "title", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Standard name" },
      { name: "governing_body", type: "VARCHAR(100)", constraints: "NOT NULL", description: "OISD, ISO, OSHA, PESO" },
      { name: "clause_number", type: "VARCHAR(50)", constraints: "NOT NULL", description: "Clause or section reference" },
      { name: "mandatory_clause", type: "TEXT", constraints: "NOT NULL", description: "Full statutory mandate text" },
      { name: "document_id", type: "UUID", constraints: "REFERENCES documents(id)", description: "Original PDF standard" }
    ],
    indexes: ["CREATE INDEX idx_regulations_code ON regulations(code);"],
    foreignKeys: ["FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL"]
  },
  {
    name: "knowledge_graph_nodes",
    category: "Knowledge Graph Engine",
    description: "Nodes representing equipment, SOPs, failures, technicians, and parts.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Node ID" },
      { name: "node_label", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Display name (e.g. P-101 or SKF-6314)" },
      { name: "node_type", type: "VARCHAR(50)", constraints: "NOT NULL", description: "Equipment, Plant, Incident, SOP, Part, Regulation" },
      { name: "properties_json", type: "JSONB", constraints: "DEFAULT '{}'", description: "Entity properties and parameters" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Node timestamp" }
    ],
    indexes: ["CREATE INDEX idx_kg_nodes_type ON knowledge_graph_nodes(node_type);", "CREATE INDEX idx_kg_nodes_label ON knowledge_graph_nodes(node_label);"],
    foreignKeys: []
  },
  {
    name: "knowledge_graph_relationships",
    category: "Knowledge Graph Engine",
    description: "Typed edges connecting nodes (e.g., INSTALLED_IN, FAILED_DUE_TO, GOVERNED_BY).",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Edge ID" },
      { name: "source_node_id", type: "UUID", constraints: "REFERENCES knowledge_graph_nodes(id)", description: "Start node ID" },
      { name: "target_node_id", type: "UUID", constraints: "REFERENCES knowledge_graph_nodes(id)", description: "End node ID" },
      { name: "relationship_type", type: "VARCHAR(100)", constraints: "NOT NULL", description: "HAS_PART, FAILED_DUE_TO, GOVERNED_BY, REFERENCES" },
      { name: "weight", type: "NUMERIC(3,2)", constraints: "DEFAULT 1.00", description: "Edge confidence strength" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Edge creation timestamp" }
    ],
    indexes: ["CREATE INDEX idx_kg_rel_source ON knowledge_graph_relationships(source_node_id);", "CREATE INDEX idx_kg_rel_target ON knowledge_graph_relationships(target_node_id);"],
    foreignKeys: [
      "FOREIGN KEY (source_node_id) REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE",
      "FOREIGN KEY (target_node_id) REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "chat_history",
    category: "RAG & Copilot Intelligence",
    description: "Conversation turns with Orion AI, grounded document citations, and query logs.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Message ID" },
      { name: "session_id", type: "UUID", constraints: "NOT NULL", description: "Chat session grouping ID" },
      { name: "user_id", type: "UUID", constraints: "REFERENCES users(id)", description: "User ID" },
      { name: "sender", type: "VARCHAR(20)", constraints: "NOT NULL", description: "user or assistant" },
      { name: "message_text", type: "TEXT", constraints: "NOT NULL", description: "Query or LLM response text" },
      { name: "cited_documents_json", type: "JSONB", constraints: "DEFAULT '[]'", description: "Array of cited document URLs/pages" },
      { name: "embedding_vector", type: "vector(1536)", constraints: "NULL", description: "pgvector semantic embedding" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Turn timestamp" }
    ],
    indexes: ["CREATE INDEX idx_chat_session ON chat_history(session_id);", "CREATE INDEX idx_chat_user ON chat_history(user_id);"],
    foreignKeys: ["FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"]
  }
];

export const FULL_POSTGRESQL_DDL_SCRIPT = `-- ====================================================================
-- INDUSMIND AI INDUSTRIAL KNOWLEDGE PLATFORM - COMPLETE SQL DDL SCHEMA
-- Target Database: PostgreSQL 15+ with pgvector Extension
-- Features: 14 Core Enterprise Tables, FK Constraints, Indexes & Vector RAG
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    plant_location VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. DOCUMENTS TABLE
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    storage_url TEXT NOT NULL,
    extracted_text TEXT,
    metadata JSONB DEFAULT '{}',
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);

-- 3. ASSETS TABLE
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_tag VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    plant_location VARCHAR(100) NOT NULL,
    criticality VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Operational',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_assets_asset_tag ON assets(asset_tag);
CREATE INDEX idx_assets_criticality ON assets(criticality);

-- 4. EQUIPMENT TABLE
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_code VARCHAR(100) UNIQUE NOT NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(100) NOT NULL,
    health_score NUMERIC(5,2) DEFAULT 100.00,
    vibration_mm_s NUMERIC(6,3) DEFAULT 0.000,
    temperature_c NUMERIC(6,2) DEFAULT 0.00,
    linked_sop_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_equipment_code ON equipment(equipment_code);
CREATE INDEX idx_equipment_asset_id ON equipment(asset_id);

-- 5. ENGINEERS TABLE
CREATE TABLE engineers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    certification_level VARCHAR(50) NOT NULL,
    years_experience INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_engineers_user_id ON engineers(user_id);

-- 6. MAINTENANCE RECORDS TABLE
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(50) NOT NULL,
    performed_by UUID REFERENCES engineers(id) ON DELETE SET NULL,
    findings TEXT NOT NULL,
    cost_usd NUMERIC(10,2) DEFAULT 0.00,
    completed_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_maint_equipment ON maintenance_records(equipment_id);
CREATE INDEX idx_maint_engineer ON maintenance_records(performed_by);

-- 7. WORK ORDERS TABLE
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(50) UNIQUE NOT NULL,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Open',
    assigned_engineer_id UUID REFERENCES engineers(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_wo_equipment ON work_orders(equipment_id);
CREATE INDEX idx_wo_status ON work_orders(status);

-- 8. INSPECTION REPORTS TABLE
CREATE TABLE inspection_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    inspector_name VARCHAR(255) NOT NULL,
    methodology VARCHAR(100) NOT NULL,
    pass_status BOOLEAN NOT NULL,
    observations TEXT NOT NULL,
    attachment_doc_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    inspected_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_inspection_equipment ON inspection_reports(equipment_id);

-- 9. REGULATIONS TABLE
CREATE TABLE regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    governing_body VARCHAR(100) NOT NULL,
    clause_number VARCHAR(50) NOT NULL,
    mandatory_clause TEXT NOT NULL,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL
);
CREATE INDEX idx_regulations_code ON regulations(code);

-- 10. COMPLIANCE REPORTS TABLE
CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_title VARCHAR(255) NOT NULL,
    regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    auditor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    findings_summary TEXT NOT NULL,
    audit_date TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_compliance_status ON compliance_reports(status);

-- 11. INCIDENTS TABLE
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL,
    root_cause_summary TEXT,
    five_whys_json JSONB DEFAULT '[]',
    fishbone_json JSONB DEFAULT '{}',
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    occurred_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_incidents_equipment ON incidents(equipment_id);
CREATE INDEX idx_incidents_severity ON incidents(severity);

-- 12. KNOWLEDGE GRAPH NODES TABLE
CREATE TABLE knowledge_graph_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_label VARCHAR(255) NOT NULL,
    node_type VARCHAR(50) NOT NULL,
    properties_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_kg_nodes_type ON knowledge_graph_nodes(node_type);
CREATE INDEX idx_kg_nodes_label ON knowledge_graph_nodes(node_label);

-- 13. KNOWLEDGE GRAPH RELATIONSHIPS TABLE
CREATE TABLE knowledge_graph_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_node_id UUID REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
    relationship_type VARCHAR(100) NOT NULL,
    weight NUMERIC(3,2) DEFAULT 1.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_kg_rel_source ON knowledge_graph_relationships(source_node_id);
CREATE INDEX idx_kg_rel_target ON knowledge_graph_relationships(target_node_id);

-- 14. CHAT HISTORY TABLE (WITH VECTOR EMBEDDINGS)
CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL,
    message_text TEXT NOT NULL,
    cited_documents_json JSONB DEFAULT '[]',
    embedding_vector vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_chat_session ON chat_history(session_id);
CREATE INDEX idx_chat_user ON chat_history(user_id);
`;
