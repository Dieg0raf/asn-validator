import { useState } from 'react';
import { ASNRequest, ValidationResponse } from '../types';

export function useASNValidation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    async function validateASN(asnData: string): Promise<{ status: number, result: ValidationResponse | null, error: string }> {
        try {
            setIsLoading(true);
            setError('');

            // send request
            const parsedData: ASNRequest = JSON.parse(asnData);
            const response = await fetch('http://localhost:8000/validate-asn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedData),
            });

            // valid response
            if (response.ok) {
                const result: ValidationResponse = await response.json();

                // Check for validation errors
                if (!result.valid && result.errors && result.errors.length > 0) {
                    // Format errors as 'field: message' per line
                    const errorList = result.errors
                        .map((err) => `${err.field}: ${err.message}`)
                        .join("\n");
                    setError(errorList);
                } else {
                    setError('');
                }
                return { status: response.status, result, error: '' };
            }

            // handle validation errors
            const errorData = await response.json();
            const errorMessage = getErrorMessage(response.status, errorData);
            setError(errorMessage);
            return { status: response.status, result: null, error: errorMessage };

        } catch (err) {
            // handle parsing errors
            const errorMessage = getErrorFromException(err);
            setError(errorMessage);
            return { status: 0, result: null, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }

    function getErrorMessage(status: number, errorData: any): string {
        switch (status) {
            case 422: // pydantic input/format errors (returned before processing in backend)
                return extractValidationError(errorData);
            case 500:
                return errorData.detail || 'Server error occurred';
            default:
                return errorData.detail || 'Validation failed';
        }
    }

    function extractValidationError(errorData: any): string {
        const validationErrors = errorData.detail;

        if (!Array.isArray(validationErrors) || validationErrors.length === 0) {
            return 'Data validation failed';
        }

        const firstError = validationErrors[0];
        const fieldPath = firstError.loc.slice(1).join('.'); // remove 'body' from path
        return `${fieldPath}: ${firstError.msg}`;
    }

    function getErrorFromException(err: any): string {
        if (err instanceof SyntaxError) {
            return 'Invalid JSON format. Please check your input.';
        }
        if (err instanceof Error) {
            return err.message;
        }
        return 'An unexpected error occurred';
    }

    function clearError(message?: string) {
        if (message) {
            setError(message);
        } else {
            setError('');
        }
    }

    return { validateASN, isLoading, error, clearError };
}