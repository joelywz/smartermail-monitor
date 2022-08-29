import { Plus } from "@emotion-icons/boxicons-regular/Plus"
import { LockAlt } from "@emotion-icons/boxicons-solid/LockAlt"
import { Refresh } from "@emotion-icons/ionicons-outline/Refresh"
import { Cog } from "@emotion-icons/boxicons-solid/Cog"
import useRefreshInput from "../hooks/useRefreshInput";
import useData from "../store";
import { useNavigate } from "react-router-dom";
import RefreshInput from "./dashboardtop/RefreshInput";
import RefreshTimer from "./dashboardtop/RefreshTimer";

interface Props {
    onShowAddModalClick: () => void;
}

export default function DashboardTopBar(props: Props) {

    const navigate = useNavigate();
    const update = useData(state => state.update);
    const reset = useData(state => state.reset);

    function handleRefresh() {
        update();
    }

    function handleLogout() {
        reset()
        navigate("/", { replace: true });
    }

    function handleSettingsClick() {
        navigate("/settings", { replace: true});
    }

    function handleShowAddModelClick() {
        props.onShowAddModalClick && props.onShowAddModalClick();
    }

    return (
        <div className="flex justify-between items-center">
            <h1 className="font-bold">Smartermail Monitor</h1>
            <div className="flex justify-end items-center gap-2 h-full">

                <RefreshTimer/>
                <RefreshInput/>

                <button className="bg-blue-500 flex justify-center items-center text-white rounded-md h-8 w-8" onClick={handleRefresh}>
                    <Refresh size={18} />
                </button>


                <button className="bg-blue-500 flex justify-center items-center text-white rounded-md h-8 w-8" onClick={handleSettingsClick}>
                    <Cog size={18} />
                </button>
                <button className="bg-blue-500 flex justify-center items-center text-white rounded-md h-8 w-8" onClick={handleLogout}>
                    <LockAlt size={15} />
                </button>
                <button className="bg-blue-500 flex justify-center items-center text-white rounded-md h-8 w-8" onClick={handleShowAddModelClick}>
                    <Plus size={20} />
                </button>
            </div>
        </div>
    )
}