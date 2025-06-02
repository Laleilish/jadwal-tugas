'use client';
import { useState, useEffect, useCallback } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import MonthlyCalendar from '@/components/MonthlyCalendar'; // Impor komponen baru
import { Task } from '@/lib/types';
import { ListFilter, Moon, Sun, List, Calendar } from 'lucide-react';

type ViewMode = 'list' | 'calendar';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'thisMonth' | 'nextMonth'>('all');
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // State untuk mode tampilan

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Gagal mengambil data tugas');
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (!('darkMode' in localStorage) && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (typeof window !== 'undefined') {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Jadwal Tugas CukuP</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? "Mode Terang" : "Mode Gelap"}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskForm onTaskAdded={fetchTasks} />

        <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-0">Daftar Tugas</h2>
                
                <div className="flex items-center space-x-2">
                  {/* Tombol Pilihan Tampilan */}
                  <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                        viewMode === 'list' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <List size={20} className="sm:hidden" />
                      <span className="hidden sm:inline">Daftar</span>
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                        viewMode === 'calendar' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Calendar size={20} className="sm:hidden" />
                      <span className="hidden sm:inline">Kalender</span>
                    </button>
                  </div>
                  
                  {/* Filter hanya muncul di mode Daftar */}
                  {viewMode === 'list' && (
                    <div className="relative">
                      <ListFilter size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value as 'all' | 'thisMonth' | 'nextMonth')}
                          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                          <option value="all">Semua Tugas</option>
                          <option value="thisMonth">Bulan Ini</option>
                          <option value="nextMonth">Bulan Depan</option>
                      </select>
                    </div>
                  )}
                </div>
            </div>

            {isLoading && <p className="text-center py-4">Memuat tugas...</p>}
            {error && <p className="text-center text-red-500 py-4">Error: {error}</p>}
            
            {/* Conditional Rendering berdasarkan viewMode */}
            {!isLoading && !error && (
              viewMode === 'list' ? (
                <TaskList tasks={tasks} onTaskDeleted={fetchTasks} filter={filter} />
              ) : (
                <MonthlyCalendar tasks={tasks} />
              )
            )}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        Dibuat dengan Next.js & Vercel KV - &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}