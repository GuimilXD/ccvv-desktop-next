use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::schema::{
    classes, classes_students, modalities, modalities_people, people, subjects, subjects_teachers,
};

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

#[derive(Debug, Clone, Insertable, Deserialize)]
#[diesel(table_name = modalities_people)]
pub struct NewPersonModality {
    pub modality_id: i32,
    pub person_id: i32,
}

#[derive(
    Debug,
    Clone,
    Queryable,
    QueryableByName,
    AsChangeset,
    Deserialize,
    Serialize,
    PartialEq,
    Identifiable,
)]
#[diesel(table_name = classes)]
pub struct Class {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Insertable, Deserialize)]
#[diesel(table_name = classes)]
pub struct NewClass {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Insertable, Deserialize)]
#[diesel(table_name = classes_students)]
pub struct NewStudentClass {
    pub class_id: i32,
    pub student_id: i32,
}

#[derive(
    Debug,
    Clone,
    Queryable,
    QueryableByName,
    AsChangeset,
    Deserialize,
    Serialize,
    PartialEq,
    Identifiable,
    Associations,
)]
#[diesel(table_name = subjects)]
#[diesel(belongs_to(Class))]
pub struct Subject {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub class_id: i32,
}

#[derive(Debug, Clone, Insertable, Deserialize)]
#[diesel(table_name = subjects)]
pub struct NewSubject {
    pub name: String,
    pub description: Option<String>,
    pub class_id: i32,
}

#[derive(Debug, Clone, Insertable, Deserialize)]
#[diesel(table_name = subjects_teachers)]
pub struct NewTeacherSubject {
    pub subject_id: i32,
    pub teacher_id: i32,
}
