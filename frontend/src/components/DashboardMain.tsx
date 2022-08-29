import { useMonitorColumns } from "../hooks/useMonitorColumns";
import Table from "../lib/Table";
import useData from "../store";

export default function DashboardMain() {

    const columns = useMonitorColumns();
    const dataSources = useData(state => state.dataSources);

    return (
        <Table columns={columns} datasource={dataSources} />
    )
}