interface FinalStatusProps {
  valid: boolean;
  errorCount: number;
}

export function FinalStatus({ valid, errorCount }: FinalStatusProps) {
  return (
    <div
      className={`my-6 p-4 rounded ${
        valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {valid ? (
        <div>🟢 ASN Validation Passed</div>
      ) : (
        <div>
          🔴 ASN Validation Failed ({errorCount} Error
          {errorCount > 1 ? "s" : ""} Found)
        </div>
      )}
    </div>
  );
}
