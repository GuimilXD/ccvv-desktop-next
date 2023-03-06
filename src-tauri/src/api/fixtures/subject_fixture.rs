use diesel::prelude::*;
use diesel::{QueryResult, SqliteConnection};

use crate::models;
use crate::schema::subjects;

pub struct SubjectFixture {
    fields: models::NewSubject,
}

impl SubjectFixture {
    pub fn new(class_id: i32) -> Self {
        Self {
            fields: models::NewSubject {
                name: "Default Subject".to_owned(),
                description: None,
                class_id,
            },
        }
    }

    pub fn name(mut self, value: String) -> Self {
        self.fields.name = value;
        self
    }

    pub fn description(mut self, value: String) -> Self {
        self.fields.description = Some(value);
        self
    }

    pub fn execute(self, connection: &mut SqliteConnection) -> QueryResult<models::Subject> {
        let subject_id: i32 = diesel::insert_into(subjects::table)
            .values(self.fields)
            .returning(subjects::id)
            .get_result(connection)?;

        subjects::table
            .filter(subjects::id.eq(subject_id))
            .get_result::<models::Subject>(connection)
    }
}
