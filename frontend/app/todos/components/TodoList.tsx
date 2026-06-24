'use client';

import { Todo } from '@/app/types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  isPending: boolean;
}

export default function TodoList({ todos, onToggle, onDelete, isPending }: TodoListProps) {
  if (todos.length === 0) {
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
      {/* 
        React에서 배열을 렌더링할 때 요소의 고유성을 식별하기 위해 key prop이 필수적입니다.
        key가 없으면 React는 배열 요소의 순서를 기반으로 렌더링을 추적하여,
        항목이 삭제되거나 순서가 바뀔 때 불필요한 DOM 업데이트가 발생하거나 상태 꼬임(버그)이 발생합니다.
      */}
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggle={onToggle} 
          onDelete={onDelete} 
          isPending={isPending}
        />
      ))}
    </div>
  );
}
