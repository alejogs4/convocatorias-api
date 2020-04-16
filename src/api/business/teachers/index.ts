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
  'dni_type',
  'professional_card',
  'military_card',
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

teachers.get('/api/v1/teacher/curriculum', tokenService.validateToken, teacherControllers.getTeacherCurriculum);
teachers.get('/api/v1/teacher/levels', teacherControllers.getTeacherLevels);
teachers.get(
  '/api/v1/candidates/:id/curriculum',
  tokenService.validateToken,
  validators.validateCurrentUserBePartProgram,
  teacherControllers.getTeacherCurriculumById,
);

export default teachers;
