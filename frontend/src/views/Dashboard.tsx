import { ChangeEvent, useEffect, useRef, useState } from "react";
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

export default function Dashboard() {

    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();
    const data = useData();
    const columns = useMonitorColumns();
    const refreshInputProps = useRefreshInput();

    useEffect(() => {
        if (data.password == null) {
            navigate("/");
            return;
        }

        if (data.dataSources.length == 0) {
            data.login(data.password);
        }
    }, [])

    function handleRefresh() {
        data.update();
    }

    function handleLogout() {
        data.reset();
        navigate("/");

    }

    return (
        <>
            <motion.main
                className="h-screen w-full flex-col"
                {...defaultAnimation}
            >
                <div className="p-10 flex flex-col h-full gap-2">
                    <div className="flex justify-between items-center">
                        <h1 className="font-bold">Smartermail Monitor</h1>
                        <div className="flex justify-end items-center gap-2 h-full">
                            <p className="text-xs text-neutral-500">Refreshing in {data.timer}s</p>

                            <div className="flex h-full items-center">
                                <input className="w-12 rounded-l-md h-full px-1 text-xs outline-none text-center border border-r-0 text-neutral-800" {...refreshInputProps} />
                                <div className="px-2 bg-neutral-50 text-xs h-full rounded-r-md flex items-center text-center text-neutral-600 border">s</div>
                            </div>



                            <button className="bg-blue-500 flex justify-center items-center text-white rounded-md h-8 w-8" onClick={handleRefresh}>
                                <Refresh size={18} />
                            </button>
                            <button className="bg-blue-500 flex justify-center items-center text-white rounded-md h-8 w-8" onClick={handleLogout}>
                                <LockAlt size={15} />
                            </button>
                            <button className="bg-blue-500 flex justify-center items-center text-white rounded-md h-8 w-8" onClick={() => setShowAddModal(true)}>
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>


                    <Table columns={columns} datasource={data.dataSources} />
                </div>
            </motion.main>

            <Modal id="addserver" show={showAddModal} onClose={() => setShowAddModal(false)}>
                <AddServer onComplete={() => setShowAddModal(false)} />
            </Modal>
        </>
    )
}