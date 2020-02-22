// packages
import { Pool } from 'pg';
import crypto from 'crypto';

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

interface TeacherServiceDependencies {
  database: Pool;
}

interface TeacherService {
  registerUser(incommingUser: User): Promise<User>;
  loginUser(email: string, password: string): Promise<User>;
}

function buildTeacherService(dependencies: TeacherServiceDependencies): TeacherService {
  return {
    async registerUser(incommingUser): Promise<User> {
      const userClone = { ...incommingUser };
      // Encode user password
      userClone.password = crypto.createHmac('sha256', userClone.password).digest('hex');
      // Insert user in database
      const user = await dependencies.database.query(
        `
          INSERT INTO teachers(name, lastname, password, email) VALUES($1, $2, $3, $4) returning *
        `,
        [userClone.name, userClone.lastname, userClone.password, userClone.email],
      );

      return user.rows[0] as User;
    },
    async loginUser(email: string, password: string): Promise<User> {
      const storedPassword = crypto.createHmac('sha256', password).digest('hex');
      const storedUser = await dependencies.database.query(
        `SELECT id, name, lastname, email, is_boss, is_program FROM teachers WHERE email=$1 AND password=$2`,
        [email, storedPassword],
      );

      if (!storedUser.rows[0]) {
        throw new Error("User doesn't exists");
      }

      return storedUser.rows[0] as User;
    },
  };
}

export default buildTeacherService;
