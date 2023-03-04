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
pub fn get_modalities(
    criteria: api::modalities::ListModalitiesCriteria,
) -> CommandResult<api::modalities::ListModalitiesResultWithTotalCount> {
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

    handle_return!(api::modalities::update_modality(
        connection,
        id,
        updated_modality
    ))
}

#[tauri::command]
pub fn delete_modality(id: i32) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::modalities::delete_modality(connection, id))
}

#[tauri::command]
pub fn add_person_to_modality(person_id: i32, modality_id: i32) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::modalities_people::add_person_to_modality(
        connection,
        person_id,
        modality_id
    ))
}

#[tauri::command]
pub fn remove_person_from_modality(person_id: i32, modality_id: i32) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::modalities_people::remove_person_from_modality(
        connection,
        person_id,
        modality_id
    ))
}

#[tauri::command]
pub fn get_people_in_modality(modality_id: i32) -> CommandResult<Vec<models::Person>> {
    let connection = &mut database::establish_connection();

    handle_return!(api::modalities_people::get_people_in_modality(
        connection,
        modality_id
    ))
}

#[tauri::command]
pub fn get_classes(
    criteria: api::classes::ListClassesCriteria,
) -> CommandResult<api::classes::ListClassesResultWithTotalCount> {
    let connection = &mut database::establish_connection();

    handle_return!(api::classes::get_classes(connection, &criteria))
}

#[tauri::command]
pub fn get_class_by_id(id: i32) -> CommandResult<models::Class> {
    let connection = &mut database::establish_connection();

    handle_return!(api::classes::get_class_by_id(connection, id))
}

#[tauri::command]
pub fn create_class(new_class: models::NewClass) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::classes::create_class(connection, new_class))
}

#[tauri::command]
pub fn update_class(id: i32, updated_class: models::Class) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::classes::update_class(connection, id, updated_class))
}

#[tauri::command]
pub fn delete_class(id: i32) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::classes::delete_class(connection, id))
}

#[tauri::command]
pub fn add_student_to_class(student_id: i32, class_id: i32) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::classes_students::add_student_to_class(
        connection, student_id, class_id
    ))
}

#[tauri::command]
pub fn remove_student_from_class(student_id: i32, class_id: i32) -> CommandResult<usize> {
    let connection = &mut database::establish_connection();

    handle_return!(api::classes_students::remove_student_from_class(
        connection, student_id, class_id
    ))
}

#[tauri::command]
pub fn get_students_in_class(class_id: i32) -> CommandResult<Vec<models::Person>> {
    let connection = &mut database::establish_connection();

    handle_return!(api::classes_students::get_students_in_class(
        connection, class_id
    ))
}
