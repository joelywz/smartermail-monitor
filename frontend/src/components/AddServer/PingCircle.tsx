
export type PingState = "online" | "offline" | "unknown" | "loading"

interface Props {
    state: PingState
}

export default function PingCircle({state}: Props) {

    function getStyle(): string {
        switch (state) {
            case "online":
                return "bg-green-500";
            case "offline":
                return "bg-red-500";
            case "unknown":
                return "bg-neutral-300";
            case "loading":
                return "bg-neutral-300 animate-ping";
        }
    }

    return (
        <div className={`w-2 h-2 rounded-full transition=all duration-200 ${getStyle()}`} />
    )
}