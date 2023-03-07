import AskForConfirmationComponent from "@/components/ask_for_confirmation_component"
import { deleteSubject, getSubjectById } from "@/helpers"
import { Subject } from "@/models"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

export default function SubjectDelete() {
    const [subject, setSubject] = useState<Subject>()

    const router = useRouter()

    const { id: class_id, subject_id } = router.query

    useEffect(() => {
        if (!class_id || !subject_id) return

        getSubjectById(Number.parseInt(subject_id.toString()))
            .then(c => setSubject(c))
            .catch(_error => {
                router.push(`/classes/${class_id}`)
            })
    }, [subject_id, class_id, router])

    return (
        <AskForConfirmationComponent prompt={`Você tem certeza que deseja deletar ${subject?.name}?`} return_to={`/classes/${class_id}`
        } action={() => {
            if (!subject?.id) return

            return deleteSubject(subject.id)
        }} />
    )
}
