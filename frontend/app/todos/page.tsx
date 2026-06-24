import { Suspense } from 'react';
import TodoApp from './components/TodoApp';
import { getTodos } from '@/app/actions';
import { format } from 'date-fns';

export default async function TodosPage(props: {
  searchParams?: Promise<{ filter?: string; search?: string; date?: string }>;
}) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || null;
  const search = searchParams?.search || null;
  const date = searchParams?.date || format(new Date(), 'yyyy-MM-dd');
  
  const initialTodos = await getTodos(filter, search, date);
  
  return (
    <main className="w-full max-w-lg min-h-[600px] bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6 relative">
      <Suspense fallback={<div className="text-center p-10">로딩 중...</div>}>
        <TodoApp initialTodos={initialTodos} />
      </Suspense>
    </main>
  );
}
