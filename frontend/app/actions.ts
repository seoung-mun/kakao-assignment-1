'use server';

import { Todo } from './types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function getTodos(filter?: string | null, search?: string | null, date?: string | null): Promise<Todo[]> {
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  if (search) params.append('search', search);
  if (date) params.append('date', date);
  const query = params.toString();
  
  try {
    // revalidate: 0 ensures we fetch fresh data on every request (for dynamic pages)
    const res = await fetch(`${BACKEND_URL}/todos?${query}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return [];
  }
}

export async function getTodo(id: string): Promise<Todo | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch todo:", error);
    return null;
  }
}
