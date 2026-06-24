import TodoForm from './components/TodoForm';

import { Suspense } from 'react';

export default function NewTodoPage() {
  return (
    <main className="w-full max-w-lg min-h-[600px] bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6 relative">
      <header className="flex items-center gap-4 border-b border-gray-100 pb-4">
        <a href="/todos" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">새로운 할 일</h1>
      </header>
      
      <div className="flex-1 mt-4">
        <Suspense fallback={<div>Loading...</div>}>
          <TodoForm />
        </Suspense>
      </div>
    </main>
  );
}
