import { useRouter } from "next/router"
import { addStudentToClass } from "@/helpers"
import AddPeopleToComponent from '@/components/add_people_to_component'

export default function ClassAddStudents() {
    const router = useRouter()

    const { id: class_id } = router.query

    return (
        <section className="section">
            <nav className="panel">
                <p className="panel-heading">
                    Adicionar Alunos
                </p>

                <AddPeopleToComponent return_to={`/classes/${class_id?.toString()}`} addPersonTo={async (person_id: number) => {
                    if (!class_id) return

                    addStudentToClass(person_id, Number.parseInt(class_id.toString()))
                }} />
            </nav>
        </section>
    )
}
