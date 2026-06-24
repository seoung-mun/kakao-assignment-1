'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { format, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function WeeklyCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const dateParam = searchParams.get('date');
  const selectedDate = dateParam ? parseISO(dateParam) : new Date();
  
  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 0 }); // 일요일 시작
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const handleDateSelect = (day: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set('date', format(day, 'yyyy-MM-dd'));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-between mt-2 mb-4">
      {weekDays.map((day, index) => {
        const isSelected = isSameDay(day, selectedDate);
        return (
          <div 
            key={index} 
            onClick={() => handleDateSelect(day)}
            className={`flex flex-col items-center justify-center w-11 h-16 rounded-2xl transition-all cursor-pointer ${
              isSelected 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                : 'text-gray-500 hover:bg-purple-50'
            }`}
          >
            <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-purple-100' : 'text-gray-400'}`}>
              {format(day, 'E', { locale: ko })}
            </span>
            <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
              {format(day, 'd')}
            </span>
          </div>
        );
      })}
    </div>
  );
}
