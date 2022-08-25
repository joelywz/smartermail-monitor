import { nanoid } from "nanoid";
import create from "zustand"

interface AlertStore {
    alerts: Alert[];
    pushAlert: (title?: string, description?: string) => void;
    removeAlert: (id: string) => void;
}

interface Alert {
    id: string;
    title?: string;
    description?: string;
    timeoutId?: number;
}


export const useAlert = create<AlertStore>((set, get) => {

    function pushAlert(title?: string, description?: string) {
        const id = nanoid(5);

        set(prev => ({
            ...prev,
            alerts: [...prev.alerts, {
                id,
                title,
                description,
                }
            ],
        }));

        setTimeout(() => {
            get().removeAlert(id)
        }, 5000);
    }

    function removeAlert(id: string) {
        let $ = get();

        const target = $.alerts.find(f => f.id == id);
        
        if (!target) return;

        target.timeoutId && clearTimeout(target.timeoutId);
        

        set(prev => ({
            ...prev,
            alerts: prev.alerts.filter(a => a.id != id),
        }));
    }

    return {
        alerts: [],
        pushAlert,
        removeAlert,

    }
})