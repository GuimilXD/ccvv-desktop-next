// @generated automatically by Diesel CLI.

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
