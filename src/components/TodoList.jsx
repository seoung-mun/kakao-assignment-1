import TodoItem from './TodoItem'

export default function TodoList({ todos = [], onToggle, onUpdateText, onDelete, currentFilter }) {
  
  // 현재 필터 상태에 따른 빈 화면 안내 문구 헬퍼 함수
  const getEmptyStateContent = () => {
    switch (currentFilter) {
      case 'active':
        return {
          title: '진행 중인 할 일이 없습니다',
          subtitle: '남은 하루도 파이팅하세요!'
        }
      case 'completed':
        return {
          title: '완료한 할 일이 없습니다',
          subtitle: '차근차근 하나씩 완료해 보세요!'
        }
      default:
        return {
          title: '아직 할 일이 없습니다',
          subtitle: '위에서 새로운 할 일을 추가해보세요!'
        }
    }
  }

  const emptyContent = getEmptyStateContent()

  return (
    <main className="todo-list-container">
      {todos.length === 0 ? (
        <div className="empty-state" id="empty-state">
          <div className="empty-icon" aria-hidden="true">📝</div>
          <p className="empty-text">{emptyContent.title}</p>
          <p className="empty-subtext">{emptyContent.subtitle}</p>
        </div>
      ) : (
        <ul className="todo-list" role="list" aria-label="할 일 목록">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id} // 안티패턴 방지: 고유 ID 키 지정
              todo={todo}
              onToggle={onToggle}
              onUpdateText={onUpdateText}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </main>
  )
}
