from fastapi import APIRouter, Depends
from app.models.schemas import KnowledgeGraphResponse, GraphNode, GraphEdge
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/knowledge-graph", tags=["5. Knowledge Graph API"])

@router.get("", response_model=KnowledgeGraphResponse)
async def get_knowledge_graph(current_user: TokenData = Depends(get_current_user)):
    nodes = [
        GraphNode(id="p101", label="Centrifugal Pump P-101", type="Equipment"),
        GraphNode(id="skf6314", label="SKF-6314 Heavy Duty Bearing", type="SparePart"),
        GraphNode(id="sop2024", label="SOP-2024 Overhaul Guide", type="SOP"),
        GraphNode(id="oisd118", label="OISD-STD-118 Pressure Safety", type="Regulation"),
        GraphNode(id="inc881", label="Incident INC-2026-881 Bearing Seizure", type="Incident")
    ]
    edges = [
        GraphEdge(source="p101", target="skf6314", relation="USES_PART"),
        GraphEdge(source="p101", target="sop2024", relation="GOVERNED_BY"),
        GraphEdge(source="p101", target="oisd118", relation="COMPLIES_WITH"),
        GraphEdge(source="inc881", target="p101", relation="AFFECTED_ASSET"),
        GraphEdge(source="inc881", target="skf6314", relation="FAILED_COMPONENT")
    ]
    return KnowledgeGraphResponse(nodes=nodes, edges=edges)
