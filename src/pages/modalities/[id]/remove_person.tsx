import { removePersonFromModality } from "@/helpers"
import { useRouter } from "next/router"

export default function ModalityRemovePerson() {
    const router = useRouter()
    const { id, person_id } = router.query

    return (
        <section className="section">
            <h1 className="title">Você tem certeza que deseja remover esta pessoa da modalidade?</h1>

            <div className="field is-grouped buttons are-large">
                <button className="button is-danger is-outlined" onClick={() => {
                    if (!id || !person_id) return

                    //TODO: add flash message
                    removePersonFromModality(Number.parseInt(person_id.toString()), Number.parseInt(id.toString()))
                        .then(_affected_rows => router.push(`/modalities/${id}`))
                        .catch(_error => router.push(`/modalities/${id}`))
                }}>
                    Sim, desejo remover
                </button>
                <button className="button is-primary is-outlined" onClick={() => router.back()}>
                    Não, desejo voltar
                </button>
            </div>
        </section>
    )
}
