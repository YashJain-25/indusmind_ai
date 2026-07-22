from fastapi import APIRouter, Depends
from app.models.schemas import AnalyticsSummaryResponse
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/analytics", tags=["10. Executive Analytics API"])

@router.get("/summary", response_model=AnalyticsSummaryResponse)
async def get_analytics_summary(current_user: TokenData = Depends(get_current_user)):
    return AnalyticsSummaryResponse(
        total_assets_monitored=142,
        overall_health_index=98.4,
        active_p1_work_orders=3,
        compliance_rate_percent=100.0,
        weekly_trips_prevented=7
    )
