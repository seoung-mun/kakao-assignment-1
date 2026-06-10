import { useState, useMemo } from 'react'
import { useLocalStorageReducer } from './hooks/useLocalStorageReducer'
import { todoReducer } from './reducers/todoReducer'
import { TODO_ACTIONS } from './constants/actions'
import { useCalendar } from './hooks/useCalendar'
import Header from './components/Header'
import DateNavigator from './components/DateNavigator'
import CalendarPopover from './components/CalendarPopover'
import TodoInput from './components/TodoInput'
import FilterTabs from './components/FilterTabs'
import TodoList from './components/TodoList'
import WeeklyView from './components/WeeklyView'

export default function App() {
  // useLocalStorageReducer 커스텀 훅: 로컬스토리지 연동 및 Reducer 패턴 사용
  const [todos, dispatch] = useLocalStorageReducer('todo-app-items', todoReducer, [])
  const [currentFilter, setCurrentFilter] = useState('all')
  
  // useCalendar 커스텀 훅: 날짜 표시, 하루 전/후 이동, 캘린더 그리드 생성 캡슐화
  const {
    selectedDate,
    calendarTargetDate,
    isCalendarOpen,
    selectDate,
    goToPrevDay,
    goToNextDay,
    goToToday,
    closeCalendar,
    toggleCalendar,
    calendarPrevMonth,
    calendarNextMonth,
    getCalendarCells
  } = useCalendar()

  // CRUD 핸들러 정의 (Action Type Enum 객체 활용)
  const handleAddTodo = (text) => {
    dispatch({
      type: TODO_ACTIONS.ADD,
      payload: { 
        id: Date.now() + Math.floor(Math.random() * 1000), 
        text, 
        date: selectedDate,
        createdAt: new Date().toISOString()
      }
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

  // 캘린더 팝오버용 날짜 변경 처리
  const handleDateSelect = (dateStr) => {
    selectDate(dateStr)
    closeCalendar()
  }

  const handleTodaySelect = () => {
    goToToday()
    closeCalendar()
  }

  // 날짜별 미완료 할 일 개수를 집계하는 룩업 딕셔너리 (useMemo)
  const activeTodoCountsByDate = useMemo(() => {
    const counts = {}
    todos.forEach(todo => {
      if (!todo.isCompleted) {
        counts[todo.date] = (counts[todo.date] || 0) + 1
      }
    })
    return counts
  }, [todos])

  // 데이터 가공 흐름: 1차 날짜 필터링 -> 2차 탭 필터링 (useMemo로 최적화)
  const dailyTodos = useMemo(() => {
    return todos.filter(todo => todo.date === selectedDate)
  }, [todos, selectedDate])
  
  const filteredTodos = useMemo(() => {
    return dailyTodos.filter(todo => {
      if (currentFilter === 'active') return !todo.isCompleted
      if (currentFilter === 'completed') return todo.isCompleted
      return true
    })
  }, [dailyTodos, currentFilter])

  // 헤더 통계 계산 (useMemo로 최적화)
  const stats = useMemo(() => {
    const totalCount = dailyTodos.length
    const completedCount = dailyTodos.filter(todo => todo.isCompleted).length
    const remainingCount = totalCount - completedCount
    return { totalCount, completedCount, remainingCount }
  }, [dailyTodos])

  return (
    <div className="app-container">
      {/* 헤더 컴포넌트 */}
      <Header 
        total={stats.totalCount} 
        completed={stats.completedCount} 
        remaining={stats.remainingCount} 
      />

      {/* 날짜 내비게이션 영역 */}
      <DateNavigator
        selectedDate={selectedDate}
        isCalendarOpen={isCalendarOpen}
        onPrevDay={goToPrevDay}
        onNextDay={goToNextDay}
        onTodayClick={goToToday}
        onToggleCalendar={toggleCalendar}
      >
        {/* 달력 팝오버 (Compound-like 형태로 내장하여 렌더링 위치 설정) */}
        <CalendarPopover
          isOpen={isCalendarOpen}
          calendarTargetDate={calendarTargetDate}
          cells={getCalendarCells()}
          selectedDate={selectedDate}
          activeTodoCounts={activeTodoCountsByDate}
          onPrevMonth={calendarPrevMonth}
          onNextMonth={calendarNextMonth}
          onTodaySelect={handleTodaySelect}
          onDateSelect={handleDateSelect}
          onClose={closeCalendar}
        />
      </DateNavigator>

      {/* 주간 캘린더 뷰 */}
      <WeeklyView
        selectedDate={selectedDate}
        activeTodoCounts={activeTodoCountsByDate}
        onDateSelect={selectDate}
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
