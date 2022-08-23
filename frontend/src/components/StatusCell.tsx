import PingCircle, { PingState } from "./PingCircle";

interface Props {
    value: boolean
}

export default function StatusCell({value}: Props) {

    function getState(): PingState {
        if (value) {
            return "online";
        } else {
            return "offline";
        }
    }

    return (
        <div>
            <PingCircle state={getState()}/>
        </div>
    )
}