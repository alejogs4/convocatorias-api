CREATE TABLE teachers(
  id serial,
  name VARCHAR(70) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  password VARCHAR(300) NOT NULL,
  email VARCHAR(150) NOT NULL,
  is_boss BOOLEAN DEFAULT false,
  is_program BOOLEAN DEFAULT false,
  CONSTRAINT pk_teacher PRIMARY KEY(id),
  CONSTRAINT unq_teacher_email UNIQUE(email)
);

CREATE TABLE job_types(
  id serial,
  text VARCHAR(40) NOT NULL,
  CONSTRAINT pk_job_types PRIMARY KEY(id)
);

CREATE TABLE jobs(
  id serial,
  name VARCHAR(400) NOT NULL,
  description text NOT NULL,
  begin_date DATE NOT NULL,
  final_date DATE NOT NULL,
  is_close BOOLEAN DEFAULT false,
  open_teacher_id int,
  job_type_id int,
  CONSTRAINT pk_jobs PRIMARY KEY(id),
  CONSTRAINT fk_jobs_teachers FOREIGN KEY(open_teacher_id) REFERENCES teachers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_jobs_job_types FOREIGN KEY(job_type_id) REFERENCES job_types(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE profiles(
  id serial,
  name VARCHAR(400) NOT NULL,
  description text NOT NULL,
  job_id int,
  CONSTRAINT pk_profiles PRIMARY KEY(id),
  CONSTRAINT fk_profiles_jobs FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE requirements(
  id serial,
  text text NOT NULL,
  job_id int,
  CONSTRAINT pk_requirements PRIMARY KEY(id),
  CONSTRAINT fk_requirements_jobs FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE stages (
  id serial,
  text VARCHAR(200) NOT NULL,
  initial_date DATE NOT NULL,
  final_date DATE NOT NULL,
  stage_order SMALLINT NOT NULL,
  job_id int,
  CONSTRAINT pk_stages PRIMARY KEY(id),
  CONSTRAINT fk_stages_jobs FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT non_negative_order CHECK(stage_order > 0),
  CONSTRAINT non_repeated_stage UNIQUE(job_id, stage_order)
);

CREATE TABLE candidates(
  id serial,
  teacher_id int,
  job_id int,
  score int NOT NULL,
  CONSTRAINT pk_candidates PRIMARY KEY(id),
  CONSTRAINT fk_candidates_teachers FOREIGN KEY(teacher_id) REFERENCES teachers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_candidates_jobs FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT unq_teacher_job UNIQUE(teacher_id, job_id),
  CONSTRAINT zero_greather_score CHECK(score >= 0),
  CONSTRAINT five_lower_score CHECK(score <= 5)
);

CREATE TABLE candidates_profiles(
  id serial,
  candidate_id integer,
  profile_id integer,
  CONSTRAINT pk_candidates_profiles PRIMARY KEY(id),
  CONSTRAINT fk_candidates_profiles_candidates FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_candidates_profiles_profiles FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE curriculum(
  id serial,
  dni VARCHAR(40) NOT NULL,
  country VARCHAR(70) NOT NULL,
  gender CHAR(1) NOT NULL,
  birthday DATE NOT NULL,
  hometown VARCHAR(70) NOT NULL,
  civil_status VARCHAR(15) NOT NULL,
  personal_address VARCHAR(90) NOT NULL,
  home_phone VARCHAR(20),
  cellphone_phone VARCHAR(20),
  teacher_id INTEGER,
  CONSTRAINT pk_curriculum PRIMARY KEY(id),
  CONSTRAINT fk_curriculum_teachers FOREIGN KEY(teacher_id) REFERENCES teachers(id)
);

CREATE TABLE title_levels(
  id serial,
  text VARCHAR(200) NOT NULL,
  CONSTRAINT pk_title_levels PRIMARY KEY(id)
);

CREATE TABLE studies(
  id serial,
  degree VARCHAR(200) NOT NULL,
  degree_topic VARCHAR(200) NOT NULL,
  begin_date DATE NOT NULL,
  final_date DATE NOT NULL,
  title_level_id INTEGER,
  curriculum_id INTEGER,
  CONSTRAINT pk_studies PRIMARY KEY(id),
  CONSTRAINT fk_studies_title_levels FOREIGN KEY(title_level_id) REFERENCES title_levels(id)
  ,
  CONSTRAINT fk_studies_curriculum FOREIGN KEY(curriculum_id) REFERENCES curriculum(id)
);

CREATE TABLE teaching_experiences(
  id serial,
  academic_program VARCHAR(200) NOT NULL,
  subjects VARCHAR(200) NOT NULL,
  organization VARCHAR(200) NOT NULL,
  begin_date DATE NOT NULL,
  final_date DATE NOT NULL,
  curriculum_id INTEGER,
  CONSTRAINT pk_teaching_experiences PRIMARY KEY(id),
  CONSTRAINT fk_teaching_experiences_curriculum FOREIGN KEY(curriculum_id) REFERENCES curriculum(id)
);


ALTER TABLE studies DROP CONSTRAINT fk_studies_curriculum;
ALTER TABLE studies ADD CONSTRAINT fk_studies_curriculum FOREIGN KEY(curriculum_id) REFERENCES curriculum(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE studies DROP CONSTRAINT fk_studies_title_levels;
ALTER TABLE studies ADD CONSTRAINT fk_studies_title_levels FOREIGN KEY(title_level_id) REFERENCES title_levels(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE teaching_experiences DROP CONSTRAINT fk_teaching_experiences_curriculum;
ALTER TABLE teaching_experiences ADD CONSTRAINT fk_teaching_experiences_curriculum FOREIGN KEY(curriculum_id) REFERENCES curriculum(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE curriculum ADD CONSTRAINT uq_curriculum_user UNIQUE(teacher_id);
-- curriculum new fields
ALTER TABLE curriculum ADD COLUMN dni_type VARCHAR(30) NOT NULL DEFAULT 'Cedula';
ALTER TABLE curriculum ADD COLUMN professional_card VARCHAR(50) NOT NULL DEFAULT '';
ALTER TABLE curriculum ADD COLUMN military_card VARCHAR(50) NOT NULL DEFAULT '';


ALTER TABLE jobs ADD COLUMN program VARCHAR(150) NOT NULL DEFAULT 'Ingenieria de sistemas';
ALTER TABLE profiles ADD COLUMN area VARCHAR(150) NOT NULL DEFAULT 'Ingenieria de software';