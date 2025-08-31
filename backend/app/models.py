from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ASNItem(BaseModel):
    item_number: str
    quantity: int
    unit_cost: Optional[float] = None
    description: Optional[str] = None

class ASNRequest(BaseModel):
    vendor_id: str
    po_number: str
    ship_date: str
    expected_delivery: str
    warehouse_code: str
    carrier: str
    tracking_number: Optional[str] = None
    tms_shipment_id: str  # for cross-document 
    items: List[ASNItem]
    special_instructions: Optional[str] = None

class ValidationError(BaseModel):
    field: str
    message: str
    rule: str
    impact: str  # business impact

class ValidationResponse(BaseModel):
    valid: bool
    errors: List[ValidationError]
    warnings: List[ValidationError]
    timestamp: datetime