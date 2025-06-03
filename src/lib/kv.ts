import { createClient } from "@vercel/kv";
import { Task } from "./types";

const kvClient = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const TASKS_KEY = "all_tasks"; 

// Fungsi untuk mendapatkan semua tugas
export async function getAllTasks(): Promise<Task[]> {
  try {
    const tasks = await kvClient.get<Task[]>(TASKS_KEY);
    return tasks || []; 
  } catch (error) {
    console.error("Error fetching tasks from KV:", error);
    return [];
  }
}

// Fungsi untuk menyimpan semua tugas (menimpa yang lama)
export async function saveAllTasks(tasks: Task[]): Promise<void> {
  try {
    await kvClient.set(TASKS_KEY, tasks);
  } catch (error) {
    console.error("Error saving tasks to KV:", error);
    throw new Error("Gagal menyimpan tugas.");
  }
}