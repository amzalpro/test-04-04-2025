import { writeFileSync } from 'fs';
import * as XLSX from 'xlsx';
import { mockStudents, mockEvaluations, mockSchedule } from '../data/mockData';

// Export to Excel
const exportToExcel = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `exports/${filename}.xlsx`);
};

// Export students
exportToExcel(mockStudents, 'students');

// Export evaluations
exportToExcel(mockEvaluations, 'evaluations');

// Export schedule
const flatSchedule = mockSchedule.flatMap(day => 
  day.slots.map(slot => ({
    day: day.day,
    ...slot
  }))
);
exportToExcel(flatSchedule, 'schedule');

console.log('Export completed successfully!');