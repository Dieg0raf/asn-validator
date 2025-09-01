import { ValidationResponse } from "../../types";
import { ValidationReport } from "../ValidationReport/ValidationReport";

interface StepValidationProps {
  validationResult: ValidationResponse | null;
  handleBack: () => void;
}

export function StepValidation({
  validationResult,
  handleBack,
}: StepValidationProps) {
  return (
    <>
      <h2 className="text-xl font-bold mb-2">Step 3: Validation Report</h2>
      {validationResult && <ValidationReport data={validationResult} />}
      {!validationResult && <p>No validation results available.</p>}
      <div className="flex gap-2 mt-4">
        <button className="btn" onClick={handleBack}>
          Back
        </button>
      </div>
    </>
  );
}
