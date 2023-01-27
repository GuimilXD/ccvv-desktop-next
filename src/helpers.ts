// When using the Tauri API npm package:
import { invoke } from '@tauri-apps/api/tauri'
import { Person, ListPeopleCriteria, ListPeopleWithTotalCount, Modality, ListModalitiesWithTotalCount, ListModalitiesCriteria } from './models'

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
