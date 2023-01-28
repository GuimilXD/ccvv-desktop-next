import { getModalityById, getPeopleInModality } from "@/helpers";
import { Modality, Person } from "@/models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUturnRightIcon, BackspaceIcon, PencilSquareIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import PeopleTableComponent from "@/components/people_table_component";
import { personDefaultColumns, personColumnHelper } from "@/helpers";

export default function ModalityIndex() {
    const [modality, setModality] = useState<Modality>()
    const [peopleInModality, setPeopleInModality] = useState<Person[]>([])
    const router = useRouter()

    const { id } = router.query

    const peopleTableColumns = [
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
                    <Link href={`/modalities/${modality?.id}/remove_person?person_id=${props.cell.row.getValue("id")}`}>
                        <BackspaceIcon className="icon" />
                    </Link>
                </div>
            ),
        }),
    ]

    const peopleInModalityTable = useReactTable({
        data: peopleInModality,
        columns: peopleTableColumns,
        getCoreRowModel: getCoreRowModel(),
    })

    useEffect(() => {
        if (!id) return

        const modality_id = Number.parseInt(id.toString())

        getModalityById(modality_id)
            .then(modality => setModality(modality))
            .catch(error => {
                console.error(error)
            })

        getPeopleInModality(modality_id)
            .then(people => setPeopleInModality(people))
            .catch(error => {
                console.error(error)
            })
    }, [id])

    return (
        <section className="section">
            <div className="card">
                <div className="card-content">
                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-96x96">
                                <UserGroupIcon />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="title is-4">{modality?.name}</p>
                        </div>
                    </div>
                </div>

                <div className="card-content">
                    {modality?.description}
                </div>

                <footer className="card-footer">
                    <Link href={`/modalities/${modality?.id}/edit`} className="card-footer-item">
                        Editar
                    </Link>
                    <Link href={`/modalities/${modality?.id}/delete`} className="card-footer-item">
                        Deletar
                    </Link>
                </footer>
            </div>

            <div className="box">
                <h1 className="title">Pessoas na Modalidade</h1>

                <div className="navbar">
                    <div className="navbar-end">
                        <Link href={`/modalities/${modality?.id}/add_people`} className="button is-link">
                            Adicionar Pessoas
                        </Link>
                    </div>
                </div>

                <PeopleTableComponent table={peopleInModalityTable} />
            </div>
        </section>
    )
}
