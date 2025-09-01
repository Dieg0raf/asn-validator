from pydantic import BaseModel, Field, validator
from typing import List
from datetime import datetime
import re

class UCC128Label(BaseModel):
    sscc: str = Field(..., pattern=r"^\d{18}$", description="18-digit SSCC")
    department_number: str = Field(..., description="Department number")
    vendor_name: str = Field(..., description="Vendor name")
    dsg_dc_name: str = Field(..., description="DSG DC name")
    po_number: str = Field(..., description="PO number")
    sort_letter: str = Field(..., description="Sort letter")
    upc: str = Field(..., description="UPC or 'Mixed'")
    dc_store_number: str = Field(..., description="DC/Store number")
    
    @validator('sscc')
    def validate_sscc(cls, v):
        if not v.startswith('0'):
            raise ValueError('SSCC must start with 0 (GS1 prefix)')
        return v

class Carton(BaseModel):
    ucc128_label: UCC128Label = Field(..., description="UCC-128 label")
    po_number: str = Field(..., description="PO number")
    items: List['Item'] = Field(..., min_items=1, description="Items in carton")
    weight: float = Field(..., gt=0, description="Carton weight")
    dimensions: List[float] = Field(..., min_items=3, max_items=3, description="Length, Width, Height")
    
    @validator('po_number')
    def validate_po_number(cls, v):
        if not re.match(r"^DSG-\d{4}-\d{6}$", v):
            raise ValueError('PO number must match DSG format: DSG-YYYY-XXXXXX')
        return v
    
    @validator('dimensions')
    def validate_carton_size(cls, v):
        length, width, height = v
        if length < 9 or width < 6 or height < 3:
            raise ValueError('Carton too small. Minimum: 9x6x3 inches')
        if length > 48 or width > 30 or height > 30:
            raise ValueError('Carton too large. Maximum: 48x30x30 inches')
        return v
    
    @validator('weight')
    def validate_carton_weight(cls, v):
        if v < 3:
            raise ValueError('Carton too light. Minimum: 3 lbs')
        if v > 50:
            raise ValueError('Carton too heavy. Maximum: 50 lbs')
        return v

class Item(BaseModel):
    sku: str = Field(..., description="SKU")
    description: str = Field(..., description="Item description")
    quantity: int = Field(..., gt=0, description="Quantity")
    upc: str = Field(..., description="UPC")
    
    @validator('upc')
    def validate_upc(cls, v):
        if not re.match(r'^\d{12,13}$', v):
            raise ValueError('UPC must be 12-13 digits')
        return v

class TMSRouting(BaseModel):
    shipment_id: str = Field(..., description="TMS Shipment ID")
    ready_date: str = Field(..., description="Ready date")
    cartons: int = Field(..., gt=0, description="Number of cartons")
    cube: float = Field(..., gt=0, description="Cube measurement")
    pallets: int = Field(..., gt=0, description="Number of pallets")
    weight: float = Field(..., gt=0, description="Total weight")
    
    @validator('shipment_id')
    def validate_shipment_id(cls, v):
        if not re.match(r'^[A-Z0-9]{8,12}$', v):
            raise ValueError('TMS Shipment ID must be 8-12 alphanumeric characters')
        return v

class ASNRequest(BaseModel):
    vendor_id: str = Field(..., description="Vendor ID")
    ship_date: str = Field(..., description="Ship date")
    expected_delivery: str = Field(..., description="Expected delivery")
    warehouse_code: str = Field(..., description="Warehouse code")
    tms_routing: TMSRouting = Field(..., description="TMS routing")
    cartons: List[Carton] = Field(..., min_items=1, description="Cartons")
    
    @validator('vendor_id')
    def validate_vendor_id(cls, v):
        if not re.match(r"^V\d{5}$", v):
            raise ValueError('Vendor ID must match DSG format: VXXXXX')
        return v
    
    @validator('warehouse_code')
    def validate_warehouse(cls, v):
        valid_warehouses = {"PA1", "PA2", "CA1", "TX1", "GA1", "OH1", "IL1", "NY1"}
        if v not in valid_warehouses:
            raise ValueError(f'Invalid warehouse code. Must be one of: {", ".join(sorted(valid_warehouses))}')
        return v

class ValidationError(BaseModel):
    field: str = Field(..., description="Field name")
    message: str = Field(..., description="Error message")
    rule: str = Field(..., description="Validation rule")
    impact: str = Field(..., description="Business impact")
    severity: str = Field(..., description="Error severity")

class ValidationResponse(BaseModel):
    valid: bool = Field(..., description="Validation result")
    errors: List[ValidationError] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.now)
    compliance_summary: dict = Field(default_factory=dict)