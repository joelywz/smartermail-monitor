interface Props {
    value: number;
}

function formatNumber(n: number) {
    return n.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
}

export default function DurationCell(props: Props) {
    function getTime() {
        if (!props.value) return "-";

        const seconds = props.value;

        const d = Math.floor(seconds / (3600*24));
        const h = formatNumber(Math.floor(seconds % (3600*24) / 3600));
        const m = formatNumber(Math.floor(seconds % 3600 / 60));
        const s = formatNumber(Math.floor(seconds % 60));
        
        return `${d}:${h}:${m}:${s}`
    }

    return (
        <div>{getTime()}</div>
    )
}