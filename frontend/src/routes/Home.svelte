<script type="ts">
    import { onMount } from "svelte";

    import { GetSpoolMessageCount } from "../../wailsjs/go/main/App";
    import AddServer from "../components/addserver/AddServer.svelte";
    import Modal from "../components/modal/Modal.svelte";
    import SpoolItem from "../components/SpoolItem.svelte";
    import type { Column } from "../components/tablev2";
    import { Table } from "../components/tablev2";
    import TopBar from "../components/TopBar.svelte";
    import type { ServerInfo } from "../smartermail";

    let showAddServerModal = false;
    let serverList: ServerInfo[] = [];

    $: {
        serverList;
        update();
    }

    interface DataSource {
        key: string;
        server: string;
        spoolCount: number;
    }

    let columns: Column<DataSource>[] = [
        {
            index: "server",
            name: "Server Name",
            width: 200,
        },
        {
            index: "spoolCount",
            name: "Spool Messages",
            width: 200,
            sorter: (a, b) => {
                if (a == null) {
                    return -1;
                }

                if (b == null) {
                    return 1;
                }

                return a - b;
            },
            component: SpoolItem,
        },
    ];

    let dataSources: DataSource[] = serverList.map((c) => {
        return {
            key: c.host,
            server: c.host,
            spoolCount: null,
        };
    });

    // Functions
    async function handleTestConnection(s: ServerInfo): Promise<boolean> {
        let result = await GetSpoolMessageCount(s.host, s.username, s.password);

        if (result != -1) {
            return true;
        }

        return false;
    }

    function handleAddServer(e: CustomEvent<ServerInfo>) {
        const { host, username, password } = e.detail;

        serverList = [
            ...serverList,
            {
                host,
                username,
                password,
            },
        ];

        dataSources = [
            ...dataSources,
            {
                key: host,
                server: host,
                spoolCount: null,
            },
        ];

        update();

        showAddServerModal = false;
    }

    // core
    async function update() {
        console.log("update");
        async function fetchAndUpdateRow(index: number, info: ServerInfo) {
            let spoolCount = await GetSpoolMessageCount(
                info.host,
                info.username,
                info.password
            );
            if (spoolCount == -1) {
                dataSources[index].spoolCount = null;
            } else {
                dataSources[index].spoolCount = spoolCount;
            }
        }
        serverList.map((info, index) => {
            fetchAndUpdateRow(index, info);
        });
    }
</script>




<TopBar on:refresh={update} on:addserver={() => (showAddServerModal = true)} />
<div class="overflow-y-hidden p-8 rounded-md bg-white flex-grow h-full">
    <Table {columns} {dataSources} />
</div>
<Modal bind:show={showAddServerModal}>
    <AddServer handleTest={handleTestConnection} on:submit={handleAddServer} />
</Modal>

