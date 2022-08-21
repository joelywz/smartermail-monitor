<script type="ts">
    import { data, removeServer, type Source } from "../store/data";
    import { Table, type Column } from "../lib/table";
    import OptionsItem from "./OptionsItem.svelte";
    import SpoolItem from "./SpoolItem.svelte";
    import { onDestroy } from "svelte";
import CheckboxTableItem from "./CheckboxTableItem.svelte";

    let dataSources: Source[] = [];

    const unsubscribe = data.subscribe((d) => {
        dataSources = d.sources;
    });

    onDestroy(() => {
        unsubscribe();
    });

    let columns: Column<Source>[] = [
        {
            index: "host",
            name: "Server Name",
            width: 250,
        },
        {
            index: "smtp",
            name: "SMTP",
            width: 50,
            component: CheckboxTableItem
        },
        {
            index: "pop",
            name: "POP",
            width: 50,
            component: CheckboxTableItem
        },
        {
            index: "imap",
            name: "IMAP",
            width: 50,
            component: CheckboxTableItem
        },
        {
            index: "spoolCount",
            name: "Spool Messages",
            width: 150,
            sorter: (a, b) => {
                if (a == null) {
                    return 1;
                }

                if (b == null) {
                    return -1;
                }

                return b - a;
            },
            component: SpoolItem,
        },
        {
            index: "smtpThreads",
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
            index: "popThreads",
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
            index: "imapThreads",
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
            index: "",
            name: "Options",
            width: 100,
            component: OptionsItem,
            genereateProps: (d) => {
                return {
                    remove: () => {
                        removeServer(d.host);
                    },
                };
            },
        },
    ];
</script>

<div class="overflow-y-hidden p-8 rounded-md bg-white flex flex-grow" style="">
    <Table {columns} {dataSources} />
</div>
