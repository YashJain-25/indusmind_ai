from fastapi import APIRouter, Depends
from app.models.schemas import EntityExtractRequest, EntityExtractionResponse, ExtractedEntity
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/entities", tags=["4. Entity Extraction API"])

@router.post("/extract", response_model=EntityExtractionResponse)
async def extract_entities(payload: EntityExtractRequest, current_user: TokenData = Depends(get_current_user)):
    extracted = [
        ExtractedEntity(name="P-101-A", category="Equipment", confidence=0.99, span="P-101-A"),
        ExtractedEntity(name="SKF-6314", category="SparePart", confidence=0.97, span="SKF-6314"),
        ExtractedEntity(name="PRV-102", category="Valve", confidence=0.96, span="PRV-102"),
        ExtractedEntity(name="OISD-STD-118", category="Regulation", confidence=0.98, span="OISD-STD-118"),
    ]
    
    return EntityExtractionResponse(
        entities=extracted,
        parameters={
            "operating_pressure": "24.5 Bar",
            "operating_temperature": "185 °C",
            "max_vibration": "4.5 mm/s"
        },
        safety_warnings=[
            "High temperature steam hazard during maintenance",
            "Mandatory Lockout/Tagout (LOTO) prior to casing removal"
        ]
    )
