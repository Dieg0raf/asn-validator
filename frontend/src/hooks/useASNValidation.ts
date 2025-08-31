import { useState } from 'react';
import { ASNRequest, ValidationResponse } from '../types';

export function useASNValidation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    async function validateASN(asnData: string): Promise<ValidationResponse | null> {
        try {
            setIsLoading(true);
            setError(''); // clear previous errors

            const parsedData: ASNRequest = JSON.parse(asnData);
            const response = await fetch('http://localhost:8000/validate-asn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedData),
            });

            console.log(response)

            // check response
            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.json();
                console.log(errorData);
                const errorMessage = errorData.detail || 'Validation failed';
                setError(errorMessage);
                return null;
            }

        } catch (err) {
            // check caught error
            if (err instanceof SyntaxError) {
                const errorMessage = 'Invalid JSON format. Please check your input.';
                setError(errorMessage);
                return null;
            }
            return null;
        } finally {
            setIsLoading(false);
        }
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