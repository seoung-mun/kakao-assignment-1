import { useState, useRef, useEffect, memo } from 'react'

function TodoItem({ todo, onToggle, onUpdateText, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isEditError, setIsEditError] = useState(false)
  
  const editInputRef = useRef(null)
  const errorTimeoutRef = useRef(null)

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  // 편집 모드 진입 시 입력창 포커싱 및 커서 맨 뒤로 이동
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      const length = editInputRef.current.value.length
      editInputRef.current.setSelectionRange(length, length)
    }
  }, [isEditing])

  const handleEditStart = () => {
    setIsEditing(true)
    setEditText(todo.text)
    setIsEditError(false)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditText(todo.text)
    setIsEditError(false)
  }

  const handleEditSave = () => {
    const trimmed = editText.trim()
    if (trimmed === '') {
      setIsEditError(true)
      
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
      
      // 0.8초 후 입력 오류 피드백 해제
      errorTimeoutRef.current = setTimeout(() => {
        setIsEditError(false)
      }, 800)
      return
    }

    // 변경사항이 있을 때만 업데이트 전파
    if (trimmed !== todo.text) {
      onUpdateText(todo.id, trimmed)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleEditSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleEditCancel()
    }
  }

  // 삭제 애니메이션 유도 후 실제 상태 제거
  const handleDeleteClick = () => {
    setIsRemoving(true)
  }

  const handleAnimationEnd = (e) => {
    // slideOut 애니메이션이 완료되었을 때만 부모의 onDelete를 호출하여 제거
    if (isRemoving && e.animationName === 'slideOut') {
      onDelete(todo.id)
    }
  }

  // HTML 엔티티 이스케이프는 React JSX가 자동으로 처리해주므로 별도 escapeHtmlEntities 불필요 (보안 강화)
  return (
    <li 
      className={`todo-item ${todo.isCompleted ? 'completed' : ''} ${isEditing ? 'editing' : ''} ${isRemoving ? 'removing' : ''}`}
      data-todo-id={todo.id}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* 완료 토글 버튼 */}
      <button
        className="complete-button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.isCompleted ? '완료 취소' : '완료하기'}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Todo 텍스트 (보기 모드) */}
      <span className="todo-text" onDoubleClick={handleEditStart}>
        {todo.text}
      </span>

      {/* Todo 수정 입력창 (편집 모드) */}
      <input
        type="text"
        className="edit-input"
        ref={editInputRef}
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ 
          display: isEditing ? 'block' : 'none',
          borderColor: isEditError ? 'var(--color-danger)' : 'var(--color-primary)' 
        }}
        aria-label="할 일 수정"
      />

      {/* 액션 버튼 그룹 */}
      <div className="todo-actions">
        {/* 수정 버튼 (보기 모드) */}
        {!isEditing && (
          <button className="action-button edit-button" onClick={handleEditStart} aria-label="수정">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* 저장 버튼 (편집 모드) */}
        {isEditing && (
          <button className="action-button save-button" style={{ display: 'flex' }} onClick={handleEditSave} aria-label="저장">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* 취소 버튼 (편집 모드) */}
        {isEditing && (
          <button className="action-button cancel-button" style={{ display: 'flex' }} onClick={handleEditCancel} aria-label="취소">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* 삭제 버튼 (보기 모드) */}
        {!isEditing && (
          <button className="action-button delete-button" onClick={handleDeleteClick} aria-label="삭제">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 4.5H13M5.5 4.5V3C5.5 2.45 5.95 2 6.5 2H9.5C10.05 2 10.5 2.45 10.5 3V4.5M6 7V11.5M8 7V11.5M10 7V11.5M4.5 4.5L5 13C5 13.55 5.45 14 6 14H10C10.55 14 11 13.55 11 13L11.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </li>
  )
}

export default memo(TodoItem)
