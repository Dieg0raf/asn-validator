import { ValidationError } from "../../types";

interface ValidationSectionProps {
  title: string;
  errors: ValidationError[];
}

export function ValidationSection({ title, errors }: ValidationSectionProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {errors.length === 0 ? (
        <div className="text-green-600 flex items-center">
          ✅ All checks passed
        </div>
      ) : (
        <ul className="list-disc pl-5 text-red-600">
          {errors.map((err, idx) => (
            <li key={idx} className="mb-2">
              <div>
                <strong>{err.field}:</strong> {err.message}
              </div>
              <div className="text-sm text-red-400 ml-2">
                <strong>Impact:</strong> {err.impact}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
