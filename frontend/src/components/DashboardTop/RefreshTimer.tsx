import useData from "../../store";

export default function RefreshTimer () {
    const timer = useData(state => state.timer);
    return (
        <p className="text-xs text-neutral-500">Refreshing in {timer}s</p>
    )
}