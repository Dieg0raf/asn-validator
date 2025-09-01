import { ValidationResponse } from "../../types";
import { ReportHeader } from "./ReportHeader";
import { ValidationSection } from "./ValidationSection";
import { FinalStatus } from "./FinalStatus";

interface ValidationReportProps {
  data: ValidationResponse;
}

export function ValidationReport({ data }: ValidationReportProps) {
  console.log(data);
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <ReportHeader summary={data.compliance_summary} />

      <FinalStatus valid={data.valid} errorCount={data.errors.length} />

      <ValidationSection title="All Validation Errors" errors={data.errors} />
    </div>
  );
}
