// packages
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import codes from './httpCodes';
import { User } from '../types';

// types
export interface TokenService {
  generateTokenFromUser(payload: object): string;
  validateToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserFromToken(token: string): User;
}

// utils
function isTheUserLogged(token: string): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    jwt.verify(token, process.env.TOKEN_SECRET_KEY as string, error => {
      resolve(error ? false : true);
    });
  });
}

function generateTokenFromUser(payload: object): string {
  return jwt.sign(payload, process.env.TOKEN_SECRET_KEY as string, { expiresIn: '7days' });
}

async function validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { authorization: token } = req.headers;

  if (!token) {
    res.status(codes.BAD_REQUEST).send({ message: 'Error leyendo el token, asegurese de haberlo enviado' });
    return;
  }

  const logged = await isTheUserLogged(token);

  if (!logged) {
    res.status(codes.UNAUTHORIZED_REQUEST).send({ message: 'El usuario no esta logueado en el sistema' });
    return;
  }

  next();
}

function getUserFromToken(token: string): User {
  return jwt.decode(token) as User;
}

const tokenService: TokenService = { generateTokenFromUser, validateToken, getUserFromToken };

export default tokenService;
