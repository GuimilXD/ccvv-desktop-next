use diesel::prelude::*;
use diesel::{QueryResult, SqliteConnection};

use crate::models;
use crate::schema::{people, subjects, subjects_teachers};

pub fn add_teacher_to_subject(
    connection: &mut SqliteConnection,
    teacher_id: i32,
    subject_id: i32,
) -> QueryResult<usize> {
    diesel::insert_into(subjects_teachers::table)
        .values(models::NewTeacherSubject {
            teacher_id,
            subject_id,
        })
        .execute(connection)
}

pub fn remove_teacher_from_subject(
    connection: &mut SqliteConnection,
    teacher_id: i32,
    subject_id: i32,
) -> QueryResult<usize> {
    diesel::delete(subjects_teachers::table)
        .filter(subjects_teachers::subject_id.eq(subject_id))
        .filter(subjects_teachers::teacher_id.eq(teacher_id))
        .execute(connection)
}

// TODO: implement pagination and filtering
pub fn get_teachers_in_subject(
    connection: &mut SqliteConnection,
    subject_id: i32,
) -> QueryResult<Vec<models::Person>> {
    subjects::table
        .inner_join(subjects_teachers::table.inner_join(people::table))
        .filter(subjects::id.eq(subject_id))
        .select(people::all_columns)
        .load::<models::Person>(connection)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::fixtures::{PersonFixture, SubjectFixture};
    use crate::database;

    #[test]
    fn basic_acceptance_test() {
        let connection = &mut database::establish_test_database_connection();

        let teacher = PersonFixture::new()
            .execute(connection)
            .expect("Could not create teacher");

        let subject = SubjectFixture::new()
            .execute(connection)
            .expect("Could not create subject");

        add_teacher_to_subject(connection, teacher.id, subject.id)
            .expect("Could not add teacher to subject");

        let people = get_teachers_in_subject(connection, subject.id)
            .expect("Could not get people in subject");

        assert_eq!(people, vec![teacher.clone()]);

        remove_teacher_from_subject(connection, teacher.id, subject.id)
            .expect("Could not remove people from subject");

        let people = get_teachers_in_subject(connection, subject.id)
            .expect("Could not get people in subject");

        assert_eq!(people, vec![]);
    }
}
