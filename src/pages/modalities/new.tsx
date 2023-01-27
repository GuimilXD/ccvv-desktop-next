
import ModalityFormComponent from "@/components/modality_form_component";

export default function NewModality() {
    return (
        <section className="section">
            <h2 className="title">Nova Modalidade</h2>
            <ModalityFormComponent action="new" redirect_to="/modalities" />
        </section>
    )
}
