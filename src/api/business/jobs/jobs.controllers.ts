// packages
import { Request, Response } from 'express';
// scripts
import { Job, Types } from '../types';
import AppInterface from '../../app';
import buildJobService from './jobs.service';
import codes from '../utils/httpCodes';
import tokenService from '../utils/token';

const jobService = buildJobService({ database: AppInterface.database });

async function getJobOpportunities(_: Request, res: Response): Promise<void> {
  try {
    const opportunities: Job[] = await jobService.getJobOpportunities();
    res.status(codes.OK_REQUEST).send({ message: 'Convocatorias conseguidas', data: { opportunities } });
  } catch (error) {
    res.status(codes.SERVER_ERROR).send({ message: `Error consiguiendo convocatorias: ${error.message}` });
  }
}

async function getJobsTypes(_: Request, res: Response): Promise<void> {
  try {
    const types: Types[] = await jobService.getJobTypes();
    res.status(codes.OK_REQUEST).send({ message: 'Tipos de trabajo conseguidos', data: { types } });
  } catch (error) {
    res.status(codes.SERVER_ERROR).send({ message: `Error consiguiendo tipos: ${error.message}` });
  }
}

async function createNewJobOpportunity(req: Request, res: Response): Promise<void> {
  try {
    const incommingJobOpportunity: Job = req.body;
    const user = tokenService.getUserFromToken(req.headers.authorization as string);

    const newStoredOpportunity = await jobService.createNewJob(incommingJobOpportunity, user);

    res.status(codes.CREATED).send({ message: 'Convocatoria creada', data: { job: newStoredOpportunity } });
  } catch (error) {
    res.status(codes.SERVER_ERROR).send({ message: `Error creando convocatoria ${error.message}` });
  }
}

const jobsController = {
  getJobOpportunities,
  createNewJobOpportunity,
  getJobsTypes,
};

export default jobsController;
