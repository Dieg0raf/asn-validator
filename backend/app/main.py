from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from .models import ASNRequest, ValidationResponse
from .validators import ASNValidator
import logging

app = FastAPI(
    title="ASN Validation",
    description="Validates ASNs against Dicks Sporting Goods compliance rules",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # frontend url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# main validator obj
validator = ASNValidator() 


@app.get("/")
async def root():
    return {"message": "Root endpoint hit"}

# Key FastAPI features:
# automatic JSON parsing
# type validation
# auto-generated documentation

@app.post("/validate-asn", response_model=ValidationResponse)
async def validate_asn(asn_data: ASNRequest):
    """Validate ASN against 3 compliance rules"""

    # 1. Parses JSON into ASNRequest object
    # 2. Validates all required fields exist
    # 3. Calls your validation logic


    try:
        is_valid, errors, warnings = validator.validate_asn(asn_data)
        
        # 4. Returns JSON response
        return ValidationResponse(
            valid=is_valid,
            errors=errors,
            warnings=warnings,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        print(e)
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