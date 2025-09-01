import { ASNPreview } from "./ASNPreview";
import { ASNRequest } from "../../types";

interface StepPreviewProps {
  parsedASN: ASNRequest;
  handleBack: () => void;
  handleValidation: () => void;
  isLoading: boolean;
}

export function StepPreview({
  parsedASN,
  handleBack,
  handleValidation,
  isLoading,
}: StepPreviewProps) {
  return (
    <div className="bg-blue-50 border border-gray-200 shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Step 2: Preview ASN
      </h2>
      <ASNPreview asn={parsedASN} />
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 rounded font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
          onClick={handleValidation}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Validating...
            </span>
          ) : (
            "Validate"
          )}
        </button>
      </div>
    </div>
  );
}
