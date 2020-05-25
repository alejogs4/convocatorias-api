/* eslint-disable @typescript-eslint/camelcase */
// packages
import { Pool } from 'pg';
import crypto from 'crypto';

// scripts
import { Curriculum, User, Studies, TeachingExperiences, Levels, UpdateUser } from '../types';
import TEACHER_SQL_QUERIES from './teachers.sql';
import {
  getCurriculumInfoForInsertion,
  getStudyInformationForInsertion,
  getExperienceInformationForInsertion,
  getHeadResult,
} from './teacher.utils';

interface TeacherServiceDependencies {
  database: Pool;
}

interface TeacherService {
  registerUser(incommingUser: User): Promise<User>;
  loginUser(email: string, password: string): Promise<User>;
  updateTeacher(user: UpdateUser, currentUser: User): Promise<User>;
  registerTeacherCurriculum(curriculum: Curriculum, user: User): Promise<Curriculum>;
  registerTeacherCurriculumFile(file: string, user: User): Promise<string>;
  getTeacherCurriculum(user: User): Promise<Curriculum>;
  getTeacherLevels(): Promise<Levels[]>;
  getTeacherById(id: number): Promise<User>;
}

function buildTeacherService(dependencies: TeacherServiceDependencies): TeacherService {
  return {
    async registerUser(incommingUser): Promise<User> {
      const userClone = { ...incommingUser };
      // Encode user password
      userClone.password = crypto.createHmac('sha256', userClone.password).digest('hex');
      // Insert user in database
      const user = await dependencies.database.query(TEACHER_SQL_QUERIES.signupTeacher, [
        userClone.name,
        userClone.lastname,
        userClone.password,
        userClone.email,
      ]);

      return user.rows[0] as User;
    },
    async updateTeacher(user: UpdateUser, currentUser: User): Promise<User> {
      const passwordQuery = user.password ? ',password=$5' : '';
      const fieldsToUpdate = user.password
        ? [
            user.name,
            user.lastname,
            user.email,
            currentUser.id,
            crypto.createHmac('sha256', user.password).digest('hex'),
          ]
        : [user.name, user.lastname, user.email, currentUser.id];

      const [updatedUser] = (
        await dependencies.database.query(
          `
        UPDATE teachers
        SET name=$1, lastname=$2, email=$3${passwordQuery}
        WHERE id = $4
        RETURNING *
      `,
          fieldsToUpdate,
        )
      ).rows;

      delete updatedUser.password;
      return updatedUser as User;
    },
    async getTeacherById(id: number): Promise<User> {
      const teacher = await dependencies.database.query(TEACHER_SQL_QUERIES.getTeacher, [id]);
      if (!teacher.rows[0]) {
        throw new Error("This user doesn't exists");
      }

      return teacher.rows[0] as User;
    },
    async loginUser(email: string, password: string): Promise<User> {
      const storedPassword = crypto.createHmac('sha256', password).digest('hex');
      const storedUser = await dependencies.database.query(TEACHER_SQL_QUERIES.loginTeacher, [email, storedPassword]);

      if (!storedUser.rows[0]) {
        throw new Error("User doesn't exists");
      }

      return storedUser.rows[0] as User;
    },
    async registerTeacherCurriculum(curriculum: Curriculum, user: User): Promise<Curriculum> {
      const storedCurriculum = await dependencies.database.query(
        TEACHER_SQL_QUERIES.addCurriculum,
        getCurriculumInfoForInsertion(curriculum, user),
      );

      const studiesInsertions = curriculum.studies.map(study =>
        dependencies.database.query(
          TEACHER_SQL_QUERIES.addTeacherStudies,
          getStudyInformationForInsertion(study, storedCurriculum.rows[0].id),
        ),
      );

      const teachingExperiencesInsertions = curriculum.teaching_experiences.map(experience =>
        dependencies.database.query(
          TEACHER_SQL_QUERIES.addTeacherExperience,
          getExperienceInformationForInsertion(experience, storedCurriculum.rows[0].id),
        ),
      );

      const studies: Studies[] = (await Promise.all(studiesInsertions)).map(getHeadResult);
      const teachingExperiences: TeachingExperiences[] = (await Promise.all(teachingExperiencesInsertions)).map(
        getHeadResult,
      );

      return { ...storedCurriculum.rows[0], studies, teachingExperiences } as Curriculum;
    },
    async registerTeacherCurriculumFile(file: string, user: User): Promise<string> {
      setImmediate(() =>
        dependencies.database.query(
          `
      UPDATE curriculum
      SET curriculum_file=$1
      WHERE teacher_id = $2
      RETURNING *
      `,
          [file, user.id],
        ),
      );
      return file;
    },
    async getTeacherCurriculum(user: User): Promise<Curriculum> {
      const curriculumResults = await dependencies.database.query(TEACHER_SQL_QUERIES.getCurriculumByUser, [user.id]);
      const curriculum: Curriculum = curriculumResults.rows[0];

      const studiesPetition = dependencies.database.query(TEACHER_SQL_QUERIES.getCurriculumStudies, [curriculum.id]);

      const teachingExperiencesPetition = dependencies.database.query(
        TEACHER_SQL_QUERIES.getTeachingExperiencesByCurriculumID,
        [curriculum.id],
      );

      const [studies, teachingExperiences] = (await Promise.all([studiesPetition, teachingExperiencesPetition])).map(
        results => results.rows,
      );

      return { ...curriculum, studies, teaching_experiences: teachingExperiences };
    },
    async getTeacherLevels(): Promise<Levels[]> {
      const levels = (await dependencies.database.query<Levels>(TEACHER_SQL_QUERIES.getTeachersLevels)).rows;
      return levels;
    },
  };
}

export default buildTeacherService;
