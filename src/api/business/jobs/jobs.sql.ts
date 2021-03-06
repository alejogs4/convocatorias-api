const JOBS_SQL_QUERIES = {
  getJobsOpportunities: `SELECT id, name, description, begin_date, final_date, is_close, open_teacher_id, job_type_id FROM jobs WHERE is_close=false ORDER BY id DESC`,
  createNewJobOpportunity: `
  INSERT INTO jobs(name, description, begin_date, final_date, open_teacher_id, job_type_id, program)
  VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
`,
  createNewJobProfile: `INSERT INTO profiles(name, description, job_id, area) VALUES($1, $2, $3, $4) RETURNING *`,
  createNewRequirement: `INSERT INTO requirements(text, job_id) VALUES($1, $2) RETURNING *`,
  createNewJobStage: `INSERT INTO stages(text, initial_date, final_date, stage_order, job_id) VALUES($1, $2, $3, $4, $5) RETURNING *`,
  getJobsTypes: 'SELECT id, text FROM job_types',
  createJobCandidate: `
  INSERT INTO candidates(teacher_id, job_id, score) VALUES($1, $2, $3) RETURNING *
`,
};

export default JOBS_SQL_QUERIES;
