-- Your SQL goes here
CREATE TABLE modalities_people (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       person_id INTEGER NOT NULL,
       modality_id INTEGER NOT NULL,
       FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
       FOREIGN KEY (modality_id) REFERENCES modalities(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX person_modality_once on modalities_people(person_id, modality_id);
