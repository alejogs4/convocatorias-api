export interface Levels {
  id?: number;
  text: string;
}

export type Types = Levels;

export interface Studies {
  id?: number;
  degree: string;
  degree_topic: string;
  begin_date: string;
  final_date: string;
  title_level_id: number;
  curriculum_id?: number;
}

export interface TeachingExperiences {
  id?: number;
  academic_program: string;
  subjects: string;
  organization: string;
  begin_date: string;
  final_date: string;
  curriculum_id?: number;
}

export interface Curriculum {
  id?: number;
  dni: string;
  gender: string;
  civil_status: string;
  country: string;
  birthday: string;
  hometown: string;
  personal_address: string;
  home_phone: string;
  cellphone_phone: string;
  studies: Studies[];
  teaching_experiences: TeachingExperiences[];
}
