// types
export interface User {
  name: string;
  lastname: string;
  password: string;
  email: string;
  is_boss?: boolean;
  is_program?: boolean;
  id: number;
}

export interface UpdateUser {
  name: string;
  email: string;
  lastname: string;
  password: string;
  oldPassword: string;
}
