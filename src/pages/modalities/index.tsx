import { ListModalitiesCriteria, Modality } from "@/models"
import Link from "next/link"
import { flexRender, getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from "react"
import { getModalities, modalityColumnHelper, modalityDefaultColumns } from "@/helpers"
import { ArrowUturnRightIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'
import TableComponent from '@/components/table_component'
import PaginationComponent from '@/components/pagination_component'
import SelectPageSizeComponent from '@/components/select_page_size_component'
import SearchFilterComponent from '@/components/search_filter_component'

const columns = [
    ...modalityDefaultColumns,
    modalityColumnHelper.display({
        header: "Ações",
        cell: (props) => (
            <div>
                <Link href={`/modalities/${props.cell.row.getValue("id")}`}>
                    <ArrowUturnRightIcon className="icon" />
                </Link>
                <Link href={`/modalities/${props.cell.row.getValue("id")}/edit`}>
                    <PencilSquareIcon className="icon" />
                </Link>
                <Link href={`/modalities/${props.cell.row.getValue("id")}/delete`}>
                    <TrashIcon className="icon" />
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
            .then(({ modalities, total_count }) => {
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
                                <SearchFilterComponent placeholder="Nome" setter={setNameFilter} />
                            </div>
                        </div>
                    </div>

                    <div className="navbar-end">
                        <Link href="/modalities/new" className="button is-link">
                            Nova Modalidade
                        </Link>
                    </div>
                </div>

                <TableComponent table={table} />

                <PaginationComponent table={table} pageIndex={pageIndex} />

                <SelectPageSizeComponent table={table} />
            </div>
        </>
    )
}
