// packages
import { Router } from 'express';

// scripts
import utils from '../utils';
import teacherControllers from './teachers.controller';

// constants
const { validators, tokenService } = utils;
const teachers = Router();

// validators
const signupRequiredFieldsValidator = validators.validateRequestSchema(['name', 'lastname', 'password', 'email']);
const loginRequiredFieldsValidator = validators.validateRequestSchema(['password', 'email']);
const curriculumRequiredFieldsValidator = validators.validateRequestSchema([
  'dni',
  'gender',
  'civil_status',
  'country',
  'birthday',
  'hometown',
  'personal_address',
  'home_phone',
  'cellphone_phone',
  'studies',
  'teaching_experiences',
]);

// routes
teachers.post('/api/v1/signup', signupRequiredFieldsValidator, teacherControllers.signupUser);
teachers.post('/api/v1/login', loginRequiredFieldsValidator, teacherControllers.login);
teachers.post(
  '/api/v1/curriculum',
  curriculumRequiredFieldsValidator,
  tokenService.validateToken,
  teacherControllers.createTeacherCurriculum,
);

export default teachers;
