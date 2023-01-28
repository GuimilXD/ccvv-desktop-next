import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import { ListPeopleCriteria, Person } from "@/models"
import { addPersonToModality, getPeople, personColumnHelper, personDefaultColumns } from "@/helpers"
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { getCoreRowModel, PaginationState, useReactTable } from "@tanstack/react-table"
import PeopleTableComponent from "@/components/people_table_component"
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

export default function ModalityAddPeople() {
    const [avaliablePeople, setAvaliablePeople] = useState<Person[]>([])
    const [searchFilter, setSearchFilter] = useState("%")

    const router = useRouter()

    const { id: modality_id } = router.query

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
        <section className="section">
            <nav className="panel">
                <p className="panel-heading">
                    Adicionar Pessoas
                </p>
                <div className="panel-block">
                    <div className="field has-addons">
                        <p className="control has-icons-left">
                            <SearchFilterComponent placeholder="Procurar" setter={setSearchFilter} />
                            <MagnifyingGlassIcon className="icon" />
                        </p>
                        <p className="control">
                            <a className="button is-link" onClick={() => {
                                table.getSelectedRowModel().rows.map(async (person) => {
                                    if (!modality_id) return
                                    try {
                                        await addPersonToModality(person.getValue("id"), Number.parseInt(modality_id.toString()))
                                    } catch (err) {
                                        // TODO: Remove people that already participate in modality from list
                                        console.log(err)
                                    }

                                    // TODO: add flash message
                                    router.push(`/modalities/${modality_id.toString()}`)
                                })
                            }}>
                                Adicionar
                            </a>
                        </p>
                    </div>
                </div>

                <div className="panel-block">
                    <PeopleTableComponent table={table} />
                </div>
                <div className="panel-block">
                    <p className="control">
                        <PaginationComponent table={table} pageIndex={pageIndex} />
                        <SelectPageSizeComponent table={table} />
                    </p>
                </div>
            </nav>
        </section>
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
