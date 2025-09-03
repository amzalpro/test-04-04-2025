import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, BookOpen, ClipboardList } from 'lucide-react';

const MobileNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 z-30 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-around h-16">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Accueil</span>
        </NavLink>
        <NavLink
          to="/students"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Élèves</span>
        </NavLink>
        <NavLink
          to="/evaluations"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <ClipboardList className="h-5 w-5" />
          <span className="text-xs mt-1">Évaluations</span>
        </NavLink>
        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Emploi du temps</span>
        </NavLink>
        <NavLink
          to="/lessons"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-1">Cahier</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileNav;