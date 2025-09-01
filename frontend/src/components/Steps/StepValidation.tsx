import { ValidationResponse } from "../../types";
import { ValidationReport } from "../ValidationReport/ValidationReport";

interface StepValidationProps {
  validationResult: ValidationResponse;
  handleBack: () => void;
}

export function StepValidation({
  validationResult,
  handleBack,
}: StepValidationProps) {
  return (
    <div className="bg-blue-50 border border-gray-200 shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Step 3: Validation Report
      </h2>
      {validationResult && <ValidationReport data={validationResult} />}
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 rounded font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
    </div>
  );
}
