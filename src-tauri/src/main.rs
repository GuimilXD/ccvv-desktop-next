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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
