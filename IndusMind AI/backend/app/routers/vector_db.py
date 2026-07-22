from typing import List
from fastapi import APIRouter, Depends
from app.models.schemas import VectorSearchRequest, VectorSearchResult
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/vector-db", tags=["6. Vector Database RAG API"])

@router.post("/search", response_model=List[VectorSearchResult])
async def search_vector_db(payload: VectorSearchRequest, current_user: TokenData = Depends(get_current_user)):
    return [
        VectorSearchResult(
            doc_id="DOC-9941",
            text_chunk="SOP-2024 Clause 4.2: Pump P-101 drive-end bearing lubrication interval is 500 operating hours. Use ISO VG 68 synthetic oil.",
            similarity_score=0.942,
            metadata={"source": "SOP-2024-PUMP.pdf", "page": 4}
        ),
        VectorSearchResult(
            doc_id="DOC-8812",
            text_chunk="Inspection Report IR-2026-04: Vibration spectrum analysis indicated 8.8 mm/s peak at NDE bearing frequency.",
            similarity_score=0.887,
            metadata={"source": "Vibration_Analysis_P101.pdf", "page": 1}
        )
    ]
