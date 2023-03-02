import DeleteComponent from "@/components/delete_component"
import { deletePerson, getPersonById } from "@/helpers"
import { Person } from "@/models"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

export default function PersonDelete() {
    const [person, setPerson] = useState<Person>()

    const router = useRouter()

    const { id } = router.query

    useEffect(() => {
        if (!id) return

        getPersonById(Number.parseInt(id.toString()))
            .then(person => setPerson(person))
            .catch(_error => {
                router.push("/people")
            })
    }, [id, router])

    return (
        <DeleteComponent return_to="/people" name={`${person?.first_name} ${person?.last_name}`} deleter={() => {
            if (!person?.id) return

            return deletePerson(person.id)
        }} />
    )
}
