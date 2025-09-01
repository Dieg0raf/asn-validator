import { ASNInput } from "../ASNInput";

interface StepInputProps {
  asnData: string;
  setAsnData: (data: string) => void;
  handleLoadTemplate: () => void;
  handleNextFromInput: () => void;
  error: string | null;
}

export function StepInput({
  asnData,
  setAsnData,
  handleLoadTemplate,
  handleNextFromInput,
  error,
}: StepInputProps) {
  return (
    <>
      <h2 className="text-xl font-bold mb-2">
        Step 1: Paste or Upload ASN JSON
      </h2>
      <ASNInput value={asnData} onChange={setAsnData} />
      <div className="flex gap-2 mt-4">
        <button className="btn" onClick={handleLoadTemplate}>
          Load Sample
        </button>
        <button className="btn btn-primary" onClick={handleNextFromInput}>
          Next: Preview
        </button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </>
  );
}
