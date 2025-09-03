import React, { useState } from 'react';
import { Search, Filter, Plus, User, Mail, Calendar, Phone, UserPlus } from 'lucide-react';
import { mockStudents } from '../data/mockData';
import AddStudentModal from '../components/modals/AddStudentModal';

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filter students based on search and class filter
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.roll.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });
  
  // Get unique class values for filter
  const classes = Array.from(new Set(mockStudents.map(student => student.class)));

  const handleAddStudent = (studentData: any) => {
    // TODO: Implement student addition logic
    console.log('Nouvel élève:', studentData);
  };

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
            placeholder="Rechercher par nom ou numéro..."
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
            {classes.map((cls) => (
              <option key={cls} value={cls}>Classe {cls}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Students grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 text-center">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-indigo-50 dark:border-indigo-900"
              />
              <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">{student.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Classe {student.class} • N° {student.roll}</p>
              
              <div className="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                {student.attendance}% Présence
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300 truncate">{student.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{student.dob}</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{student.gender}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button className="w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                Voir les détails
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredStudents.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
            <User className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Aucun élève trouvé</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Ajustez vos critères de recherche ou ajoutez de nouveaux élèves.
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