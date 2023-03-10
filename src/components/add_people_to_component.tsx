import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import { ListPeopleCriteria, Person } from "@/models"
import { getPeople, personColumnHelper, personDefaultColumns } from "@/helpers"
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { getCoreRowModel, PaginationState, useReactTable } from "@tanstack/react-table"
import TableComponent from "@/components/table_component"
import PaginationComponent from '@/components/pagination_component'
import SelectPageSizeComponent from '@/components/select_page_size_component'
import SearchFilterComponent from '@/components/search_filter_component'
const columns = [
    personColumnHelper.display({
        id: 'select',
        header: ({ table }) => (
            <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
            />
        ),
        cell: ({ row }) => (
            <div>
                <IndeterminateCheckbox
                    {...{
                        checked: row.getIsSelected(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                />
            </div>
        ),
    }),
    ...personDefaultColumns,
]

export interface AddPeopleToComponentProps {
    addPersonTo: Function,
    return_to: string
}

export default function AddPeopleToComponent({ addPersonTo, return_to }: AddPeopleToComponentProps) {
    const [avaliablePeople, setAvaliablePeople] = useState<Person[]>([])
    const [searchFilter, setSearchFilter] = useState("%")

    const router = useRouter()

    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })

    const [totalPeople, setTotalPeople] = useState(0)

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data: avaliablePeople,
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
                first_name: searchFilter,
            }
        }

        getPeople(criteria)
            .then(({ people, total_count }) => {
                setAvaliablePeople(people)
                setTotalPeople(total_count)
            })
            .catch((e: string) => console.error(e))
    }, [pageIndex, pageSize, searchFilter])

    // Reset table page index every time a search is done
    useEffect(() => {
        table.setPageIndex(0)
    }, [searchFilter, table])

    return (
        <>
            <div className="panel-block">
                <div className="field has-addons">
                    <p className="control has-icons-left">
                        <SearchFilterComponent placeholder="Procurar" setter={setSearchFilter} />
                        <MagnifyingGlassIcon className="icon" />
                    </p>
                    <p className="control">
                        <a className="button is-link" onClick={() => {
                            table.getSelectedRowModel().rows.map(async (person) => {
                                try {
                                    await addPersonTo(person.getValue("id"))
                                } catch (err) {
                                    // TODO: Remove people that already participate in item
                                    console.log(err)
                                }

                                // TODO: add flash message
                                router.push(return_to)
                            })
                        }}>
                            Adicionar
                        </a>
                    </p>
                </div>
            </div>

            <div className="panel-block">
                <TableComponent table={table} />
            </div>
            <div className="panel-block">
                <p className="control">
                    <PaginationComponent table={table} pageIndex={pageIndex} />
                    <SelectPageSizeComponent table={table} />
                </p>
            </div>
        </>
    )
}

function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
}: { indeterminate?: boolean } & any) {
    const ref = useRef<HTMLInputElement>(null!)

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    )
}
