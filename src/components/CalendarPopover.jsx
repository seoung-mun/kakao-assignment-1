import { useEffect, useRef } from 'react'
import { getFormattedDateString } from '../utils/date'

export default function CalendarPopover({
  isOpen,
  calendarTargetDate,
  cells,
  selectedDate,
  todos = [],
  onPrevMonth,
  onNextMonth,
  onTodaySelect,
  onDateSelect,
  onClose
}) {
  const popoverRef = useRef(null)

  // 클릭 아웃사이드 및 ESC 키 바인딩
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      // date-display-wrapper 내부 요소를 클릭할 때는 팝업을 닫지 않음
      const displayWrapper = e.target.closest('.date-display-wrapper')
      if (!displayWrapper) {
        onClose()
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // 달력 팝오버 렌더링 클래스 및 애니메이션 지원
  // hidden 클래스가 빠지면 애니메이션이 활성화됩니다.
  const popoverClass = `calendar-popover ${!isOpen ? 'hidden' : ''}`

  const year = calendarTargetDate.getFullYear()
  const month = calendarTargetDate.getMonth() // 0-indexed

  const todayStr = getFormattedDateString(new Date())

  return (
    <div 
      className={popoverClass} 
      ref={popoverRef}
      role="dialog" 
      aria-modal="true" 
      aria-label="달력 날짜 선택기"
    >
      {/* 캘린더 헤더 */}
      <div className="calendar-header">
        <button 
          type="button"
          className="calendar-nav-btn" 
          onClick={onPrevMonth}
          aria-label="이전 달"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L4 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="calendar-title">{year}년 {month + 1}월</span>
        <button 
          type="button"
          className="calendar-nav-btn" 
          onClick={onNextMonth}
          aria-label="다음 달"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4L12 8L6 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="calendar-days-header">
        <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
      </div>

      {/* 날짜 그리드 */}
      <div className="calendar-grid">
        {cells.map((cell, idx) => {
          const cellDateStr = getFormattedDateString(cell.date)
          const isSelected = cellDateStr === selectedDate
          const isToday = cellDateStr === todayStr
          
          // 해당 날짜에 완료되지 않은(진행 중인) 할 일이 존재하는지 검사
          const hasActiveTasks = todos.some((todo) => todo.date === cellDateStr && !todo.isCompleted)
          
          let cellClasses = 'calendar-cell'
          if (cell.isOtherMonth) cellClasses += ' other-month'
          if (isToday) cellClasses += ' today'
          if (isSelected) cellClasses += ' selected'

          return (
            <div
              key={idx}
              className={cellClasses}
              onClick={(e) => {
                e.stopPropagation()
                onDateSelect(cellDateStr)
              }}
              role="gridcell"
            >
              <span className="calendar-cell-number">{cell.date.getDate()}</span>
              {hasActiveTasks && <span className="calendar-cell-dot"></span>}
            </div>
          )
        })}
      </div>

      {/* 하단 영역 (오늘 이동) */}
      <div className="calendar-footer">
        <span 
          className="calendar-today-btn" 
          onClick={(e) => {
            e.stopPropagation()
            onTodaySelect()
          }}
          role="button"
        >
          오늘로 이동
        </span>
      </div>
    </div>
  )
}
