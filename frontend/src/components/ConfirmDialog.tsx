import { useEffect, useRef, useState } from "react";
import Modal from "../lib/Modal";

interface Props {
    show?: boolean;
    title?: string;
    info?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export function ConfirmDialog (props: Props) {

    function handleCancel() {

        props.onCancel && props.onCancel();
    }

    function handleConfirm() {

        props.onConfirm && props.onConfirm();
    }
    

    return (
        <Modal id="confirm-modal" show={props.show} onClose={handleCancel}>
            <div className="font-medium mb-2">{!props.title ? "Are you sure?" : props.title}</div>
            <p className="text-sm text-neutral-600 mb-8">{props.info}</p>
            <div className="flex justify-between gap-2">
                <button className="w-1/2 bg-neutral-400 py-1.5 rounded-md text-white font-medium" onClick={handleCancel}>No</button>
                <button className="w-1/2 bg-blue-500 py-1.5 text-white rounded-md font-medium" onClick={handleConfirm}>Yes</button>
            </div>
        </Modal>
    )
}

export function useConfirmDialog(title: string, info: string) {
    const [show, setShow] = useState(false);
    const resolve = useRef<any>(null);

    useEffect(() => {
        return () => {
            resolve.current && resolve.current(false)
        }
    }, [])

    async function showDialog(): Promise<boolean> {
        setShow(true);
        console.log("wait")
        const waitForResponse = new Promise<boolean>(res => {
            resolve.current = res;
        })

        return await waitForResponse;
    }

    function handleConfirm() {
        resolve.current && resolve.current(true);
        setShow(false);
    }

    function handleCancel() {
        resolve.current && resolve.current(false);
        setShow(false);
    }


    
    return {
        showDialog,
        props: {
            show,
            title,
            info,
            onConfirm: handleConfirm,
            onCancel: handleCancel,
        },
    }
}