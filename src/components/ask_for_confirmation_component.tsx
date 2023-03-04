import { useRouter } from 'next/router'

export interface AskForConfirmationComponentProps {
    return_to: string,
    action: Function,
    prompt: string
}

export default function AskForConfirmationComponent({ return_to, action, prompt }: AskForConfirmationComponentProps) {
    const router = useRouter()

    return (
        <section className="section">
            <h1 className="title">{prompt}</h1>

            <div className="field is-grouped buttons are-large">
                <button className="button is-danger is-outlined" onClick={() => {
                    action()
                        .then(() => router.push(return_to))
                        .catch(() => router.push(return_to))
                }}>
                    Sim, desejo remover
                </button>
                <button className="button is-primary is-outlined" onClick={() => router.back()}>
                    Não, desejo voltar
                </button>
            </div>
        </section>
    )
}
