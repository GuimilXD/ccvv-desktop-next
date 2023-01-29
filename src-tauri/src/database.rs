use diesel::prelude::*;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use dotenvy::dotenv;
use std::env;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let project_dir = directories::ProjectDirs::from("com", "ccvv", "ccvv")
        .expect("Could not get local data dir");

    let local_data_dir = project_dir.data_local_dir();

    if !local_data_dir.exists() {
        std::fs::create_dir_all(local_data_dir).expect("Could not create local data dir")
    }

    let local_database_path = local_data_dir
        .join("database.db")
        .to_string_lossy()
        .to_string();

    let database_url = env::var("DATABASE_URL").unwrap_or(local_database_path);

    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn run_migrations(connection: &mut SqliteConnection) {
    connection
        .run_pending_migrations(MIGRATIONS)
        .expect("Error migrating");
}

pub fn establish_test_database_connection() -> SqliteConnection {
    let mut connection =
        SqliteConnection::establish("").expect("Could not setup in-memory test database");

    run_migrations(&mut connection);

    connection
}
