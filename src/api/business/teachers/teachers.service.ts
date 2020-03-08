/* eslint-disable @typescript-eslint/camelcase */
// packages
import { Pool } from 'pg';
import crypto from 'crypto';

// scripts
import { Curriculum, User, Studies, TeachingExperiences, Levels } from '../types';
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
  registerTeacherCurriculum(curriculum: Curriculum, user: User): Promise<Curriculum>;
  getTeacherCurriculum(user: User): Promise<Curriculum>;
  getTeacherLevels(): Promise<Levels[]>;
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
