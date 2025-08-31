from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import ASNRequest, ValidationResponse
from .validators import ASNValidator
import logging

app = FastAPI(
    title="ASN Validator API",
    description="Validates ASNs against Dick's Sporting Goods compliance rules",
    version="1.0.0"
)

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

validator = ASNValidator()

# FastAPI endpoint to validate an ASN

@app.get("/")
async def root():
    return {"message": "ASN Validator API - Dick's Sporting Goods Compliance"}

@app.post("/validate-asn", response_model=ValidationResponse)
async def validate_asn(asn_data: ASNRequest):
    """Validate ASN against the 3 core compliance rules"""
    print(asn_data)
    try:
        is_valid, errors, warnings = validator.validate_asn(asn_data)
        print(is_valid, errors, warnings)
        
        return ValidationResponse(
            valid=is_valid,
            errors=errors,
            warnings=warnings,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sample-asn")
async def get_sample_asn():
    """Get a sample valid ASN for testing"""
    return {
        "message": "Sample valid ASN template",
        "template": {
            "vendor_id": "V12345",
            "po_number": "DSG-2024-001234",
            "ship_date": "2024-12-20",
            "expected_delivery": "2024-12-25",
            "warehouse_code": "PA1",
            "carrier": "FEDEX",
            "tracking_number": "12345678901234567890",
            "tms_shipment_id": "CS12345678",
            "items": [
                {
                    "item_number": "ITEM001",
                    "quantity": 100,
                    "unit_cost": 25.99,
                    "description": "Basketball"
                }
            ],
            "special_instructions": "Handle with care"
        }
    }