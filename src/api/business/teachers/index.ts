// packages
import { Router } from 'express';

// scripts
import utils from '../utils';
import teacherControllers from './teachers.controller';

// constants
const { validators } = utils;
const teachers = Router();

// validators
const signupRequiredFieldsValidator = validators.validateRequestSchema(['name', 'lastname', 'password', 'email']);
const loginRequiredFieldsValidator = validators.validateRequestSchema(['password', 'email']);

// routes
teachers.post('/api/v1/signup', signupRequiredFieldsValidator, teacherControllers.signupUser);
teachers.post('/api/v1/login', loginRequiredFieldsValidator, teacherControllers.login);

export default teachers;
