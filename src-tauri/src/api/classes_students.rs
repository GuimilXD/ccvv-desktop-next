use diesel::prelude::*;
use diesel::{QueryResult, SqliteConnection};

use crate::models;
use crate::schema::{classes, classes_students, people};

pub fn add_student_to_class(
    connection: &mut SqliteConnection,
    student_id: i32,
    class_id: i32,
) -> QueryResult<usize> {
    diesel::insert_into(classes_students::table)
        .values(models::NewStudentClass {
            student_id,
            class_id,
        })
        .execute(connection)
}

pub fn remove_student_from_class(
    connection: &mut SqliteConnection,
    student_id: i32,
    class_id: i32,
) -> QueryResult<usize> {
    diesel::delete(classes_students::table)
        .filter(classes_students::class_id.eq(class_id))
        .filter(classes_students::student_id.eq(student_id))
        .execute(connection)
}

// TODO: implement pagination and filtering
pub fn get_people_in_class(
    connection: &mut SqliteConnection,
    class_id: i32,
) -> QueryResult<Vec<models::Person>> {
    classes::table
        .inner_join(classes_students::table.inner_join(people::table))
        .filter(classes::id.eq(class_id))
        .select(people::all_columns)
        .load::<models::Person>(connection)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::fixtures::{ClassFixture, PersonFixture};
    use crate::database;

    #[test]
    fn basic_acceptance_test() {
        let connection = &mut database::establish_test_database_connection();

        let student = PersonFixture::new()
            .execute(connection)
            .expect("Could not create student");

        let class = ClassFixture::new()
            .execute(connection)
            .expect("Could not create class");

        add_student_to_class(connection, student.id, class.id)
            .expect("Could not add student to class");

        let people =
            get_people_in_class(connection, class.id).expect("Could not get people in class");

        assert_eq!(people, vec![student.clone()]);

        remove_student_from_class(connection, student.id, class.id)
            .expect("Could not remove people from class");

        let people =
            get_people_in_class(connection, class.id).expect("Could not get people in class");

        assert_eq!(people, vec![]);
    }
}
