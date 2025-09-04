// Data type definitions
export interface Student {
  id: string;
  name: string;
  class: string;
  roll: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  email: string;
  parentEmail: string;
  avatar: string;
  attendance: number;
  grades: Record<string, number>;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  section: string;
  capacity: number;
  currentEnrollment: number;
  classTeacher: string;
  subjects: string[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  classId: string | null;
  studentIds: string[];
  teacherId: string;
  subject: string;
  type: 'ability' | 'collaborative' | 'extracurricular' | 'remedial';
}

export interface Evaluation {
  id: string;
  title: string;
  subject: string;
  classId: string | null;
  groupId: string | null;
  date: string;
  maxMarks: number;
  duration: number;
  coefficient: number;
  topics: string[];
  status: 'upcoming' | 'completed' | 'graded';
  results: EvaluationResult[];
}

export interface EvaluationResult {
  studentId: string;
  marks: number;
  grade: string;
}

export interface Skill {
  id: string;
  name: string;
  subject: string;
  description: string;
  levels: SkillLevel[];
}

export interface SkillLevel {
  level: number;
  name: string;
  description: string;
}

export interface Absence {
  id: string;
  studentId: string;
  date: string;
  period: string;
  subject: string;
  type: 'excused' | 'unexcused';
  reason: string;
  parentNotified: boolean;
  makeupRequired: boolean;
}

export interface TimetableSlot {
  id: string;
  time: string;
  subject: string | null;
  classId: string | null;
  room: string | null;
  teacherId: string | null;
  note?: string;
}

export interface TimetableDay {
  id: string;
  day: string;
  slots: TimetableSlot[];
}

export interface Timetable {
  metadata: {
    version: string;
    lastUpdated: string;
    academicYear: string;
    semester: string;
  };
  weekdays: TimetableDay[];
}

// Collection types
export type DataCollection = 
  | 'students'
  | 'classes' 
  | 'groups'
  | 'evaluations'
  | 'skills'
  | 'absences'
  | 'timetable';

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}