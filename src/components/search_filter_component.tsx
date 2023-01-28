export interface SearchFilterComponentProps {
    placeholder: string,
    setter: Function,
    className?: string
}

export default function SearchFilterComponent({ setter, placeholder, className }: SearchFilterComponentProps) {
    if (!className)
        className = "field is-expanded"

    return (
        <div className={className}>
            <p className="control">
                <input className="input" placeholder={placeholder} onChange={e => {
                    setter(() => `%${e.target.value}%`)
                }} />
            </p>
        </div>
    )
}
