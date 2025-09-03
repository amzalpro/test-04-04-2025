import React, { useState } from 'react';
import { 
  Calendar, BookOpen, Search, PlusCircle, 
  Clipboard, ChevronRight, ListChecks, FileText 
} from 'lucide-react';
import { mockLessonPlans } from '../data/mockData';
import AddLessonModal from '../components/modals/AddLessonModal';

const LessonPlanner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filter lesson plans
  const filteredLessonPlans = mockLessonPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLesson = (lessonData: any) => {
    // TODO: Implement lesson addition logic
    console.log('Nouvelle leçon:', lessonData);
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Cahier de texte</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>Nouvelle leçon</span>
        </button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
          placeholder="Rechercher des leçons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Upcoming lessons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h3 className="font-medium text-gray-800 dark:text-white">Leçons à venir</h3>
          </div>
          <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Voir le calendrier
          </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredLessonPlans.map((lesson) => (
            <div key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">{lesson.title}</h4>
                      <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                        <span>{lesson.subject}</span>
                        <span>•</span>
                        <span>Classe {lesson.class}</span>
                        <span>•</span>
                        <span>{lesson.date}</span>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-4">
                        <div>
                          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                            <div className="flex items-center">
                              <Clipboard className="h-3 w-3 mr-1" />
                              <span>Objectifs</span>
                            </div>
                          </div>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4 list-disc">
                            {lesson.objectives.slice(0, 2).map((objective, index) => (
                              <li key={index}>{objective}</li>
                            ))}
                            {lesson.objectives.length > 2 && (
                              <li className="text-gray-500 dark:text-gray-400 text-xs">
                                +{lesson.objectives.length - 2} autres
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                            <div className="flex items-center">
                              <ListChecks className="h-3 w-3 mr-1" />
                              <span>Ressources</span>
                            </div>
                          </div>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4 list-disc">
                            {lesson.resources.slice(0, 2).map((resource, index) => (
                              <li key={index}>{resource}</li>
                            ))}
                            {lesson.resources.length > 2 && (
                              <li className="text-gray-500 dark:text-gray-400 text-xs">
                                +{lesson.resources.length - 2} autres
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                            <div className="flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              <span>Devoirs</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.homework}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Empty state */}
      {filteredLessonPlans.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Aucune leçon trouvée</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchTerm 
              ? "Ajustez votre recherche pour trouver ce que vous cherchez."
              : "Commencez à créer des leçons pour organiser votre enseignement."}
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle leçon
          </button>
        </div>
      )}

      {/* Add Lesson Modal */}
      <AddLessonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLesson}
      />
    </div>
  );
};

export default LessonPlanner;