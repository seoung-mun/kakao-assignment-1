import { useState } from 'react'
import { useLocalStorageReducer } from './hooks/useLocalStorageReducer'
import { todoReducer } from './reducers/todoReducer'
import { TODO_ACTIONS } from './constants/actions'
import Header from './components/Header'
import TodoInput from './components/TodoInput'
import FilterTabs from './components/FilterTabs'
import TodoList from './components/TodoList'

// YYYY-MM-DD 형식의 오늘 날짜 구하기 헬퍼 함수
const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function App() {
  // useLocalStorageReducer 커스텀 훅을 통해 로컬스토리지 연동 및 Reducer 패턴 사용
  const [todos, dispatch] = useLocalStorageReducer('todo-app-items', todoReducer, [])
  const [currentFilter, setCurrentFilter] = useState('all')
  
  // Phase 1 단계에서는 오늘 날짜를 기준으로 할 일을 관리합니다. (Phase 3에서 일간 내비게이터 연결 예정)
  const [selectedDate] = useState(getTodayDateString())

  // CRUD 핸들러 정의 (Action Type Enum 객체 활용)
  const handleAddTodo = (text) => {
    dispatch({
      type: TODO_ACTIONS.ADD,
      payload: { text, date: selectedDate }
    })
  }

  const handleToggleTodo = (id) => {
    dispatch({
      type: TODO_ACTIONS.TOGGLE,
      payload: { id }
    })
  }

  const handleUpdateTodoText = (id, text) => {
    dispatch({
      type: TODO_ACTIONS.UPDATE_TEXT,
      payload: { id, text }
    })
  }

  const handleDeleteTodo = (id) => {
    dispatch({
      type: TODO_ACTIONS.DELETE,
      payload: { id }
    })
  }

  // 데이터 가공 흐름: 1차 날짜 필터링 -> 2차 탭 필터링
  const dailyTodos = todos.filter(todo => todo.date === selectedDate)
  
  const filteredTodos = dailyTodos.filter(todo => {
    if (currentFilter === 'active') return !todo.isCompleted
    if (currentFilter === 'completed') return todo.isCompleted
    return true
  })

  // 헤더 통계 계산
  const totalCount = dailyTodos.length
  const completedCount = dailyTodos.filter(todo => todo.isCompleted).length
  const remainingCount = totalCount - completedCount

  return (
    <div className="app-container">
      {/* 헤더 컴포넌트: 통계 전달 및 바운스 애니메이션 지원 */}
      <Header 
        total={totalCount} 
        completed={completedCount} 
        remaining={remainingCount} 
      />

      {/* 할 일 입력창 */}
      <TodoInput onAddTodo={handleAddTodo} />

      {/* 필터 탭 */}
      <FilterTabs 
        currentFilter={currentFilter} 
        onChangeFilter={setCurrentFilter} 
      />

      {/* 할 일 리스트 영역 */}
      <TodoList
        todos={filteredTodos}
        onToggle={handleToggleTodo}
        onUpdateText={handleUpdateTodoText}
        onDelete={handleDeleteTodo}
        currentFilter={currentFilter}
      />
    </div>
  )
}
