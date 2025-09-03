import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Users, X } from 'lucide-react';
import frLocale from '@fullcalendar/core/locales/fr';

interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  description?: string;
  location?: string;
  attendees?: string[];
  allDay?: boolean;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    start: '',
    end: '',
    description: '',
    location: '',
    attendees: [],
    allDay: false
  });

  const handleDateSelect = (selectInfo: any) => {
    setNewEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    });
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event.extendedProps);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (newEvent.title && newEvent.start) {
      const eventToAdd: Event = {
        id: Date.now().toString(),
        title: newEvent.title!,
        start: newEvent.start!,
        end: newEvent.end,
        description: newEvent.description,
        location: newEvent.location,
        attendees: newEvent.attendees,
        allDay: newEvent.allDay
      };

      setEvents([...events, eventToAdd]);
      setIsModalOpen(false);
      setNewEvent({
        title: '',
        start: '',
        end: '',
        description: '',
        location: '',
        attendees: [],
        allDay: false
      });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Agenda Personnel</h2>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setNewEvent({});
            setIsModalOpen(true);
          }}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Nouveau rendez-vous</span>
        </button>
      </div>

      {/* Calendrier */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale={frLocale}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          allDaySlot={true}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
        />
      </div>

      {/* Modal d'ajout/édition d'événement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedEvent ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveEvent(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    value={newEvent.title || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date de début
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      value={newEvent.start || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      value={newEvent.end || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    rows={3}
                    value={newEvent.description || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lieu
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    value={newEvent.location || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      checked={newEvent.allDay || false}
                      onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Journée entière</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  {selectedEvent && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-md"
                    >
                      Supprimer
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  >
                    {selectedEvent ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;