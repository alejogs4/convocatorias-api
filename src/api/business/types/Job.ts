export interface Stages {
  id?: number;
  text: string;
  initial_date: string;
  final_date: string;
  stage_order: number;
  job_id?: number;
}

export interface Requirements {
  id?: number;
  text: string;
  job_id?: number;
}

export interface Profile {
  id?: number;
  job_id?: number;
  name: string;
  description: string;
  area: string;
}

export interface Job {
  id?: number;
  program: string;
  name: string;
  description: string;
  begin_date: string;
  final_date: string;
  type: string;
  is_close?: boolean;
  open_teacher_id?: number;
  job_type_id?: number;
  requirements: [Requirements];
  profiles: [Profile];
  stages: [Stages];
}

export interface JobCandidate {
  id?: number;
  teacher_id: number;
  job_id: number;
  score: number;
}
