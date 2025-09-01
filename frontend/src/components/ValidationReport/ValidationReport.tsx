import { ValidationResponse } from "../../types";
import { ReportHeader } from "./ReportHeader";
import { ValidationSection } from "./ValidationSection";
import { FinalStatus } from "./FinalStatus";

interface ValidationReportProps {
  data: ValidationResponse;
}

export function ValidationReport({ data }: ValidationReportProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <ReportHeader summary={data.compliance_summary} />
      <ValidationSection
        title="Shipment Timing"
        errors={data.errors.filter((e) => e.field.includes("ship_date"))}
      />
      <ValidationSection
        title="Carton / SSCC Labels"
        errors={data.errors.filter((e) => e.field.includes("ucc128_label"))}
      />

      <FinalStatus valid={data.valid} errorCount={data.errors.length} />
    </div>
  );
}
