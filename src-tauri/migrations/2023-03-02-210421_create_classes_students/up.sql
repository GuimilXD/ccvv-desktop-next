CREATE TABLE classes_students (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       student_id INTEGER NOT NULL,
       class_id INTEGER NOT NULL,
       FOREIGN KEY (student_id) REFERENCES people(id) ON DELETE CASCADE,
       FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX student_class_role_once on classes_students(student_id, class_id);
