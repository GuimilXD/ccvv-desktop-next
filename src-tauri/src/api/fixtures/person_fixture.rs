use diesel::prelude::*;
use diesel::{QueryResult, SqliteConnection};

use crate::models;
use crate::schema::people;

pub struct PersonFixture {
    fields: models::NewPerson,
}

impl Default for PersonFixture {
    fn default() -> Self {
        Self {
            fields: models::NewPerson {
                first_name: "Default".to_string(),
                last_name: "Person".to_string(),
                email: None,
                phone_number: None,
                details: None,
            },
        }
    }
}

impl PersonFixture {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn first_name(mut self, value: String) -> Self {
        self.fields.first_name = value;
        self
    }

    pub fn last_name(mut self, value: String) -> Self {
        self.fields.last_name = value;
        self
    }

    pub fn email(mut self, value: String) -> Self {
        self.fields.email = Some(value);
        self
    }

    pub fn phone_number(mut self, value: String) -> Self {
        self.fields.phone_number = Some(value);
        self
    }

    pub fn details(mut self, value: String) -> Self {
        self.fields.details = Some(value);
        self
    }

    pub fn execute(self, connection: &mut SqliteConnection) -> QueryResult<models::Person> {
        let person_id: i32 = diesel::insert_into(people::table)
            .values(self.fields)
            .returning(people::id)
            .get_result(connection)?;

        people::table
            .filter(people::id.eq(person_id))
            .get_result::<models::Person>(connection)
    }
}
