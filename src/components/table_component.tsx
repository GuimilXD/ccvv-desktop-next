import { flexRender, Table } from '@tanstack/react-table'

export interface TableComponent<T> {
    table: Table<T>
}

export default function PeopleTableComponent({ table }: TableComponent<any>) {
    return (
        <table className="table is-fullwidth is-striped is-bordered">
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.length < 1 &&
                    <tr>
                        <td colSpan={100}>Nenhum resultado encontrado</td>
                    </tr>
                }
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
