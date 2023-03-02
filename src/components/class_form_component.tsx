import { createClass, getClassById, updateClass } from "@/helpers";
import { Class } from "@/models";
import Router from 'next/router'
import { useEffect } from "react";
import { useForm } from "react-hook-form";


function save_class(options: ClassFormComponentProps, fields: Class): Promise<number> | void {
    switch (options.action) {
        case "new": {
            return createClass(fields)
        }
        case "edit": {
            if (!options.class_id) {
                console.error("Class ID not provided in editing")
                return
            }
            fields.id = options.class_id
            return updateClass(options.class_id, fields)
        }
    }
}

export interface ClassFormComponentProps {
    action: "new" | "edit",
    class_id?: number,
    redirect_to?: string
}

export default function ClassFormComponent(props: ClassFormComponentProps) {
    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (props.action == "edit" && props.class_id) {
            // get user and set form fields
            getClassById(props.class_id).then((class_data: Class) => {
                const fields = ['name', 'description'];
                fields.forEach((field: string) => setValue(field, class_data[field as keyof Class]));
            });
        }
    }, [props.class_id, props.action, setValue]);

    return (
        <form
            onSubmit={handleSubmit((fields: any) => {
                save_class(props, fields)
                    ?.then((_affected_rows: any) => {
                        //TODO: Send flash message
                        //TODO: Redirect user created class profile
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
                            setError("last_name", { type: "required" })
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
