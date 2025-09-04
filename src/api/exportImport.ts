import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { api } from './dataStore.js';
import { APP_CONFIG } from '../config/app.js';
import type { DataCollection } from './types.js';

// Export utilities
export class ExportManager {
  // Export individual collection as JSON
  static async exportCollection(collection: DataCollection): Promise<void> {
    try {
      let data: any;
      
      switch (collection) {
        case 'students':
          const studentsResponse = await api.getStudents();
          data = studentsResponse.data;
          break;
        case 'classes':
          const classesResponse = await api.getClasses();
          data = classesResponse.data;
          break;
        case 'groups':
          const groupsResponse = await api.getGroups();
          data = groupsResponse.data;
          break;
        case 'evaluations':
          const evaluationsResponse = await api.getEvaluations();
          data = evaluationsResponse.data;
          break;
        case 'skills':
          const skillsResponse = await api.getSkills();
          data = skillsResponse.data;
          break;
        case 'absences':
          const absencesResponse = await api.getAbsences();
          data = absencesResponse.data;
          break;
        case 'timetable':
          const timetableResponse = await api.getTimetable();
          data = timetableResponse.data;
          break;
        default:
          throw new Error(`Unknown collection: ${collection}`);
      }

      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${collection}_${timestamp}.json`;
      
      saveAs(blob, filename);
    } catch (error) {
      console.error(`Error exporting ${collection}:`, error);
      throw error;
    }
  }

  // Export all collections as separate JSON files
  static async exportAllSeparate(): Promise<void> {
    try {
      const collections: DataCollection[] = [
        'students', 'classes', 'groups', 'evaluations', 
        'skills', 'absences', 'timetable'
      ];

      for (const collection of collections) {
        await this.exportCollection(collection);
        // Small delay to avoid overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error exporting all collections:', error);
      throw error;
    }
  }

  // Export all collections as a single ZIP file
  static async exportAllAsZip(): Promise<void> {
    try {
      const zip = new JSZip();
      const timestamp = new Date().toISOString().split('T')[0];
      
      // Get all data
      const allDataResponse = await api.exportAllData();
      if (!allDataResponse.success) {
        throw new Error(allDataResponse.error || 'Failed to export data');
      }

      const allData = allDataResponse.data;

      // Add each collection to the ZIP
      for (const [collection, data] of Object.entries(allData)) {
        const jsonData = JSON.stringify(data, null, 2);
        zip.file(`${collection}.json`, jsonData);
      }

      // Add metadata file
      const metadata = {
        exportDate: new Date().toISOString(),
        version: APP_CONFIG.version,
        collections: Object.keys(allData),
        totalRecords: Object.values(allData).reduce((sum, data) => {
          return sum + (Array.isArray(data) ? data.length : 1);
        }, 0)
      };
      zip.file('export_metadata.json', JSON.stringify(metadata, null, 2));

      // Generate and save ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const filename = `schoolsync_export_${timestamp}.zip`;
      
      saveAs(zipBlob, filename);
    } catch (error) {
      console.error('Error exporting as ZIP:', error);
      throw error;
    }
  }
}

// Import utilities
export class ImportManager {
  // Import single JSON file
  static async importFile(file: File, collection?: DataCollection): Promise<boolean> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (collection) {
        // Import to specific collection
        return await this.importToCollection(collection, data);
      } else {
        // Try to auto-detect collection from filename
        const filename = file.name.toLowerCase();
        const detectedCollection = this.detectCollectionFromFilename(filename);
        
        if (detectedCollection) {
          return await this.importToCollection(detectedCollection, data);
        } else {
          throw new Error('Could not detect collection type from filename');
        }
      }
    } catch (error) {
      console.error('Error importing file:', error);
      throw error;
    }
  }

  // Import multiple files
  static async importFiles(files: FileList): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const file of Array.from(files)) {
      try {
        await this.importFile(file);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }

  // Import all data from a complete export
  static async importAllData(data: Record<string, any>): Promise<boolean> {
    try {
      const response = await api.importAllData(data);
      return response.success;
    } catch (error) {
      console.error('Error importing all data:', error);
      throw error;
    }
  }

  // Helper: Detect collection from filename
  private static detectCollectionFromFilename(filename: string): DataCollection | null {
    const collections: DataCollection[] = [
      'students', 'classes', 'groups', 'evaluations', 
      'skills', 'absences', 'timetable'
    ];

    for (const collection of collections) {
      if (filename.includes(collection)) {
        return collection;
      }
    }

    return null;
  }

  // Helper: Import data to specific collection
  private static async importToCollection(collection: DataCollection, data: any): Promise<boolean> {
    try {
      // Validate data structure
      if (!this.validateCollectionData(collection, data)) {
        throw new Error(`Invalid data structure for collection: ${collection}`);
      }

      // Import using the data store
      const importData = { [collection]: data };
      const response = await api.importAllData(importData);
      
      return response.success;
    } catch (error) {
      console.error(`Error importing to ${collection}:`, error);
      throw error;
    }
  }

  // Helper: Validate collection data structure
  private static validateCollectionData(collection: DataCollection, data: any): boolean {
    if (collection === 'timetable') {
      return data && typeof data === 'object' && data.metadata && data.weekdays;
    } else {
      return Array.isArray(data) && data.every(item => item && typeof item === 'object' && item.id);
    }
  }
}

// Utility functions for file handling
export const FileUtils = {
  // Read file as text
  readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  },

  // Validate file type
  isValidFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith(type.split('/')[1])
    );
  },

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};