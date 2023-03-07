import { getSubjectById } from "@/helpers";
import { Subject } from "@/models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserGroupIcon } from "@heroicons/react/24/solid";


export default function SubjectIndex() {
    const [subject, setSubject] = useState<Subject>()
    const router = useRouter()

    const { id: class_id, subject_id: subject_id_query } = router.query


    useEffect(() => {
        if (!subject_id_query) return

        const subject_id = Number.parseInt(subject_id_query.toString())

        getSubjectById(subject_id)
            .then(subject => setSubject(subject))
            .catch(error => {
                console.error(error)
            })
    }, [subject_id_query, class_id])

    return (
        <section className="section">
            <div className="card">
                <div className="card-content">
                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-96x96">
                                <UserGroupIcon />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="title is-4">{subject?.name}</p>
                        </div>
                    </div>
                </div>

                <div className="card-content">
                    {subject?.description}
                </div>

                <footer className="card-footer">
                    <Link href={`/classes/${class_id}/subjects/${subject?.id}/edit`} className="card-footer-item">
                        Editar
                    </Link>
                    <Link href={`/classes/${class_id}/subjects/${subject?.id}/delete`} className="card-footer-item">
                        Deletar
                    </Link>
                </footer>
            </div>
        </section>
    )
}
