import React, { useState } from 'react';
import { Plus, Filter, Calendar, Clock, BookOpen, AlertCircle, CheckCircle, FileText, ChevronDown, Settings } from 'lucide-react';
import { mockStudents, mockEvaluations } from '../data/mockData';
import AddEvaluationModal from '../components/modals/AddEvaluationModal';

interface GradeColumn {
  id: string;
  title: string;
  maxPoints: number;
}

interface Grades {
  [studentId: string]: {
    [columnId: string]: number;
  };
}

const Evaluations: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [gradeColumns, setGradeColumns] = useState<GradeColumn[]>([]);
  const [grades, setGrades] = useState<Grades>({});
  const [showGradeTable, setShowGradeTable] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnMaxPoints, setNewColumnMaxPoints] = useState(20);
  
  // Get unique classes
  const classes = Array.from(new Set(mockStudents.map(student => student.class)));
  
  // Filter students by selected class
  const studentsInClass = selectedClass 
    ? mockStudents.filter(student => student.class === selectedClass)
    : [];
  
  // Filtrer les évaluations selon le statut
  const filteredEvaluations = mockEvaluations.filter(evaluation => {
    if (selectedFilter === 'all') return true;
    return evaluation.status === selectedFilter;
  });
  
  // Grouper par matière
  const groupedEvaluations = filteredEvaluations.reduce((acc, evaluation) => {
    if (!acc[evaluation.subject]) {
      acc[evaluation.subject] = [];
    }
    acc[evaluation.subject].push(evaluation);
    return acc;
  }, {} as Record<string, typeof mockEvaluations>);

  const handleAddEvaluation = (evaluationData: any) => {
    console.log('Nouvelle évaluation:', evaluationData);
  };

  const handleGradeChange = (studentId: string, columnId: string, value: string) => {
    const numValue = parseFloat(value);
    const column = gradeColumns.find(col => col.id === columnId);
    if (!column) return;
    
    if (!isNaN(numValue) && numValue >= 0 && numValue <= column.maxPoints) {
      setGrades(prev => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [columnId]: numValue
        }
      }));
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: GradeColumn = {
        id: `col-${Date.now()}`,
        title: newColumnTitle,
        maxPoints: newColumnMaxPoints
      };
      setGradeColumns(prev => [...prev, newColumn]);
      setNewColumnTitle('');
      setNewColumnMaxPoints(20);
    }
  };

  const handleRemoveColumn = (columnId: string) => {
    setGradeColumns(prev => prev.filter(col => col.id !== columnId));
    // Supprimer les notes associées à cette colonne
    setGrades(prev => {
      const newGrades = { ...prev };
      Object.keys(newGrades).forEach(studentId => {
        const { [columnId]: removed, ...rest } = newGrades[studentId];
        newGrades[studentId] = rest;
      });
      return newGrades;
    });
  };

  const handleSaveGrades = () => {
    console.log('Notes sauvegardées:', grades);
    // TODO: Implement actual save logic
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Évaluations</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Créer une évaluation</span>
        </button>
      </div>
      
      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Classe
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setShowGradeTable(true);
              }}
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>Classe {cls}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedFilter('all')}
            >
              Toutes les évaluations
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'upcoming'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedFilter('upcoming')}
            >
              À venir
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'completed'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedFilter('completed')}
            >
              Terminées
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des notes */}
      {selectedClass && showGradeTable && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Notes des élèves - Classe {selectedClass}
              </h3>
              <button
                onClick={handleSaveGrades}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Enregistrer les notes
              </button>
            </div>
            
            {/* Ajout de nouvelle colonne */}
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre de l'évaluation
                </label>
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Ex: Contrôle 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Barème
                </label>
                <input
                  type="number"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 w-24"
                  value={newColumnMaxPoints}
                  onChange={(e) => setNewColumnMaxPoints(parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <button
                onClick={handleAddColumn}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Ajouter une colonne
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Numéro
                  </th>
                  {gradeColumns.map(column => (
                    <th key={column.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center justify-between">
                        <span>{column.title} (/{column.maxPoints})</span>
                        <button
                          onClick={() => handleRemoveColumn(column.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {studentsInClass.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={student.avatar}
                          alt={student.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{student.roll}</div>
                    </td>
                    {gradeColumns.map(column => (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max={column.maxPoints}
                          step="0.5"
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                          value={grades[student.id]?.[column.id] || ''}
                          onChange={(e) => handleGradeChange(student.id, column.id, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Évaluations par matière */}
      {Object.keys(groupedEvaluations).length > 0 ? (
        Object.entries(groupedEvaluations).map(([subject, evaluations]) => (
          <div key={subject} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              {subject}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evaluations.map((evaluation) => (
                <div key={evaluation.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800 dark:text-white">{evaluation.title}</h4>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        evaluation.status === 'upcoming' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        {evaluation.status === 'upcoming' ? 'À venir' : 'Terminée'}
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {evaluation.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {evaluation.duration} minutes
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        Classe {evaluation.class} • {evaluation.maxMarks} points
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Sujets</h5>
                      <div className="flex flex-wrap gap-2">
                        {evaluation.topics.map((topic, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <button 
                      className="w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      onClick={() => {
                        if (evaluation.class) {
                          setSelectedClass(evaluation.class);
                          setShowGradeTable(true);
                        }
                      }}
                    >
                      {evaluation.status === 'upcoming' ? 'Modifier' : 'Voir les résultats'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Aucune évaluation trouvée</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {selectedFilter === 'all' 
              ? "Vous n'avez pas encore créé d'évaluation." 
              : selectedFilter === 'upcoming' 
                ? "Vous n'avez pas d'évaluations à venir." 
                : "Vous n'avez pas d'évaluations terminées."}
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer une évaluation
          </button>
        </div>
      )}

      {/* Modal d'ajout d'évaluation */}
      <AddEvaluationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEvaluation}
      />
    </div>
  );
};

export default Evaluations;