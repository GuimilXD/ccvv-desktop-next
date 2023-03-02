import { ListClassesCriteria, Class } from "@/models"
import Link from "next/link"
import { flexRender, getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from "react"
import { getClasses, classColumnHelper, classDefaultColumns } from "@/helpers"
import { ArrowUturnRightIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'
import TableComponent from '@/components/table_component'
import PaginationComponent from '@/components/pagination_component'
import SelectPageSizeComponent from '@/components/select_page_size_component'
import SearchFilterComponent from '@/components/search_filter_component'

const columns = [
    ...classDefaultColumns,
    classColumnHelper.display({
        header: "Ações",
        cell: (props) => (
            <div>
                <Link href={`/classes/${props.cell.row.getValue("id")}`}>
                    <ArrowUturnRightIcon className="icon" />
                </Link>
                <Link href={`/classes/${props.cell.row.getValue("id")}/edit`}>
                    <PencilSquareIcon className="icon" />
                </Link>
                <Link href={`/classes/${props.cell.row.getValue("id")}/delete`}>
                    <TrashIcon className="icon" />
                </Link>
            </div>
        ),
    }),
]

export default function ClassesIndex() {
    const [classes, setClasses] = useState<Class[]>([])

    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })

    const [nameFilter, setNameFilter] = useState("%")

    const [totalClasses, setTotalClasses] = useState(0)

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data: classes,
        columns,
        getCoreRowModel: getCoreRowModel(),
        pageCount: Math.ceil(totalClasses / pageSize),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
    })

    useEffect(() => {
        const criteria: ListClassesCriteria = {
            page: pageIndex + 1,
            per_page: pageSize,
            filter: {
                name: nameFilter
            }
        }

        getClasses(criteria)
            .then(({ classes, total_count }) => {
                setClasses(classes)
                setTotalClasses(total_count)
            })
            .catch((e: string) => console.error(e))
    }, [pageIndex, pageSize, nameFilter])

    // Reset table page index every time a search is done
    useEffect(() => {
        table.setPageIndex(0)
    }, [nameFilter, table])

    return (
        <section className="section">
            <h1 className="title">Listando Turmas</h1>

            <div className="box">
                <div className="navbar">
                    <div>
                        <div className="field is-grouped is-horizontal">
                            <div className="field-body">
                                <SearchFilterComponent placeholder="Nome" setter={setNameFilter} />
                            </div>
                        </div>
                    </div>

                    <div className="navbar-end">
                        <Link href="/classes/new" className="button is-link">
                            Nova Turma
                        </Link>
                    </div>
                </div>

                <TableComponent table={table} />

                <PaginationComponent table={table} pageIndex={pageIndex} />

                <SelectPageSizeComponent table={table} />
            </div>
        </section>
    )
}
