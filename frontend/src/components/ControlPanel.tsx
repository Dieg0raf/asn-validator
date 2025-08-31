import React from "react";

interface ControlPanelProps {
  onLoadTemplate: () => void;
  onClearForm: () => void;
  hasData: boolean;
}

export function ControlPanel({
  onLoadTemplate,
  onClearForm,
  hasData,
}: ControlPanelProps) {
  return (
    <div className="controls">
      <button
        onClick={onLoadTemplate}
        className="btn btn-secondary"
        disabled={hasData}
      >
        📋 Load Sample Template
      </button>
      <button onClick={onClearForm} className="btn btn-secondary">
        🗑️ Clear Form
      </button>
    </div>
  );
}
