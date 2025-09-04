import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, Trash2 } from 'lucide-react';
import { useAlerts } from './AlertContext.js';
import { APP_CONFIG } from '../config/app.js';

interface PWAStatusProps {
  className?: string;
}

const PWAStatus: React.FC<PWAStatusProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const { addAlert } = useAlerts();

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      } else if ((window.navigator as any).standalone === true) {
        setIsInstalled(true);
      }
    };
    
    checkInstallation();

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // App installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      addAlert({
        type: 'success',
        title: 'Application installée',
        message: 'SchoolSync a été installé avec succès!'
      });
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [addAlert]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        addAlert({
          type: 'info',
          title: 'Installation en cours',
          message: 'L\'application va être installée...'
        });
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Erreur d\'installation',
        message: 'Impossible d\'installer l\'application'
      });
    }
  };

  const handleClearCache = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        // Send message to service worker to clear cache
        const messageChannel = new MessageChannel();
        
        const clearPromise = new Promise((resolve, reject) => {
          messageChannel.port1.onmessage = (event) => {
            if (event.data.success) {
              resolve(event.data);
            } else {
              reject(new Error('Failed to clear cache'));
            }
          };
        });

        registration.active?.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );

        await clearPromise;
        
        addAlert({
          type: 'success',
          title: 'Cache vidé',
          message: 'Le cache de l\'application a été vidé. Rechargez la page pour voir les changements.'
        });
      }
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de vider le cache'
      });
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Online/Offline Status */}
      <div className={`
        flex items-center px-2 py-1 rounded-full text-xs font-medium
        ${isOnline 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        }
      `}>
        {isOnline ? (
          <Wifi className="h-3 w-3 mr-1" />
        ) : (
          <WifiOff className="h-3 w-3 mr-1" />
        )}
        {isOnline ? 'En ligne' : 'Hors ligne'}
      </div>

      {/* Version Badge */}
      <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300">
        v{APP_CONFIG.version}
      </div>

      {/* Install Button */}
      {!isInstalled && deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
          title="Installer l'application"
        >
          <Download className="h-3 w-3 mr-1" />
          Installer
        </button>
      )}

      {/* Clear Cache Button */}
      <button
        onClick={handleClearCache}
        className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/30 transition-colors"
        title="Vider le cache"
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Cache
      </button>
    </div>
  );
};

export default PWAStatus;