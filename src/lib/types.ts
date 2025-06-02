export interface Task {
  id: string;
  name: string;
  deadlineDate: string; // Format YYYY-MM-DD
  deadlineTime: string; // Format HH:MM
  createdAt: number; // Timestamp
}