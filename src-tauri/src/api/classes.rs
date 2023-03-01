use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models;
use crate::schema::classes;

#[derive(Debug, Clone, Deserialize)]
pub struct FilterClasses {
    pub name: Option<String>,
}

impl Default for FilterClasses {
    fn default() -> Self {
        Self { name: None }
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct ListClassesCriteria {
    pub page: i64,
    pub per_page: i64,
    pub filter: Option<FilterClasses>,
}

impl Default for ListClassesCriteria {
    fn default() -> Self {
        Self {
            page: 1,
            per_page: 5,
            filter: Some(FilterClasses::default()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListClassesResultWithTotalCount {
    pub classes: Vec<models::Class>,
    pub total_count: i64,
}

pub fn get_classes(
    connection: &mut SqliteConnection,
    criteria: &ListClassesCriteria,
) -> QueryResult<ListClassesResultWithTotalCount> {
    let mut class_query = classes::table.into_boxed();
    let mut total_count_query = classes::table.into_boxed();

    // TODO: Remove code repetition for filtering. Maybe using macros
    if let Some(filter) = &criteria.filter {
        if let Some(first_name) = &filter.name {
            class_query = class_query.filter(classes::name.like(first_name));
            total_count_query = total_count_query.filter(classes::name.like(first_name));
        }
    }

    let total_count = total_count_query.count().get_result::<i64>(connection)?;

    let classes = class_query
        .limit(criteria.per_page)
        .offset(criteria.per_page * (criteria.page - 1))
        .load::<models::Class>(connection)?;

    Ok(ListClassesResultWithTotalCount {
        classes,
        total_count,
    })
}

pub fn get_class_by_id(connection: &mut SqliteConnection, id: i32) -> QueryResult<models::Class> {
    classes::dsl::classes
        .filter(classes::dsl::id.eq(id))
        .get_result::<models::Class>(connection)
}

pub fn create_class(
    connection: &mut SqliteConnection,
    new_class: models::NewClass,
) -> QueryResult<usize> {
    diesel::insert_into(classes::table)
        .values(&new_class)
        .execute(connection)
}

pub fn delete_class(connection: &mut SqliteConnection, id: i32) -> QueryResult<usize> {
    diesel::delete(classes::table.filter(classes::dsl::id.eq(id))).execute(connection)
}

pub fn update_class(
    connection: &mut SqliteConnection,
    id: i32,
    updated_post: models::Class,
) -> QueryResult<usize> {
    diesel::update(classes::table.filter(classes::dsl::id.eq(id)))
        .set(updated_post)
        .execute(connection)
}
#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::fixtures::ClassFixture;
    use crate::database;
    use crate::schema::classes;

    macro_rules! get_class_by_filter {
        ($connection:ident, $filter:expr) => {
            classes::table
                .filter($filter)
                .get_result::<models::Class>($connection)
        };
    }

    #[test]
    fn create_class_inserts_class_using_specified_fields() {
        let connection = &mut database::establish_test_database_connection();

        assert!(create_class(
            connection,
            models::NewClass {
                name: "Jiu-Jitsu".to_string(),
                description: Some("Jiu-Jitsu classes for people under 18".to_string()),
            },
        )
        .is_ok());

        let class = get_class_by_filter!(connection, classes::dsl::name.eq("Jiu-Jitsu"))
            .expect("Coult not find created class in table");

        assert_eq!(class.name, "Jiu-Jitsu");
        assert_eq!(
            class.description,
            Some("Jiu-Jitsu classes for people under 18".to_string())
        );
    }

    #[test]
    fn get_class_by_id_selects_class_where_id_matches() {
        let connection = &mut database::establish_test_database_connection();

        let class = ClassFixture::new()
            .name("Piano Class".to_string())
            .description("Piano classes for kids".to_string())
            .execute(connection)
            .expect("Could not create new class");

        assert_eq!(class.name, "Piano Class");
        assert_eq!(
            class.description,
            Some("Piano classes for kids".to_string())
        );
    }

    #[test]
    fn get_classes_selects_all_classes_with_pagination_and_filtering() {
        let connection = &mut database::establish_test_database_connection();

        let total_classes_count = 10;

        for i in 1..=total_classes_count {
            ClassFixture::new()
                .name(if i % 2 == 0 {
                    "Even".to_string()
                } else {
                    "Odd".to_string()
                })
                .execute(connection)
                .expect("Could not create classes");
        }

        let number_of_pages = 2;
        let classes_per_page = total_classes_count / number_of_pages;

        let criteria = ListClassesCriteria {
            page: number_of_pages,
            per_page: classes_per_page,
            filter: Some(FilterClasses::default()),
        };

        let ListClassesResultWithTotalCount {
            classes,
            total_count,
        } = get_classes(connection, &criteria).expect("Could not list all classes");

        assert_eq!(classes.len() as i64, classes_per_page);
        assert_eq!(total_count, total_classes_count);

        let criteria = ListClassesCriteria {
            filter: Some(FilterClasses {
                name: Some("Odd".to_string()),
                ..FilterClasses::default()
            }),
            ..ListClassesCriteria::default()
        };

        let ListClassesResultWithTotalCount {
            classes,
            total_count,
        } = get_classes(connection, &criteria).expect("Could not list all classes");

        classes.iter().for_each(|class| {
            assert_eq!(class.name, "Odd");
        });

        assert_eq!(total_count, total_classes_count / 2)
    }

    #[test]
    fn delete_class_deletes_class_with_matching_id() {
        let connection = &mut database::establish_test_database_connection();

        ClassFixture::new()
            .execute(connection)
            .expect("Could not create class");

        delete_class(connection, 1).expect("Could not delete class with id 1");

        assert!(classes::table
            .filter(classes::dsl::id.eq(1))
            .get_result::<models::Class>(connection)
            .is_err());
    }

    #[test]
    fn update_class_updates_class_with_matching_id() {
        let connection = &mut database::establish_test_database_connection();

        let class = ClassFixture::new()
            .execute(connection)
            .expect("Could not create class");

        let update_fields = models::Class {
            id: 10,
            name: "IWas".to_string(),
            description: Some("JustUpdated".to_string()),
            ..class
        };

        update_class(connection, 1, update_fields.clone())
            .expect("Could not delete class with id 1");

        let updated_class = get_class_by_filter!(connection, classes::dsl::id.eq(class.id))
            .expect("Could not get class");

        // class.id should not be updateable
        assert_eq!(updated_class.id, class.id);
        assert_ne!(updated_class.id, update_fields.id);

        assert_eq!(updated_class.name, update_fields.name);
        assert_eq!(updated_class.description, update_fields.description);
    }
}
