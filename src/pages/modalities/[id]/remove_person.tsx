import AskForDeletionComponent from "@/components/ask_for_deletion_component"
import { removePersonFromModality } from "@/helpers"
import { useRouter } from "next/router"

export default function ModalityRemovePerson() {
    const router = useRouter()
    const { id, person_id } = router.query

    return (
        <AskForDeletionComponent prompt="Você tem certeza que deseja remover esta pessoa da modalidade?" return_to={`/modalities/${id}`} deleter={() => {
            if (!id || !person_id) return

            return removePersonFromModality(Number.parseInt(person_id.toString()), Number.parseInt(id.toString()))
        }} />
    )
}
