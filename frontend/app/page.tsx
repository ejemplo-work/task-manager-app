'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Task {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-6206.up.railway.app';

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'completed':
      return styles.badgeCompleted;
    case 'in-progress':
      return styles.badgeProgress;
    default:
      return styles.badgePending;
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'completed':
      return 'Done';
    case 'in-progress':
      return 'In Progress';
    default:
      return 'Pending';
  }
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status: 'pending' }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      setTitle('');
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task?.title, status }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>
          <span className={styles.emoji}>📋</span> Task Manager
        </h1>
        <p className={styles.subtitle}>Organize and track your tasks</p>
      </header>

      {/* Error banner */}
      {error && (
        <div className={styles.errorBanner}>⚠ {error}</div>
      )}

      {/* Create form */}
      <form onSubmit={handleCreate} className={styles.createForm}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={styles.input}
        />
        <button type="submit" className={styles.addButton}>
          + Add Task
        </button>
      </form>

      {/* Task list */}
      {loading ? (
        <p className={styles.loadingState}>Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className={styles.emptyState}>No tasks yet — add one above!</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.taskCard}>
              <div className={styles.taskInfo}>
                <span className={styles.taskTitle}>{task.title}</span>
                <span className={`${styles.badge} ${statusBadgeClass(task.status)}`}>
                  {statusLabel(task.status)}
                </span>
              </div>
              <div className={styles.taskActions}>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => handleDelete(task.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
