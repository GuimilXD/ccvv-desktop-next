import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/router"

export default function BackButton() {
    const router = useRouter()

    return (
        <button className="button is-ghost" onClick={() => router.back()} >
            <ArrowUturnLeftIcon className="icon" />
            <span>Voltar</span>
        </button >
    )
}
