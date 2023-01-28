// @generated automatically by Diesel CLI.

diesel::table! {
    modalities (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
    }
}

diesel::table! {
    modalities_people (id) {
        id -> Nullable<Integer>,
        person_id -> Integer,
        modality_id -> Integer,
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

diesel::joinable!(modalities_people -> modalities (modality_id));
diesel::joinable!(modalities_people -> people (person_id));

diesel::allow_tables_to_appear_in_same_query!(
    modalities,
    modalities_people,
    people,
);
