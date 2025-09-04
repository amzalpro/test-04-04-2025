import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, User, Users, Mail, Calendar, Phone, UserPlus, FileText, Trash2, Edit } from 'lucide-react';
import { api } from '../api/dataStore';
import { PDFGenerator } from '../api/pdfGenerator';
import { useAlerts } from '../ui/AlertContext';
import AddStudentModal from '../components/modals/AddStudentModal';
import type { Student, Class } from '../api/types';

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const { addAlert } = useAlerts();
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsResponse, classesResponse] = await Promise.all([
        api.getStudents(),
        api.getClasses()
      ]);

      if (studentsResponse.success) {
        setStudents(studentsResponse.data);
      }
      
      if (classesResponse.success) {
        setClasses(classesResponse.data);
      }
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de charger les données des élèves'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search and class filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });
  
  // Get unique class values for filter
  const classNames = Array.from(new Set(students.map(student => student.class)));

  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      const newStudent: Student = {
        ...studentData,
        id: `s${Date.now()}`,
      };

      const response = await api.addStudent(newStudent);
      
      if (response.success) {
        setStudents(prev => [...prev, newStudent]);
        setIsAddModalOpen(false);
        addAlert({
          type: 'success',
          title: 'Élève ajouté',
          message: `${newStudent.name} a été ajouté avec succès`
        });
      } else {
        throw new Error(response.error || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'élève'
      });
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) return;

    try {
      const response = await api.deleteStudent(studentId);
      
      if (response.success) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        addAlert({
          type: 'success',
          title: 'Élève supprimé',
          message: 'L\'élève a été supprimé avec succès'
        });
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Erreur lors de la suppression'
      });
    }
  };

  const handleGenerateReport = async (studentId: string) => {
    try {
      await PDFGenerator.generateStudentReport(studentId);
      addAlert({
        type: 'success',
        title: 'Rapport généré',
        message: 'Le bulletin de l\'élève a été téléchargé'
      });
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de générer le rapport'
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Élèves</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          <span>Ajouter un élève</span>
        </button>
      </div>
      
      {/* Filters and search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative col-span-1 md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
            placeholder="Rechercher par nom, numéro ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 appearance-none"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as string | 'all')}
          >
            <option value="all">Toutes les classes</option>
            {classNames.map((className) => (
              <option key={className} value={className}>Classe {className}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Élèves</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{students.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <User className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Classes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{classNames.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Résultats</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{filteredStudents.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Students grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStudents.map((student) => {
          const grades = Object.values(student.grades);
          const average = grades.length > 0 
            ? Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length)
            : 0;

          return (
            <div key={student.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 text-center">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-indigo-50 dark:border-indigo-900"
                />
                <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">{student.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Classe {student.class} • N° {student.roll}</p>
                
                <div className="mt-3 space-y-2">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    {student.attendance}% Présence
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {average}% Moyenne
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300 truncate">{student.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {new Date(student.dob).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">{student.gender}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleGenerateReport(student.id)}
                    className="flex-1 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    title="Générer bulletin"
                  >
                    <FileText className="h-4 w-4 mx-auto" />
                  </button>
                  <button 
                    className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4 mx-auto" />
                  </button>
                  <button 
                    onClick={() => handleDeleteStudent(student.id)}
                    className="flex-1 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty state */}
      {filteredStudents.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
            <User className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Aucun élève trouvé</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchTerm || selectedClass !== 'all' 
              ? 'Ajustez vos critères de recherche ou ajoutez de nouveaux élèves.'
              : 'Commencez par ajouter des élèves à votre système.'
            }
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un élève
          </button>
        </div>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddStudent}
      />
    </div>
  );
};

export default Students;