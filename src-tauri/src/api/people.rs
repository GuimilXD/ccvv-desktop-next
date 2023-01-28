use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models;
use crate::schema::people;

#[derive(Debug, Clone, Deserialize)]
pub struct FilterPeople {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
}

impl Default for FilterPeople {
    fn default() -> Self {
        Self {
            first_name: None,
            last_name: None,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct ListPeopleCriteria {
    pub page: i64,
    pub per_page: i64,
    pub filter: Option<FilterPeople>,
}

impl Default for ListPeopleCriteria {
    fn default() -> Self {
        Self {
            page: 1,
            per_page: 5,
            filter: Some(FilterPeople::default()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListPeopleResultWithTotalCount {
    pub people: Vec<models::Person>,
    pub total_count: i64,
}

pub fn get_people(
    connection: &mut SqliteConnection,
    criteria: &ListPeopleCriteria,
) -> QueryResult<ListPeopleResultWithTotalCount> {
    let mut people_query = people::table.into_boxed();
    let mut total_count_query = people::table.into_boxed();

    // TODO: Remove code repetition for filtering. Maybe using macros
    if let Some(filter) = &criteria.filter {
        if let Some(first_name) = &filter.first_name {
            people_query = people_query.filter(people::first_name.like(first_name));
            total_count_query = total_count_query.filter(people::first_name.like(first_name));
        }

        if let Some(last_name) = &filter.last_name {
            people_query = people_query.filter(people::last_name.like(last_name));
            total_count_query = total_count_query.filter(people::last_name.like(last_name));
        }
    }

    let total_count = total_count_query.count().get_result::<i64>(connection)?;

    let people = people_query
        .limit(criteria.per_page)
        .offset(criteria.per_page * (criteria.page - 1))
        .load::<models::Person>(connection)?;

    Ok(ListPeopleResultWithTotalCount {
        people,
        total_count,
    })
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
    use crate::api::fixtures::PersonFixture;
    use crate::database;
    use crate::schema::people;

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

        PersonFixture::new()
            .first_name("Bjarne".to_string())
            .last_name("Stroustrup".to_string())
            .details("Creator of the Rust programming language".to_string())
            .execute(connection)
            .expect("Could not create new person");

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
    fn get_people_selects_all_people_with_pagination_and_filtering() {
        let connection = &mut database::establish_test_database_connection();

        let total_people_count = 10;

        for i in 1..=total_people_count {
            PersonFixture::new()
                .first_name(if i % 2 == 0 {
                    "Even".to_string()
                } else {
                    "Odd".to_string()
                })
                .execute(connection)
                .expect("Could not create new person");
        }

        let number_of_pages = 2;
        let people_per_page = total_people_count / number_of_pages;

        let criteria = ListPeopleCriteria {
            page: number_of_pages,
            per_page: people_per_page,
            filter: Some(FilterPeople::default()),
        };

        let ListPeopleResultWithTotalCount {
            people,
            total_count,
        } = get_people(connection, &criteria).expect("Could not list all people");

        assert_eq!(people.len() as i64, people_per_page);
        assert_eq!(total_count, total_people_count);

        let criteria = ListPeopleCriteria {
            filter: Some(FilterPeople {
                first_name: Some("Odd".to_string()),
                ..FilterPeople::default()
            }),
            ..ListPeopleCriteria::default()
        };

        let ListPeopleResultWithTotalCount {
            people,
            total_count,
        } = get_people(connection, &criteria).expect("Could not list all people");

        people.iter().for_each(|person| {
            assert_eq!(person.first_name, "Odd");
        });

        assert_eq!(total_count, total_people_count / 2)
    }

    #[test]
    fn delete_person_deletes_person_with_matching_id() {
        let connection = &mut database::establish_test_database_connection();

        PersonFixture::new()
            .execute(connection)
            .expect("Could not create new person");

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

        let person = PersonFixture::new()
            .execute(connection)
            .expect("Could not create new person");

        let update_fields = models::Person {
            id: 10,
            first_name: "IWas".to_string(),
            last_name: "JustUpdated".to_string(),
            ..person
        };

        update_person(connection, 1, update_fields.clone())
            .expect("Could not delete person with id 1");

        let updated_person =
            get_person_by_filter!(connection, people::dsl::id.eq(1)).expect("Could not get person");

        // person.id should not be updateable
        assert_eq!(updated_person.id, person.id);
        assert_ne!(updated_person.id, update_fields.id);

        assert_eq!(updated_person.first_name, update_fields.first_name);
        assert_eq!(updated_person.last_name, update_fields.last_name);
    }
}
