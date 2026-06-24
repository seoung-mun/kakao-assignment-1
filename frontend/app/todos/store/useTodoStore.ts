import { create } from 'zustand';
import { Todo } from '@/app/types';
import toast from 'react-hot-toast';

interface TodoStore {
  todos: Todo[];
  isCalendarOpen: boolean;
  pendingIds: number[]; // Track loading state per item
  
  // Hydration
  setInitialTodos: (todos: Todo[]) => void;
  
  // UI State
  setCalendarOpen: (isOpen: boolean) => void;
  toggleCalendar: () => void;
  
  // Actions
  toggleTodo: (id: number, currentCompleted: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  isCalendarOpen: false,
  pendingIds: [],

  setInitialTodos: (todos) => set({ todos }),
  
  setCalendarOpen: (isOpen) => set({ isCalendarOpen: isOpen }),
  toggleCalendar: () => set((state) => ({ isCalendarOpen: !state.isCalendarOpen })),

  toggleTodo: async (id, currentCompleted) => {
    // Optimistic Update & Set Pending
    set((state) => ({
      todos: state.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !currentCompleted } : todo
      ),
      pendingIds: [...state.pendingIds, id]
    }));

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentCompleted }),
      });
      if (!res.ok) throw new Error('API Error');
    } catch (error) {
      // Rollback specific item only
      set((state) => ({
        todos: state.todos.map(todo => 
          todo.id === id ? { ...todo, completed: currentCompleted } : todo
        )
      }));
      toast.error('상태 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      // Remove Pending
      set((state) => ({ pendingIds: state.pendingIds.filter(pid => pid !== id) }));
    }
  },

  deleteTodo: async (id) => {
    // Optimistic Update & Set Pending
    let todoToDelete: Todo | undefined;
    
    set((state) => {
      todoToDelete = state.todos.find(t => t.id === id);
      return {
        todos: state.todos.filter(todo => todo.id !== id),
        pendingIds: [...state.pendingIds, id]
      };
    });

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('API Error');
      toast.success('할 일이 삭제되었습니다.');
    } catch (error) {
      // Rollback specific item only
      if (todoToDelete) {
        set((state) => ({
          todos: [...state.todos, todoToDelete!]
        }));
      }
      toast.error('삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      // Remove Pending
      set((state) => ({ pendingIds: state.pendingIds.filter(pid => pid !== id) }));
    }
  }
}));
