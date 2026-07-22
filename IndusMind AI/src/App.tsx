import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, setDoc, doc } from "firebase/firestore";
import { auth, db, logoutUser } from "./lib/firebase";
import {
  UserProfile,
  UserRole,
  AppModule,
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
} from "./types";
import {
  INITIAL_AGENTS,
  INITIAL_EQUIPMENT,
  INITIAL_DOCUMENTS,
  INITIAL_WORK_ORDERS,
  INITIAL_GRAPH_NODES,
  INITIAL_GRAPH_EDGES,
  INITIAL_COMPLIANCE,
  INITIAL_LESSONS,
  INITIAL_RULES,
  INITIAL_ACTIVITY_LOGS
} from "./data/seedData";

// Navigation Components
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { CommandPalette } from "./components/CommandPalette";
import { AuthModal } from "./components/AuthModal";
import { HackathonBlueprintModal } from "./components/modals/HackathonBlueprintModal";

// Module Views
import { LoginModule } from "./components/modules/LoginModule";
import { DashboardModule } from "./components/modules/DashboardModule";
import { CopilotModule } from "./components/modules/CopilotModule";
import { DocumentIntelligenceModule } from "./components/modules/DocumentIntelligenceModule";
import { KnowledgeGraphModule } from "./components/modules/KnowledgeGraphModule";
import { DigitalTwinModule } from "./components/modules/DigitalTwinModule";
import { MaintenanceModule } from "./components/modules/MaintenanceModule";
import { RCAModule } from "./components/modules/RCAModule";
import { LessonsLearnedModule } from "./components/modules/LessonsLearnedModule";
import { ComplianceModule } from "./components/modules/ComplianceModule";
import { ReportsModule } from "./components/modules/ReportsModule";
import { AdminModule } from "./components/modules/AdminModule";
import { FastAPIModule } from "./components/modules/FastAPIModule";
import { AuditWorkspaceModule } from "./components/modules/AuditWorkspaceModule";
import { ExecutiveAnalyticsModule } from "./components/modules/ExecutiveAnalyticsModule";
import { WorkflowAutomationModule } from "./components/modules/WorkflowAutomationModule";
import { NotificationCenterModule } from "./components/modules/NotificationCenterModule";
import { MobileFieldAssistantModule } from "./components/modules/MobileFieldAssistantModule";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>("Plant Manager");
  const [activeModule, setActiveModule] = useState<AppModule>("copilot");

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Firestore Real-time Collections State
  const [agents] = useState<AgentStatus[]>(INITIAL_AGENTS);
  const [documents, setDocuments] = useState<IndustrialDocument[]>(INITIAL_DOCUMENTS);
  const [equipment, setEquipment] = useState<EquipmentTwin[]>(INITIAL_EQUIPMENT);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(INITIAL_INCIDENTS_MOCK);
  const [graphNodes] = useState<GraphNode[]>(INITIAL_GRAPH_NODES);
  const [graphEdges] = useState<GraphEdge[]>(INITIAL_GRAPH_EDGES);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(INITIAL_COMPLIANCE);
  const [lessons] = useState<LessonItem[]>(INITIAL_LESSONS);
  const [rules, setRules] = useState<WorkflowRule[]>(INITIAL_RULES);
  const [activityLogs, setActivityLogs] = useState<AgentActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "engineer@indusmind.ai",
          displayName: firebaseUser.displayName || `${activeRole} User`,
          role: activeRole,
          plantLocation: "Gujarat Refinery - Plant 04",
          avatarUrl: firebaseUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, [activeRole]);

  // Firestore Real-Time Subscriptions & Auto-seed
  useEffect(() => {
    // 1. Documents subscription
    const unsubDocs = onSnapshot(collection(db, "documents"), (snapshot) => {
      if (!snapshot.empty) {
        const docsData: IndustrialDocument[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as any;
        setDocuments(docsData);
      } else {
        // Seed initial documents to Firestore
        INITIAL_DOCUMENTS.forEach(async (docData) => {
          await setDoc(doc(db, "documents", docData.id), docData);
        });
      }
    });

    // 2. Equipment subscription
    const unsubEq = onSnapshot(collection(db, "equipment"), (snapshot) => {
      if (!snapshot.empty) {
        const eqData: EquipmentTwin[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as any;
        setEquipment(eqData);
      } else {
        INITIAL_EQUIPMENT.forEach(async (eq) => {
          await setDoc(doc(db, "equipment", eq.id), eq);
        });
      }
    });

    // 3. WorkOrders subscription
    const unsubWO = onSnapshot(collection(db, "workOrders"), (snapshot) => {
      if (!snapshot.empty) {
        const woData: WorkOrder[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as any;
        setWorkOrders(woData);
      } else {
        INITIAL_WORK_ORDERS.forEach(async (wo) => {
          await setDoc(doc(db, "workOrders", wo.id), wo);
        });
      }
    });

    return () => {
      unsubDocs();
      unsubEq();
      unsubWO();
    };
  }, []);

  // Handlers for updating items in Firestore
  const handleAddDocument = async (newDoc: IndustrialDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    try {
      await setDoc(doc(db, "documents", newDoc.id), newDoc);
    } catch (e) {
      console.error("Firestore doc write error:", e);
    }
  };

  const handleUpdateEquipment = async (updatedEq: EquipmentTwin) => {
    setEquipment((prev) => prev.map((e) => (e.id === updatedEq.id ? updatedEq : e)));
    try {
      await setDoc(doc(db, "equipment", updatedEq.id), updatedEq);
    } catch (e) {
      console.error("Firestore equipment write error:", e);
    }
  };

  const handleAddWorkOrder = async (newWo: WorkOrder) => {
    setWorkOrders((prev) => [newWo, ...prev]);
    try {
      await setDoc(doc(db, "workOrders", newWo.id), newWo);
    } catch (e) {
      console.error("Firestore WO write error:", e);
    }
  };

  const handleAddIncident = (newInc: IncidentRecord) => {
    setIncidents((prev) => [newInc, ...prev]);
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Render module component based on activeModule
  const renderActiveModule = () => {
    switch (activeModule) {
      case "login":
        return (
          <LoginModule
            currentUser={currentUser}
            activeRole={activeRole}
            onRoleChange={(r) => setActiveRole(r)}
            onNavigateModule={(mod) => setActiveModule(mod)}
          />
        );

      case "dashboard":
        return (
          <DashboardModule
            agents={agents}
            equipment={equipment}
            workOrders={workOrders}
            activityLogs={activityLogs}
            onNavigateModule={(mod) => setActiveModule(mod)}
          />
        );

      case "copilot":
        return (
          <CopilotModule
            userRole={activeRole}
            documents={documents}
            onAddDocument={handleAddDocument}
            onNavigateModule={(mod) => setActiveModule(mod)}
          />
        );

      case "documents":
        return (
          <DocumentIntelligenceModule
            documents={documents}
            onAddDocument={handleAddDocument}
          />
        );

      case "graph":
        return <KnowledgeGraphModule nodes={graphNodes} edges={graphEdges} />;

      case "twin":
        return (
          <DigitalTwinModule
            equipment={equipment}
            onUpdateEquipment={handleUpdateEquipment}
            onNavigateModule={(mod) => setActiveModule(mod)}
          />
        );

      case "maintenance":
        return (
          <MaintenanceModule
            equipment={equipment}
            workOrders={workOrders}
            onAddWorkOrder={handleAddWorkOrder}
          />
        );

      case "rca":
        return <RCAModule incidents={incidents} onAddIncident={handleAddIncident} />;

      case "reports":
        return (
          <ReportsModule
            documents={documents}
            incidents={incidents}
            workOrders={workOrders}
            complianceItems={complianceItems}
          />
        );

      case "admin":
        return <AdminModule agents={agents} />;

      case "fastapi":
        return <FastAPIModule />;

      case "lessons":
        return <LessonsLearnedModule lessons={lessons} />;

      case "compliance":
        return (
          <ComplianceModule
            complianceItems={complianceItems}
            onUpdateItem={(item) =>
              setComplianceItems((prev) => prev.map((c) => (c.id === item.id ? item : c)))
            }
          />
        );

      case "audit":
        return <AuditWorkspaceModule />;

      case "analytics":
        return <ExecutiveAnalyticsModule />;

      case "automation":
        return <WorkflowAutomationModule rules={rules} onToggleRule={handleToggleRule} />;

      case "notifications":
        return <NotificationCenterModule activityLogs={activityLogs} />;

      case "mobile":
        return <MobileFieldAssistantModule workOrders={workOrders} />;

      default:
        return (
          <DashboardModule
            agents={agents}
            equipment={equipment}
            workOrders={workOrders}
            activityLogs={activityLogs}
            onNavigateModule={(mod) => setActiveModule(mod)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors">
      {/* Header */}
      <Header
        currentUser={currentUser}
        activeRole={activeRole}
        onRoleChange={(r) => setActiveRole(r)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => logoutUser()}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
        onOpenBlueprint={() => setIsBlueprintOpen(true)}
        unreadCount={workOrders.filter((w) => w.priority.includes("Critical")).length}
        onToggleSidebarMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(m) => setActiveModule(m)}
          openCount={workOrders.length}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto pb-12">{renderActiveModule()}</main>
      </div>

      {/* Modals */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectModule={(m) => setActiveModule(m)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(role) => setActiveRole(role)}
      />

      <HackathonBlueprintModal
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />
    </div>
  );
}

// Fallback Incident data if empty
const INITIAL_INCIDENTS_MOCK: IncidentRecord[] = [
  {
    id: "inc-1",
    title: "Pump P-101 High Vibration Thermal Overload Trip",
    equipmentCode: "P-101",
    severity: "Critical",
    status: "RCA Completed",
    reportedBy: "Vibration Reliability Team",
    timestamp: "2026-07-21",
    fiveWhys: [
      { step: 1, question: "Why did Pump P-101 trip?", answer: "Overcurrent relay tripped due to motor thermal overload." },
      { step: 2, question: "Why was the motor overloaded?", answer: "Drive-end bearing inner race pitting increased rotational friction." },
      { step: 3, question: "Why did the bearing pit?", answer: "Water moisture ingress past degraded rubber oil seal." }
    ],
    capa: [
      { type: "Corrective", action: "Replace SKF bearing and install Viton seal kit", owner: "Maintenance Lead", timeline: "Immediate" }
    ]
  }
];
