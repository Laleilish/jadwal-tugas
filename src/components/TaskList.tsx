"use client";
import { Task } from "@/lib/types";
import { Trash2, CalendarDays, Clock, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import TaskModal from "./TaskModal";

interface TaskListProps {
  tasks: Task[];
  onTaskDeleted: () => void;
  filter: "all" | "thisMonth" | "nextMonth" | "thisWeek";
}

export default function TaskList({
  tasks,
  onTaskDeleted,
  filter,
}: TaskListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      return;
    }
    setIsDeleting(taskId);
    setError(null);
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus tugas");
      }
      onTaskDeleted();
    } catch (err: any) {
      setError(err.message);
      console.error("Error deleting task:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === "00:00") return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const getFilteredTasks = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Senin
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Minggu
    endOfWeek.setHours(23, 59, 59, 999);

    return tasks
      .filter((task) => {
        const taskDeadline = new Date(task.deadlineDate);
        taskDeadline.setHours(0, 0, 0, 0);

        if (filter === "thisMonth") {
          return (
            taskDeadline.getMonth() === currentMonth &&
            taskDeadline.getFullYear() === currentYear
          );
        }
        if (filter === "nextMonth") {
          const nextMonthDate = new Date(now);
          nextMonthDate.setMonth(currentMonth + 1);
          if (nextMonthDate.getMonth() === 0 && currentMonth === 11) {
            return (
              taskDeadline.getMonth() === nextMonthDate.getMonth() &&
              taskDeadline.getFullYear() === currentYear + 1
            );
          }
          return (
            taskDeadline.getMonth() === nextMonthDate.getMonth() &&
            taskDeadline.getFullYear() === nextMonthDate.getFullYear()
          );
        }
        if (filter === "thisWeek") {
        return taskDeadline >= startOfWeek && taskDeadline <= endOfWeek;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.deadlineDate}T${a.deadlineTime || "00:00"}`
        );
        const dateB = new Date(
          `${b.deadlineDate}T${b.deadlineTime || "00:00"}`
        );
        return dateA.getTime() - dateB.getTime();
      });
  };

  const filteredTasks = getFilteredTasks();

  if (tasks.length === 0 && filter === "all") {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
        Belum ada tugas. Silakan tambahkan tugas baru.
      </p>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
        Tidak ada tugas untuk periode ini.
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
      {error && (
        <div className="m-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Nama Tugas
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Deadline
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Waktu
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTasks.map((task) => {
            const deadline = new Date(task.deadlineDate);
            const now = new Date();
            const todayNormalized = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            );
            const deadlineNormalized = new Date(
              deadline.getFullYear(),
              deadline.getMonth(),
              deadline.getDate()
            );
            const isOverdue = deadlineNormalized < todayNormalized;
            const isDueToday =
              deadlineNormalized.getTime() === todayNormalized.getTime();
            let rowClass = "";
            if (isOverdue) rowClass = "bg-red-50 dark:bg-red-900/30";
            else if (isDueToday)
              rowClass = "bg-yellow-50 dark:bg-yellow-900/30";

            return (
              <tr key={task.id} className={rowClass}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* MODIFIKASI DI SINI */}
                  <div className="flex items-center">
                    <TaskModal
                      id={task.id}
                      name={task.name}
                      deadlineDate={formatDate(task.deadlineDate)}
                      deadlineTime={formatTime(task.deadlineTime)}
                      createdAt={task.createdAt}
                      attachmentLink={task.attachmentLink}
                      submitLink={task.submitLink}
                    />
                    {task.attachmentLink && (
                      <a
                        href={task.attachmentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                        title="Buka Lampiran"
                      >
                        <LinkIcon size={16} />{" "}
                        {/* Pastikan LinkIcon sudah diimpor */}
                      </a>
                    )}
                    {task.submitLink && (
                      <a
                        href={task.submitLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                        title="Kumpulkan Tugas"
                      >
                        <LinkIcon size={16} />{" "}
                        {/* Pastikan LinkIcon sudah diimpor */}
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <CalendarDays
                      size={16}
                      className="mr-2 text-gray-400 dark:text-gray-500"
                    />
                    {formatDate(task.deadlineDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.deadlineTime && task.deadlineTime !== "00:00" ? (
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Clock
                        size={16}
                        className="mr-2 text-gray-400 dark:text-gray-500"
                      />
                      {formatTime(task.deadlineTime)}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      -
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={isDeleting === task.id}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                    title="Hapus Tugas"
                  >
                    {isDeleting === task.id ? (
                      <svg
                        className="animate-spin h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
