// @generated automatically by Diesel CLI.

diesel::table! {
    modalities (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
    }
}

diesel::table! {
    people (id) {
        id -> Integer,
        first_name -> Text,
        last_name -> Text,
        email -> Nullable<Text>,
        phone_number -> Nullable<Text>,
        details -> Nullable<Text>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(modalities, people,);
