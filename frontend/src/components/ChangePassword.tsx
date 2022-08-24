import { FormEvent, useMemo } from "react";
import useRepeatPassword from "../hooks/useRepeatPassword";
import InputField from "../lib/InputField";
import InputGroup from "../lib/InputGroup";
import useData from "../store";

interface Props {
    onComplete?: () => void;
}


export default function ChangePassword(props: Props) {

    const { errMsg, passwordProps, repeatPasswordProps, check, password, repeatPassword } = useRepeatPassword();
    const isFilled = useMemo(() => password != "" && repeatPassword != "", [password, repeatPassword])
    const data = useData();

    async function handleSubmit(ev: FormEvent) {
        ev.preventDefault();
        if (!check()) return;
        await data.changePassword(password);
        props.onComplete && props.onComplete();
    }

    return (
        <div>
            <h1 className="font-semibold">Change Password</h1>
            <form className="mt-10 flex flex-col gap-12">
                <InputGroup>
                    <InputField label="Password" id="password" type="password" {...passwordProps} errMsg={errMsg} />
                    <InputField label="Repeat Password" id="password" type="password" {...repeatPasswordProps} />
                </InputGroup>
                <button type="submit" onClick={handleSubmit} disabled={!isFilled}>Change</button>
            </form>
        </div>
    )
}