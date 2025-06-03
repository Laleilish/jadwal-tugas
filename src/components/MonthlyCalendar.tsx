'use client';
import { useState } from 'react';
import { Task } from '@/lib/types';

import { ChevronLeft, ChevronRight, Circle, Link as LinkIcon } from 'lucide-react';

interface MonthlyCalendarProps {
  tasks: Task[];
}

export default function MonthlyCalendar({ tasks }: MonthlyCalendarProps) {
 
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getTasksForDay = (day: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadlineDate + 'T00:00:00');
      return (
        taskDate.getFullYear() === currentYear &&
        taskDate.getMonth() === currentMonth &&
        taskDate.getDate() === day
      );
    }).sort((a,b) => (a.deadlineTime || "00:00").localeCompare(b.deadlineTime || "00:00"));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 transition-colors duration-300">
      {/* Header Kalender */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          {new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(currentDate)}
        </h2>
        <div className="flex items-center space-x-1">
          <button onClick={handlePrevMonth} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNextMonth} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Grid Kalender */}
      <div className="grid grid-cols-7 border-l border-gray-200 dark:border-gray-700">
        {/* Header Hari */}
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-xs sm:text-sm text-gray-500 dark:text-gray-400 py-3 border-b border-t border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            {day}
          </div>
        ))}

        {/* Kotak Kosong Awal Bulan */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="border-b border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20"></div>
        ))}

        {/* Hari-hari dalam Sebulan */}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const dayNumber = day + 1;
          const today = new Date();
          const isToday =
            dayNumber === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          const tasksForDay = getTasksForDay(dayNumber);

          return (
            <div key={dayNumber} className="relative border-b border-r border-gray-200 dark:border-gray-700 min-h-[120px] p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold mb-1 ${
                  isToday 
                  ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' 
                  : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {dayNumber}
              </div>
              <div className="space-y-1">
                {tasksForDay.slice(0, 2).map(task => ( // Tampilkan maksimal 2 tugas (agar tidak terlalu penuh)
                  // UPDATE DI SINI UNTUK MENAMPILKAN IKON LINK
                  <div key={task.id} className="flex items-center text-xs bg-blue-100 dark:bg-blue-900/60 p-1.5 rounded-md shadow-sm border-l-4 border-blue-500 group/task relative">
                    <span className="font-medium text-gray-700 dark:text-gray-200 truncate flex-grow">{task.name}</span>
                    {task.attachmentLink && (
                      <a
                        href={task.attachmentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 flex-shrink-0 opacity-0 group-hover/task:opacity-100 transition-opacity"
                        title="Buka Lampiran"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkIcon size={12} />
                      </a>
                    )}
                  </div>
                ))}
                {tasksForDay.length > 2 && (
                   <div className="text-xs text-center text-gray-500 dark:text-gray-400 pt-1 font-semibold">
                     + {tasksForDay.length - 2} tugas lagi
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}