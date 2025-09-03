import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTeachers } from '../data/mockData';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('teacherAppUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // In a real app, this would be an API call
    // For demo purposes, we'll use mock data
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple mock authentication
      const foundUser = mockTeachers.find(
        teacher => teacher.email === email && password === 'password123'
      );
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: 'teacher',
          avatar: foundUser.avatar,
        };
        
        setUser(userData);
        localStorage.setItem('teacherAppUser', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('teacherAppUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};