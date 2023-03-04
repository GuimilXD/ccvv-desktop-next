import { useRouter } from "next/router"
import { addPersonToModality } from "@/helpers"
import AddPeopleToComponent from '@/components/add_people_to_component'

export default function ModalityAddPeople() {
    const router = useRouter()

    const { id: modality_id } = router.query

    return (
        <section className="section">
            <nav className="panel">
                <p className="panel-heading">
                    Adicionar Pessoas
                </p>

                <AddPeopleToComponent return_to={`/modalities/${modality_id?.toString()}`} addPersonTo={async (person_id: number) => {
                    if (!modality_id) return

                    addPersonToModality(person_id, Number.parseInt(modality_id.toString()))
                }} />
            </nav>
        </section>
    )
}
