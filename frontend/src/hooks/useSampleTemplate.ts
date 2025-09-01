import { useState } from "react";

export function useSampleTemplate() {
    const [isLoading, setIsLoading] = useState(false);
    async function fetchSampleTemplate() {
        console.log("Fetching sample template...");
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:8000/sample-asn'); // fetch sample data for demo
            console.log("Response state: ", response.status);
            if (response.ok) {
                const data = await response.json();
                return data.template;
            }
        } catch (err) {
            console.error('Failed to fetch sample template:', err);
        } finally {
            setIsLoading(false);
        }
    }

    return { loadSampleTemplate: fetchSampleTemplate, isLoading };
}