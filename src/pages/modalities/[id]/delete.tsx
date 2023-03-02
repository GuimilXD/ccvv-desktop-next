import DeleteComponent from "@/components/delete_component"
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
        <DeleteComponent return_to="/modalities" name={modality?.name} deleter={() => {
            if (!modality?.id) return

            return deleteModality(modality.id)
        }} />
    )
}
