export function useSampleTemplate() {
    async function fetchSampleTemplate() {
        console.log("Fetching sample template...");
        try {
            const response = await fetch('http://localhost:8000/sample-asn');
            console.log("Response state: ", response.status);
            if (response.ok) {
                const data = await response.json();
                return data.template;
            }
        } catch (err) {
            console.error('Failed to fetch sample template:', err);
        }
    }

    return { loadSampleTemplate: fetchSampleTemplate };
}