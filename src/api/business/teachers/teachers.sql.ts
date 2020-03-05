const TEACHER_SQL_QUERIES = {
  signupTeacher: 'INSERT INTO teachers(name, lastname, password, email) VALUES($1, $2, $3, $4) returning *',
  loginTeacher: 'SELECT id, name, lastname, email, is_boss, is_program FROM teachers WHERE email=$1 AND password=$2',
  addCurriculum: `INSERT INTO curriculum(dni, country, gender, birthday, hometown, civil_status, personal_address, home_phone, cellphone_phone, teacher_id)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *
  `,
  addTeacherStudies: `INSERT INTO studies(degree, degree_topic, begin_date, final_date, title_level_id, curriculum_id)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *
  `,
  addTeacherExperience: `INSERT INTO teaching_experiences(academic_program, subjects, organization, begin_date, final_date, curriculum_id)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *
 `,
};

export default TEACHER_SQL_QUERIES;
