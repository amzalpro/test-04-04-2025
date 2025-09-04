import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AlertProvider } from './ui/AlertContext';
import AlertContainer from './ui/AlertContainer';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Evaluations from './pages/Evaluations';
import Schedule from './pages/Schedule';
import Calendar from './pages/Calendar';
import LessonPlanner from './pages/LessonPlanner';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="evaluations" element={<Evaluations />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="lessons" element={<LessonPlanner />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
          <AlertContainer />
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;