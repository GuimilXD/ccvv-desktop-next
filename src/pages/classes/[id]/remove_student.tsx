import AskForConfirmationComponent from "@/components/ask_for_confirmation_component"
import { removeStudentFromClass } from "@/helpers"
import { useRouter } from "next/router"

export default function ClassRemoveStudent() {
    const router = useRouter()
    const { id, person_id } = router.query

    return (
        <AskForConfirmationComponent prompt="Você tem certeza que deseja remover este aluno da turma?" return_to={`/classes/${id}`} action={() => {
            if (!id || !person_id) return

            return removeStudentFromClass(Number.parseInt(person_id.toString()), Number.parseInt(id.toString()))
        }} />
    )
}
