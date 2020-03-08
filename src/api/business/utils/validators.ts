// packages
import { Request, Response, NextFunction, RequestHandler } from 'express';

// scripts
import codes from './httpCodes';
import { User } from '../types';
import tokenService from './token';

// types
export interface Validators {
  validateRequestSchema(requiredFields: string[]): RequestHandler;
  validateCurrentUserBePartProgram(req: Request, res: Response, next: NextFunction): void;
}

function validateRequestSchema(requiredFields: string[]): RequestHandler {
  return function executeSchemaValidation(req: Request, res: Response, next: NextFunction): void {
    const bodyFields: string[] = Object.keys(req.body);
    const allRequiredFieldArePresent = bodyFields.every(field => requiredFields.includes(field));

    if (!allRequiredFieldArePresent) {
      res.status(codes.BAD_REQUEST).send({ message: `Fields ${requiredFields.join(',')} are required` });
    } else {
      next();
    }
  };
}

function validateCurrentUserBePartProgram(req: Request, res: Response, next: NextFunction): void {
  const user: User = tokenService.getUserFromToken(req.headers.authorization as string);

  if (!user) {
    res.status(codes.UNAUTHORIZED_REQUEST).send({ message: 'El usuario no esta logueado en el sistema' });
    return;
  }

  if (!user.is_boss) {
    res
      .status(codes.UNAUTHORIZED_REQUEST)
      .send({ message: 'El usuario tiene que ser parte del programa para realizar esta accion' });

    return;
  }

  next();
}

export default { validateRequestSchema, validateCurrentUserBePartProgram } as Validators;
