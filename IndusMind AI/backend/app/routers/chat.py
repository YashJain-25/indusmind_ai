from fastapi import APIRouter, Depends
from app.models.schemas import ChatRequest, ChatResponse
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/chat", tags=["7. Copilot Chat API"])

@router.post("/completions", response_model=ChatResponse)
async def copilot_chat(payload: ChatRequest, current_user: TokenData = Depends(get_current_user)):
    last_query = payload.messages[-1].content if payload.messages else "Help"
    
    return ChatResponse(
        answer=f"[Orion™ Copilot] Analysis for '{last_query}':\n\nPump P-101 requires immediate inspection based on recent 8.8 mm/s vibration telemetry. The root cause is drive-end bearing race pitting. Follow SOP-2024 for LOTO and SKF-6314 replacement.",
        confidence_score=0.98,
        sources=[
            {"title": "SOP-2024-PUMP: Centrifugal Pump Overhaul", "type": "SOP", "confidence": 0.98},
            {"title": "ML-904: Vibration Analysis Report P-101", "type": "Inspection Report", "confidence": 0.95}
        ],
        suggested_actions=[
            "Create Emergency Work Order for SKF-6314 Replacement",
            "Schedule Laser Alignment Inspection",
            "Verify OISD-STD-118 Lubrication Compliance"
        ]
    )
