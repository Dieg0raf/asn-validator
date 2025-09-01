from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import ASNRequest, ValidationResponse, ValidationError
from .validators import DSGASNValidator
from datetime import datetime

app = FastAPI(
    title="DSG (Dick's Sporting Goods) ASN Validator API",
    description="API for validating ASNs against DSG compliance rules",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# validator (used across validation)
validator = DSGASNValidator()


@app.post("/validate-asn", response_model=ValidationResponse)
async def validate_asn(asn_data: ASNRequest):
    """
    Validate an ASN against DSG compliance rules
        - ASN timing requirements (within 1 hour of shipment close)
        - Carton requirements (one PO per carton, size limits)
        - UCC-128 labeling requirements (GS1 compliant SSCC)
        - TMS routing requirements (shipment ID)
        - Business rule validation (warehouse codes, PO formats)
    """
    try:

        # does validation (on valid ASNRequest obj)
        is_valid, errors = validator.validate_asn(asn_data)
        
        asn_compliance_summary = {
            "total_cartons": len(asn_data.cartons),
            "total_items": sum(
                sum(item.quantity for item in carton.items)
                for carton in asn_data.cartons
            ),
            "total_weight": sum(carton.weight for carton in asn_data.cartons),
            "validation_errors": len(errors),
        }
        
        response = ValidationResponse(
            valid=is_valid,
            errors=errors,
            timestamp=datetime.now(),
            compliance_summary=asn_compliance_summary
        )

        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during validation: {str(e)}"
        )