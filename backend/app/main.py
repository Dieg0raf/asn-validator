from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import ASNRequest, ValidationResponse, ValidationError
from .validators import DSGASNValidator
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DSG ASN Validator API",
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
    Validate an Advance Ship Notice against DSG compliance rules
    
    This endpoint validates ASN data against business rules from the DSG
    Vendor Routing Guide, including:
    - ASN timing requirements (within 1 hour of shipment close)
    - Carton requirements (one PO per carton, size limits)
    - UCC-128 labeling requirements (GS1 compliant SSCC (Serial Shipping Container Code))
    - TMS routing requirements (shipment ID on BOL)
    - Business rule validation (warehouse codes, PO formats)
    """
    try:
        logger.info(f"Validating ASN for vendor {asn_data.vendor_id}")
        
        # does validation (on valid ASNRequest obj)
        is_valid, errors, warnings, info = validator.validate_asn(asn_data)
        
        compliance_summary = {
            "total_cartons": len(asn_data.cartons),
            "total_items": sum(
                sum(item.quantity for item in carton.items)
                for carton in asn_data.cartons
            ),
            "total_weight": sum(carton.weight for carton in asn_data.cartons),
            "validation_errors": len(errors),
            "validation_warnings": len(warnings),
            "validation_info": len(info)
        }
        
        response = ValidationResponse(
            valid=is_valid,
            errors=errors,
            warnings=warnings,
            info=info,
            timestamp=datetime.now(),
            compliance_summary=compliance_summary
        )
        
        logger.info(f"ASN validation completed. Valid: {is_valid}, Errors: {len(errors)}, Warnings: {len(warnings)}")
        
        return response
        
    except Exception as e:
        logger.error(f"Error during ASN validation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during validation: {str(e)}"
        )

@app.get("/sample-asn")
async def get_sample_asn():
    """Get a realistic sample ASN based on DSG actual requirements"""
    return {
        "message": "Sample ASN template based on DSG requirements",
        "template": {
            "vendor_id": "V12345",
            "ship_date": "2024-12-20",
            "expected_delivery": "2024-12-25",
            "warehouse_code": "PA1",
            "tms_routing": {
                "shipment_id": "TMS12345678",
                "ready_date": "2024-12-20",
                "cartons": 2,
                "cube": 15.5,
                "pallets": 1,
                "weight": 45.2
            },
            "cartons": [
                {
                    "ucc128_label": {
                        "sscc": "000123456789012345",
                        "department_number": "10 - Athletic Apparel",
                        "vendor_name": "Vendor Name, 123 Vendor St, City, ST 12345",
                        "dsg_dc_name": "DSG - PA1, 456 DC St, City, PA 12345",
                        "po_number": "DSG-2024-001234",
                        "sort_letter": "A",
                        "upc": "ITEM001",
                        "dc_store_number": "PA1"
                    },
                    "po_number": "DSG-2024-001234",
                    "items": [
                        {
                            "sku": "ITEM001",
                            "description": "Basketball Jersey",
                            "quantity": 100,
                            "upc": "123456789012"
                        }
                    ],
                    "weight": 25.1,
                    "dimensions": [24, 18, 12]
                }
            ]
        },
        "notes": "This template follows DSG actual requirements: UCC-128 labels, TMS routing, carton specifications"
    }