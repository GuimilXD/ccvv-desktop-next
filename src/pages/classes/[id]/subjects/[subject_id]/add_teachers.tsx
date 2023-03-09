import { useRouter } from "next/router"
import { addTeacherToSubject } from "@/helpers"
import AddPeopleToComponent from '@/components/add_people_to_component'

export default function SubjectAddTeachers() {
    const router = useRouter()

    const { id: class_id, subject_id } = router.query

    return (
        <section className="section">
            <nav className="panel">
                <p className="panel-heading">
                    Adicionar Professores
                </p>

                <AddPeopleToComponent return_to={`/classes/${class_id}/subjects/${subject_id?.toString()}`} addPersonTo={async (person_id: number) => {
                    if (!subject_id) return

                    addTeacherToSubject(person_id, Number.parseInt(subject_id.toString()))
                }} />
            </nav>
        </section>
    )
}
