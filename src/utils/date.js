/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환합니다.
 * @param {Date} dateObj - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD 포맷 문자열
 */
export function getFormattedDateString(dateObj) {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Date 객체를 한국어 포맷(예: 2026년 6월 3일 수요일)의 문자열로 변환합니다.
 * @param {Date} dateObj - 변환할 Date 객체
 * @returns {string} 한국어 날짜 표시용 문자열
 */
export function getKoreanDisplayDate(dateObj) {
  const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const dayName = daysOfWeek[dateObj.getDay()]
  return `${year}년 ${month}월 ${day}일 ${dayName}`
}

/**
 * 주어진 날짜가 속한 주의 일요일 Date 객체를 구합니다.
 * @param {Date} dateObj - 기준 Date 객체
 * @returns {Date} 일요일 Date 객체
 */
export function getStartOfWeekDate(dateObj) {
  const current = new Date(dateObj)
  const day = current.getDay()
  current.setDate(current.getDate() - day)
  return current
}

/**
 * 주어진 날짜에 특정 일수를 더하거나 뺀 Date 객체를 구합니다.
 * @param {Date} dateObj - 기준 Date 객체
 * @param {number} days - 더할 일 수
 * @returns {Date} 계산된 Date 객체
 */
export function addDays(dateObj, days) {
  const result = new Date(dateObj)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * 7x6 캘린더 그리드 셀 생성 함수 (이전 달 일부, 이번 달 전체, 다음 달 일부 포함 총 42칸)
 * @param {number} year - 연도 (4자리)
 * @param {number} month - 월 (0-indexed, 0 ~ 11)
 * @returns {Array<{date: Date, isOtherMonth: boolean}>} 42개의 셀 객체 배열
 */
export function generateCalendarGrid(year, month) {
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const prevMonthTotalDays = new Date(year, month, 0).getDate()

  const cells = []

  // 1. 이전 달 날짜 채우기
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, prevMonthTotalDays - i),
      isOtherMonth: true
    })
  }

  // 2. 이번 달 날짜 채우기
  for (let i = 1; i <= totalDays; i++) {
    cells.push({
      date: new Date(year, month, i),
      isOtherMonth: false
    })
  }

  // 3. 다음 달 날짜 채우기 (총 42칸 맞추기)
  const remainingCells = 42 - cells.length
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({
      date: new Date(year, month + 1, i),
      isOtherMonth: true
    })
  }

  return cells
}
