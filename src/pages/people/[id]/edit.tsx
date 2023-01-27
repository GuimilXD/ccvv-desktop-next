import PersonFormComponent from "@/components/person_form_component"
import { useRouter } from "next/router"

export default function PersonEdit() {
    const router = useRouter()

    const { id } = router.query

    if (!id) return router.back()

    const person_id = Number.parseInt(id.toString())

    return (
        <section className="section">
            <h1 className="title">Editando Pessoa</h1>
            <PersonFormComponent action="edit" person_id={person_id}/>
        </section>
    )
}
