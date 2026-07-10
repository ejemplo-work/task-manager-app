'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-6206.up.railway.app';

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
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋 Task Manager</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        API: {API_URL}
      </p>

      {error && (
        <div style={{ padding: '1rem', background: '#fee', border: '1px solid #fcc', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title..."
          style={{ flex: 1, padding: '0.75rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p style={{ color: '#888' }}>No tasks yet. Create one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', marginBottom: '0.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
              <span style={{ flex: 1 }}>
                <strong>{task.title}</strong>
                <span style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', fontSize: '0.75rem', background: task.status === 'completed' ? '#d4edda' : task.status === 'in-progress' ? '#fff3cd' : '#e2e3e5', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {task.status}
                </span>
              </span>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button onClick={() => handleDelete(task.id)} style={{ padding: '0.4rem 0.8rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
