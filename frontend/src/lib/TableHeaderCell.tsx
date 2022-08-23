import { ArrowDownward } from "@emotion-icons/evaicons-solid/ArrowDownward"
import { BreadSlice } from "@emotion-icons/fa-solid";


interface Props {
    width: number;
    value: any;
    paddingX?: number;
    paddingY?: number;
    sortable?: boolean;
    sortState?: SortState;
    onSort?: (sortState: SortState) => void
}

export type SortState = "ascend" | "descend" | "default"

// Down arrow = ascend
// Up arrow = descend


export default function TableHeaderCell({ width, value, paddingX = 5, paddingY = 5, sortable = false, sortState = "default", onSort = () => { } }: Props) {

    function handleSortClick() {
        switch (sortState) {
            case "default":
                onSort("ascend");
                break;
            case "ascend":
                onSort("descend");
                break;
            case "descend":
                onSort("default");
                break;
        }
    }

    return (
        <th
            style={{ minWidth: width, padding: `${paddingY}px ${paddingX}px`, maxWidth: width }}
            className={`text-xs text-neutral-500 font-semibold`}
        >
            <div className="flex justify-between items-center">
                {value}
                {sortable && (
                    <button className={`${sortState != "default" ? "text-blue-500" : null} ${sortState == "descend" ? "rotate-180" : null} transition-all duration-200`} onClick={handleSortClick}>
                        <ArrowDownward size={16} />
                    </button>
                )}

            </div>

        </th>
    )

}