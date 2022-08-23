import { Close } from "@emotion-icons/evaicons-solid/Close";
import { AnimatePresence, motion } from "framer-motion";
import { defaultAnimation } from "../animations/default";

interface Props {
    show?: boolean;
    children?: React.ReactNode;
    onClose?: () => void;
    id: string;
}


export default function Modal({ show = false, children, onClose, id }: Props) {


    function handleClose() {
        onClose && onClose();
    }

    return (
        <AnimatePresence mode="popLayout">
            {show == true && <motion.div
                key={`curtain-${id}`}
                className="fixed w-screen h-screen bg-black opacity-50 left-0 top-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{
                    ease: "easeInOut",
                    duration: 0.25,
                }}
            ></motion.div>}

            {show == true &&
                <motion.div
                    key={`modal-${id}`}
                    className="fixed w-full h-full flex justify-center items-center z-50 top-0 left-0"
                    {...defaultAnimation}
                >
                    <div className="bg-white p-10 rounded-md relative" style={{ width: 380 }}>
                        <button className="absolute right-0 top-0 p-4 z-50" onClick={handleClose}>
                            <Close size={24} />
                        </button>
                        {children}
                    </div>

                </motion.div>}


        </AnimatePresence>
    )
}