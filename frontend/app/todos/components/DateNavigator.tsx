'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { format, addDays, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ReactNode } from 'react';

export default function DateNavigator({ children, isCalendarOpen, onToggleCalendar }: { children: ReactNode, isCalendarOpen: boolean, onToggleCalendar: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const dateParam = searchParams.get('date');
  const selectedDate = dateParam ? parseISO(dateParam) : new Date();

  const handlePrevDay = () => {
    const prevDay = addDays(selectedDate, -1);
    updateDateParam(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    updateDateParam(nextDay);
  };

  const handleTodayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateDateParam(new Date());
  };

  const updateDateParam = (dateObj: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set('date', format(dateObj, 'yyyy-MM-dd'));
    router.push(`?${params.toString()}`);
  };

  const displayDateStr = format(selectedDate, 'yyyy년 M월 d일 (E)', { locale: ko });

  return (
    <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg p-2 shadow-sm">
      <button 
        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-md transition-colors" 
        onClick={handlePrevDay} 
        aria-label="이전 날짜"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="relative">
        <div 
          className="flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
          role="button" 
          onClick={onToggleCalendar}
        >
          <span className="text-base font-bold text-gray-800">{displayDateStr}</span>
          <span className="text-gray-400 text-xs">▼</span>
          <button 
            className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
            onClick={handleTodayClick}
          >
            오늘
          </button>
        </div>
        
        {isCalendarOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
            {children}
          </div>
        )}
      </div>

      <button 
        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-md transition-colors" 
        onClick={handleNextDay} 
        aria-label="다음 날짜"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
