'use client';

import { format, startOfWeek, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function WeeklyCalendar() {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 }); // 일요일 시작
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  return (
    <div className="flex justify-between mt-2 mb-4">
      {weekDays.map((day, index) => {
        const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth();
        return (
          <div 
            key={index} 
            className={`flex flex-col items-center justify-center w-11 h-16 rounded-2xl transition-all cursor-pointer ${
              isToday 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                : 'text-gray-500 hover:bg-purple-50'
            }`}
          >
            <span className={`text-xs font-medium mb-1 ${isToday ? 'text-purple-100' : 'text-gray-400'}`}>
              {format(day, 'E', { locale: ko })}
            </span>
            <span className={`text-lg font-bold ${isToday ? 'text-white' : 'text-gray-700'}`}>
              {format(day, 'd')}
            </span>
          </div>
        );
      })}
    </div>
  );
}
