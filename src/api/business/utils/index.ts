// scripts
import codes, { HttpCodes } from './httpCodes';
import validators, { Validators } from './validators';
import tokenService, { TokenService } from './token';

// types
interface Utils {
  httpCodes: HttpCodes;
  validators: Validators;
  tokenService: TokenService;
}

const utils: Utils = {
  httpCodes: codes,
  validators: validators,
  tokenService,
};

export default utils;
