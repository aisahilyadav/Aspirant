import React, { useState, useEffect } from 'react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiPlus, 
  FiCalendar, 
  FiClock, 
  FiFlag, 
  FiCheckCircle,
  FiCircle,
  FiX,
  FiEdit3,
  FiTrash2,
  FiLoader,
  FiBell,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { getCalendarTodos, createTodo, updateTodo, deleteTodo } from '../api/todoApi';
import TodoForm from '../components/TodoForm';

export default function TodoCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [todosForSelectedDate, setTodosForSelectedDate] = useState([]);
  
  // Dialog / Sidebar states
  const [showForm, setShowForm] = useState(false);
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const [showTodoDetails, setShowTodoDetails] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [createType, setCreateType] = useState('todo');
  const [loading, setLoading] = useState(false);
  
  // Views and Filters
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      loadTodosForDate(selectedDate);
    }
  }, [selectedDate, calendarData, filterStatus, filterCategory]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowCreateOverlay(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Load range covering previous and next month buffer
      const startDate = new Date(year, month - 1, 20);
      const endDate = new Date(year, month + 2, 10);
      
      const response = await getCalendarTodos(startDate, endDate);
      
      const processedData = {};
      response.todos?.forEach(todo => {
        const createdDate = new Date(todo.createdAt).toDateString();
        const dueDate = todo.dueDate ? new Date(todo.dueDate).toDateString() : null;
        
        if (!processedData[createdDate]) {
          processedData[createdDate] = { created: [], due: [], completed: [] };
        }
        processedData[createdDate].created.push(todo);
        
        if (dueDate) {
          if (!processedData[dueDate]) {
            processedData[dueDate] = { created: [], due: [], completed: [] };
          }
          processedData[dueDate].due.push(todo);
          
          if (todo.status === 'completed') {
            processedData[dueDate].completed.push(todo);
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

  const loadTodosForDate = (date) => {
    const dateString = date.toDateString();
    const dayData = calendarData[dateString];
    
    if (dayData) {
      const allTodos = [
        ...dayData.created,
        ...dayData.due
      ];
      
      const uniqueTodos = allTodos.filter((todo, index, self) => 
        index === self.findIndex(t => t._id === todo._id)
      );
      
      let filteredTodos = uniqueTodos;
      if (filterStatus !== 'all') {
        filteredTodos = filteredTodos.filter(todo => todo.status === filterStatus);
      }
      if (filterCategory !== 'all') {
        filteredTodos = filteredTodos.filter(todo => todo.category === filterCategory);
      }
      
      setTodosForSelectedDate(filteredTodos);
    } else {
      setTodosForSelectedDate([]);
    }
  };

  const navigateTime = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() + direction);
      } else {
        newDate.setDate(prev.getDate() + direction * 7);
      }
      return newDate;
    });
    setShowCreateOverlay(false);
    setShowTodoDetails(false);
  };

  // Helper for generating monthly grid days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const prevMonth = new Date(year, month - 1, 0);
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  // Helper for generating weekly view days
  const getDaysInWeek = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // Adjust to Sunday
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      days.push(weekDay);
    }
    return days;
  };

  const getDayData = (date) => {
    const dateString = date.toDateString();
    const dayData = calendarData[dateString];
    return dayData ? {
      created: dayData.created.length,
      due: dayData.due.length,
      completed: dayData.completed.length,
      todos: [...dayData.created, ...dayData.due].filter((todo, index, self) => 
        index === self.findIndex(t => t._id === todo._id)
      )
    } : { created: 0, due: 0, completed: 0, todos: [] };
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowCreateOverlay(true);
    setShowTodoDetails(false);
    setSelectedTodo(null);
  };

  const handleTodoClick = (todo, event) => {
    event.stopPropagation();
    setSelectedTodo(todo);
    setShowTodoDetails(true);
    setShowCreateOverlay(false);
  };

  const handleCreateNew = (type) => {
    setCreateType(type);
    setShowForm(true);
    setShowCreateOverlay(false);
  };

  const handleCreateTodo = async (todoData) => {
    try {
      if (selectedDate) {
        if (createType === 'todo') {
          todoData.dueDate = selectedDate.toISOString();
        } else if (createType === 'reminder') {
          todoData.dueDate = selectedDate.toISOString();
          todoData.category = 'reminder';
        } else if (createType === 'schedule') {
          todoData.startDate = selectedDate.toISOString();
          todoData.endDate = new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString();
          todoData.category = 'schedule';
        }
      }
      
      await createTodo(todoData);
      setShowForm(false);
      loadCalendarData();
    } catch (error) {
      console.error(error);
      alert('Failed to create todo');
    }
  };

  const handleTodoToggle = async (todoId) => {
    try {
      const todo = todosForSelectedDate.find(t => t._id === todoId) || selectedTodo;
      const newStatus = todo.status === 'completed' ? 'not-started' : 'completed';
      await updateTodo(todoId, { status: newStatus });
      if (selectedTodo && selectedTodo._id === todoId) {
        setSelectedTodo(prev => ({ ...prev, status: newStatus }));
      }
      loadCalendarData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todoId);
        loadCalendarData();
        setShowTodoDetails(false);
        setSelectedTodo(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdateTodo = async (todoData) => {
    try {
      await updateTodo(selectedTodo._id, todoData);
      setShowForm(false);
      setSelectedTodo(null);
      loadCalendarData();
    } catch (error) {
      console.error(error);
      alert('Failed to update todo');
    }
  };

  const days = viewMode === 'month' ? getDaysInMonth() : getDaysInWeek();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pt-20 pb-8 px-4 sm:px-6 lg:px-8 font-sans relative overflow-x-hidden select-none">
      
      {/* Background ruling pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      {/* Handdrawn filter SVG */}
      <svg className="absolute w-0 h-0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="handdrawn" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto py-8 space-y-8">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b-2 border-stone-900 pb-6 gap-4">
          <div className="text-left">
            <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase block rotate-[-1deg]">
              [ calendar planner ]
            </span>
            <h1 className="text-4xl font-sans font-black text-stone-950 tracking-tight leading-none mt-1">Calendar Agenda</h1>
            <p className="text-xs text-stone-605 font-medium mt-1.5">Schedule tasks, set reminders, and log sessions</p>
          </div>

          {/* View Toggles & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex border-2 border-stone-900 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors flex items-center space-x-1.5 ${
                  viewMode === 'month' ? 'bg-[#F8C537] text-stone-950' : 'bg-white hover:bg-stone-50'
                }`}
              >
                <FiGrid className="w-3.5 h-3.5" />
                <span>Month</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 text-xs font-bold uppercase border-l-2 border-stone-900 transition-colors flex items-center space-x-1.5 ${
                  viewMode === 'week' ? 'bg-[#F8C537] text-stone-950' : 'bg-white hover:bg-stone-50'
                }`}
              >
                <FiList className="w-3.5 h-3.5" />
                <span>Week</span>
              </button>
            </div>

            {/* Filters */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border-2 border-stone-900 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border-2 border-stone-900 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <option value="all">All Categories</option>
              <option value="study">Study</option>
              <option value="quiz">Quiz</option>
              <option value="reading">Reading</option>
              <option value="research">Research</option>
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="other">Other</option>
            </select>

            <button
              onClick={() => {
                setSelectedDate(new Date());
                setShowForm(true);
                setCreateType('todo');
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-[#F26430] text-white border-2 border-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all"
            >
              <FiPlus className="w-4 h-4 stroke-[3]" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Calendar Body */}
          <div className="lg:col-span-3">
            <div 
              className="bg-white border-2 border-stone-900 rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] relative"
              style={{ filter: 'url(#handdrawn)' }}
            >
              
              {/* Month/Week Navigation bar */}
              <div className="flex items-center justify-between p-5 border-b-2 border-stone-900 bg-stone-50/50">
                <div className="flex items-center space-x-3 text-left">
                  <button
                    onClick={() => navigateTime(-1)}
                    className="p-2 border-2 border-stone-900 bg-white hover:bg-stone-50 rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <FiChevronLeft className="w-4 h-4 text-stone-950 stroke-[2.5]" />
                  </button>
                  
                  <h2 className="text-xl font-sans font-black text-stone-950 tracking-tight leading-none select-none">
                    {viewMode === 'month' 
                      ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : `Week of ${getDaysInWeek()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    }
                  </h2>
                  
                  <button
                    onClick={() => navigateTime(1)}
                    className="p-2 border-2 border-stone-900 bg-white hover:bg-stone-50 rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <FiChevronRight className="w-4 h-4 text-stone-950 stroke-[2.5]" />
                  </button>
                </div>

                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-xs font-extrabold uppercase border-2 border-stone-900 bg-white hover:bg-stone-50 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  Today
                </button>
              </div>

              {/* Grid Wrapper */}
              <div className="p-5">
                {viewMode === 'month' ? (
                  /* --- MONTH VIEW --- */
                  <>
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {weekDays.map(day => (
                        <div key={day} className="text-center py-2">
                          <span className="text-xs font-extrabold uppercase tracking-widest text-stone-500 font-mono">{day}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {days.map(({ date, isCurrentMonth }, index) => {
                        const dayData = getDayData(date);
                        const today = date.toDateString() === new Date().toDateString();
                        const selected = selectedDate && date.toDateString() === selectedDate.toDateString();
                        
                        return (
                          <div
                            key={index}
                            onClick={() => handleDateClick(date)}
                            className={`min-h-[110px] p-2 border-2 border-stone-900 rounded-2xl cursor-pointer transition-all ${
                              !isCurrentMonth ? 'bg-stone-50/55 text-stone-400 opacity-60' : 'bg-white hover:bg-stone-50/80 hover:translate-y-[-1px]'
                            } ${
                              today ? 'bg-[#FEF5D1] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : ''
                            } ${
                              selected ? 'ring-2 ring-[#2C5EFA] border-[#2C5EFA]' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-xs font-mono font-black ${
                                today ? 'text-[#F26430]' : 'text-stone-850'
                              }`}>
                                {date.getDate()}
                              </span>
                              {dayData.todos.length > 0 && (
                                <span className="text-[9px] font-bold bg-stone-900 text-stone-100 px-1.5 py-0.5 rounded-full">
                                  {dayData.todos.length}
                                </span>
                              )}
                            </div>

                            {/* Color Tag dots */}
                            <div className="flex space-x-1 mb-2">
                              {dayData.todos.slice(0, 3).map((todo, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-1.5 rounded-full border border-stone-900 ${
                                    todo.status === 'completed' ? 'bg-[#2ECC71]' :
                                    todo.priority === 'high' ? 'bg-[#FF6B6B]' : 'bg-[#F8C537]'
                                  }`} 
                                />
                              ))}
                            </div>

                            {/* Todos mini block previews */}
                            <div className="space-y-1 overflow-hidden">
                              {dayData.todos.slice(0, 2).map((todo) => (
                                <div
                                  key={todo._id}
                                  onClick={(e) => handleTodoClick(todo, e)}
                                  className={`text-[9px] px-1.5 py-0.5 border border-stone-900 rounded truncate hover:opacity-85 font-sans font-bold leading-tight ${
                                    todo.status === 'completed' 
                                      ? 'bg-green-50 text-stone-400 line-through' 
                                      : todo.priority === 'high' 
                                      ? 'bg-[#FFD2D2] text-red-900'
                                      : 'bg-[#E3F2FD] text-blue-900'
                                  }`}
                                  title={todo.title}
                                >
                                  {todo.title}
                                </div>
                              ))}
                              {dayData.todos.length > 2 && (
                                <div className="text-[8px] font-mono text-stone-500 text-left font-bold pl-1">
                                  +{dayData.todos.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* --- WEEK VIEW --- */
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3 min-h-[400px]">
                    {days.map((date, index) => {
                      const dayData = getDayData(date);
                      const today = date.toDateString() === new Date().toDateString();
                      const selected = selectedDate && date.toDateString() === selectedDate.toDateString();
                      
                      return (
                        <div
                          key={index}
                          onClick={() => handleDateClick(date)}
                          className={`flex flex-col border-2 border-stone-900 rounded-2xl p-3 text-left transition-all hover:bg-stone-50/50 ${
                            today ? 'bg-[#FEF5D1]' : 'bg-white'
                          } ${
                            selected ? 'ring-2 ring-[#2C5EFA]' : ''
                          }`}
                        >
                          {/* Day Header */}
                          <div className="border-b border-stone-250 pb-2 mb-3">
                            <span className="text-[9px] font-mono font-bold tracking-widest text-stone-450 uppercase block">
                              {weekDays[date.getDay()]}
                            </span>
                            <span className="text-lg font-sans font-black text-stone-950">
                              {date.getDate()}
                            </span>
                          </div>

                          {/* Todos List */}
                          <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px]">
                            {dayData.todos.map((todo) => (
                              <div
                                key={todo._id}
                                onClick={(e) => handleTodoClick(todo, e)}
                                className={`p-2 border border-stone-900 rounded-xl cursor-pointer hover:translate-y-[-1px] transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                                  todo.status === 'completed'
                                    ? 'bg-green-50/70 opacity-60 text-stone-400 line-through'
                                    : todo.priority === 'high'
                                    ? 'bg-[#FFD2D2]'
                                    : 'bg-white'
                                }`}
                              >
                                <p className="text-[10px] font-bold truncate text-stone-900">{todo.title}</p>
                                <span className="text-[8px] font-mono text-stone-500 capitalize block mt-1">
                                  {todo.category}
                                </span>
                              </div>
                            ))}
                            {dayData.todos.length === 0 && (
                              <div className="h-full flex items-center justify-center py-8">
                                <span className="text-[10px] font-mono text-stone-400 italic">No events</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Event Details or Selected Date summary */}
          <div className="lg:col-span-1 space-y-6 text-left">
            
            {/* Event Details Card */}
            {showTodoDetails && selectedTodo ? (
              <div 
                className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-stone-950">Details</h3>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleEditTodo(selectedTodo)}
                      className="p-1 hover:bg-stone-50 border border-transparent hover:border-stone-900 rounded-lg transition-all"
                      title="Edit"
                    >
                      <FiEdit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(selectedTodo._id)}
                      className="p-1 hover:bg-red-50 hover:text-red-650 border border-transparent hover:border-stone-900 rounded-lg transition-all"
                      title="Delete"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShowTodoDetails(false)}
                      className="p-1 hover:bg-stone-50 rounded-lg"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <button 
                      onClick={() => handleTodoToggle(selectedTodo._id)}
                      className="mt-0.5 transition-transform active:scale-90"
                    >
                      {selectedTodo.status === 'completed' ? (
                        <div className="w-4 h-4 bg-[#2ECC71] border-2 border-stone-900 rounded flex items-center justify-center">
                          <FiCheckCircle className="w-3 h-3 text-stone-950 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 bg-white border-2 border-stone-900 rounded hover:bg-stone-50" />
                      )}
                    </button>
                    <h4 className={`text-base font-black text-stone-950 leading-tight ${
                      selectedTodo.status === 'completed' ? 'line-through text-stone-400' : ''
                    }`}>
                      {selectedTodo.title}
                    </h4>
                  </div>

                  {selectedTodo.description && (
                    <p className="text-xs text-stone-705 leading-relaxed font-sans font-semibold bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      {selectedTodo.description}
                    </p>
                  )}

                  {/* Priority, Category, Status */}
                  <div className="space-y-2 text-xs font-sans font-bold">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Priority:</span>
                      <span className="capitalize text-stone-850">{selectedTodo.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Category:</span>
                      <span className="capitalize text-stone-850">{selectedTodo.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Status:</span>
                      <span className="capitalize text-stone-850">{selectedTodo.status.replace('-', ' ')}</span>
                    </div>
                    {selectedTodo.dueDate && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Due Date:</span>
                        <span className="text-stone-850 font-mono">
                          {new Date(selectedTodo.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Selected Date Summary */
              <div 
                className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-950 border-b border-stone-200 pb-3 mb-4">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Selected Date'}
                </h3>

                {todosForSelectedDate.length === 0 ? (
                  <div className="py-8 text-center">
                    <FiCalendar className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs text-stone-600 font-medium">No tasks scheduled for this day.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto">
                    {todosForSelectedDate.map((todo) => (
                      <div
                        key={todo._id}
                        onClick={(e) => handleTodoClick(todo, e)}
                        className="p-3 border border-stone-900 bg-white hover:bg-stone-50 hover:translate-y-[-1px] rounded-2xl cursor-pointer transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-start space-x-2.5"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTodoToggle(todo._id);
                          }}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {todo.status === 'completed' ? (
                            <div className="w-3.5 h-3.5 bg-[#2ECC71] border border-stone-900 rounded flex items-center justify-center">
                              <FiCheckCircle className="w-2.5 h-2.5 text-stone-950 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-3.5 h-3.5 bg-white border border-stone-900 rounded hover:bg-stone-50" />
                          )}
                        </button>
                        <div className="text-left min-w-0 flex-1">
                          <p className={`text-xs font-bold text-stone-900 truncate ${todo.status === 'completed' ? 'line-through text-stone-400' : ''}`}>
                            {todo.title}
                          </p>
                          <span className="text-[9px] font-mono font-bold text-stone-450 uppercase tracking-widest block mt-0.5">
                            {todo.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Legend Card */}
            <div 
              className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-stone-950 mb-3 font-mono">[ Legend ]</h4>
              <div className="space-y-2 text-xs font-bold font-sans">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#FF6B6B] border border-stone-900 rounded-full" />
                  <span className="text-stone-700">High Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#F8C537] border border-stone-900 rounded-full" />
                  <span className="text-stone-700">Medium Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#2ECC71] border border-stone-900 rounded-full" />
                  <span className="text-stone-700">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#FEF5D1] border border-stone-900 rounded-full" />
                  <span className="text-stone-700">Current Day</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Overlay Modal */}
        {showCreateOverlay && selectedDate && (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white border-2 border-stone-900 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full p-6 text-left"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                <h3 className="text-base font-black text-stone-950 uppercase">
                  Schedule Event
                </h3>
                <button
                  onClick={() => setShowCreateOverlay(false)}
                  className="p-1 hover:bg-stone-50 rounded-lg"
                >
                  <FiX className="w-4 h-4 text-stone-800" />
                </button>
              </div>
              
              <p className="text-xs font-bold text-stone-600 mb-4">
                Select category to create for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}:
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleCreateNew('todo')}
                  className="w-full flex items-center justify-between p-3.5 border-2 border-stone-900 rounded-2xl hover:bg-stone-50 active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-100 border border-blue-300 rounded-xl flex items-center justify-center">
                      <FiCheckCircle className="w-4.5 h-4.5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Task Todo</p>
                      <p className="text-[10px] text-stone-500 font-medium">Create a checklist item</p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-stone-500" />
                </button>

                <button
                  onClick={() => handleCreateNew('reminder')}
                  className="w-full flex items-center justify-between p-3.5 border-2 border-stone-900 rounded-2xl hover:bg-stone-50 active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-yellow-100 border border-yellow-350 rounded-xl flex items-center justify-center">
                      <FiBell className="w-4.5 h-4.5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Reminder</p>
                      <p className="text-[10px] text-stone-500 font-medium">Set alerts for deadlines</p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-stone-500" />
                </button>

                <button
                  onClick={() => handleCreateNew('schedule')}
                  className="w-full flex items-center justify-between p-3.5 border-2 border-stone-900 rounded-2xl hover:bg-stone-50 active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-green-100 border border-green-300 rounded-xl flex items-center justify-center">
                      <FiCalendar className="w-4.5 h-4.5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Schedule Event</p>
                      <p className="text-[10px] text-stone-500 font-medium">Create a timeline block</p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-stone-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Todo Form Modal */}
        <TodoForm
          todo={selectedTodo}
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedTodo(null);
            setCreateType('todo');
          }}
          onSubmit={selectedTodo ? handleUpdateTodo : handleCreateTodo}
          prefilledDate={selectedDate}
          createType={createType}
        />
      </div>
    </div>
  );
}