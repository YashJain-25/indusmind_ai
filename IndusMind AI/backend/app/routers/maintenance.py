from fastapi import APIRouter, Depends
from app.models.schemas import TelemetryInput, MaintenancePredictionResponse
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/maintenance", tags=["9. Predictive Maintenance API"])

@router.post("/predict", response_model=MaintenancePredictionResponse)
async def predict_maintenance(telemetry: TelemetryInput, current_user: TokenData = Depends(get_current_user)):
    is_high_risk = telemetry.vibration_mms > 6.0 or telemetry.temperature_c > 85.0
    
    return MaintenancePredictionResponse(
        equipment_code=telemetry.equipment_code,
        failure_probability=87.5 if is_high_risk else 18.2,
        remaining_useful_life_days=12 if is_high_risk else 160,
        predicted_failure_mode="Drive-End Bearing Race Pitting & Seal Mechanical Degradation" if is_high_risk else "Normal Wear",
        recommended_spares=[
            {"part_name": "SKF-6314 Heavy Duty Ball Bearing", "stock_qty": 4, "lead_time_days": 2},
            {"part_name": "Viton Mechanical Seal Kit MS-101", "stock_qty": 2, "lead_time_days": 1}
        ]
    )
