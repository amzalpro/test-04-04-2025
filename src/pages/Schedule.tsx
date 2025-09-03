import React, { useState } from 'react';
import { Calendar, Clock, MapPin, MoreHorizontal, PlusCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { mockSchedule } from '../data/mockData';
import AddClassModal from '../components/modals/AddClassModal';

const Schedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>(mockSchedule[0].day);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const days = mockSchedule.map(day => day.day);
  const selectedDaySchedule = mockSchedule.find(day => day.day === selectedDay);
  
  // Trouver l'index du jour actuel
  const currentDayIndex = days.indexOf(selectedDay);
  
  // Gérer la navigation
  const goToPreviousDay = () => {
    const newIndex = (currentDayIndex - 1 + days.length) % days.length;
    setSelectedDay(days[newIndex]);
  };
  
  const goToNextDay = () => {
    const newIndex = (currentDayIndex + 1) % days.length;
    setSelectedDay(days[newIndex]);
  };

  const handleAddClass = (classData: any) => {
    // TODO: Implement class addition logic
    console.log('Nouveau cours:', classData);
  };
  
  // Obtenir la date actuelle
  const today = new Date();
  const currentMonth = today.toLocaleString('fr-FR', { month: 'long' });
  const currentYear = today.getFullYear();

  // Traduire les jours en français
  const translateDay = (day: string) => {
    const translations: Record<string, string> = {
      'Monday': 'Lundi',
      'Tuesday': 'Mardi',
      'Wednesday': 'Mercredi',
      'Thursday': 'Jeudi',
      'Friday': 'Vendredi'
    };
    return translations[day] || day;
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Emploi du temps</h2>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>Ajouter un cours</span>
          </button>
        </div>
      </div>
      
      {/* Navigation du calendrier */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h3 className="font-medium text-gray-800 dark:text-white">{currentMonth} {currentYear}</h3>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousDay}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Jour précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToNextDay}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Jour suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Jours de la semaine */}
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700">
          {days.map((day) => (
            <button
              key={day}
              className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${
                day === selectedDay
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {translateDay(day)}
            </button>
          ))}
        </div>
        
        {/* Emploi du temps du jour sélectionné */}
        <div className="p-6">
          {selectedDaySchedule?.slots.map((slot, index) => (
            <div
              key={index}
              className="mb-4 last:mb-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row p-4">
                {/* Horaire */}
                <div className="sm:w-1/4 mb-3 sm:mb-0 flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{slot.time}</span>
                </div>
                
                {/* Détails du cours */}
                <div className="sm:w-2/4 mb-3 sm:mb-0">
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {slot.subject || 'Heure libre'}
                  </h4>
                  {slot.class && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Classe {slot.class}
                    </p>
                  )}
                </div>
                
                {/* Salle */}
                {slot.room && (
                  <div className="sm:w-1/4 flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Salle {slot.room}</span>
                  </div>
                )}
                
                {/* Actions */}
                <div className="mt-3 sm:mt-0 sm:ml-auto">
                  <button
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Plus d'options"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Actions rapides */}
              {slot.subject && (
                <div className="bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 px-4 py-3 text-right">
                  <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    Ajouter une leçon
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Résumé hebdomadaire */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-800 dark:text-white">Résumé de la semaine</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {mockSchedule.reduce((total, day) => total + day.slots.filter(slot => slot.subject).length, 0)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Total des cours</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {mockSchedule.reduce((total, day) => total + day.slots.filter(slot => slot.subject === 'Mathematics').length, 0)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Cours de mathématiques</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {mockSchedule.reduce((total, day) => total + day.slots.filter(slot => slot.subject === 'Physics').length, 0)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Cours de physique</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {mockSchedule.reduce((total, day) => total + day.slots.filter(slot => !slot.subject).length, 0)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Heures libres</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout de cours */}
      <AddClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddClass}
      />
    </div>
  );
};

export default Schedule;