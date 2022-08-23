import InputGroup from "../lib/InputGroup";
import { Close } from "@emotion-icons/material-twotone/Close"
import InputField, { useField } from "../lib/InputField";
import { FormEvent, useEffect, useState } from "react";
import useData, { ConflictError } from "../store";
import PingCircle, { PingState } from "./PingCircle";

interface Props {
    onComplete?: () => void;
}


export default function AddServer({ onComplete }: Props) {

    const data = useData();
    const host = useField();
    const username = useField();
    const password = useField();

    const [lockInput, setLockInput] = useState(false);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [pingState, setPingState] = useState<PingState>("unknown");

    async function handleSubmit(ev: FormEvent) {
        ev.preventDefault();
        setLockInput(true);
        let host = cleanHost()
        try {
            await data.addServer(host, username.value, password.value);
            onComplete && onComplete();
        } catch (e) {
            if (e == ConflictError) {
                setErrMsg("Server is already in the list");
            }

            console.log(e)

        }
        setLockInput(false)
    }

    async function handleTestConnection() {
        cleanHost();
        setLockInput(true);
        setPingState("loading");
        const success = await data.ping(host.value, username.value, password.value);
        if (success) {
            setPingState("online");
        } else {
            setPingState("offline");
        }
        setLockInput(false);
    }

    function cleanHost(): string{
        const newVal = host.value.replace(/^"+|\/+$/g, "")
        host.setValue(newVal);
        return newVal;
    }

    useEffect(() => {
        if (host.value == "" || username.value == "" || password.value == "") {
            setAllowSubmit(false);
        } else {
            setAllowSubmit(true);
        }

        setPingState("unknown");

        setErrMsg("");
    }, [host.value, username.value, password.value])

    return (
        <div>
            <button className="absolute right-0 top-0 p-4">
                <Close size={24} />
            </button>
            <h1 className="font-semibold mb-4">Add Server</h1>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <InputGroup>
                    <InputField label="Host" id="host" {...host.props} errMsg={errMsg} />
                    <InputField label="Username" id="username" {...username.props} />
                    <InputField label="Password" id="password" type="password" {...password.props} />
                    <div className="flex items-center gap-2 mb-3">
                        <PingCircle state={pingState} />
                        <button
                            className="text-xs text-blue-500 disabled:text-neutral-400"
                            type="button"
                            disabled={!allowSubmit}
                            onClick={handleTestConnection}
                        >
                            Test Connection
                        </button>
                    </div>
                    <button type="submit" disabled={!allowSubmit}>Add Server</button>
                </InputGroup>

            </form>

        </div>
    )
}


