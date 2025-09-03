import { writeFileSync } from 'fs';
import { mockStudents, mockEvaluations, mockSchedule, mockLessonPlans } from '../data/mockData';

const backup = () => {
  const data = {
    students: mockStudents,
    evaluations: mockEvaluations,
    schedule: mockSchedule,
    lessonPlans: mockLessonPlans,
    timestamp: new Date().toISOString(),
  };

  const filename = `backups/backup_${new Date().toISOString().split('T')[0]}.json`;
  writeFileSync(filename, JSON.stringify(data, null, 2));
  
  console.log(`Backup created successfully: ${filename}`);
};

backup();