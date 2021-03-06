// packages
import { Router } from 'express';

// scripts
import jobsController from './jobs.controllers';
import utils from '../utils';

// constants
const jobs = Router();
const { tokenService, validators } = utils;

const jobValidator = validators.validateRequestSchema([
  'name',
  'program',
  'requirements',
  'stages',
  'description',
  'begin_date',
  'final_date',
  'profiles',
  'job_type_id',
]);

const candidateJobValidator = validators.validateRequestSchema(['job_id', 'profiles']);

jobs.get('/api/v1/jobs', jobsController.getJobOpportunities);
jobs.get('/api/v1/jobs/types', jobsController.getJobsTypes);
jobs.get('/api/v1/job/:id', jobsController.getJobOpportunity);
jobs.get(
  '/api/v1/job/candidates/:job',
  tokenService.validateToken,
  validators.validateCurrentUserBePartProgram,
  jobsController.getJobCandidates,
);
jobs.post(
  '/api/v1/job',
  jobValidator,
  tokenService.validateToken,
  validators.validateCurrentUserBePartProgram,
  jobsController.createNewJobOpportunity,
);
jobs.post('/api/v1/job/candidate', candidateJobValidator, tokenService.validateToken, jobsController.applyToAJob);

export default jobs;
