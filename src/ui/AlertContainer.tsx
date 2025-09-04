import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useAlerts, type Alert } from './AlertContext.js';

const AlertContainer: React.FC = () => {
  const { alerts, removeAlert } = useAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {alerts.map(alert => (
        <AlertComponent key={alert.id} alert={alert} onClose={() => removeAlert(alert.id)} />
      ))}
    </div>
  );
};

interface AlertComponentProps {
  alert: Alert;
  onClose: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ alert, onClose }) => {
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-200';
    }
  };

  const getIcon = (type: Alert['type']) => {
    const iconClass = "h-5 w-5 mr-2 flex-shrink-0";
    switch (type) {
      case 'success':
        return <CheckCircle className={iconClass} />;
      case 'error':
        return <AlertCircle className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'info':
        return <Info className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  return (
    <div className={`
      border rounded-lg p-4 shadow-lg animate-slide-in
      ${getAlertStyles(alert.type)}
    `}>
      <div className="flex items-start">
        {getIcon(alert.type)}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{alert.title}</h4>
          <p className="text-sm mt-1 break-words">{alert.message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Fermer l'alerte"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertContainer;