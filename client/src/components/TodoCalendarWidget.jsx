import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
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
      
      // Process the data to group by date
      const processedData = {};
      response.todos?.forEach(todo => {
        const createdDate = new Date(todo.createdAt).toDateString();
        const dueDate = todo.dueDate ? new Date(todo.dueDate).toDateString() : null;
        
        // Count created todos
        if (!processedData[createdDate]) {
          processedData[createdDate] = { created: 0, due: 0, completed: 0 };
        }
        processedData[createdDate].created += 1;
        
        // Count due todos
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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
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
    
    // Show different colors based on activity
    if (dayData.completed === dayData.due && dayData.due > 0) {
      return 'bg-green-500'; // All due todos completed
    } else if (dayData.due > 0) {
      return 'bg-yellow-500'; // Has due todos
    } else if (dayData.created > 0) {
      return 'bg-blue-500'; // Created todos
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
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <FiCalendar className="w-4 h-4 mr-2" />
          Todo Calendar
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-900 min-w-[80px] text-center">
            {formatMonth(currentDate)}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((date, index) => {
          const dayData = getDayData(date);
          const indicator = getDayIndicator(dayData);
          const today = isToday(date);
          
          return (
            <div
              key={index}
              className={`relative h-8 flex items-center justify-center text-xs transition-colors ${
                date 
                  ? `cursor-pointer hover:bg-gray-100 ${
                      today ? 'bg-black text-white rounded' : 'text-gray-700'
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
                  <span className={today ? 'font-bold' : ''}>{date.getDate()}</span>
                  {indicator && !today && (
                    <div className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${indicator}`} />
                  )}
                  {indicator && today && (
                    <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${indicator} border border-white`} />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
              <span className="text-gray-600">Created</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
              <span className="text-gray-600">Due</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              <span className="text-gray-600">Done</span>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}