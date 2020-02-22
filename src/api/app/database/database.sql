CREATE TABLE teachers(
  id serial,
  name VARCHAR(70) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  password VARCHAR(300) NOT NULL,
  email VARCHAR(150) NOT NULL,
  is_boss BOOLEAN DEFAULT 0,
  is_program BOOLEAN DEFAULT 0,
  CONSTRAINT pk_teacher PRIMARY KEY(id),
  CONSTRAINT unq_teacher_email UNIQUE(email)
);

CREATE TABLE jobs(
  id serial,
  open_teacher_id int,
  title VARCHAR(400) NOT NULL,
  description text NOT NULL,
  limit_date DATE NOT NULL,
  is_open BOOLEAN DEFAULT 1,
  CONSTRAINT pk_jobs PRIMARY KEY(id),
  CONSTRAINT fk_jobs_teachers FOREIGN KEY(open_teacher_id) REFERENCES teachers(id)
)

CREATE TABLE candidates(
  id serial,
  teacher_id int,
  job_id int,
  score int NOT NULL,
  CONSTRAINT pk_candidates PRIMARY KEY(id),
  CONSTRAINT fk_candidates_teachers FOREIGN KEY(teacher_id) REFERENCES teachers(id),
  CONSTRAINT fk_candidates_jobs FOREIGN KEY(job_id) REFERENCES jobs(id),
  CONSTRAINT unq_teacher_job UNIQUE(teacher_id, job_id),
  CONSTRAINT zero_greather_score CHECK(score >= 0),
  CONSTRAINT five_lower_score CHECK(score <= 5)
);