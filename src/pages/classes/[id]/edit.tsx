import ClassFormComponent from "@/components/class_form_component"
import { useRouter } from "next/router"

export default function ClassEdit() {
    const router = useRouter()

    const { id } = router.query

    // TODO: implement better error logic
    if (!id) return <></>

    const class_id = Number.parseInt(id.toString())

    return (
        <section className="section">
            <h1 className="title">Editando Turma</h1>
            <ClassFormComponent action="edit" class_id={class_id} />
        </section>
    )
}
