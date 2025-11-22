import { onValue, ref, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from '../utils/firebaseConfig';

interface ControlState {
    bomba: boolean;
    valvula: boolean;
    ph: boolean;
}

export const useCultivoControl = () => {
    const [controlState, setControlState] = useState<ControlState>({
        bomba: false,
        valvula: false,
        ph: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [retryTrigger, setRetryTrigger] = useState(0);

    useEffect(() => {
        const controlRef = ref(database, 'cultivo/control');

        const unsubscribe = onValue(controlRef, (snapshot) => {
            if (snapshot.exists()) {
                setControlState(snapshot.val() as ControlState);
                setError(null);
            } else {
                setControlState({ bomba: false, valvula: false, ph: false });
            }
            setIsLoading(false);
        }, (dbError) => {
            console.error("Firebase Control Read Error:", dbError);
            setError("Failed to read control state.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [retryTrigger]);

    const toggleBomba = async () => {
        const newState = !controlState.bomba;
        try {
            await set(ref(database, 'cultivo/control/bomba'), newState);
        } catch (e) {
            console.error("Error toggling bomba:", e);
            setError("Failed to toggle bomba.");
        }
    };

    const togglePh = async () => {
        const newState = !controlState.ph;
        try {
            await set(ref(database, 'cultivo/control/ph'), newState);
        } catch (e) {
            console.error("Error toggling ph:", e);
            setError("Failed to toggle ph.");
        }
    }

    const toggleValvula = async () => {
        const newState = !controlState.valvula;
        try {
            await set(ref(database, 'cultivo/control/valvula'), newState);
        } catch (e) {
            console.error("Error toggling valvula:", e);
            setError("Failed to toggle valvula.");
        }
    };

    const refetch = () => {
        setIsLoading(true);
        setError(null);
        setRetryTrigger(prev => prev + 1);
    };

    return {
        controlState,
        isLoading,
        error,
        toggleBomba,
        toggleValvula,
        togglePh,
        refetch,
    };
};
