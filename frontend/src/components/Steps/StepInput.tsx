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
    <>
      <h2 className="text-xl font-bold mb-2">
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
          className="px-4 py-2 rounded font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition"
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
    </>
  );
}
