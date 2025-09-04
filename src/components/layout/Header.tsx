import React from 'react';
import { Menu, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import PWAStatus from '../../ui/PWAStatus';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Section gauche */}
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
            SchoolSync
          </h1>
          
          {/* PWA Status */}
          <PWAStatus className="ml-4 hidden lg:flex" />
        </div>
        
        {/* Section droite */}
        <div className="flex items-center space-x-4">
          {/* Thème */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none transition-colors"
            aria-label={`Passer au mode ${theme === 'light' ? 'sombre' : 'clair'}`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {/* Notifications */}
          <button
            className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none transition-colors relative"
            aria-label="Voir les notifications"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
          </button>
          
          {/* Menu utilisateur */}
          <div className="relative flex items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                  alt={user?.name || 'Avatar utilisateur'}
                />
              </div>
              <div className="ml-3 hidden md:block">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role === 'admin' ? 'Administrateur' : 'Enseignant'}
                </div>
              </div>
            </div>
            
            {/* Bouton déconnexion */}
            <button 
              onClick={logout}
              className="ml-4 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
      
      {/* PWA Status for mobile */}
      <div className="lg:hidden px-4 pb-2">
        <PWAStatus />
      </div>
    </header>
  );
};

export default Header;