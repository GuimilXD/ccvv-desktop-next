import PersonFormComponent from "@/components/person_form_component";

export default function NewPerson() {
    return (
        <section className="section">
            <h2 className="title">Nova Pessoa</h2>
            <PersonFormComponent action="new" redirect_to="/people" />
        </section>
    )
}
