import { getModalityById } from "@/helpers";
import { Modality } from "@/models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserGroupIcon } from "@heroicons/react/24/solid";

export default function ModalityIndex() {
    const [modality, setModality] = useState<Modality>()
    const router = useRouter()

    const { id } = router.query

    useEffect(() => {
        if (!id) return

        getModalityById(Number.parseInt(id.toString()))
        .then(modality => setModality(modality))
        .catch(_error => {
            router.push("/modalities")
        })
    }, [])

    return (
        <div className="card">
            <div className="card-content">
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-96x96">
                            <UserGroupIcon />
                        </figure>
                    </div>
                    <div className="media-content">
                        <p className="title is-4">{modality?.name}</p>
                    </div>
                </div>
            </div>

            <div className="card-content">
                {modality?.description}
            </div>

            <footer className="card-footer">
                <Link href={`/modalities/${modality?.id}/edit`} className="card-footer-item">
                    Editar
                </Link>
                <Link href={`/modalities/${modality?.id}/delete`} className="card-footer-item">
                    Deletar
                </Link>
            </footer>
        </div>
    )
}
