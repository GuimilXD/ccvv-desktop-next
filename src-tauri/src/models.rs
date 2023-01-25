use diesel::prelude::*;
use serde::Serialize;

use crate::schema::people;

#[derive(Debug, Clone, Queryable, QueryableByName, AsChangeset, Serialize, PartialEq)]
#[diesel(table_name = people)]
pub struct Person {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub details: Option<String>,
}

#[derive(Debug, Clone, Insertable)]
#[diesel(table_name = people)]
pub struct NewPerson {
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub details: Option<String>,
}
