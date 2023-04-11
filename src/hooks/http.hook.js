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

    const bodySChema = {
        "dir": "ASC",
        "filter": {
            "cutoff_from": "2023-04-13T00:00:00.000Z",
            "cutoff_to": "2023-04-13T13:00:00Z",
            "delivery_method_id": [],
            "provider_id": [],
            "status": "awaiting_deliver",
            "warehouse_id": []
        },
        "limit": 100,
        "offset": 0,
        "with": {
            "analytics_data": true,
            "barcodes": true,
            "financial_data": true,
            "translit": true
        }
    }

    const formData = JSON.stringify(bodySChema)

    const request = useCallback( async (url, method = 'POST', body = formData , 
    headers = {  
        'Client-Id': '634359' ,
        
     }) => {
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