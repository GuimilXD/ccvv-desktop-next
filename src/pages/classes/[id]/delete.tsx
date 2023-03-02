
import DeleteComponent from "@/components/delete_component"
import { deleteClass, getClassById } from "@/helpers"
import { Class } from "@/models"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

export default function ClassDelete() {
    const [classData, setClass] = useState<Class>()

    const router = useRouter()

    const { id } = router.query

    useEffect(() => {
        if (!id) return

        getClassById(Number.parseInt(id.toString()))
            .then(classData => setClass(classData))
            .catch(_error => {
                router.push("/classes")
            })
    }, [id, router])

    return (
        <DeleteComponent return_to="/classes" name={classData?.name} deleter={() => {
            if (!classData?.id)
                return

            return deleteClass(classData.id)
        }} />
    )
}
