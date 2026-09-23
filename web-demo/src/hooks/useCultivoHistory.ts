import { limitToLast, onValue, query, ref, database } from "@/mock/database";
import { useEffect, useState } from "react";
import { CultivoData } from "@/types/CultivoTypes";

export const useCultivoHistory = () => {
  const [history, setHistory] = useState<CultivoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const historyRef = ref(database, "cultivo/historico");
    const historyQuery = query(historyRef, limitToLast(50));

    const unsubscribe = onValue(
      historyQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, CultivoData>;
          // Convert object to array and reverse to show newest first
          const historyList = Object.keys(data)
            .map((key) => ({
              ...data[key],
              id: key,
            }))
            .reverse();

          setHistory(historyList as CultivoData[]);
          setError(null);
        } else {
          setHistory([]);
        }
        setIsLoading(false);
      },
      (dbError) => {
        console.error("Database History Read Error:", dbError);
        setError("Failed to read history data.");
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return {
    history,
    isLoading,
    error,
  };
};
