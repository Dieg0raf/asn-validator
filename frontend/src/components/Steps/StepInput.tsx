import { ASNInput } from "./ASNInput";

interface StepInputProps {
  asnData: string;
  setAsnData: (data: string) => void;
  handleValidLoadTemplate: () => void;
  handleInvalidLoadTemplate: () => void;
  handleNextFromInput: () => void;
  handleClearForm: () => void;
  isValidLoading: boolean;
  isInvalidLoading: boolean;
  error: string | null;
}

export function StepInput({
  asnData,
  setAsnData,
  handleValidLoadTemplate,
  handleInvalidLoadTemplate,
  handleNextFromInput,
  handleClearForm,
  isValidLoading,
  isInvalidLoading,
  error,
}: StepInputProps) {
  return (
    <div className="bg-blue-50 border border-gray-200 shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Step 1: Paste ASN JSON (must match required format){" "}
      </h2>
      <ASNInput value={asnData} onChange={setAsnData} />
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 rounded font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          disabled={isValidLoading || isInvalidLoading}
          onClick={handleValidLoadTemplate}
        >
          {isValidLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-gray-600"
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
              Loading...
            </span>
          ) : (
            "Load Valid Sample"
          )}
        </button>

        <button
          className="px-4 py-2 rounded font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          disabled={isValidLoading || isInvalidLoading}
          onClick={handleInvalidLoadTemplate}
        >
          {isInvalidLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-gray-600"
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
              Loading...
            </span>
          ) : (
            "Load Invalid Sample"
          )}
        </button>

        <button
          className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
          disabled={isInvalidLoading || isValidLoading}
          onClick={handleNextFromInput}
        >
          Next: Preview
        </button>
        <button
          className="px-4 py-2 rounded font-semibold bg-red-600 text-white hover:bg-red-700 transition"
          onClick={handleClearForm}
          disabled={isInvalidLoading || isValidLoading}
        >
          Clear
        </button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
