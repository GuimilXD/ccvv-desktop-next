#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use app::commands;

fn main() {
    let connection = &mut app::database::establish_connection();

    app::database::run_migrations(connection);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::get_people,
            commands::get_person_by_id,
            commands::create_person,
            commands::update_person,
            commands::delete_person,
            commands::get_modalities,
            commands::get_modality_by_id,
            commands::create_modality,
            commands::update_modality,
            commands::delete_modality,
            commands::add_person_to_modality,
            commands::remove_person_from_modality,
            commands::get_people_in_modality,
            commands::get_classes,
            commands::get_class_by_id,
            commands::create_class,
            commands::update_class,
            commands::delete_class,
            commands::add_student_to_class,
            commands::remove_student_from_class,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
