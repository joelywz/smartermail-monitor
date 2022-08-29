import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultAnimation } from "../animations/default";
import ChangePassword from "../components/ChangePassword";
import { ConfirmDialog, useConfirmDialog } from "../components/ConfirmDialog";
import { useAlert } from "../hooks/useAlert";
import Modal from "../lib/Modal";
import useData from "../store";


export default function Settings() {

    const navigate = useNavigate();
    const [pwdModal, setPwdModal] = useState(false);
    const resetDataDialog = useConfirmDialog("Are you sure?", "All server information and preferences will be lost.");
    const resetData = useData(state => state.resetData);
    const alert = useAlert();

    function handleBackClick() {
        navigate("/dashboard", {replace: true});
    }

    function handleShowPwdModal() {
        setPwdModal(true)
    }

    async function handleResetData() {
        if(await resetDataDialog.showDialog()) {
            try {
                await resetData();
                navigate("/", {
                    replace: true,
                })
    
            } catch (e) {
                const err = e as Error;
                alert.pushAlert("Error", err.message);
            }
        }
    }


    return (
        <>
            <motion.main className="m-16"{...defaultAnimation}>
                <button className="text-neutral-500 text-sm font-medium" onClick={handleBackClick}>Back</button>
                <h1 className="font-bold text-2xl mb-5">Settings</h1>

                <div className="flex flex-col items-start gap-2">
                    <button className="text-blue-500 rounded-md text-sm font-medium" onClick={handleShowPwdModal}>Change Password</button>
                    <button className="text-blue-500 rounded-md text-sm font-medium" onClick={handleResetData}>Reset Data</button>
                </div>

                <Modal id="" show={pwdModal} onClose={() => setPwdModal(false)} >
                    <ChangePassword onComplete={() => setPwdModal(false)} />
                </Modal>

            </motion.main>
            <ConfirmDialog {...resetDataDialog.props}/>
        </>
    )
}