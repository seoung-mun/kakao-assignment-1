import { useTodoStore } from './useTodoStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * 컴포넌트 리렌더링 최적화를 위한 커스텀 Selector 모음
 * 소프트웨어 엔지니어링 규칙(관심사 분리)에 따라 스토어 구독 로직을 UI 컴포넌트에서 분리합니다.
 */

// 1. 할 일의 ID 목록만 추출하는 Selector
// 내부 상태(completed 등)가 변경되어도 ID 배열이 같으면 리렌더링을 방지합니다.
export const useTodoIds = () => {
  return useTodoStore(
    useShallow((state) => state.todos.map((todo) => todo.id))
  );
};

// 2. 특정 ID의 할 일 객체만 추출하는 Selector
// 다른 할 일이 변경되더라도, 자신이 구독한 ID의 데이터가 바뀔 때만 리렌더링됩니다.
export const useTodoById = (id: number) => {
  return useTodoStore((state) => state.todos.find((todo) => todo.id === id));
};
