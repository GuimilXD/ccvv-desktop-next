interface DeleteComponentProps {
    deleter: Function,
    name: string | undefined,
    return_to: string

}

import { useRouter } from 'next/router'

export default function DeleteComponent({ deleter, name, return_to }: DeleteComponentProps) {
    const router = useRouter()

    return (
        <section className="section">
            <h1 className="title"> Você tem certeza que deseja deletar &quot;{name}&quot;</h1>

            <div className="field is-grouped buttons are-large">
                <button className="button is-danger is-outlined" onClick={() => {
                    //TODO: add flash message
                    deleter()
                        .then(() => router.push(return_to))
                        .catch(() => router.push(return_to))
                }}>
                    Sim, desejo deletar
                </button>
                <button className="button is-primary is-outlined" onClick={() => router.back()}>
                    Não, desejo voltar
                </button>
            </div>
        </section>
    )
}
