import React, { useState } from "react";
import "./App.css";
import { ValidationResponse, ASNRequest } from "./types";
import { Header } from "./components/Header";
import { useASNValidation } from "./hooks/useASNValidation";
// import { sampleTemplates } from "./sampleTemplates";
import {
  validSampleTemplates,
  invalidSampleTemplates,
} from "./sampleTemplates";
import { StepInput } from "./components/Steps/StepInput";
import { StepPreview } from "./components/Steps/StepPreview";
import { StepValidation } from "./components/Steps/StepValidation";

export default function App() {
  const [step, setStep] = useState(1);
  const [inputError, setInputError] = useState<string | null>(null);
  const [asnData, setAsnData] = useState<string>("");
  const [parsedASN, setParsedASN] = useState<ASNRequest | null>(null);
  const [isValidLoading, setValidIsLoading] = useState<boolean>(false);
  const [isInvalidLoading, setInvalidIsLoading] = useState<boolean>(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);

  const {
    validateASN,
    isLoading: isLoadingValidation,
    error,
    clearError,
  } = useASNValidation();

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
    const { status, result, error } = await validateASN(asnData);
    if (status === 422) {
      setInputError(error);
      setStep(4); // go to input error step
    } else if (result) {
      setValidationResult(result);
      setStep(3);
    }
  }

  async function handleValidLoadTemplate() {
    setValidIsLoading(true);
    setTimeout(() => {
      const randomSample =
        validSampleTemplates[
          Math.floor(Math.random() * validSampleTemplates.length)
        ];
      setAsnData(JSON.stringify(randomSample, null, 2));
      setValidIsLoading(false);
    }, 600);
    clearError();
  }

  async function handleInvalidLoadTemplate() {
    setInvalidIsLoading(true);
    setTimeout(() => {
      const randomSample =
        invalidSampleTemplates[
          Math.floor(Math.random() * invalidSampleTemplates.length)
        ];
      setAsnData(JSON.stringify(randomSample, null, 2));
      setInvalidIsLoading(false);
    }, 600);
    clearError();
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
    setValidationResult(null);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg ">
      <Header />
      {step === 1 && (
        <StepInput
          asnData={asnData}
          setAsnData={setAsnData}
          handleValidLoadTemplate={handleValidLoadTemplate}
          handleInvalidLoadTemplate={handleInvalidLoadTemplate}
          handleNextFromInput={handleNextFromInput}
          handleClearForm={handleClearForm}
          isValidLoading={isValidLoading}
          isInvalidLoading={isInvalidLoading}
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

      {step === 4 && inputError && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          <h2 className="text-lg font-bold mb-2">Input/Format Error</h2>
          <p>{inputError}</p>
          <button
            className="mt-4 px-4 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => setStep(1)}
          >
            Back to Edit
          </button>
        </div>
      )}
    </div>
  );
}
