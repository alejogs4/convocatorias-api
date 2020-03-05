// packages
import { Request, Response } from 'express';

// scripts
import utils from '../utils';
import buildTeacherService from './teachers.service';
import AppInterface from '../../app';
import { Curriculum, User } from '../types';

// constants
const { httpCodes, tokenService } = utils;
const userService = buildTeacherService({ database: AppInterface.database });

// private functions
// TODO
// public functions
async function signupUser(req: Request, res: Response): Promise<void> {
  try {
    const incommingUser = req.body as User;
    const user = await userService.registerUser(incommingUser);
    delete user.password;

    res.status(httpCodes.CREATED).send({ message: 'User succesfully created', data: user });
  } catch (error) {
    res.status(httpCodes.SERVER_ERROR).send({ message: `Error in user signup ${error.message}` });
  }
}

async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await userService.loginUser(email, password);
    const token = tokenService.generateTokenFromUser(user);

    res.status(httpCodes.OK_REQUEST).send({ message: 'Succesful login', data: { user, token } });
  } catch (error) {
    res.status(httpCodes.SERVER_ERROR).send({ message: `Error in user signup ${error.message}` });
  }
}

async function createTeacherCurriculum(req: Request, res: Response): Promise<void> {
  try {
    const teacherCurriculum: Curriculum = req.body;
    const user: User = tokenService.getUserFromToken(req.headers.authorization as string);

    const storedCurriculum: Curriculum = await userService.registerTeacherCurriculum(teacherCurriculum, user);
    res.status(httpCodes.CREATED).send({ message: 'Hoja de vida guardada', data: { curriculum: storedCurriculum } });
  } catch (error) {
    res.status(httpCodes.SERVER_ERROR).send({ message: 'Error registrando hoja de vida' + ' ' + error.message });
  }
}

const teacherControllers = {
  signupUser,
  login,
  createTeacherCurriculum,
};

export default teacherControllers;
