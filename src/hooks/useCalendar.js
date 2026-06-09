import { useState, useCallback } from 'react'
import { getFormattedDateString } from '../utils/date'

export function useCalendar(initialDateStr = getFormattedDateString(new Date())) {
  const [selectedDate, setSelectedDate] = useState(initialDateStr) // YYYY-MM-DD 형식의 문자열
  const [calendarTargetDate, setCalendarTargetDate] = useState(new Date(initialDateStr)) // 달력 뷰 년/월을 위한 Date 객체
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // 특정 날짜 선택
  const selectDate = useCallback((dateStr) => {
    setSelectedDate(dateStr)
    setCalendarTargetDate(new Date(dateStr))
  }, [])

  // 하루 전으로 이동
  const goToPrevDay = useCallback(() => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() - 1)
    const prevDateStr = getFormattedDateString(current)
    setSelectedDate(prevDateStr)
    setCalendarTargetDate(current)
  }, [selectedDate])

  // 하루 후로 이동
  const goToNextDay = useCallback(() => {
    const current = new Date(selectedDate)
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
    setCalendarTargetDate(new Date(selectedDate))
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

    // 1일의 요일 알아내기
    const firstDayIndex = new Date(year, month, 1).getDay()
    // 이번 달의 총 일수
    const totalDays = new Date(year, month + 1, 0).getDate()
    // 지난 달의 총 일수
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
