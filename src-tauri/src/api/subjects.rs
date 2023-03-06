use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models;
use crate::schema::subjects;

#[derive(Debug, Clone, Deserialize)]
pub struct FilterSubjects {
    pub name: Option<String>,
}

impl Default for FilterSubjects {
    fn default() -> Self {
        Self { name: None }
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct ListSubjectsCriteria {
    pub page: i64,
    pub per_page: i64,
    pub filter: Option<FilterSubjects>,
}

impl Default for ListSubjectsCriteria {
    fn default() -> Self {
        Self {
            page: 1,
            per_page: 5,
            filter: Some(FilterSubjects::default()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListSubjectsResultWithTotalCount {
    pub subjects: Vec<models::Subject>,
    pub total_count: i64,
}

pub fn get_subjects_in_class(
    connection: &mut SqliteConnection,
    class_id: i32,
    criteria: &ListSubjectsCriteria,
) -> QueryResult<ListSubjectsResultWithTotalCount> {
    let mut subject_query = subjects::table
        .filter(subjects::class_id.eq(class_id))
        .into_boxed();
    let mut total_count_query = subjects::table
        .filter(subjects::class_id.eq(class_id))
        .into_boxed();

    // TODO: Remove code repetition for filtering. Maybe using macros
    if let Some(filter) = &criteria.filter {
        if let Some(first_name) = &filter.name {
            subject_query = subject_query.filter(subjects::name.like(first_name));
            total_count_query = total_count_query.filter(subjects::name.like(first_name));
        }
    }

    let total_count = total_count_query.count().get_result::<i64>(connection)?;

    let subjects = subject_query
        .limit(criteria.per_page)
        .offset(criteria.per_page * (criteria.page - 1))
        .load::<models::Subject>(connection)?;

    Ok(ListSubjectsResultWithTotalCount {
        subjects,
        total_count,
    })
}

pub fn get_subject_by_id(
    connection: &mut SqliteConnection,
    id: i32,
) -> QueryResult<models::Subject> {
    subjects::dsl::subjects
        .filter(subjects::dsl::id.eq(id))
        .get_result::<models::Subject>(connection)
}

pub fn create_subject(
    connection: &mut SqliteConnection,
    new_subject: models::NewSubject,
) -> QueryResult<usize> {
    diesel::insert_into(subjects::table)
        .values(&new_subject)
        .execute(connection)
}

pub fn delete_subject(connection: &mut SqliteConnection, id: i32) -> QueryResult<usize> {
    diesel::delete(subjects::table.filter(subjects::dsl::id.eq(id))).execute(connection)
}

pub fn update_subject(
    connection: &mut SqliteConnection,
    id: i32,
    updated_post: models::Subject,
) -> QueryResult<usize> {
    diesel::update(subjects::table.filter(subjects::dsl::id.eq(id)))
        .set(updated_post)
        .execute(connection)
}
#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::fixtures::{ClassFixture, SubjectFixture};
    use crate::database;
    use crate::schema::subjects;

    macro_rules! get_subject_by_filter {
        ($connection:ident, $filter:expr) => {
            subjects::table
                .filter($filter)
                .get_result::<models::Subject>($connection)
        };
    }

    #[test]
    fn create_subject_inserts_subject_using_specified_fields() {
        let connection = &mut database::establish_test_database_connection();

        let class = ClassFixture::new()
            .execute(connection)
            .expect("Could not create class");

        assert!(create_subject(
            connection,
            models::NewSubject {
                name: "Jiu-Jitsu".to_string(),
                description: Some("Jiu-Jitsu subjects for people under 18".to_string()),
                class_id: class.id
            },
        )
        .is_ok());

        let subject = get_subject_by_filter!(connection, subjects::dsl::name.eq("Jiu-Jitsu"))
            .expect("Coult not find created subject in table");

        assert_eq!(subject.name, "Jiu-Jitsu");
        assert_eq!(
            subject.description,
            Some("Jiu-Jitsu subjects for people under 18".to_string())
        );
    }

    #[test]
    fn get_subject_by_id_selects_subject_where_id_matches() {
        let connection = &mut database::establish_test_database_connection();

        let class = ClassFixture::new()
            .execute(connection)
            .expect("Could not create class");

        let subject = SubjectFixture::new(class.id)
            .name("Music Theory".to_string())
            .description("The study of practices and possibilities in music".to_string())
            .execute(connection)
            .expect("Could not create new subject");

        assert_eq!(subject.name, "Music Theory");
        assert_eq!(
            subject.description,
            Some("The study of practices and possibilities in music".to_string())
        );
    }

    #[test]
    fn get_subjects_in_class_selects_only_subjects_in_class_with_pagination_and_filtering() {
        let connection = &mut database::establish_test_database_connection();

        let total_subjects_count = 10;

        let class = ClassFixture::new()
            .execute(connection)
            .expect("Could not create class");

        let other_class = ClassFixture::new()
            .execute(connection)
            .expect("Could not create class");

        for i in 1..=total_subjects_count {
            if i % 2 == 0 {
                SubjectFixture::new(class.id)
            } else {
                SubjectFixture::new(other_class.id)
            }
            .execute(connection)
            .expect("Could not create subjects");
        }

        let subjects =
            get_subjects_in_class(connection, class.id, &ListSubjectsCriteria::default())
                .expect("Could not get subjects in class");

        let other_subjects =
            get_subjects_in_class(connection, other_class.id, &ListSubjectsCriteria::default())
                .expect("Could not get subjects in other class");

        assert!(subjects.total_count == (total_subjects_count / 2));
        assert!(other_subjects.total_count == (total_subjects_count / 2));
    }

    #[test]
    fn delete_subject_deletes_subject_with_matching_id() {
        let connection = &mut database::establish_test_database_connection();

        let class = ClassFixture::new()
            .execute(connection)
            .expect("Could not create class");

        SubjectFixture::new(class.id)
            .execute(connection)
            .expect("Could not create subject");

        delete_subject(connection, 1).expect("Could not delete subject with id 1");

        assert!(subjects::table
            .filter(subjects::dsl::id.eq(1))
            .get_result::<models::Subject>(connection)
            .is_err());
    }

    #[test]
    fn update_subject_updates_subject_with_matching_id() {
        let connection = &mut database::establish_test_database_connection();

        let class = ClassFixture::new()
            .execute(connection)
            .expect("Could not create class");

        let subject = SubjectFixture::new(class.id)
            .execute(connection)
            .expect("Could not create subject");

        let update_fields = models::Subject {
            id: 10,
            name: "IWas".to_string(),
            description: Some("JustUpdated".to_string()),
            ..subject
        };

        update_subject(connection, 1, update_fields.clone())
            .expect("Could not delete subject with id 1");

        let updated_subject = get_subject_by_filter!(connection, subjects::dsl::id.eq(subject.id))
            .expect("Could not get subject");

        // subject.id should not be updateable
        assert_eq!(updated_subject.id, subject.id);
        assert_ne!(updated_subject.id, update_fields.id);

        assert_eq!(updated_subject.name, update_fields.name);
        assert_eq!(updated_subject.description, update_fields.description);
    }
}
