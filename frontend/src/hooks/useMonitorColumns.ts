import { useState } from "react";
import DurationCell from "../components/DurationCell";
import OptionsCell from "../components/OptionsCell";
import StatusCell from "../components/StatusCell";
import { CheckCell, Columns } from "../lib/Table";
import useData, { MonitorDataSource } from "../store";

export function useMonitorColumns() {
    const data = useData();
    const [columns] = useState<Columns<MonitorDataSource>>([
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
            target: "uptime",
            key: "header-uptime",
            name: "Uptime",
            width: 100,
            component: DurationCell,
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

    return columns;
}