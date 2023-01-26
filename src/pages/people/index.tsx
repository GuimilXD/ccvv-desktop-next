import { getPeople } from '@/helpers'
import { ListPeopleCriteria, Person } from '@/models'
import { useEffect, useState } from 'react'

import { Column, CompactTable } from '@table-library/react-table-library/compact';
import { TableNode } from '@table-library/react-table-library';

export default function PeopleIndex() {
    const [people, setPeople] = useState<Person[]>([])
    const [firstNameFilter, setFirstNameFilter] = useState("%")
    const [lastNameFilter, setLastNameFilter] = useState("%")

    const columns: Column[]  = [
        {
            label: "ID",
            renderCell: (person: TableNode) => person.id
        },
        {
            label: "Primeiro Nome",
            renderCell: (person: TableNode) => person.first_name
        },
        {
            label: "Último Nome",
            renderCell: (person: TableNode) => person.last_name
        },
        {
            label: "Email",
            renderCell: (person: TableNode) => person.email
        },
        {
            label: "Número de Celular",
            renderCell: (person: TableNode) => person.phone_number
        },
        {
            label: "Detalhes",
            renderCell: (person: TableNode) => person.details
        },
    ]

    useEffect(() => {
        const criteria: ListPeopleCriteria = {
            page: 1,
            per_page: 10,
            filter: {
                first_name: firstNameFilter,
                last_name: lastNameFilter
            }
        }

        getPeople(criteria)
            .then((people: Person[]) => {
                setPeople(people)
            })
            .catch((e: string) => console.error(e))
    }, [people, firstNameFilter])

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
                                            <input className="input" placeholder="Primeiro Nome" onChangeCapture={e => {
                                                setFirstNameFilter(() => `%${e.target.value}%`)
                                            }}/>
                                        </p>
                                    </div>
                                    <div className="field is-expanded">
                                        <p className="control">
                                            <input className="input" placeholder="Último Nome" onChangeCapture={e => {
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

                    <CompactTable className="table" columns={columns} data={{ nodes: people }} />
                </div>
            </main>
        </>
    )
}
