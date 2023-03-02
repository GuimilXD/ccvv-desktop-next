// When using the Tauri API npm package:
import { createColumnHelper } from '@tanstack/react-table'
import { invoke } from '@tauri-apps/api/tauri'
import { Person, ListPeopleCriteria, ListPeopleWithTotalCount, Modality, ListModalitiesWithTotalCount, ListModalitiesCriteria, Class, ListClassesWithTotalCount, ListClassesCriteria } from './models'

export const personColumnHelper = createColumnHelper<Person>()

export const personDefaultColumns = [
    personColumnHelper.accessor('id', {
        header: "ID",
        cell: info => info.getValue()
    }),
    personColumnHelper.accessor('first_name', {
        header: "Primeiro Nome",
        cell: info => info.getValue()
    }),
    personColumnHelper.accessor('last_name', {
        header: "Último Nome",
        cell: info => info.getValue()
    }),
    personColumnHelper.accessor('email', {
        header: "Email",
        cell: info => info.getValue()
    }),
    personColumnHelper.accessor('phone_number', {
        header: "Número de Celular",
        cell: info => info.getValue()
    }),
    personColumnHelper.accessor('details', {
        header: "Detalhes",
        cell: info => info.getValue()
    }),
]

export const modalityColumnHelper = createColumnHelper<Modality>()

export const modalityDefaultColumns = [
    modalityColumnHelper.accessor('id', {
        header: "ID",
        cell: info => info.getValue()
    }),
    modalityColumnHelper.accessor('name', {
        header: "Nome",
        cell: info => info.getValue()
    }),
    modalityColumnHelper.accessor('description', {
        header: "Descrição",
        cell: info => info.getValue()
    }),
]

export const classColumnHelper = createColumnHelper<Class>()

export const classDefaultColumns = [
    classColumnHelper.accessor('id', {
        header: "ID",
        cell: info => info.getValue()
    }),
    classColumnHelper.accessor('name', {
        header: "Nome",
        cell: info => info.getValue()
    }),
    classColumnHelper.accessor('description', {
        header: "Descrição",
        cell: info => info.getValue()
    }),
]

export async function getPeople(criteria: ListPeopleCriteria): Promise<ListPeopleWithTotalCount> {
    return invoke("get_people", { criteria })
}

export async function getPersonById(id: number): Promise<Person> {
    return invoke("get_person_by_id", { id })
}

export async function createPerson(newPerson: Person): Promise<number> {
    return invoke("create_person", { newPerson })
}

export async function updatePerson(id: number, updatedPerson: Person): Promise<number> {
    return invoke("update_person", { id, updatedPerson })
}

export async function deletePerson(id: number): Promise<number> {
    return invoke("delete_person", { id })
}

export async function getModalities(criteria: ListModalitiesCriteria): Promise<ListModalitiesWithTotalCount> {
    return invoke("get_modalities", { criteria })
}

export async function getModalityById(id: number): Promise<Modality> {
    return invoke("get_modality_by_id", { id })
}

export async function createModality(newModality: Modality): Promise<number> {
    return invoke("create_modality", { newModality })
}

export async function updateModality(id: number, updatedModality: Modality): Promise<number> {
    return invoke("update_modality", { id, updatedModality })
}

export async function deleteModality(id: number): Promise<number> {
    return invoke("delete_modality", { id })
}

export async function getPeopleInModality(modalityId: number): Promise<Person[]> {
    return invoke("get_people_in_modality", { modalityId })
}

export async function addPersonToModality(personId: number, modalityId: number): Promise<number> {
    return invoke("add_person_to_modality", { personId, modalityId })
}

export async function removePersonFromModality(personId: number, modalityId: number): Promise<number> {
    return invoke("remove_person_from_modality", { personId, modalityId })
}

export async function getClasses(criteria: ListClassesCriteria): Promise<ListClassesWithTotalCount> {
    return invoke("get_classes", { criteria })
}

export async function getClassById(id: number): Promise<Class> {
    return invoke("get_class_by_id", { id })
}

export async function createClass(newClass: Class): Promise<number> {
    return invoke("create_class", { newClass })
}

export async function updateClass(id: number, updatedClass: Class): Promise<number> {
    return invoke("update_class", { id, updatedClass })
}

export async function deleteClass(id: number): Promise<number> {
    return invoke("delete_class", { id })
}
