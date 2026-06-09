import { getFormattedDateString, addDays } from '../utils/date'

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토']

export default function WeeklyView({ selectedDate, todos, onDateSelect }) {
  
  // selectedDate(선택 날짜)를 정가운데(4번째, index 3)에 놓기 위해
  // selectedDate 기준 -3일 ~ +3일의 날짜 배열 생성
  const getDialDays = () => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const centerDate = new Date(year, month - 1, day)
    const days = []
    for (let i = -3; i <= 3; i++) {
      days.push(addDays(centerDate, i))
    }
    return days
  }

  const weekDays = getDialDays()
  const todayStr = getFormattedDateString(new Date())

  // 헤더 년/월 타이틀 (선택된 날짜 기준 표시)
  const getWeekRangeTitle = () => {
    const [year, month] = selectedDate.split('-').map(Number)
    return `${year}년 ${month}월`
  }

  // < 및 > 네비게이션 작동: 선택된 날짜 자체를 7일씩 앞/뒤로 이동하여 다이얼을 회전시킴
  const handlePrevWeek = () => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const current = new Date(year, month - 1, day)
    const prevDate = addDays(current, -7)
    onDateSelect(getFormattedDateString(prevDate))
  }

  const handleNextWeek = () => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const current = new Date(year, month - 1, day)
    const nextDate = addDays(current, 7)
    onDateSelect(getFormattedDateString(nextDate))
  }

  return (
    <div className="weekly-view-container">
      {/* 주간 뷰 헤더 (년월 가운데 정렬, 버튼 우측 배치) */}
      <div className="weekly-view-header">
        <span className="weekly-view-title">{getWeekRangeTitle()}</span>
        <div className="weekly-view-nav">
          <button 
            type="button"
            onClick={handlePrevWeek} 
            className="weekly-view-nav-btn"
            aria-label="이전 주"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L4 8L10 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            type="button"
            onClick={handleNextWeek} 
            className="weekly-view-nav-btn"
            aria-label="다음 주"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4L12 8L6 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 7일 그리드 (다이얼식) */}
      <div className="weekly-grid">
        {weekDays.map((day) => {
          const dateStr = getFormattedDateString(day)
          const isSelected = dateStr === selectedDate // 항상 가운데에 위치하는 날짜가 true가 됨
          const isToday = dateStr === todayStr
          
          // 각 일자의 실제 요일 텍스트 구하기 (다이얼 회전 시 요일 동적 갱신 필수)
          const dayLabel = DAYS_OF_WEEK[day.getDay()]

          // 요일별 미완료 할 일 집계
          const uncompletedCount = todos.filter(
            (todo) => todo.date === dateStr && !todo.isCompleted
          ).length

          let btnClasses = 'weekly-day-btn'
          if (isSelected) btnClasses += ' selected'
          if (isToday) btnClasses += ' today'

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onDateSelect(dateStr)}
              className={btnClasses}
            >
              {/* 요일 */}
              <span className="weekly-day-label">{dayLabel}</span>

              {/* 일자 */}
              <span className="weekly-day-number">{day.getDate()}</span>

              {/* 미완료 할 일 개수 배지 */}
              {uncompletedCount > 0 && (
                <span className="weekly-badge">{uncompletedCount}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
