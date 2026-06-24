import { useOptimistic, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Todo } from '@/app/types';

export function useTodos(initialTodos: Todo[]) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    initialTodos,
    (state, action: { type: 'toggle' | 'delete', id: number, completed?: boolean }) => {
      switch (action.type) {
        case 'toggle':
          return state.map(todo => 
            todo.id === action.id ? { ...todo, completed: action.completed! } : todo
          );
        case 'delete':
          return state.filter(todo => todo.id !== action.id);
        default:
          return state;
      }
    }
  );

  const handleToggle = async (id: number, completed: boolean) => {
    addOptimisticTodo({ type: 'toggle', id, completed: !completed });
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
    addOptimisticTodo({ type: 'delete', id });
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

  const stats = useMemo(() => {
    const total = optimisticTodos.length;
    const completedCount = optimisticTodos.filter(t => t.completed).length;
    const activeCount = total - completedCount;
    return { total, completedCount, activeCount };
  }, [optimisticTodos]);

  return {
    optimisticTodos,
    handleToggle,
    handleDelete,
    stats,
    isPending,
  };
}
