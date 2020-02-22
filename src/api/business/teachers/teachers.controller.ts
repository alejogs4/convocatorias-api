// packages
import { Request, Response } from 'express';

// scripts
import utils from '../utils';
import buildTeacherService, { User } from './teachers.service';
import AppInterface from '../../app';

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

const teacherControllers = {
  signupUser,
  login,
};

export default teacherControllers;
