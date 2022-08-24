import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultAnimation } from "../animations/default";
import ChangePassword from "../components/ChangePassword";
import Modal from "../lib/Modal";


export default function Settings() {

    const navigate = useNavigate();
    const [pwdModal, setPwdModal] = useState(false);

    function handleBackClick() {
        navigate(-1);
    }

    function handleShowPwdModal() {
        setPwdModal(true)
    }


    return (
        <motion.main className="m-16"{...defaultAnimation}>
                <button className="text-neutral-500 text-sm font-medium" onClick={handleBackClick}>Back</button>
                <h1 className="font-bold text-2xl mb-5">Settings</h1>

                <div className="flex flex-col items-start gap-2">
                    <button className="text-blue-500 rounded-md text-sm font-medium" onClick={handleShowPwdModal}>Change Password</button>
                    <button className="text-blue-500 rounded-md text-sm font-medium">Reset Data</button>
                </div>

                <Modal id="" show={pwdModal} onClose={() => setPwdModal(false)} >
                    <ChangePassword onComplete={() => setPwdModal(false)}/>
                </Modal>
        </motion.main>
    )
}