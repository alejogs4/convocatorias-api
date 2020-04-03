import { Pool } from 'pg';
import { Job, User, Profile, Types, JobCandidate, Requirements, Stages } from '../types';
import JOBS_SQL_QUERIES from './jobs.sql';

interface JobService {
  createNewJob(job: Job, user: User): Promise<Job>;
  getJobOpportunities(): Promise<Job[]>;
  getJobTypes(): Promise<Types[]>;
  createNewJobCandidate(user: User, jobId: number, profiles: number[]): Promise<JobCandidate>;
  getJobOpportunity(id: number): Promise<Job>;
  getJobCandidates(jobId: number): Promise<Array<User>>;
}

interface JobServiceDependencies {
  database: Pool;
}

function buildJobService({ database }: JobServiceDependencies): JobService {
  return {
    async createNewJob(job: Job, user: User): Promise<Job> {
      const storedJob = await database.query<Job>(JOBS_SQL_QUERIES.createNewJobOpportunity, [
        job.name,
        job.description,
        job.begin_date,
        job.final_date,
        user.id,
        job.job_type_id,
        job.program,
      ]);

      const storedProfilesPromise = job.profiles.map(profile =>
        database.query<Profile>(JOBS_SQL_QUERIES.createNewJobProfile, [
          profile.name,
          profile.description,
          storedJob.rows[0].id,
          profile.area,
        ]),
      );

      const storedRequirementsPromise = job.requirements.map(requirement =>
        database.query<Requirements>(JOBS_SQL_QUERIES.createNewRequirement, [requirement.text, storedJob.rows[0].id]),
      );

      const storedStagesPromise = job.stages.map(stage =>
        database.query<Stages>(JOBS_SQL_QUERIES.createNewJobStage, [
          stage.text,
          stage.initial_date,
          stage.final_date,
          stage.stage_order,
          storedJob.rows[0].id,
        ]),
      );

      const storedProfiles = (await Promise.all(storedProfilesPromise)).map(insertion => insertion.rows[0]);
      const storedRequirement = (await Promise.all(storedRequirementsPromise)).map(insertion => insertion.rows[0]);
      const storedStages = (await Promise.all(storedStagesPromise)).map(insertion => insertion.rows[0]);

      return {
        ...storedJob.rows[0],
        profiles: storedProfiles,
        requirements: storedRequirement,
        stages: storedStages,
      } as Job;
    },
    async getJobOpportunities(): Promise<Job[]> {
      const jobs = (await database.query<Job>(JOBS_SQL_QUERIES.getJobsOpportunities)).rows;
      return jobs;
    },
    async getJobOpportunity(id: number): Promise<Job> {
      const job = (
        await database.query<Job>(
          `
      SELECT id, name, description, program, begin_date, final_date, is_close, open_teacher_id, job_type_id
      FROM jobs
      WHERE id=$1
      `,
          [id],
        )
      ).rows[0];

      if (!job) {
        throw new Error('No existe esta convocatoria');
      }

      const requirements = database.query<Requirements>('SELECT id, text, job_id FROM requirements WHERE job_id = $1', [
        job.id,
      ]);
      const profiles = database.query<Profile>(
        'SELECT id, name, description, job_id, area FROM profiles WHERE job_id = $1',
        [job.id],
      );
      const stages = database.query<Stages>(
        'SELECT id, text, initial_date, final_date, stage_order, job_id FROM stages WHERE job_id = $1 ORDER BY stage_order ASC',
        [job.id],
      );

      const results = await Promise.all([requirements, profiles, stages]);
      return {
        ...job,
        requirements: results[0].rows,
        profiles: results[1].rows,
        stages: results[2].rows,
      } as Job;
    },
    async getJobTypes(): Promise<Types[]> {
      const types = (await database.query(JOBS_SQL_QUERIES.getJobsTypes)).rows;
      return types;
    },
    async createNewJobCandidate(user: User, jobId: number, profiles: number[]): Promise<JobCandidate> {
      const score = 5; // TODO: Calculate real score based on UDEM requirements
      const jobCandidate = (
        await database.query<JobCandidate>(JOBS_SQL_QUERIES.createJobCandidate, [user.id, jobId, score])
      ).rows[0];

      await Promise.all(
        profiles.map(profileId =>
          database.query('INSERT INTO candidates_profiles(candidate_id, profile_id) VALUES($1, $2)', [
            jobCandidate.id,
            profileId,
          ]),
        ),
      );

      return jobCandidate;
    },
    async getJobCandidates(jobId: number): Promise<Array<User>> {
      const users = await database.query<User>(
        `
        SELECT
        u.id, u.name, u.lastname, u.email, u.is_boss, u.is_program, u.id
        FROM teachers u
        INNER JOIN candidates c
        ON c.teacher_id = u.id
        WHERE c.job_id = $1;
      `,
        [jobId],
      );
      return users.rows;
    },
  };
}

export default buildJobService;
