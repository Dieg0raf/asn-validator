import { ASNPreview } from "../ASNPreview";
import { ASNRequest } from "../../types";

interface StepPreviewProps {
  parsedASN: ASNRequest;
  handleBack: () => void;
  handleValidation: () => void;
}

export function StepPreview({
  parsedASN,
  handleBack,
  handleValidation,
}: StepPreviewProps) {
  return (
    <>
      <h2 className="text-xl font-bold mb-2">Step 2: Preview ASN</h2>
      <ASNPreview asn={parsedASN} />
      <div className="flex gap-2 mt-4">
        <button className="btn" onClick={handleBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={handleValidation}>
          Validate
        </button>
      </div>
    </>
  );
}
