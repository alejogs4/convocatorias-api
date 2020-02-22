export interface HttpCodes {
  SERVER_ERROR: number;
  BAD_REQUEST: number;
  NOT_FOUND: number;
  OK_REQUEST: number;
  CREATED: number;
  UNAUTHORIZED_REQUEST: number;
}

const codes: HttpCodes = {
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  OK_REQUEST: 200,
  UNAUTHORIZED_REQUEST: 401,
  CREATED: 201,
};

export default codes;
