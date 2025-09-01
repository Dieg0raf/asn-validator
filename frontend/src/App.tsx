import React, { useState } from "react";
import "./App.css";
import { ValidationResponse, ASNRequest } from "./types";
import { Header } from "./components/Header";
import { useASNValidation } from "./hooks/useASNValidation";
import { useSampleTemplate } from "./hooks/useSampleTemplate";
import { StepInput } from "./components/Steps/StepInput";
import { StepPreview } from "./components/Steps/StepPreview";
import { StepValidation } from "./components/Steps/StepValidation";

export default function App() {
  const [step, setStep] = useState(1);
  const [asnData, setAsnData] = useState<string>("");
  const [parsedASN, setParsedASN] = useState<ASNRequest | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);

  const {
    validateASN,
    isLoading: isLoadingValidation,
    error,
    clearError,
  } = useASNValidation();
  const { loadSampleTemplate, isLoading: isLoadingTemplate } =
    useSampleTemplate();

  function handleNextFromInput() {
    try {
      const parsed = JSON.parse(asnData);
      setParsedASN(parsed);
      setStep(2);
      clearError();
    } catch {
      clearError("Invalid JSON format. Please check your input.");
    }
  }

  async function handleValidation() {
    if (!asnData.trim()) {
      clearError("Please enter ASN data to validate");
      return;
    }

    try {
      const validationResult = await validateASN(asnData);
      if (validationResult) {
        setValidationResult(validationResult);
        setStep(3);
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

  function handleBack() {
    setStep((prev) => Math.max(1, prev - 1));
    clearError();
  }

  function handleClearForm() {
    setAsnData("");
    setValidationResult(null);
    setParsedASN(null);
    clearError();
  }

  function handleBackToEdit() {
    setStep(1);
    setValidationResult(null); // optional: clear previous results
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg ">
      <Header />
      {step === 1 && (
        <StepInput
          asnData={asnData}
          setAsnData={setAsnData}
          handleLoadTemplate={handleLoadTemplate}
          handleNextFromInput={handleNextFromInput}
          handleClearForm={handleClearForm}
          isLoading={isLoadingTemplate}
          error={error}
        />
      )}

      {step === 2 && parsedASN && (
        <StepPreview
          parsedASN={parsedASN}
          handleBack={handleBack}
          handleValidation={handleValidation}
          isLoading={isLoadingValidation}
        />
      )}

      {step === 3 && validationResult && (
        <StepValidation
          validationResult={validationResult}
          handleBack={handleBack}
          handleBackToEdit={handleBackToEdit}
        />
      )}
    </div>
  );
}
