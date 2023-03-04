import AskForDeletionComponent from "@/components/ask_for_deletion_component"
import { deleteClass, getClassById } from "@/helpers"
import { Class } from "@/models"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

export default function ClassDelete() {
    const [class_data, setClass] = useState<Class>()

    const router = useRouter()

    const { id } = router.query

    useEffect(() => {
        if (!id) return

        getClassById(Number.parseInt(id.toString()))
            .then(c => setClass(c))
            .catch(_error => {
                router.push("/classes")
            })
    }, [id, router])

    return (
        <AskForDeletionComponent prompt={`Você tem certeza que deseja deletar ${class_data?.name}?`} return_to={`/classes/${id}`
        } deleter={() => {
            if (!class_data?.id) return

            return deleteClass(class_data.id)
        }} />
    )
}
