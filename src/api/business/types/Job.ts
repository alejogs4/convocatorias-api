export interface Profile {
  id?: number;
  job_id?: number;
  name: string;
  description: string;
}

export interface Job {
  id?: number;
  name: string;
  description: string;
  begin_date: string;
  final_date: string;
  type: string;
  is_close?: boolean;
  open_teacher_id?: number;
  job_type_id?: number;
  profiles: [Profile];
}
