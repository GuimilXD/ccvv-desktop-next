import { getClassById } from "@/helpers";
import { Modality, Person } from "@/models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserGroupIcon } from "@heroicons/react/24/solid";

export default function ModalityIndex() {
    const [class_data, setClassData] = useState<Modality>()
    const router = useRouter()

    const { id } = router.query

    useEffect(() => {
        if (!id) return

        const class_id = Number.parseInt(id.toString())

        getClassById(class_id)
            .then(class_data => setClassData(class_data))
            .catch(error => {
                console.error(error)
            })
    }, [id])


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
                            <p className="title is-4">{class_data?.name}</p>
                        </div>
                    </div>
                </div>

                <div className="card-content">
                    {class_data?.description}
                </div>

                <footer className="card-footer">
                    <Link href={`/classes/${class_data?.id}/edit`} className="card-footer-item">
                        Editar
                    </Link>
                    <Link href={`/classes/${class_data?.id}/delete`} className="card-footer-item">
                        Deletar
                    </Link>
                </footer>
            </div>
        </section>
    )
}
