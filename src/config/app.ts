// Application configuration
export const APP_CONFIG = {
  name: 'SchoolSync',
  version: '0.2.0',
  description: 'Offline-first School Management Single Page Application',
  
  // API Configuration
  api: {
    baseUrl: '/data',
    timeout: 5000,
    retryAttempts: 3
  },
  
  // PWA Configuration
  pwa: {
    manifestUrl: '/manifest.json',
    serviceWorkerUrl: '/sw.js',
    cacheName: 'schoolsync-v0.2.0'
  },
  
  // Data Configuration
  data: {
    collections: {
      students: 'students.json',
      classes: 'classes.json',
      groups: 'groups.json',
      evaluations: 'evaluations.json',
      skills: 'skills.json',
      absences: 'absences.json',
      timetable: 'timetable.json'
    }
  },
  
  // Export Configuration
  export: {
    formats: ['json', 'zip'],
    compression: false, // Future enhancement
    dateFormat: 'YYYY-MM-DD'
  },
  
  // PDF Configuration
  pdf: {
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  
  // UI Configuration
  ui: {
    theme: {
      default: 'light',
      storageKey: 'schoolsync-theme'
    },
    alerts: {
      duration: 5000,
      position: 'top-right'
    },
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    }
  },
  
  // Seating Chart Configuration
  seatingChart: {
    defaultRows: 6,
    defaultColumns: 5,
    maxStudentsPerSeat: 1
  },
  
  // Academic Configuration
  academic: {
    gradingScale: {
      A: { min: 90, max: 100, gpa: 4.0 },
      'A-': { min: 85, max: 89, gpa: 3.7 },
      'B+': { min: 80, max: 84, gpa: 3.3 },
      B: { min: 75, max: 79, gpa: 3.0 },
      'B-': { min: 70, max: 74, gpa: 2.7 },
      'C+': { min: 65, max: 69, gpa: 2.3 },
      C: { min: 60, max: 64, gpa: 2.0 },
      'C-': { min: 55, max: 59, gpa: 1.7 },
      D: { min: 50, max: 54, gpa: 1.0 },
      F: { min: 0, max: 49, gpa: 0.0 }
    },
    skillLevels: {
      1: 'Beginner',
      2: 'Developing', 
      3: 'Proficient',
      4: 'Advanced'
    }
  }
} as const;

// Type definitions for configuration
export type AppConfig = typeof APP_CONFIG;
export type ThemeMode = 'light' | 'dark';
export type ExportFormat = 'json' | 'zip';
export type GradeLevel = keyof typeof APP_CONFIG.academic.gradingScale;
export type SkillLevel = 1 | 2 | 3 | 4;