import { ASNInput } from "../ASNInput";

interface StepInputProps {
  asnData: string;
  setAsnData: (data: string) => void;
  handleLoadTemplate: () => void;
  handleNextFromInput: () => void;
  handleClearForm: () => void;
  isLoading: boolean;
  error: string | null;
}

export function StepInput({
  asnData,
  setAsnData,
  handleLoadTemplate,
  handleNextFromInput,
  handleClearForm,
  isLoading,
  error,
}: StepInputProps) {
  return (
    <div className="bg-blue-50 border border-gray-200 shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Step 1: Paste or Upload ASN JSON
      </h2>
      <ASNInput value={asnData} onChange={setAsnData} />
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 rounded font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          disabled={isLoading}
          onClick={handleLoadTemplate}
        >
          Load Sample
        </button>
        <button
          className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
          disabled={isLoading}
          onClick={handleNextFromInput}
        >
          Next: Preview
        </button>
        <button
          className="px-4 py-2 rounded font-semibold bg-red-600 text-white hover:bg-red-700 transition"
          onClick={handleClearForm}
        >
          Clear
        </button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
