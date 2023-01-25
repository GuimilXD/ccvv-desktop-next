use crate::api;
use crate::database;
use crate::models;

#[tauri::command]
pub fn get_people(criteria: api::people::ListPeopleCriteria) -> Vec<models::Person>{
    let connection = &mut database::establish_connection();

    api::people::get_people(connection, &criteria)
        .expect("Could not get people")
}

#[tauri::command]
pub fn get_people_by_id(id: i32) -> models::Person {
    let connection = &mut database::establish_connection();

    api::people::get_person_by_id(connection, id)
        .expect("Could not get person by id")
}

#[tauri::command]
pub fn create_person(new_person: models::NewPerson) -> usize {
    let connection = &mut database::establish_connection();

    api::people::create_person(connection, new_person)
        .expect("Could not create person")
}

#[tauri::command]
pub fn update_person(id: i32, updated_person: models::Person) -> usize {
    let connection = &mut database::establish_connection();

    api::people::update_person(connection, id, updated_person)
        .expect("Could not update person")
}

#[tauri::command]
pub fn delete_person(id: i32) -> usize {
    let connection = &mut database::establish_connection();

    api::people::delete_person(connection, id)
        .expect("Could not delete person")
}
