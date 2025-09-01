export interface UCC128Label {
    sscc: string;
    department_number: string;
    vendor_name: string;
    dsg_dc_name: string;
    po_number: string;
    sort_letter: string;
    upc: string;
    dc_store_number: string;
}

export interface ASNItem {
    sku: string;
    description: string;
    quantity: number;
    upc: string;
}

export interface Carton {
    ucc128_label: UCC128Label;
    po_number: string;
    items: ASNItem[];
    weight: number;
    dimensions: number[];
}

export interface TMSRouting {
    shipment_id: string;
    ready_date: string;
    cartons: number;
    cube: number;
    pallets: number;
    weight: number;
}

export interface ASNRequest {
    vendor_id: string;
    ship_date: string;
    expected_delivery: string;
    warehouse_code: string;
    tms_routing: TMSRouting;
    cartons: Carton[];
}

export interface ValidationError {
    field: string;
    message: string;
    rule: string;
    impact: string;
    severity: string;
}

export interface ValidationResponse {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    timestamp: string;
    compliance_summary: Record<string, any>;
}