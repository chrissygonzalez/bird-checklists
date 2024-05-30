import { useEffect, useState } from "react";

type FetchReturn = {
    data: any;
    isLoading: boolean;
    error: string | null;
}

const myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", `${import.meta.env.VITE_EBIRD_KEY}`);

const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

const useFetch = (url: string): FetchReturn => {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    // error coming back from server
                    // setError('problem');
                    throw Error('could not fetch the data for that resource');
                }
                return response.json();
            })
            .then(data => {
                setIsLoading(false);
                setData(data);
                setError(null);
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.message);
            })
    }, [url])

    return { data, isLoading, error };
}

export default useFetch;