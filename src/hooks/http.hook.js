import { useState, useCallback } from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const bodySChema = {
    //     "dir": "ASC",
    //     "filter": {
    //         "since": "2023-04-01T00:00:00.000Z",
    //         "status": "awaiting_deliver",
    //         "to": "2023-04-11T10:00:00Z"
    //     },
    //     "limit": 100,
    //     "offset": 0,
    //     "translit": true,
    //     "with": {
    //         "analytics_data": true,
    //         "financial_data": true
    //     }
    // }



    const request = useCallback( async (url, method = 'POST', body = null , 
    headers = {'Content-Type': 'application/json'}) => {
        setLoading(true);
        try{
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();
            
            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e
        }

    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {loading, request, error, clearError}

}