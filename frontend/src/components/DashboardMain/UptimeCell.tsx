import { useEffect, useRef, useState } from "react";

interface Props {
    value: number | null;
}

function formatNumber(n: number) {
    return n.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
}

export default function DurationCell(props: Props) {

    const [offset, setOffset] = useState(0);
    const intervalId = useRef<null | NodeJS.Timer>(null);

    useEffect(() => {
        setOffset(0);
        if (props.value) {
            intervalId.current = setInterval(() => {
                setOffset(prev => prev + 1);
            }, 1000)
        }

        return () => {
            intervalId.current && clearInterval(intervalId.current);
        }
    }, [props.value])



    function getTime() {
        if (!props.value) return "-";

        const seconds = props.value + offset;

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