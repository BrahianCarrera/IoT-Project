import { limitToLast, onValue, query, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { CultivoData } from '../types/CultivoTypes';
import { database } from '../utils/firebaseConfig';

export const useCultivoHistory = () => {
    const [history, setHistory] = useState<CultivoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const historyRef = ref(database, 'cultivo/historico');
        // Query the last 50 items. 
        // Note: Firebase lists are often ordered by key (timestamp-based push IDs) by default if no orderBy is specified,
        // but explicitly ordering by key or a timestamp child is safer.
        // Assuming push IDs are used, orderByKey() works well for chronological order.
        const historyQuery = query(historyRef, limitToLast(50));

        const unsubscribe = onValue(historyQuery, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Convert object to array and reverse to show newest first
                const historyList = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key // Optional: keep the ID if needed for keys in lists
                })).reverse();

                setHistory(historyList as CultivoData[]);
                setError(null);
            } else {
                setHistory([]);
            }
            setIsLoading(false);
        }, (dbError) => {
            console.error("Firebase History Read Error:", dbError);
            setError("Failed to read history data.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return {
        history,
        isLoading,
        error,
    };
};
