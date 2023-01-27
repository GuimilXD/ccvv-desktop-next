import { getPeople } from '@/helpers'
import { ListPeopleCriteria, Person } from '@/models'
import { createColumnHelper, flexRender, getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'


const columnHelper = createColumnHelper<Person>()

const columns = [
    columnHelper.accessor('id', {
        header: "ID",
        cell: info => info.getValue()
    }),
    columnHelper.accessor('first_name', {
        header: "Primeiro Nome",
        cell: info => info.getValue()
    }),
    columnHelper.accessor('last_name', {
        header: "Último Nome",
        cell: info => info.getValue()
    }),
    columnHelper.accessor('email', {
        header: "Email",
        cell: info => info.getValue()
    }),
    columnHelper.accessor('phone_number', {
        header: "Número de Celular",
        cell: info => info.getValue()
    }),
    columnHelper.accessor('details', {
        header: "Detalhes",
        cell: info => info.getValue()
    }),
]

export default function PeopleIndex() {
    const [people, setPeople] = useState<Person[]>([])
    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })

    const [firstNameFilter, setFirstNameFilter] = useState("%")
    const [lastNameFilter, setLastNameFilter] = useState("%")

    const [totalPeople, setTotalPeople] = useState(0)

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data: people,
        columns,
        getCoreRowModel: getCoreRowModel(),
        pageCount: Math.ceil(totalPeople / pageSize),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
    })

    useEffect(() => {
        const criteria: ListPeopleCriteria = {
            page: pageIndex + 1,
            per_page: pageSize,
            filter: {
                first_name: firstNameFilter,
                last_name: lastNameFilter
            }
        }

        getPeople(criteria)
            .then(({people, total_count}) => {
                setPeople(people)
                setTotalPeople(total_count)
            })
            .catch((e: string) => console.error(e))
    }, [pageIndex, pageSize, firstNameFilter, lastNameFilter])

    // Reset table page index every time a search is done
    useEffect(() => {
        table.setPageIndex(0)
    }, [firstNameFilter, lastNameFilter])

    return (
        <>
            <main>
                <section className="section">
                    <h1 className="title">Listando Pessoas</h1>
                </section>

                <div className="box">
                    <div className="navbar">
                        <div>
                            <div className="field is-grouped is-horizontal">
                                <div className="field-body">
                                    <div className="field is-expanded">
                                        <p className="control">
                                            <input className="input" placeholder="Primeiro Nome" onChange={e => {
                                                setFirstNameFilter(() => `%${e.target.value}%`)
                                            }}/>
                                        </p>
                                    </div>
                                    <div className="field is-expanded">
                                        <p className="control">
                                            <input className="input" placeholder="Último Nome" onChange={e => {
                                                setLastNameFilter(() => `%${e.target.value}%`)
                                            }}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="navbar-end">
                            <button className="button is-link">
                                Nova Pessoa
                            </button>
                        </div>
                    </div>

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
                            {people.length < 1 &&
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

                    <nav className="pagination" role="navigation" aria-label="pagination">
                        <a
                            onClick={() => table.previousPage()}
                            className="pagination-previous">
                            Anterior
                        </a>
                        <a
                            onClick={() => table.nextPage()}
                            className="pagination-next">
                            Próxima
                        </a>
                        <ul className="pagination-list">
                            {Array.from({length: table.getPageCount()}, (_, i) => i + 1).map((page: number) =>
                                <li key={page}>
                                    <a
                                        className={`pagination-link ${page == pageIndex + 1 ? "is-current" : ""}`}
                                        onClick={() => table.setPageIndex(page - 1)}
                                        aria-current="page">
                                        {page}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </nav>

                    <select
                        className="select is-small"
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[5, 10, 15, 20, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Mostrar {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </main>
        </>
    )
}
