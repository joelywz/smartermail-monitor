import { ChangeEvent, useEffect, useRef, useState } from "react";
import useData from "../store";

export default function useRefreshInput() {

    const data = useData();
    const refreshFocusTimeout = useRef<number | null>(null)
    const [refreshTime, setRefreshTime] = useState(100);

    useEffect(() => {
        setRefreshTime(data.refreshTime);
    }, [])


    function handleChange(ev: ChangeEvent<HTMLInputElement>) {

        if (refreshFocusTimeout.current != null) {
            clearTimeout(refreshFocusTimeout.current);
        }

        if (ev.target.value == "") {
            setRefreshTime(0);
        }

        const newVal = parseInt(ev.target.value)

        if (isNaN(newVal)) {
            return;
        }

        setRefreshTime(newVal);

        refreshFocusTimeout.current = setTimeout(() => {
            ev.target.blur();
        }, 2000);
    }

    function handleBlur() {
        set();
    }


    function set(value?: number) {
        if (refreshFocusTimeout.current != null) {
            clearTimeout(refreshFocusTimeout.current)
            refreshFocusTimeout.current = null;
        }

        let targetTime = refreshTime;

        if (value != null) {
            targetTime = value;
        }

        if (targetTime < 10) {
            targetTime = 10;
        }

        data.setRefreshTime(targetTime);
        setRefreshTime(targetTime);
    }

    return {
        onChange: handleChange,
        onBlur: handleBlur,
        value: refreshTime,
    }
    
}