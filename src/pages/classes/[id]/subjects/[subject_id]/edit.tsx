import SubjectFormComponent from "@/components/subject_form_component";
import { useRouter } from 'next/router'

export default function EditSubject() {
    const router = useRouter()

    const { id, subject_id: subject_id_query } = router.query

    let class_id = Number.parseInt(id?.toString() || "")
    let subject_id = Number.parseInt(subject_id_query?.toString() || "")

    return (
        <section className="section">
            <h2 className="title">Editar Matéria</h2>
            <SubjectFormComponent action="edit" class_id={class_id} subject_id={subject_id} redirect_to={`/classes/${class_id}`} />
        </section>
    )
}
