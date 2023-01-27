import { deletePerson, getPersonById } from "@/helpers"
import { Person } from "@/models"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

export default function PersonDelete() {
    const [person, setPerson] = useState<Person>()

    const router = useRouter()

    const { id } = router.query

    useEffect(() => {
        if (!id) return

        getPersonById(Number.parseInt(id.toString()))
        .then(person => setPerson(person))
        .catch(_error => {
            router.push("/people")
        })
    }, [id, router])

    return (
        <section className="section">
            <h1 className="title"> Você tem certeza que deseja deletar &quot;{`${person?.first_name} ${person?.last_name}`}&quot;</h1>

            <div className="field is-grouped buttons are-large">
                <button className="button is-danger is-outlined" onClick={() => {
                    if (!person?.id) return

                    //TODO: add flash message
                    deletePerson(person.id)
                        .then(_affected_rows => router.push("/people"))
                        .catch(_error => router.push("people"))
                }}>
                    Sim, desejo deletar
                </button>
                <button className="button is-primary is-outlined" onClick={() => router.back()}>
                    Não, desejo voltar
                </button>
            </div>
        </section>
    )
}
