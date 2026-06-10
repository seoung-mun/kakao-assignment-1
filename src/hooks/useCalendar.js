import { useState, useCallback } from 'react'
import { getFormattedDateString, generateCalendarGrid } from '../utils/date'

export function useCalendar(initialDateStr = getFormattedDateString(new Date())) {
  const [selectedDate, setSelectedDate] = useState(initialDateStr) // YYYY-MM-DD 형식의 문자열
  const [calendarTargetDate, setCalendarTargetDate] = useState(() => {
    const [year, month, day] = initialDateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }) // 달력 뷰 년/월을 위한 Date 객체
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // 특정 날짜 선택
  const selectDate = useCallback((dateStr) => {
    setSelectedDate(dateStr)
    const [year, month, day] = dateStr.split('-').map(Number)
    setCalendarTargetDate(new Date(year, month - 1, day))
  }, [])

  // 하루 전으로 이동
  const goToPrevDay = useCallback(() => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const current = new Date(year, month - 1, day)
    current.setDate(current.getDate() - 1)
    const prevDateStr = getFormattedDateString(current)
    setSelectedDate(prevDateStr)
    setCalendarTargetDate(current)
  }, [selectedDate])

  // 하루 후로 이동
  const goToNextDay = useCallback(() => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const current = new Date(year, month - 1, day)
    current.setDate(current.getDate() + 1)
    const nextDateStr = getFormattedDateString(current)
    setSelectedDate(nextDateStr)
    setCalendarTargetDate(current)
  }, [selectedDate])

  // 오늘 날짜로 이동
  const goToToday = useCallback(() => {
    const today = new Date()
    const todayStr = getFormattedDateString(today)
    setSelectedDate(todayStr)
    setCalendarTargetDate(today)
  }, [])

  // 달력 팝오버 열기/닫기
  const openCalendar = useCallback(() => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    setCalendarTargetDate(new Date(year, month - 1, day))
    setIsCalendarOpen(true)
  }, [selectedDate])

  const closeCalendar = useCallback(() => {
    setIsCalendarOpen(false)
  }, [])

  const toggleCalendar = useCallback(() => {
    if (isCalendarOpen) {
      closeCalendar()
    } else {
      openCalendar()
    }
  }, [isCalendarOpen, openCalendar, closeCalendar])

  // 달력 이전 달 이동
  const calendarPrevMonth = useCallback(() => {
    setCalendarTargetDate(prev => {
      const nextTarget = new Date(prev)
      nextTarget.setMonth(nextTarget.getMonth() - 1)
      return nextTarget
    })
  }, [])

  // 달력 다음 달 이동
  const calendarNextMonth = useCallback(() => {
    setCalendarTargetDate(prev => {
      const nextTarget = new Date(prev)
      nextTarget.setMonth(nextTarget.getMonth() + 1)
      return nextTarget
    })
  }, [])

  // 달력의 7x6 캘린더 그리드 셀 생성
  const getCalendarCells = useCallback(() => {
    const year = calendarTargetDate.getFullYear()
    const month = calendarTargetDate.getMonth() // 0-indexed
    return generateCalendarGrid(year, month)
  }, [calendarTargetDate])

  return {
    selectedDate,
    calendarTargetDate,
    isCalendarOpen,
    selectDate,
    goToPrevDay,
    goToNextDay,
    goToToday,
    openCalendar,
    closeCalendar,
    toggleCalendar,
    calendarPrevMonth,
    calendarNextMonth,
    getCalendarCells
  }
}
