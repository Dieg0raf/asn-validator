import { ValidationResponse } from "../types";

interface ValidationResultsProps {
  result: ValidationResponse;
}

export function ValidationResults({ result }: ValidationResultsProps) {
    console.log(result);
  return (
    <div className="result-section">
      <ResultHeader isValid={result.valid} />

      {result.errors.length > 0 && <ErrorsSection errors={result.errors} />}

      {result.warnings.length > 0 && (
        <WarningsSection warnings={result.warnings} />
      )}

      <Timestamp timestamp={result.timestamp} />
    </div>
  );
}

function ResultHeader({ isValid }: { isValid: boolean }) {
  return (
    <div className={`result-header ${isValid ? "valid" : "invalid"}`}>
      {isValid ? (
        <>
          <span className="result-icon">✅</span>
          <h2>ASN is Valid!</h2>
        </>
      ) : (
        <>
          <span className="result-icon">❌</span>
          <h2>ASN has Validation Errors</h2>
        </>
      )}
    </div>
  );
}

function ErrorsSection({ errors }: { errors: any[] }) {
  return (
    <div className="errors-section">
      <div className="section-header">
        <h3>❌ Validation Errors ({errors.length})</h3>
        <CopyErrorsButton errors={errors} />
      </div>
      <div className="error-list">
        {errors.map((error, index) => (
          <ErrorItem key={index} error={error} />
        ))}
      </div>
    </div>
  );
}

function ErrorItem({ error }: { error: any }) {
  return (
    <div className="error-item">
      <div className="error-content">
        <strong>{error.field}:</strong> {error.message}
      </div>
      <div className="error-details">
        <span className="rule-tag">{error.rule}</span>
        <span className="impact-tag">Impact: {error.impact}</span>
      </div>
    </div>
  );
}

function WarningsSection({ warnings }: { warnings: any[] }) {
  return (
    <div className="warnings-section">
      <h3>⚠️ Warnings ({warnings.length})</h3>
      <div className="warning-list">
        {warnings.map((warning, index) => (
          <WarningItem key={index} warning={warning} />
        ))}
      </div>
    </div>
  );
}

function WarningItem({ warning }: { warning: any }) {
  return (
    <div className="warning-item">
      <div className="warning-content">
        <strong>{warning.field}:</strong> {warning.message}
      </div>
      <span className="rule-tag">{warning.rule}</span>
    </div>
  );
}

function Timestamp({ timestamp }: { timestamp: string }) {
  return (
    <div className="timestamp">
      <small>Validated at: {new Date(timestamp).toLocaleString()}</small>
    </div>
  );
}

// TODO: Fix this function
function CopyErrorsButton({ errors }: { errors: any[] }) {
  function handleCopyErrors() {
    const errorText = errors
      .map((err) => `${err.field}: ${err.message}`)
      .join("\n");
    navigator.clipboard.writeText(errorText);
  }

  return (
    <button
      onClick={handleCopyErrors}
      className="btn btn-small"
      disabled={errors.length === 0}
    >
      �� Copy Errors
    </button>
  );
}
