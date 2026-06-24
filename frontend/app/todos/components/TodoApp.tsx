'use client';

import { Todo } from '@/app/types';
import WeeklyCalendar from './WeeklyCalendar';
import FilterTabs from './FilterTabs';
import SearchBar from './SearchBar';
import TodoList from './TodoList';
import Link from 'next/link';
import DateNavigator from './DateNavigator';
import CalendarPopover from './CalendarPopover';
import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';

interface TodoAppProps {
  initialTodos: Todo[];
}

export default function TodoApp({ initialTodos }: TodoAppProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handleToggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);
  const handleCloseCalendar = () => setIsCalendarOpen(false);
  
  const { optimisticTodos, handleToggle, handleDelete, stats, isPending } = useTodos(initialTodos);
  
  return (
    <>
      <header className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">오늘의 할 일</h1>
          <p className="text-sm text-gray-500 mt-1">
            진행 중 {stats.activeCount}개, 완료 {stats.completedCount}개
          </p>
        </div>
        <Link 
          href="/todos/new"
          className="bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md transition-colors"
        >
          +
        </Link>
      </header>

      <div className="pt-4">
        <DateNavigator isCalendarOpen={isCalendarOpen} onToggleCalendar={handleToggleCalendar}>
          <CalendarPopover onClose={handleCloseCalendar} />
        </DateNavigator>
        <WeeklyCalendar />
      </div>
      
      <div className="flex flex-col gap-3">
        <SearchBar />
        <FilterTabs />
      </div>

      <div className="flex-1 overflow-y-auto">
        <TodoList 
          todos={optimisticTodos} 
          onToggle={handleToggle} 
          onDelete={handleDelete} 
          isPending={isPending}
        />
      </div>
    </>
  );
}
