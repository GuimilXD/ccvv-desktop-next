import { createPerson, getPersonById, updatePerson } from "@/helpers";
import { Person } from "@/models";
import Router from 'next/router'
import { useEffect } from "react";
import { useForm } from "react-hook-form";


function save_person(options: PersonFormComponentProps, fields: Person): Promise<number> | void {
    switch (options.action) {
        case "new": {
            return createPerson(fields)
        }
        case "edit": {
            if (!options.person_id) {
                console.error("Person ID not provided in editing")
                return
            }
            fields.id = options.person_id
            return updatePerson(options.person_id, fields)
        }
    }
}

export interface PersonFormComponentProps {
    action: "new" | "edit",
    person_id?: number,
    redirect_to?: string
}

export default function PersonFormComponent(props: PersonFormComponentProps) {
    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (props.action == "edit" && props.person_id) {
            // get user and set form fields
            getPersonById(props.person_id).then((person: Person) => {
                const fields = ['first_name', 'last_name', 'email', 'phone_number', 'details'];
                fields.forEach((field: string) => setValue(field, person[field as keyof Person]));
            });
        }
    }, [props.person_id, props.action, setValue]);

    return (
            <form
                onSubmit={handleSubmit((fields: any) => {
                    save_person(props, fields)
                        ?.then((_affected_rows: any) => {
                            //TODO: Send flash message
                            //TODO: Redirect user created person profile
                          //
                            if (props.redirect_to) {
                                Router.push(props.redirect_to)
                            } else {
                                Router.back()
                            }
                        })
                        .catch((error: string) => {
                            //TODO: Implement better error handling
                            if (error.includes("missing field `last_name`")) {
                                setError("last_name", { type: "required" })
                            }
                            if (error.includes("missing field `first_name`")) {
                                setError("first_name", { type: "required" })
                            }
                        })
                })}>
                <div className="field is-horizontal">
                    <div className="field-body">
                        <div className="field">
                            <label className="label">Primeiro Nome</label>
                            <input className="input" {...register("first_name", { required: true })} />
                            <p className="help is-danger">
                                {errors.first_name && <span>Campo Obrigatório</span>}
                            </p>
                        </div>

                        <div className="field">
                            <label className="label">Último Nome</label>
                            <input className="input" {...register("last_name", { required: true })} />
                            <p className="help is-danger">
                                {errors.last_name && <span>Campo Obrigatório</span>}
                            </p>
                        </div>
                    </div>
                </div>

            <div className="field">
                <label className="label">Email</label>
                <div className="control">
                    <input className="input" type="email" {...register("email")}/>
                </div>
            </div>

            <div className="field">
                <label className="label">Número de Celular</label>
                <div className="control">
                    <input className="input" {...register("phone_number")}/>
                </div>
            </div>

            <div className="field">
                <label className="label">Detalhes</label>
                <div className="control">
                    <textarea className="textarea" {...register("details")}/>
                </div>
            </div>

            <input type="submit" className="button is-primary is-fullwidth"/>
        </form>
    )
}
