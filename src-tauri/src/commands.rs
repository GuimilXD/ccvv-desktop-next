use crate::api;
use crate::database;
use crate::models;

type CommandResult<T> = Result<T, String>;

macro_rules! handle_return {
    ($action:expr) => {
        $action.map_err(|e| e.to_string())
    };
}

#[tauri::command]
pub fn get_people(
    criteria: api::people::ListPeopleCriteria,
) -> CommandResult<api::people::ListPeopleResultWithTotalCount> {
    let connection = &mut database::establish_connection();

    handle_return!(api::people::get_people(connection, &criteria))
}

#[tauri::command]
pub fn get_person_by_id(id: i32) -> CommandResult<models::Person> {
    let connection = &mut database::establish_connection();

    handle_return!(api::people::get_person_by_id(connection, id))
}

#[tauri::command]
pub fn create_person(new_person: models::NewPerson) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::people::create_person(connection, new_person))
}

#[tauri::command]
pub fn update_person(id: i32, updated_person: models::Person) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::people::update_person(connection, id, updated_person))
}

#[tauri::command]
pub fn delete_person(id: i32) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::people::delete_person(connection, id))
}

#[tauri::command]
pub fn get_modalities(criteria: api::modalities::ListModalitiesCriteria) -> CommandResult<api::modalities::ListModalitiesResultWithTotalCount> {
    let connection = &mut database::establish_connection();

    handle_return!(api::modalities::get_modalities(connection, &criteria))
}

#[tauri::command]
pub fn get_modality_by_id(id: i32) -> CommandResult<models::Modality> {
    let connection = &mut database::establish_connection();

    handle_return!(api::modalities::get_modality_by_id(connection, id))
}

#[tauri::command]
pub fn create_modality(new_modality: models::NewModality) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::modalities::create_modality(connection, new_modality))
}

#[tauri::command]
pub fn update_modality(id: i32, updated_modality: models::Modality) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::modalities::update_modality(connection, id, updated_modality))
}

#[tauri::command]
pub fn delete_modality(id: i32) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::modalities::delete_modality(connection, id))
}
