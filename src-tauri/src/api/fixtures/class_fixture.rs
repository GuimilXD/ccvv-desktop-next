use diesel::prelude::*;
use diesel::{QueryResult, SqliteConnection};

use crate::models;
use crate::schema::classes;

pub struct ClassFixture {
    fields: models::NewClass,
}

impl Default for ClassFixture {
    fn default() -> Self {
        Self {
            fields: models::NewClass {
                name: "Default".to_string(),
                description: None,
            },
        }
    }
}

impl ClassFixture {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn name(mut self, value: String) -> Self {
        self.fields.name = value;
        self
    }

    pub fn description(mut self, value: String) -> Self {
        self.fields.description = Some(value);
        self
    }

    pub fn execute(self, connection: &mut SqliteConnection) -> QueryResult<models::Class> {
        let class_id: i32 = diesel::insert_into(classes::table)
            .values(self.fields)
            .returning(classes::id)
            .get_result(connection)?;

        classes::table
            .filter(classes::id.eq(class_id))
            .get_result::<models::Class>(connection)
    }
}
