use diesel::prelude::*;
use diesel::{QueryResult, SqliteConnection};

use crate::models;
use crate::schema::modalities;

pub struct ModalityFixture {
    fields: models::NewModality,
}

impl Default for ModalityFixture {
    fn default() -> Self {
        Self {
            fields: models::NewModality {
                name: "Default".to_string(),
                description: None,
            },
        }
    }
}

impl ModalityFixture {
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

    pub fn execute(self, connection: &mut SqliteConnection) -> QueryResult<models::Modality> {
        let modality_id: i32 = diesel::insert_into(modalities::table)
            .values(self.fields)
            .returning(modalities::id)
            .get_result(connection)?;

        modalities::table
            .filter(modalities::id.eq(modality_id))
            .get_result::<models::Modality>(connection)
    }
}
