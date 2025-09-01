import { ValidationResponse } from "../../types";
import { ValidationReport } from "../ValidationReport/ValidationReport";

interface StepValidationProps {
  validationResult: ValidationResponse;
  handleBack: () => void;
  handleBackToEdit: () => void;
}

export function StepValidation({
  validationResult,
  handleBack,
  handleBackToEdit,
}: StepValidationProps) {
  return (
    <div className="bg-blue-50 border border-gray-200 shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Step 3: Validation Report
      </h2>
      {validationResult && <ValidationReport data={validationResult} />}
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 rounded mx-auto font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
          onClick={handleBackToEdit}
        >
          {validationResult?.valid ? "Validate a new ASN" : "Back to Edit"}
        </button>
      </div>
    </div>
  );
}
