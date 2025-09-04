import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, BookOpen, ClipboardList, 
  ArrowUp, ArrowDown, Activity, MessageSquare, Bell,
  FileText, Archive
} from 'lucide-react';
import { api } from '../api/dataStore';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../ui/AlertContext';
import ExportImportPanel from '../ui/ExportImportPanel';
import type { Student, Class, Evaluation, Absence } from '../api/types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlerts();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averageAttendance: 0,
    upcomingEvaluations: 0,
    completedEvaluations: 0,
    globalAverage: 0
  });
  const [topStudent, setTopStudent] = useState<Student | null>(null);
  const [recentAbsences, setRecentAbsences] = useState<Absence[]>([]);

  const currentDate = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all required data
      const [studentsRes, classesRes, evaluationsRes, absencesRes] = await Promise.all([
        api.getStudents(),
        api.getClasses(),
        api.getEvaluations(),
        api.getAbsences()
      ]);

      if (!studentsRes.success || !classesRes.success || !evaluationsRes.success || !absencesRes.success) {
        throw new Error('Failed to load dashboard data');
      }

      const students = studentsRes.data;
      const classes = classesRes.data;
      const evaluations = evaluationsRes.data;
      const absences = absencesRes.data;

      // Calculate statistics
      const totalStudents = students.length;
      const totalClasses = classes.length;
      
      // Average attendance
      const averageAttendance = totalStudents > 0 
        ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / totalStudents)
        : 0;

      // Evaluations stats
      const upcomingEvaluations = evaluations.filter(e => e.status === 'upcoming').length;
      const completedEvaluations = evaluations.filter(e => e.status === 'completed').length;

      // Global average calculation
      const allGrades = students.flatMap(s => Object.values(s.grades));
      const globalAverage = allGrades.length > 0 
        ? Math.round(allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length)
        : 0;

      // Find top student
      const studentsWithAvg = students.map(student => {
        const grades = Object.values(student.grades);
        const average = grades.length > 0 
          ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length
          : 0;
        return { ...student, average };
      });
      
      const topPerformer = studentsWithAvg.sort((a, b) => b.average - a.average)[0] || null;

      // Recent absences (last 5)
      const sortedAbsences = absences
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setStats({
        totalStudents,
        totalClasses,
        averageAttendance,
        upcomingEvaluations,
        completedEvaluations,
        globalAverage
      });
      
      setTopStudent(topPerformer);
      setRecentAbsences(sortedAbsences);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      addAlert({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de charger les données du tableau de bord'
      });
    } finally {
      setLoading(false);
    }
  };

  // Stats cards
  const statsCards = [
    { 
      icon: Users, 
      label: 'Total Élèves', 
      value: stats.totalStudents, 
      trend: 'up', 
      color: 'bg-blue-500',
      description: `Répartis sur ${stats.totalClasses} classes`
    },
    { 
      icon: Activity, 
      label: 'Assiduité Moyenne', 
      value: `${stats.averageAttendance}%`, 
      trend: stats.averageAttendance >= 90 ? 'up' : stats.averageAttendance >= 80 ? 'neutral' : 'down', 
      color: 'bg-green-500',
      description: 'Présence des élèves'
    },
    { 
      icon: ClipboardList, 
      label: 'Évaluations', 
      value: stats.upcomingEvaluations, 
      trend: 'neutral', 
      color: 'bg-amber-500',
      description: `${stats.completedEvaluations} terminées`
    },
    { 
      icon: BookOpen, 
      label: 'Moyenne Générale', 
      value: `${stats.globalAverage}%`, 
      trend: stats.globalAverage >= 75 ? 'up' : stats.globalAverage >= 65 ? 'neutral' : 'down', 
      color: 'bg-purple-500',
      description: 'Toutes matières confondues'
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Bienvenue, {user?.name.split(' ')[0]}!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentDate}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          <Calendar className="h-4 w-4" />
          <span>Tableau de bord</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
          >
            <div className="flex justify-between">
              <div className={`w-12 h-12 rounded-lg ${card.color} text-white flex items-center justify-center`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center space-x-1">
                {card.trend === 'up' && (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                )}
                {card.trend === 'down' && (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">{card.value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Two column layout for main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Absences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 dark:text-white">Absences Récentes</h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Voir tout</button>
          </div>
          <div className="p-6 space-y-4">
            {recentAbsences.length > 0 ? recentAbsences.map((absence) => (
              <div key={absence.id} className="flex space-x-4">
                <div className="flex-shrink-0 w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-lg flex flex-col items-center justify-center text-red-700 dark:text-red-400">
                  <span className="text-sm font-semibold">{absence.date.split('-')[2]}</span>
                  <span className="text-xs">{absence.date.split('-')[1]}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    Absence - {absence.subject}
                  </h4>
                  <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{absence.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {absence.type === 'excused' ? 'Justifiée' : 'Non justifiée'}: {absence.reason}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Aucune absence récente
              </p>
            )}
          </div>
        </div>

        {/* Export/Import Panel */}
        <ExportImportPanel />
      </div>

      {/* Top Performing Student */}
      {topStudent && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-white">Meilleur Élève</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
              <img 
                src={topStudent.avatar} 
                alt={topStudent.name} 
                className="w-24 h-24 rounded-full object-cover mb-4 sm:mb-0"
              />
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-white">{topStudent.name}</h4>
                <p className="text-gray-500 dark:text-gray-400">Classe {topStudent.class}, N° {topStudent.roll}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Assiduité: {topStudent.attendance}%
                </p>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(topStudent.grades).map(([subject, grade]) => (
                    <div key={subject} className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{subject}</div>
                      <div className="mt-1 text-lg font-semibold text-gray-800 dark:text-white">{grade}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;