import { getKoreanDisplayDate } from '../utils/date'

export default function DateNavigator({ 
  selectedDate, 
  isCalendarOpen, 
  onPrevDay, 
  onNextDay, 
  onTodayClick, 
  onToggleCalendar,
  children 
}) {
  const [year, month, day] = selectedDate.split('-').map(Number)
  const displayDateStr = getKoreanDisplayDate(new Date(year, month - 1, day))

  const handleTodayClick = (e) => {
    e.stopPropagation() // 달력 팝업 토글 방지
    onTodayClick()
  }

  const handleTriggerClick = (e) => {
    onToggleCalendar()
  }

  return (
    <div className="date-navigator">
      {/* 이전 날짜 버튼 */}
      <button 
        className="nav-button" 
        onClick={onPrevDay} 
        aria-label="이전 날짜"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L4 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 날짜 표시 및 달력 컨테이너 */}
      <div className={`date-display-wrapper ${isCalendarOpen ? 'open' : ''}`}>
        <div 
          className="date-display" 
          role="button" 
          aria-haspopup="dialog" 
          aria-expanded={isCalendarOpen ? 'true' : 'false'}
          tabIndex={0} 
          aria-label="날짜 선택기 열기"
          onClick={handleTriggerClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleTriggerClick()
            }
          }}
        >
          <span className="current-date-text">{displayDateStr}</span>
          <span className="dropdown-arrow" aria-hidden="true">▾</span>
          <button 
            className="today-badge" 
            onClick={handleTodayClick}
            tabIndex={0}
          >
            오늘
          </button>
        </div>

        {/* 달력 팝오버 주입 (children) */}
        {children}
      </div>

      {/* 다음 날짜 버튼 */}
      <button 
        className="nav-button" 
        onClick={onNextDay} 
        aria-label="다음 날짜"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4L12 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
