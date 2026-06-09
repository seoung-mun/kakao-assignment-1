import { useState, useRef, useEffect } from 'react'

export default function TodoInput({ onAddTodo }) {
  const [inputValue, setInputValue] = useState('')
  const [hasError, setHasError] = useState(false)
  const errorTimeoutRef = useRef(null)

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (inputValue.trim() === '') {
      setHasError(true)
      
      // 기존 타이머가 있으면 초기화
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
      
      // 2.5초 후 자동으로 에러 상태 해제 (기존 바닐라 JS 스펙 동일)
      errorTimeoutRef.current = setTimeout(() => {
        setHasError(false)
      }, 2500)
      
      return
    }

    onAddTodo(inputValue)
    setInputValue('')
    setHasError(false)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    if (value.trim() !== '') {
      setHasError(false)
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }

  return (
    <form className="input-section" onSubmit={handleSubmit} noValidate>
      <div className={`input-wrapper ${hasError ? 'has-error' : ''}`}>
        <input
          type="text"
          className="todo-input"
          placeholder="새로운 할 일을 입력하세요..."
          autoComplete="off"
          aria-label="새 할 일 입력"
          aria-errormessage="input-error-message"
          aria-invalid={hasError ? 'true' : undefined}
          value={inputValue}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="add-button" aria-label="할 일 추가">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      {/* 빈 입력 경고 메시지 */}
      <div 
        className={`error-message ${hasError ? 'visible' : ''}`} 
        id="input-error-message" 
        role="alert" 
        aria-live="polite"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 4V7.5M7 9.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>할 일을 입력해주세요</span>
      </div>
    </form>
  )
}
