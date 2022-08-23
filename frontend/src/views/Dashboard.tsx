import Table, { CheckCell, Columns } from "../lib/Table";
import useData, { MonitorDataSource } from "../store";
import { Plus } from "@emotion-icons/boxicons-regular/Plus"
import { LockAlt } from "@emotion-icons/boxicons-solid/LockAlt"
import { Refresh } from "@emotion-icons/ionicons-outline/Refresh"
import AddServer from "../components/AddServer";
import Modal from "../lib/Modal";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import OptionsCell from "../components/OptionsCell";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { defaultAnimation } from "../animations/default";
import StatusCell from "../components/StatusCell";

export default function Dashboard() {

    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();
    const data = useData();
    const [refreshTime, setRefreshTime] = useState(100);
    const refreshFocusTimeout = useRef<number | null>(null)
    const [columns, setColumns] = useState<Columns<MonitorDataSource>>([
        {
            target: "host",
            key: "header-host",
            name: "Server Name",
            width: 250,
        },
        {
            target: "online",
            key: "header-status",
            name: "",
            width: 30,
            component: StatusCell
        },
        {
            target: "smtp",
            key: "header-smtp",
            name: "SMTP",
            width: 50,
            component: CheckCell
        },
        {
            target: "pop",
            key: "header-pop",
            name: "POP",
            width: 50,
            component: CheckCell
        },
        {
            target: "imap",
            key: "header-imap",
            name: "IMAP",
            width: 50,
            component: CheckCell
        },
        {
            target: "spoolCount",
            key: "header-spoolCount",
            name: "Spool Messages",
            width: 150,
            sorter: (a, b) => {
                if (a == null) {
                    return -1;
                }

                if (b == null) {
                    return 1;
                }

                return b - a;
            },
        },
        {
            target: "smtpThreads",
            key: "header-smtpThreads",
            name: "SMTP Threads",
            width: 115,
            sorter: (a, b) => {
                if (a == null) {
                    return 1;
                }

                if (b == null) {
                    return -1;
                }

                return b - a;
            },
        },
        {
            target: "popThreads",
            key: "header-popThreads",
            name: "POP Threads",
            width: 115,
            sorter: (a, b) => {
                if (a == null) {
                    return 1;
                }

                if (b == null) {
                    return -1;
                }

                return b - a;
            },
        },
        {
            target: "imapThreads",
            key: "header-imapThreads",
            name: "IMAP Threads",
            width: 115,
            sorter: (a, b) => {
                if (a == null) {
                    return 1;
                }

                if (b == null) {
                    return -1;
                }

                return b - a;
            },
        },

        {
            target: null,
            key: "header-options",
            name: "Options",
            width: 100,
            generateProps: (s) => {
                return {
                    onDeleteClick: () => {
                        data.removeServer(s.host);
                    }
                }
            },
            component: OptionsCell
        },
    ])

    useEffect(() => {

        if (data.password == null) {
            navigate("/");
            return;
        }

        const id = setInterval(() => {
            data.tick();
        }, 1000);

        setRefreshTime(data.refreshTime);

        return () => {
            clearInterval(id);
        }

    }, [])

    function handleRefresh() {
        data.update();
    }

    function handleLogout() {
        data.reset();
        navigate("/");

    }

    function handleRefreshChange(ev: ChangeEvent<HTMLInputElement>) {

        if (refreshFocusTimeout.current != null) {
            clearTimeout(refreshFocusTimeout.current);
        }

        if (ev.target.value == "") {
            setRefreshTime(0);
        }



        const newVal = parseInt(ev.target.value)

        if (isNaN(newVal)) {
            return;
        }

        setRefreshTime(newVal);

        refreshFocusTimeout.current = setTimeout(() => {
            // handleRefreshSet(newVal);
            ev.target.blur();
        }, 2000);



    }

    function handleRefreshSet(value?: number) {
        console.log("set")
        if (refreshFocusTimeout.current != null) {
            clearTimeout(refreshFocusTimeout.current)
            refreshFocusTimeout.current = null;
        }

        let targetTime = refreshTime;

        if (value != null) {
            targetTime = value;
        }

        if (targetTime < 10) {
            targetTime = 10;
        }

        data.setRefreshTime(targetTime);

        setRefreshTime(targetTime);

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
                                <input className="w-12 rounded-l-md h-full px-1 text-xs outline-none text-center border border-r-0 text-neutral-800" onChange={handleRefreshChange} onBlur={() => handleRefreshSet()} value={refreshTime} />
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


                    <div className="p-6 bg-white rounded-md flex-grow">
                        <Table columns={columns} datasource={data.dataSources} />
                    </div>
                </div>
            </motion.main>

            <Modal id="addserver" show={showAddModal} onClose={() => setShowAddModal(false)}>
                <AddServer onComplete={() => setShowAddModal(false)} />
            </Modal>
        </>
    )
}