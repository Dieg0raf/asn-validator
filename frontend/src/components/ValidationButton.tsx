interface ValidationButtonProps {
  onValidate: () => void;
  isLoading: boolean;
  hasData: boolean;
}

export function ValidationButton({
  onValidate,
  isLoading,
  hasData,
}: ValidationButtonProps) {
  return (
    <div className="validation-section">
      <button
        onClick={onValidate}
        disabled={isLoading || !hasData}
        className="btn btn-primary"
      >
        {isLoading ? "�� Validating..." : "✅ Validate ASN"}
      </button>
    </div>
  );
}
