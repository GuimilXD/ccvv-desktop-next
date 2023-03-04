import AskForDeletionComponent from "@/components/ask_for_deletion_component"
import { removeStudentFromClass } from "@/helpers"
import { useRouter } from "next/router"

export default function ClassRemoveStudent() {
    const router = useRouter()
    const { id, student_id } = router.query

    return (
        <AskForDeletionComponent prompt="Você tem certeza que deseja remover este da turma?" return_to={`/classes/${id}`} deleter={() => {
            if (!id || !student_id) return

            return removeStudentFromClass(Number.parseInt(student_id.toString()), Number.parseInt(id.toString()))
        }} />
    )
}
