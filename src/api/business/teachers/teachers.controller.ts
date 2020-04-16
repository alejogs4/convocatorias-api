// packages
import { Request, Response } from 'express';

// scripts
import utils from '../utils';
import buildTeacherService from './teachers.service';
import AppInterface from '../../app';
import { Curriculum, User, Levels } from '../types';

// constants
const { httpCodes, tokenService } = utils;
const userService = buildTeacherService({ database: AppInterface.database });

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
    res.status(httpCodes.SERVER_ERROR).send({ message: `Error registrando hoja de vida ${error.message}` });
  }
}

async function getTeacherCurriculum(req: Request, res: Response): Promise<void> {
  try {
    const user: User = tokenService.getUserFromToken(req.headers.authorization as string);
    const curriculum: Curriculum = await userService.getTeacherCurriculum(user);

    res.status(httpCodes.OK_REQUEST).send({ message: 'Hoja de vida conseguida', data: { curriculum } });
  } catch (error) {
    res.status(httpCodes.SERVER_ERROR).send({ message: `Error consiguiendo hoja de vida ${error.message}` });
  }
}

async function getTeacherCurriculumById(req: Request, res: Response): Promise<void> {
  try {
    const user: User = await userService.getTeacherById(Number(req.params.id));
    const curriculum: Curriculum = await userService.getTeacherCurriculum(user);
    res.status(httpCodes.OK_REQUEST).send({ message: 'Hoja de vida conseguida', data: { curriculum } });
  } catch (error) {
    res.status(httpCodes.SERVER_ERROR).send({ message: `Error consiguiendo hoja de vida ${error.message}` });
  }
}

async function getTeacherLevels(_: Request, res: Response): Promise<void> {
  try {
    const levels: Levels[] = await userService.getTeacherLevels();
    res.status(httpCodes.OK_REQUEST).send({ message: `Niveles conseguidos`, data: { levels } });
  } catch (error) {
    res.status(httpCodes.SERVER_ERROR).send({ message: `Error consiguiendo los niveles ${error.message}` });
  }
}

const teacherControllers = {
  signupUser,
  login,
  createTeacherCurriculum,
  getTeacherCurriculum,
  getTeacherLevels,
  getTeacherCurriculumById,
};

export default teacherControllers;
