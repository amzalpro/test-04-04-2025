import React, { useState } from 'react';
import { Download, Upload, FileText, Archive, Loader } from 'lucide-react';
import { ExportManager, ImportManager, FileUtils } from '../api/exportImport.js';
import { useAlerts } from './AlertContext.js';
import type { DataCollection } from '../api/types.js';

interface ExportImportPanelProps {
  className?: string;
}

const ExportImportPanel: React.FC<ExportImportPanelProps> = ({ className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<DataCollection | 'all'>('all');
  const { addAlert } = useAlerts();

  const collections: { value: DataCollection; label: string }[] = [
    { value: 'students', label: 'Élèves' },
    { value: 'classes', label: 'Classes' },
    { value: 'groups', label: 'Groupes' },
    { value: 'evaluations', label: 'Évaluations' },
    { value: 'skills', label: 'Compétences' },
    { value: 'absences', label: 'Absences' },
    { value: 'timetable', label: 'Emploi du temps' }
  ];

  const handleExportSingle = async (collection: DataCollection) => {
    setIsExporting(true);
    try {
      await ExportManager.exportCollection(collection);
      addAlert({
        type: 'success',
        title: 'Export réussi',
        message: `${collections.find(c => c.value === collection)?.label} exporté avec succès`
      });
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Erreur d\'export',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async (format: 'separate' | 'zip') => {
    setIsExporting(true);
    try {
      if (format === 'separate') {
        await ExportManager.exportAllSeparate();
        addAlert({
          type: 'success',
          title: 'Export réussi',
          message: 'Toutes les collections ont été exportées séparément'
        });
      } else {
        await ExportManager.exportAllAsZip();
        addAlert({
          type: 'success',
          title: 'Export réussi',
          message: 'Toutes les données ont été exportées dans un fichier ZIP'
        });
      }
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Erreur d\'export',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsImporting(true);
    try {
      const results = await ImportManager.importFiles(files);
      
      if (results.success > 0) {
        addAlert({
          type: 'success',
          title: 'Import réussi',
          message: `${results.success} fichier(s) importé(s) avec succès`
        });
      }
      
      if (results.failed > 0) {
        addAlert({
          type: 'warning',
          title: 'Import partiel',
          message: `${results.failed} fichier(s) ont échoué: ${results.errors.join(', ')}`,
          persistent: true
        });
      }
    } catch (error) {
      addAlert({
        type: 'error',
        title: 'Erreur d\'import',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-6">
          Export / Import de Données
        </h3>

        {/* Export Section */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
            Exporter les données
          </h4>
          
          {/* Individual Collection Export */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Exporter une collection spécifique
            </label>
            <div className="flex flex-wrap gap-2">
              {collections.map(collection => (
                <button
                  key={collection.value}
                  onClick={() => handleExportSingle(collection.value)}
                  disabled={isExporting}
                  className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {collection.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export All Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Exporter toutes les données
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleExportAll('separate')}
                disabled={isExporting}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Fichiers séparés
              </button>
              
              <button
                onClick={() => handleExportAll('zip')}
                disabled={isExporting}
                className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Archive className="h-4 w-4 mr-2" />
                )}
                Fichier ZIP
              </button>
            </div>
          </div>
        </div>

        {/* Import Section */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
            Importer les données
          </h4>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Sélectionnez des fichiers JSON à importer
            </p>
            
            <label className="inline-block">
              <input
                type="file"
                multiple
                accept=".json"
                onChange={handleFileImport}
                disabled={isImporting}
                className="hidden"
              />
              <span className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg cursor-pointer transition-colors disabled:opacity-50">
                {isImporting ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Sélectionner des fichiers
              </span>
            </label>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Formats supportés: JSON. Multiple fichiers acceptés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportImportPanel;