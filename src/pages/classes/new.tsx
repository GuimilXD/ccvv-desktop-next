import ClassFormComponent from "@/components/class_form_component";

export default function NewClasses() {
    return (
        <section className="section">
            <h2 className="title">Nova Turma</h2>
            <ClassFormComponent action="new" redirect_to="/classes" />
        </section>
    )
}
