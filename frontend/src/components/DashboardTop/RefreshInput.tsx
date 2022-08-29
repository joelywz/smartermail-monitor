import useRefreshInput from "../../hooks/useRefreshInput";

export default function RefreshInput() {

    const refreshInputProps = useRefreshInput();
    
    return (
        <div className="flex h-full items-center">
            <input className="w-12 rounded-l-md h-full px-1 text-xs outline-none text-center border border-r-0 text-neutral-800" {...refreshInputProps} />
            <div className="px-2 bg-neutral-50 text-xs h-full rounded-r-md flex items-center text-center text-neutral-600 border">s</div>
        </div>
    )
}