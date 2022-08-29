import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "@emotion-icons/boxicons-regular/Plus"
import { LockAlt } from "@emotion-icons/boxicons-solid/LockAlt"
import { Refresh } from "@emotion-icons/ionicons-outline/Refresh"
import { useNavigate } from "react-router-dom";
import { useMonitorColumns } from "../hooks/useMonitorColumns";
import { motion } from "framer-motion";
import { defaultAnimation } from "../animations/default";
import useData from "../store";
import Table from "../lib/Table";
import AddServer from "../components/AddServer";
import Modal from "../lib/Modal";
import useRefreshInput from "../hooks/useRefreshInput";
import { Cog } from "@emotion-icons/boxicons-solid/Cog"
import DashboardTopBar from "../components/DashboardTopBar";
import DashboardMain from "../components/DashboardMain";
import { useAlert } from "../hooks/useAlert";

export default function Dashboard() {

    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();
    const password = useData(state => state.password);
    const login = useData(state => state.login);
    const dataSourcesLength = useData(state => state.dataSources.length);
    const alert = useAlert();


    useEffect(() => {
        if (password == null) {
            navigate("/", {replace: true});
            return;
        }

        if (dataSourcesLength == 0) {
            login(password).catch(e => {
                const err = e as Error;
                alert.pushAlert("Error", err.message + "\nTry restarting the application");
            });
        }
    }, [])


    useEffect(() => {
        if (password == null) {
            navigate("/");
            return;
        }
    }, [])

    function handleShowAddModalClick() {
        setShowAddModal(true);
    }

    return (
        <>
            <motion.main
                className="h-screen w-full flex-col"
                {...defaultAnimation}
            >
                <div className="p-10 flex flex-col h-full gap-2">

                    <DashboardTopBar onShowAddModalClick={handleShowAddModalClick}/>

                    <DashboardMain/>

                </div>
            </motion.main>

            <Modal id="addserver" show={showAddModal} onClose={() => setShowAddModal(false)}>
                <AddServer onComplete={() => setShowAddModal(false)} />
            </Modal>
        </>
    )
}