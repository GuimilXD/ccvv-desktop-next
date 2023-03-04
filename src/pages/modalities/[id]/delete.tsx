import AskForConfirmationComponent from "@/components/ask_for_confirmation_component"
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
        <AskForConfirmationComponent prompt={`Você tem certeza que deseja deletar ${modality?.name}?`} return_to={`/modalities/${id}`
        } action={() => {
            if (!modality?.id) return

            return deleteModality(modality.id)
        }} />
    )
}
