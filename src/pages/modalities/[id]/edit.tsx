import ModalityFormComponent from "@/components/modality_form_component"
import { useRouter } from "next/router"

export default function ModalityEdit() {
    const router = useRouter()

    const { id } = router.query

    // TODO: implement better error logic
    if (!id) return <></>

    const modality_id = Number.parseInt(id.toString())

    return (
        <section className="section">
            <h1 className="title">Editando Modalidade</h1>
            <ModalityFormComponent action="edit" modality_id={modality_id}/>
        </section>
    )
}
