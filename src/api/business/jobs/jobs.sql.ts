const JOBS_SQL_QUERIES = {
  getJobsOpportunities: `SELECT id, name, description, begin_date, final_date, is_close, open_teacher_id, job_type_id FROM jobs WHERE is_close=false ORDER BY id DESC`,
  createNewJobOpportunity: `
  INSERT INTO jobs(name, description, begin_date, final_date, open_teacher_id, job_type_id)
  VALUES($1, $2, $3, $4, $5, $6) RETURNING *
`,
  createNewJobProfile: `INSERT INTO profiles(name, description, job_id) VALUES($1, $2, $3) RETURNING *`,
  getJobsTypes: 'SELECT id, text FROM job_types',
};

export default JOBS_SQL_QUERIES;
