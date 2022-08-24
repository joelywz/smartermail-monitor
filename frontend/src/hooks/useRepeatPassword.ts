import { ChangeEvent, useEffect, useState } from "react";

export default function useRepeatPassword() {
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errMsg, setErrMsg] = useState("")

    useEffect(() => {
        setErrMsg("");
    }, [password, repeatPassword])

    function handlePasswordChange(ev: ChangeEvent<HTMLInputElement>) {
        setPassword(ev.target.value);
    }

    function handleRepeatPasswordChange(ev: ChangeEvent<HTMLInputElement>) {
        setRepeatPassword(ev.target.value);
    }
    
    function check() {
        if (password.length > 32 || repeatPassword.length > 32) {
            setErrMsg("Too long");
            return false;
        }

        if (password != repeatPassword) {
            setErrMsg("Password does not match")
            return false;
        }

        setErrMsg("")
        return true;
    }
        

    return {
        password,
        repeatPassword,
        errMsg,
        check,
        passwordProps: {
            onChange: handlePasswordChange,
            value: password,
        },
        repeatPasswordProps: {
            onChange: handleRepeatPasswordChange,
            value: repeatPassword
        },
    }

}