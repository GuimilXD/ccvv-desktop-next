import { subjectDefaultColumns, subjectColumnHelper, getSubjectsInClass } from '@/helpers'
import { ArrowUturnRightIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'
import Link from "next/link"
import TableComponent from '@/components/table_component'
import PaginationComponent from '@/components/pagination_component'
import SelectPageSizeComponent from '@/components/select_page_size_component'
import SearchFilterComponent from '@/components/search_filter_component'
import { useEffect, useMemo, useState } from 'react'
import { getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { ListSubjectsCriteria, Subject } from '@/models'

export interface SubjectsTableComponentCriteria {
    class_id: number
}

export default function SubjectsTableComponent({ class_id }: SubjectsTableComponentCriteria) {
    const columns = [
        ...subjectDefaultColumns,
        subjectColumnHelper.display({
            header: "Ações",
            cell: (props) => (
                <div>
                    <Link href={`/classes/${class_id}/subjects/${props.cell.row.getValue("id")}`}>
                        <ArrowUturnRightIcon className="icon" />
                    </Link>
                    <Link href={`/classes/${class_id}/subjects/${props.cell.row.getValue("id")}/edit`}>
                        <PencilSquareIcon className="icon" />
                    </Link>
                    <Link href={`/classes/${class_id}/subjects/${props.cell.row.getValue("id")}/delete`}>
                        <TrashIcon className="icon" />
                    </Link>
                </div>
            ),
        }),
    ]

    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })

    const [nameFilter, setNameFilter] = useState("%")

    const [totalSubjects, setTotalSubjects] = useState(0)
    const [subjects, setSubjects] = useState<Subject[]>([])

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data: subjects,
        columns,
        getCoreRowModel: getCoreRowModel(),
        pageCount: Math.ceil(totalSubjects / pageSize),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
    })

    useEffect(() => {
        const criteria: ListSubjectsCriteria = {
            page: pageIndex + 1,
            per_page: pageSize,
            filter: {
                name: nameFilter
            }
        }

        getSubjectsInClass(class_id, criteria)
            .then(({ subjects, total_count }) => {
                setSubjects(subjects)
                setTotalSubjects(total_count)
            })
            .catch((e: string) => console.error(e))
    }, [pageIndex, pageSize, nameFilter, class_id])


    // Reset table page index every time a search is done
    useEffect(() => {
        table.setPageIndex(0)
    }, [nameFilter, table])

    return (
        <>
            <div className="navbar">
                <div>
                    <div className="field is-grouped is-horizontal">
                        <div className="field-body">
                            <SearchFilterComponent placeholder="Nome" setter={setNameFilter} />
                        </div>
                    </div>
                </div>

                <div className="navbar-end">
                    <Link href={`/classes/${class_id}/subjects/new`} className="button is-link">
                        Adicionar Matéria
                    </Link>
                </div>
            </div>

            <TableComponent table={table} />

            <PaginationComponent table={table} pageIndex={pageIndex} />

            <SelectPageSizeComponent table={table} />
        </>
    )
}
