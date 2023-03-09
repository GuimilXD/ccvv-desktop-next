CREATE TABLE subjects_teachers (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       teacher_id INTEGER NOT NULL,
       subject_id INTEGER NOT NULL,
       FOREIGN KEY (teacher_id) REFERENCES people(id) ON DELETE CASCADE,
       FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX subject_teacher_once on subjects_teachers(teacher_id, subject_id);
