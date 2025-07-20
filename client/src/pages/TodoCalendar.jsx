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
  FiFilter,
  FiSearch,
  FiMoreVertical,
  FiBell,
  FiUser,
  FiX,
  FiEdit3,
  FiTrash2
} from 'react-icons/fi';
import { getCalendarTodos, createTodo, updateTodo, deleteTodo } from '../api/todoApi';
import TodoForm from '../components/TodoForm';
import TodoCard from '../components/TodoCard';

export default function TodoCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [todosForSelectedDate, setTodosForSelectedDate] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const [showTodoDetails, setShowTodoDetails] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [createType, setCreateType] = useState('todo');
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      loadTodosForDate(selectedDate);
    }
  }, [selectedDate, calendarData]);

  // Close overlays when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.create-overlay-modal') && !event.target.closest('.calendar-day')) {
        setShowCreateOverlay(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowCreateOverlay(false);
      }
    };

    if (showCreateOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showCreateOverlay]);

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
        
        // Store full todo data for each date
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
      // Combine all todos for this date and remove duplicates
      const allTodos = [
        ...dayData.created,
        ...dayData.due
      ];
      
      // Remove duplicates based on _id
      const uniqueTodos = allTodos.filter((todo, index, self) => 
        index === self.findIndex(t => t._id === todo._id)
      );
      
      // Apply filters
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

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null);
    setShowCreateOverlay(false);
    setShowTodoDetails(false);
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

  const getDayIndicators = (dayData) => {
    const indicators = [];
    
    if (dayData.created > 0) {
      indicators.push('bg-blue-500');
    }
    if (dayData.due > 0) {
      indicators.push(dayData.completed === dayData.due ? 'bg-green-500' : 'bg-yellow-500');
    }
    
    return indicators;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date, event) => {
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
      // Set appropriate fields based on create type
      if (selectedDate) {
        if (createType === 'todo') {
          todoData.dueDate = selectedDate.toISOString();
          todoData.category = todoData.category || 'other';
        } else if (createType === 'reminder') {
          todoData.dueDate = selectedDate.toISOString();
          todoData.category = 'reminder';
          todoData.isReminder = true;
        } else if (createType === 'schedule') {
          todoData.startDate = selectedDate.toISOString();
          todoData.category = 'schedule';
          todoData.isScheduled = true;
        }
      }
      
      await createTodo(todoData);
      setShowForm(false);
      loadCalendarData();
      setCreateType('todo');
    } catch (error) {
      console.error('Failed to create todo:', error);
      alert('Failed to create todo');
    }
  };

  const handleTodoToggle = async (todoId) => {
    try {
      const todo = todosForSelectedDate.find(t => t._id === todoId);
      const newStatus = todo.status === 'completed' ? 'not-started' : 'completed';
      await updateTodo(todoId, { status: newStatus });
      loadCalendarData();
    } catch (error) {
      console.error('Failed to toggle todo status:', error);
    }
  };

  const handleEditTodo = (todo) => {
    setSelectedTodo(todo);
    setShowForm(true);
    setShowTodoDetails(false);
  };

  const handleDeleteTodo = async (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todoId);
        loadCalendarData();
        setShowTodoDetails(false);
        setSelectedTodo(null);
      } catch (error) {
        console.error('Failed to delete todo:', error);
        alert('Failed to delete todo');
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
      console.error('Failed to update todo:', error);
      alert('Failed to update todo');
    }
  };

  const days = getDaysInMonth();
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
              <p className="text-gray-600">View and manage your tasks by date</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Filters */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Todo</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden calendar-container relative">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <h2 className="text-2xl font-bold text-gray-900">
                      {formatMonth(currentDate)}
                    </h2>
                    
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Today
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Week day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {shortWeekDays.map(day => (
                      <div key={day} className="text-center py-3">
                        <span className="text-sm font-semibold text-gray-600">{day}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {days.map(({ date, isCurrentMonth }, index) => {
                      const dayData = getDayData(date);
                      const indicators = getDayIndicators(dayData);
                      const today = isToday(date);
                      const selected = isSelected(date);
                      
                      return (
                        <div
                          key={index}
                          onClick={(e) => handleDateClick(date, e)}
                          className={`calendar-day relative min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-all duration-200 ${
                            !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'
                          } ${
                            today ? 'ring-2 ring-black' : ''
                          } ${
                            selected ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${
                              today ? 'text-black font-bold' : 
                              !isCurrentMonth ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                              {date.getDate()}
                            </span>
                            
                            {/* Todo count indicators */}
                            {dayData.todos.length > 0 && (
                              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                {dayData.todos.length}
                              </span>
                            )}
                          </div>

                          {/* Color indicators */}
                          <div className="flex space-x-1 mb-2">
                            {indicators.slice(0, 3).map((color, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${color}`} />
                            ))}
                            {indicators.length > 3 && (
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                            )}
                          </div>

                          {/* First few todos preview - Now clickable */}
                          <div className="space-y-1">
                            {dayData.todos.slice(0, 2).map((todo) => (
                              <div
                                key={todo._id}
                                onClick={(e) => handleTodoClick(todo, e)}
                                className={`text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
                                  todo.status === 'completed' 
                                    ? 'bg-green-100 text-green-800 line-through' 
                                    : todo.priority === 'high' 
                                    ? 'bg-red-100 text-red-800'
                                    : todo.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                                title={todo.title}
                              >
                                {todo.title}
                              </div>
                            ))}
                            {dayData.todos.length > 2 && (
                              <div className="text-xs text-gray-500 px-2">
                                +{dayData.todos.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Todo Details or Selected Date Info */}
            <div className="lg:col-span-1">
              {/* Todo Details */}
              {showTodoDetails && selectedTodo && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Todo Details</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTodo(selectedTodo)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(selectedTodo._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowTodoDetails(false)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Title and Status */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <button onClick={() => handleTodoToggle(selectedTodo._id)}>
                          {selectedTodo.status === 'completed' ? (
                            <FiCheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <FiCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <h4 className={`text-lg font-medium ${
                          selectedTodo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {selectedTodo.title}
                        </h4>
                      </div>
                      
                      {selectedTodo.description && (
                        <p className="text-gray-600 text-sm">{selectedTodo.description}</p>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedTodo.priority === 'high' ? 'bg-red-100 text-red-600' :
                          selectedTodo.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {selectedTodo.priority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Category:</span>
                        <span className="text-gray-900 capitalize">{selectedTodo.category}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedTodo.status === 'completed' ? 'bg-green-100 text-green-600' :
                          selectedTodo.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {selectedTodo.status.replace('-', ' ')}
                        </span>
                      </div>

                      {selectedTodo.dueDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Due Date:</span>
                          <span className="text-gray-900">
                            {new Date(selectedTodo.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}

                      {selectedTodo.estimatedDuration && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span className="text-gray-900">{selectedTodo.estimatedDuration} min</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {selectedTodo.tags && selectedTodo.tags.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500 mb-2 block">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedTodo.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedTodo.notes && (
                      <div>
                        <span className="text-sm text-gray-500 mb-2 block">Notes:</span>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {selectedTodo.notes}
                        </p>
                      </div>
                    )}

                    {/* Progress */}
                    {selectedTodo.subtasks && selectedTodo.subtasks.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500 mb-2 block">Subtasks:</span>
                        <div className="space-y-2">
                          {selectedTodo.subtasks.map((subtask, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                subtask.completed ? 'bg-green-500' : 'border-2 border-gray-300'
                              }`} />
                              <span className={`text-sm ${
                                subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Regular sidebar content when no special views */}
              {!showTodoDetails && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Click on a Date'}
                  </h3>

                  {selectedDate ? (
                    <div className="space-y-4">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-blue-600">
                            {getDayData(selectedDate).created}
                          </div>
                          <div className="text-xs text-blue-600">Created</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-yellow-600">
                            {getDayData(selectedDate).due}
                          </div>
                          <div className="text-xs text-yellow-600">Due</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-green-600">
                            {getDayData(selectedDate).completed}
                          </div>
                          <div className="text-xs text-green-600">Done</div>
                        </div>
                      </div>

                      {/* Todos List */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                          Tasks ({todosForSelectedDate.length})
                        </h4>
                        
                        {todosForSelectedDate.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-sm mb-3">
                              No tasks for this date
                            </p>
                            <p className="text-gray-400 text-xs">
                              Click on the date to add tasks
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {todosForSelectedDate.map((todo) => (
                              <div
                                key={todo._id}
                                onClick={(e) => handleTodoClick(todo, e)}
                                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <div className="flex items-start space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTodoToggle(todo._id);
                                    }}
                                    className="mt-1"
                                  >
                                    {todo.status === 'completed' ? (
                                      <FiCheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <FiCircle className="w-4 h-4 text-gray-400" />
                                    )}
                                  </button>
                                  <div className="flex-1">
                                    <h5 className={`text-sm font-medium ${
                                      todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                                    }`}>
                                      {todo.title}
                                    </h5>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        todo.priority === 'high' ? 'bg-red-100 text-red-600' :
                                        todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-green-100 text-green-600'
                                      }`}>
                                        {todo.priority}
                                      </span>
                                      <span className="text-xs text-gray-500 capitalize">
                                        {todo.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        Click on a date to view and manage tasks
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Legend */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-gray-600">Tasks Created</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-gray-600">Tasks Due</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-gray-600">All Done</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-black rounded-full" />
                    <span className="text-gray-600">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Overlay Modal - Now centered on screen */}
          {showCreateOverlay && selectedDate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="create-overlay-modal bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Create for {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Choose what you'd like to create for this date
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCreateOverlay(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => handleCreateNew('todo')}
                      className="w-full flex items-center space-x-4 p-4 text-left border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <FiCheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-gray-900">Todo</div>
                        <div className="text-sm text-gray-600">Create a new task to complete</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleCreateNew('reminder')}
                      className="w-full flex items-center space-x-4 p-4 text-left border-2 border-gray-200 rounded-xl hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                        <FiBell className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-gray-900">Reminder</div>
                        <div className="text-sm text-gray-600">Set a reminder for important things</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleCreateNew('schedule')}
                      className="w-full flex items-center space-x-4 p-4 text-left border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <FiCalendar className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-gray-900">Schedule</div>
                        <div className="text-sm text-gray-600">Schedule an event or appointment</div>
                      </div>
                    </button>
                  </div>

                  {/* Show existing todos for this date if any */}
                  {todosForSelectedDate.length > 0 && (
                    <>
                      <hr className="my-6" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Existing tasks ({todosForSelectedDate.length})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {todosForSelectedDate.map((todo) => (
                            <div
                              key={todo._id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTodoClick(todo, e);
                                setShowCreateOverlay(false);
                              }}
                              className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  todo.status === 'completed' ? 'bg-green-500' : 
                                  todo.priority === 'high' ? 'bg-red-500' : 
                                  todo.priority === 'medium' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`} />
                                <div className="flex-1">
                                  <span className={`text-sm font-medium ${
                                    todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                                  }`}>
                                    {todo.title}
                                  </span>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-500 capitalize">
                                      {todo.category}
                                    </span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                      todo.priority === 'high' ? 'bg-red-100 text-red-600' :
                                      todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                      'bg-green-100 text-green-600'
                                    }`}>
                                      {todo.priority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
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
    </div>
  );
}