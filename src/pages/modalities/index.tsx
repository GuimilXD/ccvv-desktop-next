import { ListModalitiesCriteria, Modality } from "@/models"
import Link from "next/link"
import { createColumnHelper, flexRender, getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from "react"
import { getModalities } from "@/helpers"
import { ArrowUturnRightIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'

const columnHelper = createColumnHelper<Modality>()

const columns = [
    columnHelper.accessor('id', {
        header: "ID",
        cell: info => info.getValue()
    }),
    columnHelper.accessor('name', {
        header: "Nome",
        cell: info => info.getValue()
    }),
    columnHelper.accessor('description', {
        header: "Descrição",
        cell: info => info.getValue()
    }),
    columnHelper.display({
        header: "Ações",
        cell: (props) => (
            <div>
                <Link href={`/modalities/${props.cell.row.getValue("id")}`}>
                    <ArrowUturnRightIcon className="icon"/>
                </Link>
                <Link href={`/modalities/${props.cell.row.getValue("id")}/edit`}>
                    <PencilSquareIcon className="icon"/>
                </Link>
                <Link href={`/modalities/${props.cell.row.getValue("id")}/delete`}>
                    <TrashIcon className="icon"/>
                </Link>
            </div>
        ),
    }),
]

export default function ModalitiesIndex() {
    const [modalities, setModalities] = useState<Modality[]>([])

    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })

    const [nameFilter, setNameFilter] = useState("%")

    const [totalModalities, setTotalModalities] = useState(0)

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data: modalities,
        columns,
        getCoreRowModel: getCoreRowModel(),
        pageCount: Math.ceil(totalModalities / pageSize),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
    })

    useEffect(() => {
        const criteria: ListModalitiesCriteria = {
            page: pageIndex + 1,
            per_page: pageSize,
            filter: {
                name: nameFilter
            }
        }

        getModalities(criteria)
            .then(({modalities, total_count}) => {
                setModalities(modalities)
                setTotalModalities(total_count)
            })
            .catch((e: string) => console.error(e))
    }, [pageIndex, pageSize, nameFilter])

    // Reset table page index every time a search is done
    useEffect(() => {
        table.setPageIndex(0)
    }, [nameFilter, table])

    return (
        <>
            <section className="section">
                <h1 className="title">Listando Modalidades</h1>
            </section>

            <div className="box">
                    <div className="navbar">
                        <div>
                            <div className="field is-grouped is-horizontal">
                                <div className="field-body">
                                    <div className="field is-expanded">
                                        <p className="control">
                                            <input className="input" placeholder="Nome" onChange={e => {
                                                setNameFilter(() => `%${e.target.value}%`)
                                            }}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="navbar-end">
                            <Link href="/modalities/new" className="button is-link">
                                Nova Modalidade
                            </Link>
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
                            {modalities.length < 1 &&
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
        </>
    )
}
