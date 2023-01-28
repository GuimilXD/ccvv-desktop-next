use diesel::prelude::*;
use diesel::{QueryResult, SqliteConnection};

use crate::models;
use crate::schema::{modalities, modalities_people, people};

pub fn add_person_to_modality(
    connection: &mut SqliteConnection,
    person_id: i32,
    modality_id: i32,
) -> QueryResult<usize> {
    diesel::insert_into(modalities_people::table)
        .values(models::NewPersonModality {
            person_id,
            modality_id,
        })
        .execute(connection)
}

pub fn remove_person_from_modality(
    connection: &mut SqliteConnection,
    person_id: i32,
    modality_id: i32,
) -> QueryResult<usize> {
    diesel::delete(modalities_people::table)
        .filter(modalities_people::modality_id.eq(modality_id))
        .filter(modalities_people::person_id.eq(person_id))
        .execute(connection)
}

// TODO: implement pagination and filtering
pub fn get_people_in_modality(
    connection: &mut SqliteConnection,
    modality_id: i32,
) -> QueryResult<Vec<models::Person>> {
    modalities::table
        .inner_join(modalities_people::table.inner_join(people::table))
        .filter(modalities::id.eq(modality_id))
        .select(people::all_columns)
        .load::<models::Person>(connection)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::fixtures::{ModalityFixture, PersonFixture};
    use crate::database;

    #[test]
    fn basic_acceptance_test() {
        let connection = &mut database::establish_test_database_connection();

        let person = PersonFixture::new()
            .execute(connection)
            .expect("Could not create person");

        let modality = ModalityFixture::new()
            .execute(connection)
            .expect("Could not create modality");

        add_person_to_modality(connection, person.id, modality.id)
            .expect("Could not add person to modality");

        let people = get_people_in_modality(connection, modality.id)
            .expect("Could not get people in modality");

        assert_eq!(people, vec![person.clone()]);

        remove_person_from_modality(connection, person.id, modality.id)
            .expect("Could not remove people from modality");

        let people = get_people_in_modality(connection, modality.id)
            .expect("Could not get people in modality");

        assert_eq!(people, vec![]);
    }
}
