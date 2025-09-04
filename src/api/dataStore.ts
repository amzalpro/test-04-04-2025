import { APP_CONFIG } from '../config/app.js';
import type { 
  Student, Class, Group, Evaluation, Skill, Absence, Timetable,
  DataCollection, ApiResponse 
} from './types.js';

// In-memory data store
class DataStore {
  private data: Map<DataCollection, any[]> = new Map();
  private timetable: Timetable | null = null;
  private loaded: Set<DataCollection> = new Set();

  // Load data from JSON files
  async loadCollection<T>(collection: DataCollection): Promise<T[]> {
    if (this.loaded.has(collection) && collection !== 'timetable') {
      return this.data.get(collection) || [];
    }

    try {
      const filename = APP_CONFIG.data.collections[collection];
      const response = await fetch(`${APP_CONFIG.api.baseUrl}/${filename}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${collection}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (collection === 'timetable') {
        this.timetable = data;
        return data as T[];
      } else {
        this.data.set(collection, data);
        this.loaded.add(collection);
        return data;
      }
    } catch (error) {
      console.error(`Error loading ${collection}:`, error);
      return [];
    }
  }

  // Get data from store
  getData<T>(collection: DataCollection): T[] {
    if (collection === 'timetable') {
      return (this.timetable ? [this.timetable] : []) as T[];
    }
    return this.data.get(collection) || [];
  }

  // Set data in store
  setData<T>(collection: DataCollection, data: T[]): void {
    if (collection === 'timetable') {
      this.timetable = data[0] as Timetable;
    } else {
      this.data.set(collection, data);
    }
    this.loaded.add(collection);
  }

  // Add item to collection
  addItem<T extends { id: string }>(collection: DataCollection, item: T): void {
    if (collection === 'timetable') {
      this.timetable = item as Timetable;
    } else {
      const currentData = this.data.get(collection) || [];
      currentData.push(item);
      this.data.set(collection, currentData);
    }
  }

  // Update item in collection
  updateItem<T extends { id: string }>(collection: DataCollection, id: string, updatedItem: T): boolean {
    if (collection === 'timetable') {
      this.timetable = updatedItem as Timetable;
      return true;
    }

    const currentData = this.data.get(collection) || [];
    const index = currentData.findIndex(item => item.id === id);
    
    if (index !== -1) {
      currentData[index] = updatedItem;
      this.data.set(collection, currentData);
      return true;
    }
    return false;
  }

  // Delete item from collection
  deleteItem(collection: DataCollection, id: string): boolean {
    if (collection === 'timetable') {
      this.timetable = null;
      return true;
    }

    const currentData = this.data.get(collection) || [];
    const index = currentData.findIndex(item => item.id === id);
    
    if (index !== -1) {
      currentData.splice(index, 1);
      this.data.set(collection, currentData);
      return true;
    }
    return false;
  }

  // Search items in collection
  search<T extends { id: string }>(
    collection: DataCollection, 
    searchTerm: string, 
    fields: string[]
  ): T[] {
    const data = this.getData<T>(collection);
    if (!searchTerm) return data;

    return data.filter(item =>
      fields.some(field => {
        const value = (item as any)[field];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }

  // Get all data for export
  getAllData(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [collection, data] of this.data.entries()) {
      result[collection] = data;
    }
    
    if (this.timetable) {
      result.timetable = this.timetable;
    }
    
    return result;
  }

  // Clear all data
  clear(): void {
    this.data.clear();
    this.timetable = null;
    this.loaded.clear();
  }

  // Import data from external source
  importData(data: Record<string, any>): void {
    this.clear();
    
    for (const [collection, items] of Object.entries(data)) {
      if (collection === 'timetable') {
        this.timetable = items as Timetable;
      } else if (Array.isArray(items)) {
        this.data.set(collection as DataCollection, items);
        this.loaded.add(collection as DataCollection);
      }
    }
  }
}

// Global data store instance
export const dataStore = new DataStore();

// API wrapper functions
export const api = {
  // Students
  async getStudents(): Promise<ApiResponse<Student[]>> {
    try {
      const data = await dataStore.loadCollection<Student>('students');
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  async addStudent(student: Student): Promise<ApiResponse<Student>> {
    try {
      dataStore.addItem('students', student);
      return { data: student, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: student, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  async updateStudent(id: string, student: Student): Promise<ApiResponse<Student>> {
    try {
      const success = dataStore.updateItem('students', id, student);
      return { 
        data: student, 
        success, 
        error: success ? undefined : 'Student not found',
        timestamp: new Date().toISOString() 
      };
    } catch (error) {
      return { 
        data: student, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  async deleteStudent(id: string): Promise<ApiResponse<boolean>> {
    try {
      const success = dataStore.deleteItem('students', id);
      return { 
        data: success, 
        success, 
        error: success ? undefined : 'Student not found',
        timestamp: new Date().toISOString() 
      };
    } catch (error) {
      return { 
        data: false, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  // Classes
  async getClasses(): Promise<ApiResponse<Class[]>> {
    try {
      const data = await dataStore.loadCollection<Class>('classes');
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  // Groups
  async getGroups(): Promise<ApiResponse<Group[]>> {
    try {
      const data = await dataStore.loadCollection<Group>('groups');
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  // Evaluations
  async getEvaluations(): Promise<ApiResponse<Evaluation[]>> {
    try {
      const data = await dataStore.loadCollection<Evaluation>('evaluations');
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  // Skills
  async getSkills(): Promise<ApiResponse<Skill[]>> {
    try {
      const data = await dataStore.loadCollection<Skill>('skills');
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  // Absences
  async getAbsences(): Promise<ApiResponse<Absence[]>> {
    try {
      const data = await dataStore.loadCollection<Absence>('absences');
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  // Timetable
  async getTimetable(): Promise<ApiResponse<Timetable>> {
    try {
      const data = await dataStore.loadCollection<Timetable>('timetable');
      return { 
        data: data[0] || {} as Timetable, 
        success: true, 
        timestamp: new Date().toISOString() 
      };
    } catch (error) {
      return { 
        data: {} as Timetable, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  // Search functionality
  async searchStudents(searchTerm: string): Promise<ApiResponse<Student[]>> {
    try {
      await dataStore.loadCollection<Student>('students');
      const data = dataStore.search<Student>('students', searchTerm, ['name', 'roll', 'email', 'class']);
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  // Export/Import functionality
  async exportAllData(): Promise<ApiResponse<Record<string, any>>> {
    try {
      // Ensure all collections are loaded
      await Promise.all([
        dataStore.loadCollection('students'),
        dataStore.loadCollection('classes'),
        dataStore.loadCollection('groups'),
        dataStore.loadCollection('evaluations'),
        dataStore.loadCollection('skills'),
        dataStore.loadCollection('absences'),
        dataStore.loadCollection('timetable')
      ]);

      const data = dataStore.getAllData();
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: {}, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  },

  async importAllData(data: Record<string, any>): Promise<ApiResponse<boolean>> {
    try {
      dataStore.importData(data);
      return { data: true, success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        data: false, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }
};