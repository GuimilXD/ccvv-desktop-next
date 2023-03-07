import { createSubject, getSubjectById, updateSubject } from "@/helpers";
import { Subject } from "@/models";
import Router from 'next/router'
import { useEffect } from "react";
import { useForm } from "react-hook-form";


function save_subject(options: SubjectFormComponentProps, fields: Subject): Promise<number> | void {
    switch (options.action) {
        case "new": {
            fields.class_id = options.class_id
            return createSubject(fields)
        }
        case "edit": {
            if (!options.subject_id) {
                console.error("Subject ID not provided in editing")
                return
            }
            fields.id = options.subject_id
            fields.class_id = options.class_id
            return updateSubject(options.subject_id, fields)
        }
    }
}

export interface SubjectFormComponentProps {
    action: "new" | "edit",
    subject_id?: number,
    redirect_to?: string,
    class_id: number
}

export default function SubjectFormComponent(props: SubjectFormComponentProps) {
    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (props.action == "edit" && props.subject_id) {
            // get user and set form fields
            getSubjectById(props.subject_id).then((subject_data: Subject) => {
                const fields = ['name', 'description'];
                fields.forEach((field: string) => setValue(field, subject_data[field as keyof Subject]));
            });
        }
    }, [props.subject_id, props.action, setValue]);

    return (
        <form
            onSubmit={handleSubmit((fields: any) => {
                save_subject(props, fields)
                    ?.then((_affected_rows: any) => {
                        //TODO: Send flash message
                        //TODO: Redirect user created subject profile
                        //
                        if (props.redirect_to) {
                            Router.push(props.redirect_to)
                        } else {
                            Router.back()
                        }
                    })
                    .catch((error: string) => {
                        //TODO: Implement better error handling
                        if (error.includes("missing field `name`")) {
                            setError("name", { type: "required" })
                        }
                    })
            })}>

            <div className="field">
                <label className="label">Nome</label>
                <input className="input" {...register("name", { required: true })} />
                <p className="help is-danger">
                    {errors.name && <span>Campo Obrigatório</span>}
                </p>
            </div>

            <div className="field">
                <label className="label">Descrição</label>
                <div className="control">
                    <textarea className="textarea" {...register("description")} />
                </div>
            </div>

            <input type="submit" className="button is-primary is-fullwidth" />
        </form>
    )
}
