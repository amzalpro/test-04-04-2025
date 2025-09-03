import React, { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, ClipboardList, Calendar, BookOpen, X,
  Settings, BarChart2, MessageSquare, HelpCircle
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      ) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);
  
  const NavItem = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`
      }
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden md:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <div
        ref={sidebar}
        className={`fixed z-40 md:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg md:shadow-none transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="ml-2 text-lg font-bold text-gray-800 dark:text-white">SchoolSync</span>
          </div>
          <button
            ref={trigger}
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Fermer le menu</span>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-3 py-4 space-y-1">
          <div className="mb-4 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 px-4">
            Principal
          </div>
          <NavItem to="/" icon={Home} label="Tableau de bord" />
          <NavItem to="/students" icon={Users} label="Élèves" />
          <NavItem to="/evaluations" icon={ClipboardList} label="Évaluations" />
          <NavItem to="/schedule" icon={Calendar} label="Emploi du temps" />
          <NavItem to="/calendar" icon={Calendar} label="Agenda personnel" />
          <NavItem to="/lessons" icon={BookOpen} label="Cahier de texte" />
          
          <div className="mt-8 mb-4 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 px-4">
            Extras
          </div>
          <NavItem to="/analytics" icon={BarChart2} label="Statistiques" />
          <NavItem to="/messages" icon={MessageSquare} label="Messages" />
          <NavItem to="/settings" icon={Settings} label="Paramètres" />
          <NavItem to="/help" icon={HelpCircle} label="Aide & Support" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;