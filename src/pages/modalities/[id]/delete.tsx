import { deleteModality, getModalityById } from "@/helpers"
import { Modality } from "@/models"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

export default function ModalityDelete() {
    const [modality, setModality] = useState<Modality>()

    const router = useRouter()

    const { id } = router.query

    useEffect(() => {
        if (!id) return

        getModalityById(Number.parseInt(id.toString()))
        .then(modality => setModality(modality))
        .catch(_error => {
            router.push("/modalities")
        })
    }, [id, router])

    return (
        <section className="section">
            <h1 className="title"> Você tem certeza que deseja deletar &quot;{modality?.name}&quot;</h1>

            <div className="field is-grouped buttons are-large">
                <button className="button is-danger is-outlined" onClick={() => {
                    if (!modality?.id) return

                    //TODO: add flash message
                    deleteModality(modality.id)
                        .then(_affected_rows => router.push("/modalities"))
                        .catch(_error => router.push("modalities"))
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
