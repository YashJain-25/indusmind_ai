import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends
from app.models.schemas import DocumentUploadResponse
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/upload", tags=["2. Document Upload API"])

@router.post("", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form("SOP"),
    current_user: TokenData = Depends(get_current_user)
):
    file_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
    content = await file.read()
    
    return DocumentUploadResponse(
        file_id=file_id,
        filename=file.filename or "unknown.pdf",
        file_type=document_type,
        size_bytes=len(content),
        storage_path=f"s3://indusmind-documents/{file_id}/{file.filename}",
        status="INGESTED_AND_INDEXED"
    )
