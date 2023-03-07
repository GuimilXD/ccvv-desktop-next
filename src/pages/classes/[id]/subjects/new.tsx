import SubjectFormComponent from "@/components/subject_form_component";
import { useRouter } from 'next/router'

export default function NewSubject() {
    const router = useRouter()

    const { id } = router.query

    let class_id = Number.parseInt(id?.toString() || "")

    return (
        <section className="section">
            <h2 className="title">Nova Matéria</h2>
            <SubjectFormComponent action="new" class_id={class_id} redirect_to={`/classes/${class_id}`} />
        </section>
    )
}
