// When using the Tauri API npm package:
import { invoke } from '@tauri-apps/api/tauri'
import { Person, ListPeopleCriteria, ListPeopleWithTotalCount } from './models'

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
