import { PDFDocument, rgb } from '@react-pdf/renderer';
import { mockStudents, mockEvaluations } from '../data/mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const generateStudentReport = async (student: any) => {
  const doc = await PDFDocument.create();
  const page = doc.addPage();

  // Add header
  page.drawText('Rapport de l\'élève', {
    x: 50,
    y: 800,
    size: 20,
    color: rgb(0, 0, 0),
  });

  // Add student info
  page.drawText(`Nom: ${student.name}`, { x: 50, y: 750 });
  page.drawText(`Classe: ${student.class}`, { x: 50, y: 730 });
  page.drawText(`Présence: ${student.attendance}%`, { x: 50, y: 710 });

  // Add grades
  Object.entries(student.grades).forEach(([subject, grade], index) => {
    page.drawText(`${subject}: ${grade}%`, {
      x: 50,
      y: 690 - (index * 20),
    });
  });

  // Save the PDF
  const pdfBytes = await doc.save();
  return pdfBytes;
};

// Generate reports for all students
const generateAllReports = async () => {
  for (const student of mockStudents) {
    const report = await generateStudentReport(student);
    // Save to file system
    const filename = `reports/${student.name.replace(' ', '_')}_${format(new Date(), 'dd-MM-yyyy', { locale: fr })}.pdf`;
    // Write file logic here
  }
};

generateAllReports().then(() => console.log('Reports generated successfully!'));