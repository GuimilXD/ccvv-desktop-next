use diesel::prelude::*;
use serde::{Serialize, Deserialize};

use crate::schema::people;
use crate::schema::modalities;

#[derive(
    Debug, Clone, Queryable, QueryableByName, AsChangeset, Deserialize, Serialize, PartialEq,
)]
#[diesel(table_name = people)]
pub struct Person {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub details: Option<String>,
}

#[derive(Debug, Clone, Insertable, Deserialize)]
#[diesel(table_name = people)]
pub struct NewPerson {
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub details: Option<String>,
}

#[derive(
    Debug, Clone, Queryable, QueryableByName, AsChangeset, Deserialize, Serialize, PartialEq,
)]
#[diesel(table_name = modalities)]
pub struct Modality {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Insertable, Deserialize)]
#[diesel(table_name = modalities)]
pub struct NewModality {
    pub name: String,
    pub description: Option<String>,
}
