import React, { useState } from "react";
import "./App.css";
import { ASNRequest, ValidationResponse } from "./types";

function App() {
  const [asnData, setAsnData] = useState<string>("");
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const validateASN = async () => {
    if (!asnData.trim()) {
      setError("Please enter ASN data to validate");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const parsedData: ASNRequest = JSON.parse(asnData);

      const response = await fetch("http://localhost:8000/validate-asn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      if (response.ok) {
        const result: ValidationResponse = await response.json();
        setValidationResult(result);
      } else {
        const errorData = await response.json();
        setError(`Validation failed: ${errorData.detail || "Unknown error"}`);
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format. Please check your input.");
      } else {
        setError(
          `Error: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleTemplate = async () => {
    try {
      const response = await fetch("http://localhost:8000/sample-asn");
      if (response.ok) {
        const data = await response.json();
        setAsnData(JSON.stringify(data.template, null, 2));
        setValidationResult(null);
        setError("");
      }
    } catch (err) {
      console.error("Failed to fetch sample template:", err);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🚚 ASN Validator</h1>
        <p>Dick's Sporting Goods Compliance Rules</p>
      </header>

      <main>
        <div>
          <button onClick={loadSampleTemplate}>📋 Load Sample Template</button>
          <button onClick={() => setAsnData("")}>🗑️ Clear</button>
        </div>

        <div>
          <label>ASN Data (JSON):</label>
          <textarea
            value={asnData}
            onChange={(e) => setAsnData(e.target.value)}
            placeholder="Paste your ASN JSON data here..."
            rows={15}
          />
        </div>

        <button onClick={validateASN} disabled={isLoading}>
          {isLoading ? "�� Validating..." : "✅ Validate ASN"}
        </button>

        {error && <div style={{ color: "red" }}>❌ {error}</div>}

        {validationResult && (
          <div>
            <h2>
              {validationResult.valid
                ? "✅ ASN is Valid!"
                : "❌ ASN has Validation Errors"}
            </h2>

            {validationResult.errors.length > 0 && (
              <div>
                <h3>❌ Errors ({validationResult.errors.length})</h3>
                {validationResult.errors.map((error, index) => (
                  <div
                    key={index}
                    style={{
                      margin: "10px 0",
                      padding: "10px",
                      border: "1px solid red",
                    }}
                  >
                    <strong>{error.field}:</strong> {error.message}
                    <br />
                    <small>Impact: {error.impact}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
