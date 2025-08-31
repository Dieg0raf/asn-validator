from typing import List, Tuple
from datetime import datetime, timedelta
import re
from .models import ASNRequest, ValidationError

class ASNValidator:
    def __init__(self):
        # Business rules from Dick's Guide
        self.valid_warehouse_codes = {"PA1", "PA2", "CA1", "TX1", "GA1", "OH1", "IL1", "NY1"}
        self.valid_carriers = {"FEDEX", "UPS", "USPS", "DHL", "ESTES", "YRC", "ABF", "SAIA"}
        self.po_number_pattern = r"^DSG-\d{4}-\d{6}$"
        self.tms_shipment_pattern = r"^CS\d{8}$"  # CSxxxxxxxx format
    
    def validate_asn(self, asn: ASNRequest) -> Tuple[bool, List[ValidationError], List[ValidationError]]:
        errors = []
        warnings = []
        
        # Your 3 core validation rules
        errors.extend(self._validate_timing(asn))           # Rule 1: Timing
        errors.extend(self._validate_data_integrity(asn))   # Rule 2: Data Integrity  
        errors.extend(self._validate_cross_document_consistency(asn))  # Rule 3: Cross-Document
        
        is_valid = len(errors) == 0
        return is_valid, errors, warnings
    
    def _validate_timing(self, asn: ASNRequest) -> List[ValidationError]:
        """Rule 1: Timing Validation - $250 chargeback for late ASNs"""
        errors = []
        
        try:
            ship_date = datetime.strptime(asn.ship_date, "%Y-%m-%d")
            expected_delivery = datetime.strptime(asn.expected_delivery, "%Y-%m-%d")
            
            # Ship date cannot be in the past (ASN must be sent within 1 hour)
            if ship_date.date() < datetime.now().date():
                errors.append(ValidationError(
                    field="ship_date",
                    message="Ship date cannot be in the past - ASN must be sent within 1 hour of departure",
                    rule="timing_validation",
                    impact="$250 chargeback per shipment"
                ))
            
            # Expected delivery must be after ship date
            if expected_delivery <= ship_date:
                errors.append(ValidationError(
                    field="expected_delivery", 
                    message="Expected delivery must be after ship date",
                    rule="timing_validation",
                    impact="$250 chargeback per shipment"
                ))
                
        except ValueError:
            errors.append(ValidationError(
                field="dates",
                message="Dates must be in YYYY-MM-DD format",
                rule="timing_validation", 
                impact="$250 chargeback per shipment"
            ))
        
        return errors
    
    def _validate_data_integrity(self, asn: ASNRequest) -> List[ValidationError]:
        """Rule 2: Data Integrity - $7.50 per carton + $250 service fee"""
        errors = []
        
        # Validate PO number format
        if not re.match(self.po_number_pattern, asn.po_number):
            errors.append(ValidationError(
                field="po_number",
                message="PO number must match format: DSG-YYYY-XXXXXX (e.g., DSG-2024-001234)",
                rule="data_integrity",
                impact="$7.50 per carton + $250 service fee"
            ))
        
        # Validate warehouse code
        if asn.warehouse_code not in self.valid_warehouse_codes:
            errors.append(ValidationError(
                field="warehouse_code",
                message=f"Invalid warehouse code. Must be one of: {', '.join(sorted(self.valid_warehouse_codes))}",
                rule="data_integrity",
                impact="$7.50 per carton + $250 service fee"
            ))
        
        # Validate items have positive quantities
        for i, item in enumerate(asn.items):
            if item.quantity <= 0:
                errors.append(ValidationError(
                    field=f"items[{i}].quantity",
                    message="Item quantity must be greater than 0",
                    rule="data_integrity",
                    impact="$7.50 per carton + $250 service fee"
                ))
        
        return errors
    
    def _validate_cross_document_consistency(self, asn: ASNRequest) -> List[ValidationError]:
        """Rule 3: Cross-Document Consistency - $500 per shipment"""
        errors = []
        
        # Validate TMS Shipment ID format (critical for BOL/ASN matching)
        if not re.match(self.tms_shipment_pattern, asn.tms_shipment_id):
            errors.append(ValidationError(
                field="tms_shipment_id",
                message="TMS Shipment ID must match format: CSxxxxxxxx (8 digits)",
                rule="cross_document_consistency",
                impact="$500 flat fee per shipment"
            ))
        
        # Validate carrier
        if asn.carrier.upper() not in self.valid_carriers:
            errors.append(ValidationError(
                field="carrier",
                message=f"Invalid carrier. Must be one of: {', '.join(sorted(self.valid_carriers))}",
                rule="cross_document_consistency",
                impact="$500 flat fee per shipment"
            ))
        
        # Validate tracking number if provided
        if asn.tracking_number and len(asn.tracking_number) < 10:
            errors.append(ValidationError(
                field="tracking_number",
                message="Tracking number must be at least 10 characters long",
                rule="cross_document_consistency",
                impact="$500 flat fee per shipment"
            ))
        
        return errors