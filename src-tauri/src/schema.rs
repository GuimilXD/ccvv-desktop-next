// @generated automatically by Diesel CLI.

diesel::table! {
    classes (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
    }
}

diesel::table! {
    classes_students (id) {
        id -> Nullable<Integer>,
        student_id -> Integer,
        class_id -> Integer,
    }
}

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

diesel::table! {
    subjects (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
        class_id -> Integer,
    }
}

diesel::table! {
    subjects_teachers (id) {
        id -> Nullable<Integer>,
        teacher_id -> Integer,
        subject_id -> Integer,
    }
}

diesel::joinable!(classes_students -> classes (class_id));
diesel::joinable!(classes_students -> people (student_id));
diesel::joinable!(modalities_people -> modalities (modality_id));
diesel::joinable!(modalities_people -> people (person_id));
diesel::joinable!(subjects -> classes (class_id));
diesel::joinable!(subjects_teachers -> people (teacher_id));
diesel::joinable!(subjects_teachers -> subjects (subject_id));

diesel::allow_tables_to_appear_in_same_query!(
    classes,
    classes_students,
    modalities,
    modalities_people,
    people,
    subjects,
    subjects_teachers,
);
