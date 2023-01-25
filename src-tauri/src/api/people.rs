use diesel::prelude::*;

use crate::models;
use crate::schema::people;

#[derive(Debug, Clone, Copy)]
pub struct ListPeopleCriteria {
    page: i64,
    per_page: i64,
}

impl Default for ListPeopleCriteria {
    fn default() -> Self {
        Self {
            page: 1,
            per_page: 5,
        }
    }
}

pub fn get_people(
    connection: &mut SqliteConnection,
    criteria: ListPeopleCriteria,
) -> Vec<models::Person> {
    people::dsl::people
        .limit(criteria.per_page)
        .offset(criteria.per_page * (criteria.page - 1))
        .load::<models::Person>(connection)
        .expect("Could not list all people")
}

pub fn get_person_by_id(connection: &mut SqliteConnection, id: i32) -> QueryResult<models::Person> {
    people::dsl::people
        .filter(people::dsl::id.eq(id))
        .get_result::<models::Person>(connection)
}

pub fn create_person(
    connection: &mut SqliteConnection,
    new_person: models::NewPerson,
) -> QueryResult<usize> {
    diesel::insert_into(people::table)
        .values(&new_person)
        .execute(connection)
}

pub fn delete_person(connection: &mut SqliteConnection, id: i32) -> QueryResult<usize> {
    diesel::delete(people::table.filter(people::dsl::id.eq(id))).execute(connection)
}

pub fn update_person(
    connection: &mut SqliteConnection,
    id: i32,
    updated_post: models::Person,
) -> QueryResult<usize> {
    diesel::update(people::table.filter(people::dsl::id.eq(id)))
        .set(updated_post)
        .execute(connection)
}
#[cfg(test)]
mod tests {
    use super::*;
    use crate::database;
    use crate::schema::people;

    macro_rules! insert_into_people {
        ($connection:ident, $values:expr) => {
            diesel::insert_into(people::table)
                .values($values)
                .execute($connection)
                .expect("Could not save new person");
        };
    }

    macro_rules! get_person_by_filter {
        ($connection:ident, $filter:expr) => {
            people::table
                .filter($filter)
                .get_result::<models::Person>($connection)
        };
    }


    #[test]
    fn create_person_inserts_person_using_specified_fields() {
        let connection = &mut database::establish_test_database_connection();

        assert!(create_person(
            connection,
            models::NewPerson {
                first_name: "José".to_string(),
                last_name: "Valim".to_string(),
                email: None,
                phone_number: None,
                details: Some("Creator of the Elixir programming language".to_string()),
            },
        )
        .is_ok());

        let person = get_person_by_filter!(connection, people::dsl::first_name.eq("José"))
            .expect("Coult not find created person in table");

        assert_eq!(person.first_name, "José");
        assert_eq!(person.last_name, "Valim");
        assert_eq!(person.email, None);
        assert_eq!(
            person.details,
            Some("Creator of the Elixir programming language".to_string())
        );
        assert_eq!(person.phone_number, None);
    }

    #[test]
    fn get_person_by_id_selects_person_where_id_matches() {
        let connection = &mut database::establish_test_database_connection();

        let new_person = models::NewPerson {
            first_name: "Bjarne".to_string(),
            last_name: "Stroustrup".to_string(),
            email: None,
            phone_number: None,
            details: Some("Creator of the Rust programming language".to_string()),
        };

        insert_into_people!(connection, &new_person);

        let person = get_person_by_id(connection, 1).expect("Could not find new person in table");

        assert_eq!(person.first_name, "Bjarne");
        assert_eq!(person.last_name, "Stroustrup");
        assert_eq!(person.email, None);
        assert_eq!(
            person.details,
            Some("Creator of the Rust programming language".to_string())
        );
        assert_eq!(person.phone_number, None);
    }

    #[test]
    fn get_people_selects_all_people_with_pagination() {
        let connection = &mut database::establish_test_database_connection();

        let mut people_to_be_added = vec![];
        let total_people_count = 10;

        for i in 1..=total_people_count {
            people_to_be_added.push(models::NewPerson {
                first_name: i.to_string(),
                last_name: "User".to_string(),
                email: None,
                phone_number: None,
                details: None,
            });
        }

        insert_into_people!(connection, people_to_be_added);

        let number_of_pages = 2;
        let people_per_page = total_people_count / number_of_pages;

        let criteria = ListPeopleCriteria {
            page: number_of_pages,
            per_page: people_per_page,
        };

        let people = get_people(connection, criteria);

        assert!(people.len() == people_per_page.try_into().unwrap());
    }

    #[test]
    fn delete_person_deletes_person_with_matching_id() {
        let connection = &mut database::establish_test_database_connection();

        insert_into_people!(
            connection,
            models::NewPerson {
                first_name: "SoonTo".to_string(),
                last_name: "BeDeleted".to_string(),
                email: None,
                phone_number: None,
                details: None,
            }
        );

        assert!(get_person_by_filter!(connection, people::dsl::id.eq(1)).is_ok());

        delete_person(connection, 1).expect("Could not delete person with id 1");

        assert!(people::table
            .filter(people::dsl::id.eq(1))
            .get_result::<models::Person>(connection)
            .is_err());
    }

    #[test]
    fn update_person_updates_person_with_matching_id() {
        let connection = &mut database::establish_test_database_connection();

        insert_into_people!(
            connection,
            models::NewPerson {
                first_name: "SoonTo".to_string(),
                last_name: "BeUpdated".to_string(),
                email: Some("original@email.com".to_string()),
                phone_number: None,
                details: None,
            }
        );

        let person =  get_person_by_filter!(connection, people::dsl::id.eq(1))
            .expect("Could not get person");

        let update_fields = models::Person {
            id: 10,
            first_name: "IWas".to_string(),
            last_name: "JustUpdated".to_string(),
            ..person
        };

        update_person(connection, 1, update_fields.clone())
            .expect("Could not delete person with id 1");

        let updated_person =  get_person_by_filter!(connection, people::dsl::id.eq(1))
            .expect("Could not get person");

        // person.id should not be updateable
        assert_eq!(updated_person.id, person.id);
        assert_ne!(updated_person.id, update_fields.id);

        assert_eq!(updated_person.first_name, update_fields.first_name);
        assert_eq!(updated_person.last_name, update_fields.last_name);
    }
}
