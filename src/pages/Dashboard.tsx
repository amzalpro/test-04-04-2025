import React from 'react';
import { 
  Calendar, Clock, Users, BookOpen, ClipboardList, 
  ArrowUp, ArrowDown, Activity, MessageSquare, Bell
} from 'lucide-react';
import { mockStudents, mockRecentActivity, mockUpcomingEvents } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Calculate statistics
  const totalStudents = mockStudents.length;
  const averageAttendance = Math.round(
    mockStudents.reduce((sum, student) => sum + student.attendance, 0) / totalStudents
  );
  
  // Get top-performing student
  const topStudent = [...mockStudents].sort((a, b) => {
    const avgA = Object.values(a.grades).reduce((sum, grade) => sum + grade, 0) / Object.values(a.grades).length;
    const avgB = Object.values(b.grades).reduce((sum, grade) => sum + grade, 0) / Object.values(b.grades).length;
    return avgB - avgA;
  })[0];

  // Stats cards
  const statsCards = [
    { icon: Users, label: 'Total Students', value: totalStudents, trend: 'up', color: 'bg-blue-500' },
    { icon: Activity, label: 'Average Attendance', value: `${averageAttendance}%`, trend: 'up', color: 'bg-green-500' },
    { icon: ClipboardList, label: 'Upcoming Tests', value: 2, trend: 'neutral', color: 'bg-amber-500' },
    { icon: MessageSquare, label: 'Unread Messages', value: 5, trend: 'down', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {user?.name.split(' ')[0]}!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentDate}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          <Calendar className="h-4 w-4" />
          <span>Today's Schedule</span>
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
                {card.trend !== 'neutral' && (
                  <span className={`text-xs font-medium ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {card.trend === 'up' ? '+5%' : '-3%'}
                  </span>
                )}
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">{card.value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Two column layout for main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 dark:text-white">Upcoming Events</h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
          </div>
          <div className="p-6 space-y-4">
            {mockUpcomingEvents.map((event) => (
              <div key={event.id} className="flex space-x-4">
                <div className="flex-shrink-0 w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex flex-col items-center justify-center text-indigo-700 dark:text-indigo-400">
                  <span className="text-sm font-semibold">{event.date.split('-')[1]}/{event.date.split('-')[2]}</span>
                  <span className="text-xs">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">{event.title}</h4>
                  <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{event.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {mockRecentActivity.map((activity) => {
                let Icon;
                let bgColor;
                
                switch (activity.type) {
                  case 'grade':
                    Icon = ClipboardList;
                    bgColor = 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
                    break;
                  case 'attendance':
                    Icon = Users;
                    bgColor = 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
                    break;
                  case 'lesson':
                    Icon = BookOpen;
                    bgColor = 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
                    break;
                  case 'message':
                    Icon = MessageSquare;
                    bgColor = 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
                    break;
                  default:
                    Icon = Bell;
                    bgColor = 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
                }
                
                return (
                  <div key={activity.id} className="flex space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 dark:text-white">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Student */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-800 dark:text-white">Top Performing Student</h3>
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
              <p className="text-gray-500 dark:text-gray-400">Class {topStudent.class}, Roll {topStudent.roll}</p>
              
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
    </div>
  );
};

export default Dashboard;