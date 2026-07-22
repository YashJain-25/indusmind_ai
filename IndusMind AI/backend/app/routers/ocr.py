from fastapi import APIRouter, Depends
from app.models.schemas import OCRRequest, OCRResult
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/ocr", tags=["3. OCR Engine API"])

@router.post("/process", response_model=OCRResult)
async def process_ocr(payload: OCRRequest, current_user: TokenData = Depends(get_current_user)):
    return OCRResult(
        file_id=payload.file_id,
        ocr_text=f"[OCR Extracted for {payload.file_id}] EQUIPMENT: P-101-A | MAX PRESSURE: 24.5 BAR | BEARING: SKF-6314 | SOP CODE: SOP-2024-PUMP-OVERHAUL. Maintenance procedure requires LOTO enforcement.",
        confidence=0.988,
        page_count=6,
        bounding_boxes_extracted=142
    )
