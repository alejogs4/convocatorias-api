import { Pool } from 'pg';
import { Job, User, Profile, Types } from '../types';
import JOBS_SQL_QUERIES from './jobs.sql';

interface JobService {
  createNewJob(job: Job, user: User): Promise<Job>;
  getJobOpportunities(): Promise<Job[]>;
  getJobTypes(): Promise<Types[]>;
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
      ]);

      const storedProfilesPromise = job.profiles.map(profile =>
        database.query<Profile>(JOBS_SQL_QUERIES.createNewJobProfile, [
          profile.name,
          profile.description,
          storedJob.rows[0].id,
        ]),
      );

      const storedProfiles = (await Promise.all(storedProfilesPromise)).map(insertion => insertion.rows[0]);

      return { ...storedJob.rows[0], profiles: storedProfiles } as Job;
    },
    async getJobOpportunities(): Promise<Job[]> {
      const jobs = (await database.query<Job>(JOBS_SQL_QUERIES.getJobsOpportunities)).rows;
      return jobs;
    },
    async getJobTypes(): Promise<Types[]> {
      const types = (await database.query(JOBS_SQL_QUERIES.getJobsTypes)).rows;
      return types;
    },
  };
}

export default buildJobService;
