'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // If dateParam is missing, default to today's local date in 'yyyy-MM-dd' to match timezone
      const targetDate = dateParam || format(new Date(), 'yyyy-MM-dd');
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date: new Date(targetDate).toISOString() }),
      });

      if (res.ok) {
        router.push('/todos');
        router.refresh();
      } else {
        throw new Error('Failed to create todo');
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          어떤 할 일을 계획 중이신가요?
        </label>
        <textarea
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 30분 동안 책 읽기"
          className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          autoFocus
        />
      </div>
      
      <button
        type="submit"
        disabled={!title.trim() || isSubmitting}
        className="mt-6 w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '추가 중...' : '할 일 추가'}
      </button>
    </form>
  );
}
