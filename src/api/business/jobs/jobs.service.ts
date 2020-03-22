import { Pool } from 'pg';
import { Job, User, Profile, Types, JobCandidate, Requirements, Stages } from '../types';
import JOBS_SQL_QUERIES from './jobs.sql';

interface JobService {
  createNewJob(job: Job, user: User): Promise<Job>;
  getJobOpportunities(): Promise<Job[]>;
  getJobTypes(): Promise<Types[]>;
  createNewJobCandidate(user: User, jobId: number): Promise<JobCandidate>;
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
    async getJobTypes(): Promise<Types[]> {
      const types = (await database.query(JOBS_SQL_QUERIES.getJobsTypes)).rows;
      return types;
    },
    async createNewJobCandidate(user: User, jobId: number): Promise<JobCandidate> {
      const score = 5; // TODO: Calculate real score based on UDEM requirements
      const jobCandidate = (
        await database.query<JobCandidate>(JOBS_SQL_QUERIES.createJobCandidate, [user.id, jobId, score])
      ).rows[0];

      return jobCandidate;
    },
  };
}

export default buildJobService;
