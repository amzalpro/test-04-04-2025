import jsPDF from 'jspdf';
import { api } from './dataStore.js';
import { APP_CONFIG } from '../config/app.js';
import type { Student, Class, Evaluation } from './types.js';

export class PDFGenerator {
  // Generate basic class averages PDF
  static async generateClassAveragesReport(classId: string): Promise<void> {
    try {
      // Get data
      const [studentsResponse, classesResponse, evaluationsResponse] = await Promise.all([
        api.getStudents(),
        api.getClasses(),
        api.getEvaluations()
      ]);

      if (!studentsResponse.success || !classesResponse.success || !evaluationsResponse.success) {
        throw new Error('Failed to load required data');
      }

      const students = studentsResponse.data;
      const classes = classesResponse.data;
      const evaluations = evaluationsResponse.data;

      // Find the class
      const targetClass = classes.find(c => c.id === classId);
      if (!targetClass) {
        throw new Error('Class not found');
      }

      // Filter students for this class
      const classStudents = students.filter(s => s.class === targetClass.name);

      // Filter evaluations for this class
      const classEvaluations = evaluations.filter(e => 
        e.classId === classId && e.status === 'completed'
      );

      // Create PDF
      const doc = new jsPDF();
      const config = APP_CONFIG.pdf;
      
      // Set up document
      doc.setFont(config.fontFamily);
      doc.setFontSize(config.fontSize);

      // Title
      doc.setFontSize(16);
      doc.text(`Rapport de Moyennes - Classe ${targetClass.name}`, config.margins.left, config.margins.top + 10);
      
      // Date
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, config.margins.left, config.margins.top + 20);

      // Class info
      doc.setFontSize(12);
      let yPosition = config.margins.top + 35;
      doc.text(`Niveau: ${targetClass.level}`, config.margins.left, yPosition);
      yPosition += 8;
      doc.text(`Section: ${targetClass.section}`, config.margins.left, yPosition);
      yPosition += 8;
      doc.text(`Enseignant: ${targetClass.classTeacher}`, config.margins.left, yPosition);
      yPosition += 8;
      doc.text(`Effectif: ${classStudents.length}/${targetClass.capacity}`, config.margins.left, yPosition);
      yPosition += 15;

      // Student averages table
      doc.setFontSize(14);
      doc.text('Moyennes des Élèves', config.margins.left, yPosition);
      yPosition += 10;

      // Table headers
      doc.setFontSize(10);
      const tableHeaders = ['Nom', 'N° Étudiant', 'Moyenne Générale', 'Assiduité'];
      let xPosition = config.margins.left;
      const columnWidths = [60, 30, 40, 30];

      // Draw headers
      tableHeaders.forEach((header, index) => {
        doc.text(header, xPosition, yPosition);
        xPosition += columnWidths[index];
      });
      yPosition += 8;

      // Draw line under headers
      doc.line(config.margins.left, yPosition - 2, config.margins.left + 160, yPosition - 2);
      yPosition += 5;

      // Student data rows
      classStudents.forEach(student => {
        if (yPosition > 270) { // Start new page if needed
          doc.addPage();
          yPosition = config.margins.top + 10;
        }

        // Calculate overall average
        const grades = Object.values(student.grades);
        const overallAverage = grades.length > 0 
          ? (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(1)
          : 'N/A';

        xPosition = config.margins.left;
        doc.text(student.name, xPosition, yPosition);
        xPosition += columnWidths[0];
        doc.text(student.roll, xPosition, yPosition);
        xPosition += columnWidths[1];
        doc.text(`${overallAverage}%`, xPosition, yPosition);
        xPosition += columnWidths[2];
        doc.text(`${student.attendance}%`, xPosition, yPosition);
        
        yPosition += 8;
      });

      // Class statistics
      yPosition += 10;
      doc.setFontSize(14);
      doc.text('Statistiques de la Classe', config.margins.left, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      
      // Calculate class averages
      const allGrades = classStudents.flatMap(s => Object.values(s.grades));
      const classAverage = allGrades.length > 0 
        ? (allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length).toFixed(1)
        : 'N/A';
      
      const attendanceAverage = classStudents.length > 0
        ? (classStudents.reduce((sum, s) => sum + s.attendance, 0) / classStudents.length).toFixed(1)
        : 'N/A';

      doc.text(`Moyenne de classe: ${classAverage}%`, config.margins.left, yPosition);
      yPosition += 8;
      doc.text(`Assiduité moyenne: ${attendanceAverage}%`, config.margins.left, yPosition);
      yPosition += 8;
      doc.text(`Nombre d'évaluations: ${classEvaluations.length}`, config.margins.left, yPosition);
      yPosition += 15;

      // Subject breakdown
      if (targetClass.subjects.length > 0) {
        doc.setFontSize(14);
        doc.text('Moyennes par Matière', config.margins.left, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        targetClass.subjects.forEach(subject => {
          const subjectGrades = classStudents
            .map(s => s.grades[subject.toLowerCase()])
            .filter(grade => grade !== undefined);
          
          const subjectAverage = subjectGrades.length > 0
            ? (subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length).toFixed(1)
            : 'N/A';

          doc.text(`${subject}: ${subjectAverage}%`, config.margins.left, yPosition);
          yPosition += 8;
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `SchoolSync v${APP_CONFIG.version} - Page ${i}/${pageCount}`,
          config.margins.left,
          297 - config.margins.bottom
        );
      }

      // Save the PDF
      const filename = `rapport_classe_${targetClass.name}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  // Generate student individual report
  static async generateStudentReport(studentId: string): Promise<void> {
    try {
      const [studentsResponse, evaluationsResponse] = await Promise.all([
        api.getStudents(),
        api.getEvaluations()
      ]);

      if (!studentsResponse.success || !evaluationsResponse.success) {
        throw new Error('Failed to load required data');
      }

      const student = studentsResponse.data.find(s => s.id === studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      const studentEvaluations = evaluationsResponse.data.filter(e => 
        e.results.some(r => r.studentId === studentId)
      );

      const doc = new jsPDF();
      const config = APP_CONFIG.pdf;

      // Title
      doc.setFontSize(16);
      doc.text(`Bulletin - ${student.name}`, config.margins.left, config.margins.top + 10);
      
      // Student info
      doc.setFontSize(12);
      let yPosition = config.margins.top + 25;
      doc.text(`Classe: ${student.class}`, config.margins.left, yPosition);
      yPosition += 8;
      doc.text(`N° Étudiant: ${student.roll}`, config.margins.left, yPosition);
      yPosition += 8;
      doc.text(`Date de naissance: ${new Date(student.dob).toLocaleDateString('fr-FR')}`, config.margins.left, yPosition);
      yPosition += 15;

      // Grades summary
      doc.setFontSize(14);
      doc.text('Résultats par Matière', config.margins.left, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      Object.entries(student.grades).forEach(([subject, grade]) => {
        doc.text(`${subject.charAt(0).toUpperCase() + subject.slice(1)}: ${grade}%`, config.margins.left, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Evaluations detail
      if (studentEvaluations.length > 0) {
        doc.setFontSize(14);
        doc.text('Détail des Évaluations', config.margins.left, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        studentEvaluations.forEach(evaluation => {
          const result = evaluation.results.find(r => r.studentId === studentId);
          if (result) {
            doc.text(
              `${evaluation.title}: ${result.marks}/${evaluation.maxMarks} (${result.grade})`,
              config.margins.left,
              yPosition
            );
            yPosition += 8;
          }
        });
      }

      // Save the PDF
      const filename = `bulletin_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error('Error generating student report:', error);
      throw error;
    }
  }
}