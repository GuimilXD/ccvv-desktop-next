CREATE TABLE subjects (
       id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       description TEXT,
       class_id INTEGER NOT NULL,
       FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE ON UPDATE CASCADE
);
