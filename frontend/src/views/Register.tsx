import { LockAlt } from "@emotion-icons/boxicons-solid/LockAlt"
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HasSavedData } from "../../wailsjs/go/main/App";
import { defaultAnimation } from "../animations/default";
import useData from "../store";

export default function Register() {

    const password = useField();
    const data = useData();
    const navigate = useNavigate()
    const repeatPassword = useField();
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [errMsg, setErrMsg]= useState("");

    useEffect(() => {
        let msg = "";
        if (password.value.length > 32 || repeatPassword.value.length > 32) {
            msg = "Password must not exceed 32 characters";
            setErrMsg(msg)
            return
        }


        if (password.value != "" && repeatPassword.value != "") {
            setAllowSubmit(true);
        } else {
            setAllowSubmit(false);
        }

        setErrMsg(msg)

    }, [password.value, repeatPassword.value])


    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        if (password.value != repeatPassword.value) {
            setErrMsg("Password does not match")
            return;
        }

        try {
            await data.register(password.value)
            navigate("/dashboard", { replace: true })
        } catch (e) {
            console.log(e)
        }

        
    }

    return (
        <motion.div
            className="h-screen flex items-center justify-center"
            {...defaultAnimation}
        >
            <div className="bg-white rounded-lg shadow-sm flex flex-col p-14 px-14 items-center gap-5 justify-between" style={{ width: 400, height: 450 }}>
                <div className="flex flex-col gap-4 items-center">
                    <h1 className="text-lg font-semibold">Smartermail Monitor</h1>
                    <LockAlt className="" size={30} />
                    <p className="text-sm text-neutral-500 text-center">Create a password to store your server information in an encrypted format.</p>

                </div>

                <form className="flex flex-col w-full mt-5 justify-between gap-12" autoComplete="off" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <p className="text-red-500 text-xs mb-1 h-4">{errMsg}</p>
                        <Field className="mb-4" type="password" placeholder="Password" {...password}/>
                        <Field type="password" placeholder="Repeat Password"{...repeatPassword} />
                        
                    </div>

                    <button className="bg-blue-500 py-1.5 rounded-sm text-white font-medium" disabled={!allowSubmit} type="submit">Create</button>
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