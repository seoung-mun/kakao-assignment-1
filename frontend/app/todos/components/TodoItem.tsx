'use client';

import { Todo } from '@/app/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  isPending: boolean;
}

export default function TodoItem({ todo, onToggle, onDelete, isPending }: TodoItemProps) {
  return (
    <div className={`flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl mb-3 shadow-sm transition-all hover:border-purple-200 hover:shadow-md ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      <button 
        onClick={() => onToggle(todo.id, todo.completed)}
        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
          todo.completed 
            ? 'bg-purple-600 border-purple-600' 
            : 'border-gray-300 hover:border-purple-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate transition-colors ${
          todo.completed ? 'text-gray-400 line-through' : 'text-gray-800 font-medium'
        }`}>
          {todo.title}
        </p>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="text-gray-400 hover:text-red-500 transition-colors p-1"
        aria-label="Delete todo"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
