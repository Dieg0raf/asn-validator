from typing import List, Tuple, Dict
from datetime import datetime, timedelta
import re
from .models import ASNRequest, ValidationError

class DSGASNValidator:
    """ASN validator based on DSG routing guide requirements"""
    
    def __init__(self):
        self.asn_timing_hours = 1  # 1 hour after shipment closes
        self.max_delivery_days = 30
        
    def validate_asn(self, asn: ASNRequest) -> Tuple[bool, List[ValidationError], List[ValidationError], List[ValidationError]]:
        """Validate ASN against DSG requirements"""
        errors = []
        warnings = []
        
        # validation rules
        errors.extend(self._validate_dsg_timing(asn))
        errors.extend(self._validate_dsg_carton_rules(asn))
        errors.extend(self._validate_dsg_labeling(asn))
        errors.extend(self._validate_dsg_tms_routing(asn))
        
        is_valid = len(errors) == 0
        return is_valid, errors, warnings
    
    def _validate_dsg_timing(self, asn: ASNRequest) -> List[ValidationError]:
        """DSG timing requirements: ASN within 1 hour of shipment close"""
        errors = []
        
        try:
            ship_date = datetime.strptime(asn.ship_date, "%Y-%m-%d")
            current_date = datetime.now().date()
            
            # check ASN is 1 hour after shipment closes
            if ship_date.date() < current_date:
                errors.append(ValidationError(
                    field="ship_date",
                    message="DSG requirement: ASN must be sent within 1 hour after shipment closes",
                    rule="dsg_timing_requirement",
                    impact="ASN rejection + potential chargeback",
                    severity="error"
                ))
                
        except ValueError:
            errors.append(ValidationError(
                field="dates",
                message="Dates must be in YYYY-MM-DD format",
                rule="date_format",
                impact="ASN rejection",
                severity="error"
            ))
        
        return errors
    
    def _validate_dsg_carton_rules(self, asn: ASNRequest) -> List[ValidationError]:
        """DSG carton requirements: one PO per carton, size limits"""
        errors = []
        
        for i, carton in enumerate(asn.cartons):
            # DSG requirement: One PO per carton
            po_numbers = set()
            for item in carton.items:
                if hasattr(item, 'po_number'):
                    po_numbers.add(item.po_number)
            
            if len(po_numbers) > 1:
                errors.append(ValidationError(
                    field=f"cartons[{i}].po_numbers",
                    message="DSG requirement: Cartons must contain merchandise for only one purchase order",
                    rule="dsg_one_po_per_carton",
                    impact="Carton rejection + processing delays",
                    severity="error"
                ))
            
            # DSG carton size requirements
            length, width, height = carton.dimensions
            if length < 9 or width < 6 or height < 3:
                errors.append(ValidationError(
                    field=f"cartons[{i}].dimensions",
                    message="DSG requirement: Carton too small. Minimum: 9x6x3 inches",
                    rule="dsg_carton_size_minimum",
                    impact="Carton rejection + handling delays",
                    severity="error"
                ))
            
            if length > 48 or width > 30 or height > 30:
                errors.append(ValidationError(
                    field=f"cartons[{i}].dimensions",
                    message="DSG requirement: Carton too large. Maximum: 48x30x30 inches",
                    rule="dsg_carton_size_maximum",
                    impact="Carton rejection + handling delays",
                    severity="error"
                ))
        
        return errors
    
    def _validate_dsg_labeling(self, asn: ASNRequest) -> List[ValidationError]:
        """DSG UCC-128 labeling requirements"""
        errors = []
        
        for i, carton in enumerate(asn.cartons):
            label = carton.ucc128_label
            
            # DSG requirement: SSCC must be GS1 compliant (start with 0)
            if not label.sscc.startswith('0'):
                errors.append(ValidationError(
                    field=f"cartons[{i}].ucc128_label.sscc",
                    message="DSG requirement: SSCC must start with 0 (GS1 compliant)",
                    rule="dsg_gs1_sscc_requirement",
                    impact="Label rejection + processing delays",
                    severity="error"
                ))
            
            # DSG requirement: UCC-128 label must contain all required fields
            required_fields = ['department_number', 'vendor_name', 'dsg_dc_name', 
                             'po_number', 'sort_letter', 'upc', 'dc_store_number']
            
            for field in required_fields:
                if not getattr(label, field, None):
                    errors.append(ValidationError(
                        field=f"cartons[{i}].ucc128_label.{field}",
                        message=f"DSG requirement: UCC-128 label must contain {field}",
                        rule="dsg_label_completeness",
                        impact="Label rejection + processing delays",
                        severity="error"
                    ))
        
        return errors
    
    def _validate_dsg_tms_routing(self, asn: ASNRequest) -> List[ValidationError]:
        """DSG TMS routing requirements"""
        errors = []
        
        tms = asn.tms_routing
        
        # DSG requirement: TMS Shipment ID must be on BOL
        if not tms.shipment_id:
            errors.append(ValidationError(
                field="tms_routing.shipment_id",
                message="DSG requirement: TMS Shipment ID must be listed on BOL (first page, CID field)",
                rule="dsg_tms_bol_requirement",
                impact="Shipment rejection + routing delays",
                severity="error"
            ))
        
        # DSG requirement: Accurate metrics required
        if tms.cartons != len(asn.cartons):
            errors.append(ValidationError(
                field="tms_routing.cartons",
                message="DSG requirement: TMS carton count must match actual carton count",
                rule="dsg_tms_accuracy",
                impact="Routing delays + processing issues",
                severity="error"
            ))
        
        return errors