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
