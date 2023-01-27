import { createModality, getModalityById, updateModality } from "@/helpers";
import { Modality } from "@/models";
import Router from 'next/router'
import { useEffect } from "react";
import { useForm } from "react-hook-form";


function save_modality(options: ModalityFormComponentProps, fields: Modality): Promise<number> | void {
    switch (options.action) {
        case "new": {
            return createModality(fields)
        }
        case "edit": {
            if (!options.modality_id) {
                console.error("Modality ID not provided in editing")
                return
            }
            fields.id = options.modality_id
            return updateModality(options.modality_id, fields)
        }
    }
}

export interface ModalityFormComponentProps {
    action: "new" | "edit",
    modality_id?: number,
    redirect_to?: string
}

export default function ModalityFormComponent(props: ModalityFormComponentProps) {
    const { register, handleSubmit, setError, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (props.action == "edit" && props.modality_id) {
            // get user and set form fields
            getModalityById(props.modality_id).then((modality: Modality) => {
                const fields = ['name', 'description'];
                fields.forEach((field: string) => setValue(field, modality[field as keyof Modality]));
            });
        }
    }, [props.modality_id, props.action, setValue]);

    return (
            <form
                onSubmit={handleSubmit((fields: any) => {
                    save_modality(props, fields)
                        ?.then((_affected_rows: any) => {
                            //TODO: Send flash message
                            //TODO: Redirect user created modality profile
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
                    <textarea className="textarea" {...register("description")}/>
                </div>
            </div>

            <input type="submit" className="button is-primary is-fullwidth"/>
        </form>
    )
}
