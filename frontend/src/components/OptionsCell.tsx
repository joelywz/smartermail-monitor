import { Delete } from "@emotion-icons/material/Delete";

interface Props {
    onDeleteClick?: () => void;
}


export default function OptionsCell({onDeleteClick} : Props) {

    function handleDelete() {
        onDeleteClick && onDeleteClick();
    }

    return (
        <div className="flex justify-start items-center">
            <button className="text-neutral-600" onClick={handleDelete}>
                <Delete size={16}/>
            </button>
        </div>
    )

}