/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { QueryResult } from 'pg';
import { Curriculum, User, Studies, TeachingExperiences } from '../types';

export const getCurriculumInfoForInsertion = (curriculum: Curriculum, user: User) => [
  curriculum.dni,
  curriculum.dni_type,
  curriculum.professional_card,
  curriculum.military_card,
  curriculum.country,
  curriculum.gender,
  curriculum.birthday,
  curriculum.hometown,
  curriculum.civil_status,
  curriculum.personal_address,
  curriculum.home_phone,
  curriculum.cellphone_phone,
  user.id,
];

export const getStudyInformationForInsertion = (study: Studies, curriculumID: number) => [
  study.degree,
  study.degree_topic,
  study.begin_date,
  study.final_date,
  study.title_level_id,
  curriculumID,
];

export const getExperienceInformationForInsertion = (experience: TeachingExperiences, curriculumID: number) => [
  experience.academic_program,
  experience.subjects,
  experience.organization,
  experience.begin_date,
  experience.final_date,
  curriculumID,
];

export const getHeadResult = (result: QueryResult) => result.rows[0];
