import AskForConfirmationComponent from "@/components/ask_for_confirmation_component"
import { removeTeacherFromSubject } from "@/helpers"
import { useRouter } from "next/router"

export default function SubjectRemoveTeacher() {
    const router = useRouter()
    const { id, person_id, subject_id } = router.query

    return (
        <AskForConfirmationComponent prompt="Você tem certeza que deseja remover este professor da matéria?" return_to={`/classes/${id}/subjects/${subject_id}`} action={() => {
            if (!subject_id || !person_id) return

            return removeTeacherFromSubject(Number.parseInt(person_id.toString()), Number.parseInt(subject_id.toString()))
        }} />
    )
}
