import { Close } from "@emotion-icons/evaicons-solid/Close";
import { AnimatePresence, motion } from "framer-motion";
import { defaultAnimation } from "../animations/default";
import { useAlert } from "../hooks/useAlert";

export default function AlertManager() {

    const alert = useAlert();

    return (
        <div className="fixed right-0 bottom-0 p-4 z-50 flex gap-2 flex-col" style={{ width: 300 }}>
            <AnimatePresence>
            {[...alert.alerts].map(a => (
                <motion.div layout key={a.id} className="w-full" {...defaultAnimation}>
                    <Alert  title={a.title} description={a.description} onClose={() => alert.removeAlert(a.id)}/>
                </motion.div>
                
            ))}
            </AnimatePresence>
        </div>
    )
}

interface Props {
    title?: string;
    description?: string;
    onClose?: () => void;
}

function Alert({title = "Error", description = "An unexpected error has occured!", onClose}: Props) {
    return (
        <div className="text-xs p-2.5 px-5 rounded-md bg-red-100 shadow-sm text-red-500 font-semibold border-red-200 border relative">
            <button className="absolute z-50 right-0 top-0 text-neutral-900 opacity-40 p-1.5" onClick={onClose}>
                <Close size={15 }/>
            </button>
            <h1 className="font-bold">{title}</h1>
            <p className="font-normal text-red-500">{description}   </p>
        </div>

    )
}