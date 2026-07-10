import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiList,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiLoader
} from 'react-icons/fi';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import TodoCalendarWidget from '../components/TodoCalendarWidget';
import { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo, 
  getDashboardStats, 
  toggleSubtask 
} from '../api/todoApi';

export default function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await getTodos();
      setTodos(response.todos || []);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData) => {
    try {
      await createTodo(todoData);
      loadTodos();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
      alert('Failed to create todo');
    }
  };

  const handleUpdateTodo = async (todoData) => {
    try {
      await updateTodo(editingTodo._id, todoData);
      loadTodos();
      setEditingTodo(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
      alert('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todoId);
        loadTodos();
      } catch (error) {
        console.error('Failed to delete todo:', error);
        alert('Failed to delete todo');
      }
    }
  };

  const handleToggleStatus = async (todoId) => {
    try {
      const todo = todos.find(t => t._id === todoId);
      const newStatus = todo.status === 'completed' ? 'not-started' : 'completed';
      await updateTodo(todoId, { status: newStatus });
      loadTodos();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Failed to update todo status');
    }
  };

  // Detailed Feature: Toggle Subtask Callback
  const handleSubtaskToggle = async (todoId, subtaskId, completed) => {
    try {
      await toggleSubtask(todoId, subtaskId, completed);
      loadTodos();
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
      throw error;
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  // Filter logic
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || todo.status === statusFilter;
    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pt-20 pb-8 px-4 sm:px-6 lg:px-8 font-sans relative overflow-x-hidden select-none">
      
      {/* Background Ruling Pattern */}
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
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b-2 border-stone-900 pb-6 gap-4">
          <div className="text-left">
            <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase block rotate-[-1deg]">
              [ study task planner ]
            </span>
            <h1 className="text-4xl font-sans font-black text-stone-950 tracking-tight leading-none mt-1">Todo Dashboard</h1>
            <p className="text-xs text-stone-600 font-medium mt-1.5">Manage your milestones, assignments, and tasks</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-5 py-3.5 bg-[#F8C537] text-stone-950 border-2 border-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] self-start md:self-center"
          >
            <FiPlus className="w-4.5 h-4.5 text-stone-950 stroke-[3]" />
            <span>New Todo</span>
          </button>
        </div>

        {/* Detailed Feature: Filter & Search Tray */}
        <div 
          className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] grid grid-cols-1 md:grid-cols-4 gap-4 text-left"
          style={{ filter: 'url(#handdrawn)' }}
        >
          {/* Search bar */}
          <div className="md:col-span-1 space-y-1">
            <label className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-sans">Search Tasks</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-stone-450 w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-stone-900 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 placeholder-stone-400 font-sans font-semibold shadow-sm"
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-sans">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-bold shadow-sm"
            >
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-sans">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-bold shadow-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Importance</option>
              <option value="medium">Medium Importance</option>
              <option value="low">Low Importance</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-sans">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-bold shadow-sm"
            >
              <option value="all">All Categories</option>
              <option value="study">Study</option>
              <option value="quiz">Quiz</option>
              <option value="reading">Reading</option>
              <option value="research">Research</option>
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="reminder">Reminder</option>
              <option value="schedule">Event</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column - Stats and Calendar Widget */}
          <div className="lg:col-span-1 space-y-6 text-left">
            
            {/* Stats Cards Wrapper */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Total Tasks */}
              <div 
                className="bg-white border-2 border-stone-900 rounded-3xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest font-mono">[ Total Tasks ]</p>
                    <p className="text-2xl font-black text-stone-950 mt-1">{filteredTodos.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-stone-50 border-2 border-stone-900 rounded-xl flex items-center justify-center text-stone-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <FiList className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div 
                className="bg-[#E3F2FD] border-2 border-stone-900 rounded-3xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-extrabold text-blue-700 uppercase tracking-widest font-mono">[ In Progress ]</p>
                    <p className="text-2xl font-black text-blue-900 mt-1 font-sans">
                      {filteredTodos.filter(t => t.status === 'in-progress').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white border-2 border-stone-900 rounded-xl flex items-center justify-center text-blue-700 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <FiClock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div 
                className="bg-[#EAF5E5] border-2 border-stone-900 rounded-3xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-extrabold text-green-700 uppercase tracking-widest font-mono">[ Completed ]</p>
                    <p className="text-2xl font-black text-green-900 mt-1 font-sans">
                      {filteredTodos.filter(t => t.status === 'completed').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white border-2 border-stone-900 rounded-xl flex items-center justify-center text-green-700 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <FiCheckCircle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Widget */}
            <div 
              className="bg-white border-2 border-stone-900 rounded-3xl p-2 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <TodoCalendarWidget />
            </div>
          </div>

          {/* Right Column - Todo Cards Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-stone-900 rounded-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <FiLoader className="w-8 h-8 text-stone-950 animate-spin mb-3" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">Retrieving milestones...</span>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div 
                className="text-center py-16 bg-[#FEF5D1] border-2 border-stone-900 rounded-3xl p-8 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <div className="w-16 h-16 bg-white border-2 border-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <FiList className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-stone-950 mb-1 uppercase tracking-wider">No todos found</h3>
                <p className="text-stone-750 text-xs font-bold mb-6">Create a milestone or filter by different tags</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center space-x-2 px-5 py-3 bg-[#F8C537] text-stone-950 border-2 border-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all"
                >
                  <FiPlus className="w-4 h-4 text-stone-950 stroke-[3]" />
                  <span>Create Todo</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTodos.map((todo) => (
                  <TodoCard
                    key={todo._id}
                    todo={todo}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                    onSubtaskToggle={handleSubtaskToggle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Todo Form Modal */}
        <TodoForm
          todo={editingTodo}
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingTodo(null);
          }}
          onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
        />
      </div>
    </div>
  );
}