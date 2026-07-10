import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiLoader } from 'react-icons/fi';
import { getCalendarTodos } from '../api/todoApi';

export default function TodoCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const response = await getCalendarTodos(startDate, endDate);
      
      const processedData = {};
      response.todos?.forEach(todo => {
        const createdDate = new Date(todo.createdAt).toDateString();
        const dueDate = todo.dueDate ? new Date(todo.dueDate).toDateString() : null;
        
        if (!processedData[createdDate]) {
          processedData[createdDate] = { created: 0, due: 0, completed: 0 };
        }
        processedData[createdDate].created += 1;
        
        if (dueDate) {
          if (!processedData[dueDate]) {
            processedData[dueDate] = { created: 0, due: 0, completed: 0 };
          }
          processedData[dueDate].due += 1;
          
          if (todo.status === 'completed') {
            processedData[dueDate].completed += 1;
          }
        }
      });
      
      setCalendarData(processedData);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDayData = (date) => {
    if (!date) return null;
    const dateString = date.toDateString();
    return calendarData[dateString] || { created: 0, due: 0, completed: 0 };
  };

  const getDayIndicator = (dayData) => {
    if (!dayData || (dayData.created === 0 && dayData.due === 0)) return null;
    
    const total = dayData.created + dayData.due;
    if (total === 0) return null;
    
    if (dayData.completed === dayData.due && dayData.due > 0) {
      return 'bg-[#2ECC71]';
    } else if (dayData.due > 0) {
      return 'bg-[#F8C537]';
    } else if (dayData.created > 0) {
      return 'bg-[#2C5EFA]';
    }
    return null;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="bg-white rounded-2xl p-4 text-stone-900 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-stone-150 pb-2">
        <h3 className="text-xs font-extrabold text-stone-950 uppercase tracking-widest flex items-center font-mono">
          <FiCalendar className="w-4 h-4 mr-1.5 text-[#D9866B] stroke-[2.5]" />
          Calendar
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-stone-50 border border-stone-200 rounded transition-all active:scale-95"
          >
            <FiChevronLeft className="w-3.5 h-3.5 text-stone-850" />
          </button>
          <span className="text-xs font-extrabold text-stone-950 min-w-[70px] text-center font-mono">
            {formatMonth(currentDate)}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-stone-50 border border-stone-200 rounded transition-all active:scale-95"
          >
            <FiChevronRight className="w-3.5 h-3.5 text-stone-850" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-sans font-bold">
        {weekDays.map(day => (
          <div key={day} className="text-[10px] font-extrabold text-stone-500 py-1 uppercase tracking-wider font-mono">
            {day}
          </div>
        ))}
        
        {days.map((date, index) => {
          const dayData = getDayData(date);
          const indicator = getDayIndicator(dayData);
          const today = isToday(date);
          
          return (
            <div
              key={index}
              className={`relative h-7 flex items-center justify-center text-xs transition-all border border-transparent rounded-lg ${
                date 
                  ? `cursor-pointer hover:bg-stone-50 ${
                      today 
                        ? 'bg-[#FEF5D1] border-stone-900 text-stone-950 font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' 
                        : 'text-stone-800'
                    }`
                  : ''
              }`}
              title={date && dayData ? 
                `Created: ${dayData.created}, Due: ${dayData.due}, Completed: ${dayData.completed}` : 
                ''
              }
            >
              {date && (
                <>
                  <span className={today ? 'font-black' : ''}>{date.getDate()}</span>
                  {indicator && !today && (
                    <div className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-stone-950/40 ${indicator}`} />
                  )}
                  {indicator && today && (
                    <div className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-stone-950/40 ${indicator}`} />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-stone-150">
        <div className="flex flex-wrap items-center justify-center gap-3 text-[9px] font-extrabold uppercase font-mono tracking-wider">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-[#2C5EFA] border border-stone-950/40 rounded-full mr-1" />
            <span className="text-stone-550">Created</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-[#F8C537] border border-stone-950/40 rounded-full mr-1" />
            <span className="text-stone-550">Due</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-[#2ECC71] border border-stone-950/40 rounded-full mr-1" />
            <span className="text-stone-550">Done</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-[#FAF9F6]/80 flex items-center justify-center rounded-2xl z-20">
          <FiLoader className="w-4.5 h-4.5 text-stone-950 animate-spin" />
        </div>
      )}
    </div>
  );
}