'use client';

import TodoItem from './TodoItem';
import { useTodoIds } from '../store/useTodoSelectors';

export default function TodoList() {
  const todoIds = useTodoIds();

  if (todoIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p className="text-sm">할 일이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {todoIds.map(id => (
        <TodoItem 
          key={id} 
          id={id} 
        />
      ))}
    </div>
  );
}
