interface Props {
    children?: React.ReactNode;
}

export default function InputGroup({children}: Props) {
    return (
        <div className="flex flex-col gap-4">
            {children}
        </div>
    )
}