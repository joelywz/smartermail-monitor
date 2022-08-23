
interface Props {
    width: number;
    paddingX?: number;
    paddingY?: number;
    children?: React.ReactNode;
}

export default function TableBodyCell({ width, paddingX = 5, paddingY = 5, children}: Props) {
    return (
        <td
            style={{ minWidth: width, maxWidth: width, padding: `${paddingY}px ${paddingX}px` }}
            className="text-sm"
        >
            {children}
        </td>
    )
}