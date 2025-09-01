import React, { useState } from "react";
import "./App.css";
import { ValidationResponse } from "./types";
import { Header } from "./components/Header";
import { ControlPanel } from "./components/ControlPanel";
import { ASNInput } from "./components/ASNInput";
import { ValidationButton } from "./components/ValidationButton";
import { ValidationResults } from "./components/ValidationResults";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { useASNValidation } from "./hooks/useASNValidation";
import { useSampleTemplate } from "./hooks/useSampleTemplate";

export default function App() {
  const [asnData, setAsnData] = useState<string>("");
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);

  const { validateASN, isLoading, error, clearError } = useASNValidation();
  const { loadSampleTemplate } = useSampleTemplate();

  async function handleValidation() {
    if (!asnData.trim()) {
      clearError("Please enter ASN data to validate");
      return;
    }

    try {
      const result = await validateASN(asnData);
      if (result) {
        setValidationResult(result);
      }
    } catch (err) {
      console.log("Unexpected error: ", error);
    }
  }

  async function handleLoadTemplate() {
    const data = await loadSampleTemplate();
    if (data) {
      setAsnData(JSON.stringify(data, null, 2));
      setValidationResult(null);
      clearError();
    }
  }

  function handleClearForm() {
    setAsnData("");
    setValidationResult(null);
    clearError();
  }

  return (
    <div className="App">
      <Header />

      <main className="App-main">
        <ControlPanel
          onLoadTemplate={handleLoadTemplate}
          onClearForm={handleClearForm}
          hasData={!!asnData}
        />

        <ASNInput value={asnData} onChange={setAsnData} />

        <ValidationButton
          onValidate={handleValidation}
          isLoading={isLoading}
          hasData={!!asnData.trim()}
        />

        <ErrorDisplay error={error} />

        {validationResult && <ValidationResults result={validationResult} />}
      </main>
    </div>
  );
}
