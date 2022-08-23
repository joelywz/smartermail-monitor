import { ErrorCircle } from "@emotion-icons/boxicons-regular/ErrorCircle"
import { useState } from "react";

interface Props {
    label: string;
    id: string;
    value?: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    errMsg?: string;
    disabled?: boolean;
}


export default function InputField({ label, id, type, placeholder, onChange, errMsg, disabled, value}: Props) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 items-center">
                <label htmlFor={id} className="text-sm text-neutral-600">{label}</label>
                {errMsg && errMsg != "" && <p className="text-xs flex items-center text-red-500 gap-0.5"><span><ErrorCircle size={12} /></span>{errMsg}</p>}
            </div>

            <input id={id} type={type} placeholder={placeholder} disabled={disabled} className="bg-neutral-100 rounded px-2 py-1.5 text-sm outline-none" onChange={onChange} value={value}/>
        </div>
    )
}

export function useField(initial: string = "") {
    const [value, setValue] = useState(initial);

    function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setValue(ev.target.value);
    }

    return {
        onChange,
        setValue,
        value,
        props: {
            onChange,
            value,
        }
    }
}