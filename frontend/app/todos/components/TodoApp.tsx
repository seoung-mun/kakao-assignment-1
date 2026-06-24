'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Todo } from '@/app/types';
import WeeklyCalendar from './WeeklyCalendar';
import FilterTabs from './FilterTabs';
import SearchBar from './SearchBar';
import TodoList from './TodoList';
import Link from 'next/link';

interface TodoAppProps {
  initialTodos: Todo[];
}

export default function TodoApp({ initialTodos }: TodoAppProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const handleToggle = async (id: number, completed: boolean) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
    }
  };

  // 통계 계산
  const total = initialTodos.length;
  const completedCount = initialTodos.filter(t => t.completed).length;
  const activeCount = total - completedCount;

  return (
    <>
      <header className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Today</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeCount} tasks pending, {completedCount} completed
          </p>
        </div>
        <Link 
          href="/todos/new"
          className="bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md transition-colors"
        >
          +
        </Link>
      </header>

      <WeeklyCalendar />
      
      <div className="flex flex-col gap-3">
        <SearchBar />
        <FilterTabs />
      </div>

      <div className="flex-1 overflow-y-auto">
        <TodoList 
          todos={initialTodos} 
          onToggle={handleToggle} 
          onDelete={handleDelete} 
          isPending={isPending}
        />
      </div>
    </>
  );
}
