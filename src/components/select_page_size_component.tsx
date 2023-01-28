import { Table } from "@tanstack/react-table"

export interface SelectPageSizeComponent<T> {
    options?: number[],
    table: Table<T>
}

export default function SelectPageSizeComponent({ options, table }: SelectPageSizeComponent<any>) {
    if (!options)
        options = [5, 10, 15, 20, 50, 100]

    return (
        <select
            className="select is-small"
            value={table.getState().pagination.pageSize}
            onChange={e => {
                table.setPageSize(Number(e.target.value))
            }}
        >
            {options.map(pageSize => (
                <option key={pageSize} value={pageSize}>
                    Mostrar {pageSize}
                </option>
            ))}
        </select>
    )
}
