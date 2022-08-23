import { LockAlt } from "@emotion-icons/boxicons-solid/LockAlt"
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultAnimation } from "../animations/default";
import useData, { AccessError } from "../store";
import { SpinnerIos } from "@emotion-icons/fluentui-system-filled/SpinnerIos"

export default function Login() {

    const password = useField();
    const data = useData();
    const navigate = useNavigate();
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg]= useState("");

    useEffect(() => {
        if (password.value != "") {
            setAllowSubmit(true)
        } else {
            setAllowSubmit(false)
        }
        setErrMsg("")

    }, [password.value])

    useEffect(() => {
        async function exec() {
            try {
                if (!await data.hasRegistered()) {
                    navigate("/register");
                }
            } catch (e) {
                navigate("/register");
            }

        }
        exec();

    }, [])


    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        setLoading(true)

        setTimeout(async () => {
            try {
                await data.login(password.value)
                navigate("/dashboard")
            } catch (e) {
                if (e == AccessError) {
                    setErrMsg("Invalid password")
                } else {
                    setErrMsg("Data is corrupted or invalid")
                }
            }
            setLoading(false)
        }, 1000)
        
    }

    async function handleReset() {
        try {
            await data.resetData();
            navigate("/register");
        } catch (e) {
            console.log(e);
            setErrMsg("Failed to reset data.");
        }

    }

    return (
        <motion.div 
            className="h-screen flex items-center justify-center"
            {...defaultAnimation}
        >
            <div className="bg-white rounded-lg shadow-sm flex flex-col p-14 px-14 items-center justify-between" style={{ width: 400, height: 450 }}>
                <div className="flex flex-col gap-7 items-center">
                    <h1 className="text-lg font-semibold">Smartermail Monitor</h1>
                    <LockAlt className="" size={30} />
                    <p className="text-sm text-neutral-500 text-center">Enter your password to unlock your data.</p>

                </div>

                <form className="flex flex-col w-full justify-between gap-12" autoComplete="off" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <p className="text-red-500 text-xs mb-1 h-4">{errMsg}</p>
                        <Field className="mb-4" type="password" placeholder="Password" {...password} disabled={loading}/>
                        <a className="text-blue-500 text-xs cursor-pointer" onClick={handleReset}>Reset Data</a>
                        
                    </div>

                    <button className="bg-blue-500 py-1.5 rounded-sm text-white font-medium flex gap-2 justify-center items-center" disabled={!allowSubmit || loading} type="submit">
                        {loading && <SpinnerIos className="animate-spin" size={15}/>}
                        <motion.p layout >Unlock</motion.p>
                    </button>
                </form>

            </div>
        </motion.div>

    )
}

interface Props {
    value: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    className?: string;
    disabled?: boolean
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

function Field(props: Props) {
    return (
        <input 
            className={`bg-neutral-100 px-2.5 py-1.5 w-full rounded-sm shadow-sm text-sm outline-none ${props.className}`} 
            placeholder={props.placeholder}
            type={props.type}
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
        />
    )
}

function useField() {
    const [value, setValue] = useState("");

    function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setValue(ev.target.value);
    }

    return {
        onChange,
        setValue,
        value,
    }
}