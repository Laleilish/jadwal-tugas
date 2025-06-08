import { NextResponse } from 'next/server';
import { getAllTasks as getTasksFromKV, saveAllTasks as saveTasksToKV } from '@/lib/kv';
import { Task } from '@/lib/types';

// GET /api/tasks - Mengambil semua tugas
export async function GET() {
  try {
    const tasks = await getTasksFromKV();
    // Urutkan tugas berdasarkan tanggal deadline (terdekat dulu)
    const sortedTasks = tasks.sort((a, b) => {
      const dateA = new Date(`${a.deadlineDate}T${a.deadlineTime || '00:00'}`);
      const dateB = new Date(`${b.deadlineDate}T${b.deadlineTime || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });
    return NextResponse.json(sortedTasks);
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ message: 'Gagal mengambil tugas' }, { status: 500 });
  }
}

// POST /api/tasks - Menambah tugas baru
export async function POST(request: Request) {
  try {
    // AMBIL attachmentLink DARI REQUEST BODY
    const { name, deadlineDate, deadlineTime, attachmentLink, submitionLink } = await request.json();

    if (!name || !deadlineDate) {
      return NextResponse.json({ message: 'Nama tugas dan tanggal deadline harus diisi' }, { status: 400 });
    }

    const tasks = await getTasksFromKV();
    const newTask: Task = {
      id: crypto.randomUUID(), // ID unik untuk setiap tugas
      name,
      deadlineDate,
      deadlineTime: deadlineTime || "00:00", // Default waktu jika tidak diisi
      attachmentLink: attachmentLink || undefined, // SIMPAN attachmentLink (atau undefined jika kosong)
      submitionLink: submitionLink || undefined,
      createdAt: Date.now(),
    };
    tasks.push(newTask);
    await saveTasksToKV(tasks);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ message: 'Gagal menambah tugas' }, { status: 500 });
  }
}

// DELETE /api/tasks?id={taskId} - Menghapus tugas berdasarkan ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json({ message: 'ID Tugas dibutuhkan' }, { status: 400 });
    }

    let tasks = await getTasksFromKV();
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== taskId);

    if (tasks.length === initialLength) {
      return NextResponse.json({ message: 'Tugas tidak ditemukan' }, { status: 404 });
    }

    await saveTasksToKV(tasks);
    return NextResponse.json({ message: 'Tugas berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error("API DELETE Error:", error);
    return NextResponse.json({ message: 'Gagal menghapus tugas' }, { status: 500 });
  }
}