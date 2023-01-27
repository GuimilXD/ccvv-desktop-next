import { getPersonById } from "@/helpers";
import { Person } from "@/models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/solid";

export default function PersonIndex() {
    const [person, setPerson] = useState<Person>()
    const router = useRouter()

    const { id } = router.query

    useEffect(() => {
        if (!id) return

        getPersonById(Number.parseInt(id.toString()))
            .then(person => setPerson(person))
            .catch(error => {
                console.log(error)
            })
    }, [id])

    return (
        <div className="card">
            <div className="card-content">
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-96x96">
                            <UserIcon />
                        </figure>
                    </div>
                    <div className="media-content">
                        <p className="title is-4">{`${person?.first_name} ${person?.last_name}`}</p>
                        <p className="subtitle is-6">
                            {person?.email}
                        </p>
                        <p className="subtitle is-6">
                            {person?.phone_number}
                        </p>
                    </div>
                </div>
            </div>

            <div className="card-content">
                {person?.details}
            </div>

            <footer className="card-footer">
                <Link href={`/people/${person?.id}/edit`} className="card-footer-item">
                    Editar
                </Link>
                <Link href={`/people/${person?.id}/delete`} className="card-footer-item">
                    Deletar
                </Link>
            </footer>
        </div>
    )
}
