// packages
import { Request, Response, NextFunction, RequestHandler } from 'express';

// scripts
import codes from './httpCodes';

// types
export interface Validators {
  validateRequestSchema(requiredFields: string[]): RequestHandler;
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

export default { validateRequestSchema } as Validators;
