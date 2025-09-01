from typing import List, Tuple, Dict
from datetime import datetime, timedelta
import re
from .models import ASNRequest, ValidationError

class DSGASNValidator:
        
    def validate_asn(self, asn: ASNRequest) -> Tuple[bool, List[ValidationError], List[ValidationError], List[ValidationError]]:
        errors = []

        # validation rules checklist
        errors.extend(self._validate_dsg_timing(asn))
        errors.extend(self._validate_dsg_carton_rules(asn))
        errors.extend(self._validate_dsg_labeling(asn))
        errors.extend(self._validate_dsg_tms_routing(asn))
        
        is_valid = len(errors) == 0
        return is_valid, errors
    
    def _validate_dsg_timing(self, asn: ASNRequest) -> List[ValidationError]:
        """DSG timing requirements"""
        errors = []
        
        try:
            # parse dates
            ship_date = datetime.strptime(asn.ship_date, "%Y-%m-%d")
            asn_submission_time = datetime.now()
            time_difference = asn_submission_time - ship_date

            # check ASN is 1 hour after shipment closes
            if time_difference.total_seconds() > 3600:
                errors.append(ValidationError(
                    field="ship_date",
                    message="ASN must be sent within 1 hour after shipment closes",
                    rule="dsg_timing_requirement",
                    impact="ASN rejection + potential chargeback",
                ))
                
        except ValueError:
            errors.append(ValidationError(
                field="dates",
                message="Dates must be in YYYY-MM-DD format",
                rule="date_format",
                impact="ASN rejection",
            ))
        
        return errors
    
    def _validate_dsg_carton_rules(self, asn: ASNRequest) -> List[ValidationError]:
        """DSG carton requirements"""
        errors = []

        # iterate over cartons
        for i, carton in enumerate(asn.cartons):

            # check for multiple PO numbers
            po_numbers = set()
            for item in carton.items:
                if hasattr(item, 'po_number'):
                    po_numbers.add(item.po_number)
                if item.po_number != carton.po_number: # PO numbers must match
                    errors.append(ValidationError(
                        field=f"cartons[{i}].items[{item.sku}].po_number",
                        message="Item PO number must match carton PO number",
                        rule="dsg_one_po_per_carton",
                        impact="Carton rejection + processing delays",
                    ))

            if len(po_numbers) > 1:
                errors.append(ValidationError(
                    field=f"cartons[{i}].po_numbers",
                    message="Cartons must contain merchandise for only one purchase order",
                    rule="dsg_one_po_per_carton",
                    impact="Carton rejection + processing delays",
                ))

            # check carton weight
            if carton.weight < 3:
                errors.append(ValidationError(
                    field=f"cartons[{i}].weight",
                    message="Carton too light. Minimum: 3 lbs",
                    rule="dsg_carton_weight_minimum",
                    impact="Carton rejection + processing delays",
                ))
            if carton.weight > 50:
                errors.append(ValidationError(
                    field=f"cartons[{i}].weight",
                    message="Carton too heavy. Maximum: 50 lbs",
                    rule="dsg_carton_weight_maximum",
                    impact="Carton rejection + processing delays",
                ))

            # check carton size requirements
            length, width, height = carton.dimensions
            if length < 9 or width < 6 or height < 3:
                errors.append(ValidationError(
                    field=f"cartons[{i}].dimensions",
                    message="Carton too small. Minimum: 9x6x3 inches",
                    rule="dsg_carton_size_minimum",
                    impact="Carton rejection + handling delays",
                ))
            
            if length > 48 or width > 30 or height > 30:
                errors.append(ValidationError(
                    field=f"cartons[{i}].dimensions",
                    message="Carton too large. Maximum: 48x30x30 inches",
                    rule="dsg_carton_size_maximum",
                    impact="Carton rejection + handling delays",
                ))
        return errors
    
    def _validate_dsg_labeling(self, asn: ASNRequest) -> List[ValidationError]:
        """DSG UCC-128 labeling requirements"""
        errors = []

        # iterate over cartons
        for i, carton in enumerate(asn.cartons):
            label = carton.ucc128_label
            
            # check SSCC is GS1 compliant
            if not label.sscc.startswith('0'):
                errors.append(ValidationError(
                    field=f"cartons[{i}].ucc128_label.sscc",
                    message="SSCC must start with 0 (GS1 compliant)",
                    rule="dsg_gs1_sscc_requirement",
                    impact="Label rejection + processing delays",
                ))
        
        return errors
    
    def _validate_dsg_tms_routing(self, asn: ASNRequest) -> List[ValidationError]:
        """DSG TMS routing requirements"""
        errors = []
        tms = asn.tms_routing
        
        # check that sizes match
        if tms.cartons != len(asn.cartons):
            errors.append(ValidationError(
                field="tms_routing.cartons",
                message="TMS carton count must match actual carton count",
                rule="dsg_tms_accuracy",
                impact="Routing delays + processing issues",
            ))
        
        return errors