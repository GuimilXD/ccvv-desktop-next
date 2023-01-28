use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models;
use crate::schema::modalities;

#[derive(Debug, Clone, Deserialize)]
pub struct FilterModalities {
    pub name: Option<String>,
}

impl Default for FilterModalities {
    fn default() -> Self {
        Self { name: None }
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct ListModalitiesCriteria {
    pub page: i64,
    pub per_page: i64,
    pub filter: Option<FilterModalities>,
}

impl Default for ListModalitiesCriteria {
    fn default() -> Self {
        Self {
            page: 1,
            per_page: 5,
            filter: Some(FilterModalities::default()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ListModalitiesResultWithTotalCount {
    pub modalities: Vec<models::Modality>,
    pub total_count: i64,
}

pub fn get_modalities(
    connection: &mut SqliteConnection,
    criteria: &ListModalitiesCriteria,
) -> QueryResult<ListModalitiesResultWithTotalCount> {
    let mut modality_query = modalities::table.into_boxed();
    let mut total_count_query = modalities::table.into_boxed();

    // TODO: Remove code repetition for filtering. Maybe using macros
    if let Some(filter) = &criteria.filter {
        if let Some(first_name) = &filter.name {
            modality_query = modality_query.filter(modalities::name.like(first_name));
            total_count_query = total_count_query.filter(modalities::name.like(first_name));
        }
    }

    let total_count = total_count_query.count().get_result::<i64>(connection)?;

    let modalities = modality_query
        .limit(criteria.per_page)
        .offset(criteria.per_page * (criteria.page - 1))
        .load::<models::Modality>(connection)?;

    Ok(ListModalitiesResultWithTotalCount {
        modalities,
        total_count,
    })
}

pub fn get_modality_by_id(
    connection: &mut SqliteConnection,
    id: i32,
) -> QueryResult<models::Modality> {
    modalities::dsl::modalities
        .filter(modalities::dsl::id.eq(id))
        .get_result::<models::Modality>(connection)
}

pub fn create_modality(
    connection: &mut SqliteConnection,
    new_modality: models::NewModality,
) -> QueryResult<usize> {
    diesel::insert_into(modalities::table)
        .values(&new_modality)
        .execute(connection)
}

pub fn delete_modality(connection: &mut SqliteConnection, id: i32) -> QueryResult<usize> {
    diesel::delete(modalities::table.filter(modalities::dsl::id.eq(id))).execute(connection)
}

pub fn update_modality(
    connection: &mut SqliteConnection,
    id: i32,
    updated_post: models::Modality,
) -> QueryResult<usize> {
    diesel::update(modalities::table.filter(modalities::dsl::id.eq(id)))
        .set(updated_post)
        .execute(connection)
}
#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::fixtures::ModalityFixture;
    use crate::database;
    use crate::schema::modalities;

    macro_rules! get_modality_by_filter {
        ($connection:ident, $filter:expr) => {
            modalities::table
                .filter($filter)
                .get_result::<models::Modality>($connection)
        };
    }

    #[test]
    fn create_modality_inserts_modality_using_specified_fields() {
        let connection = &mut database::establish_test_database_connection();

        assert!(create_modality(
            connection,
            models::NewModality {
                name: "Jiu-Jitsu".to_string(),
                description: Some("Jiu-Jitsu classes for people under 18".to_string()),
            },
        )
        .is_ok());

        let modality = get_modality_by_filter!(connection, modalities::dsl::name.eq("Jiu-Jitsu"))
            .expect("Coult not find created modality in table");

        assert_eq!(modality.name, "Jiu-Jitsu");
        assert_eq!(
            modality.description,
            Some("Jiu-Jitsu classes for people under 18".to_string())
        );
    }

    #[test]
    fn get_modality_by_id_selects_modality_where_id_matches() {
        let connection = &mut database::establish_test_database_connection();

        let modality = ModalityFixture::new()
            .name("Piano Class".to_string())
            .description("Piano classes for kids".to_string())
            .execute(connection)
            .expect("Could not create new modality");

        assert_eq!(modality.name, "Piano Class");
        assert_eq!(
            modality.description,
            Some("Piano classes for kids".to_string())
        );
    }

    #[test]
    fn get_modalities_selects_all_modalities_with_pagination_and_filtering() {
        let connection = &mut database::establish_test_database_connection();

        let total_modalities_count = 10;

        for i in 1..=total_modalities_count {
            ModalityFixture::new()
                .name(if i % 2 == 0 {
                    "Even".to_string()
                } else {
                    "Odd".to_string()
                })
                .execute(connection)
                .expect("Could not create modalities");
        }

        let number_of_pages = 2;
        let modalities_per_page = total_modalities_count / number_of_pages;

        let criteria = ListModalitiesCriteria {
            page: number_of_pages,
            per_page: modalities_per_page,
            filter: Some(FilterModalities::default()),
        };

        let ListModalitiesResultWithTotalCount {
            modalities,
            total_count,
        } = get_modalities(connection, &criteria).expect("Could not list all modalities");

        assert_eq!(modalities.len() as i64, modalities_per_page);
        assert_eq!(total_count, total_modalities_count);

        let criteria = ListModalitiesCriteria {
            filter: Some(FilterModalities {
                name: Some("Odd".to_string()),
                ..FilterModalities::default()
            }),
            ..ListModalitiesCriteria::default()
        };

        let ListModalitiesResultWithTotalCount {
            modalities,
            total_count,
        } = get_modalities(connection, &criteria).expect("Could not list all modalities");

        modalities.iter().for_each(|modality| {
            assert_eq!(modality.name, "Odd");
        });

        assert_eq!(total_count, total_modalities_count / 2)
    }

    #[test]
    fn delete_modality_deletes_modality_with_matching_id() {
        let connection = &mut database::establish_test_database_connection();

        ModalityFixture::new()
            .execute(connection)
            .expect("Could not create modality");

        delete_modality(connection, 1).expect("Could not delete modality with id 1");

        assert!(modalities::table
            .filter(modalities::dsl::id.eq(1))
            .get_result::<models::Modality>(connection)
            .is_err());
    }

    #[test]
    fn update_modality_updates_modality_with_matching_id() {
        let connection = &mut database::establish_test_database_connection();

        let modality = ModalityFixture::new()
            .execute(connection)
            .expect("Could not create modality");

        let update_fields = models::Modality {
            id: 10,
            name: "IWas".to_string(),
            description: Some("JustUpdated".to_string()),
            ..modality
        };

        update_modality(connection, 1, update_fields.clone())
            .expect("Could not delete modality with id 1");

        let updated_modality =
            get_modality_by_filter!(connection, modalities::dsl::id.eq(modality.id))
                .expect("Could not get modality");

        // modality.id should not be updateable
        assert_eq!(updated_modality.id, modality.id);
        assert_ne!(updated_modality.id, update_fields.id);

        assert_eq!(updated_modality.name, update_fields.name);
        assert_eq!(updated_modality.description, update_fields.description);
    }
}
