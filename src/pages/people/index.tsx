import { getPeople, personColumnHelper, personDefaultColumns } from '@/helpers'
import { ListPeopleCriteria, Person } from '@/models'
import { getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUturnRightIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'
import PeopleTableComponent from '@/components/people_table_component'
import PaginationComponent from '@/components/pagination_component'
import SelectPageSizeComponent from '@/components/select_page_size_component'
import SearchFilterComponent from '@/components/search_filter_component'


const columns = [
    ...personDefaultColumns,
    personColumnHelper.display({
        header: "Ações",
        cell: (props) => (
            <div>
                <Link href={`/people/${props.cell.row.getValue("id")}`}>
                    <ArrowUturnRightIcon className="icon" />
                </Link>
                <Link href={`/people/${props.cell.row.getValue("id")}/edit`}>
                    <PencilSquareIcon className="icon" />
                </Link>
                <Link href={`/people/${props.cell.row.getValue("id")}/delete`}>
                    <TrashIcon className="icon" />
                </Link>
            </div>
        ),
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
            .then(({ people, total_count }) => {
                setPeople(people)
                setTotalPeople(total_count)
            })
            .catch((e: string) => console.error(e))
    }, [pageIndex, pageSize, firstNameFilter, lastNameFilter])

    // Reset table page index every time a search is done
    useEffect(() => {
        table.setPageIndex(0)
    }, [firstNameFilter, lastNameFilter, table])

    return (
        <>
            <main>
                <section className="section">
                    <h1 className="title">Listando Pessoas</h1>
                </section>

                <div className="box">
                    <div className="navbar">
                        <div className="field is-grouped is-horizontal">
                            <div className="field-body">
                                <SearchFilterComponent placeholder='Primeiro Nome' setter={setFirstNameFilter} />
                                <SearchFilterComponent placeholder='Último Nome' setter={setLastNameFilter} />
                            </div>
                        </div>

                        <div className="navbar-end">
                            <Link href="/people/new" className="button is-link">
                                Nova Pessoa
                            </Link>
                        </div>
                    </div>

                    <PeopleTableComponent table={table} />

                    <PaginationComponent table={table} pageIndex={pageIndex} />

                    <SelectPageSizeComponent table={table} />
                </div>
            </main>
        </>
    )
}
