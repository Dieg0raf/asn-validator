import React from "react";

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return <div className="error-message">❌ {error}</div>;
}
