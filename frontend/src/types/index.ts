export interface ASNItem {
    item_number: string;
    quantity: number;
    unit_cost?: number;
    description?: string;
}

export interface ASNRequest {
    vendor_id: string;
    po_number: string;
    ship_date: string;
    expected_delivery: string;
    warehouse_code: string;
    carrier: string;
    tracking_number?: string;
    tms_shipment_id: string;
    items: ASNItem[];
    special_instructions?: string;
}

export interface ValidationError {
    field: string;
    message: string;
    rule: string;
    impact: string;
}

export interface ValidationResponse {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    timestamp: string;
}