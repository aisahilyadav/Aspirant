import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiList,
  FiCheckCircle,
  FiClock,
  FiSearch,
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
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-app)] pt-20 pb-8 px-4 sm:px-6 lg:px-8 font-sans relative overflow-x-hidden select-none transition-colors duration-300">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />

      <div className="relative z-10 max-w-7xl mx-auto py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b-2 border-stone-850 pb-6 gap-4">
          <div className="text-left font-sans">
            <span className="text-[9px] font-mono font-black tracking-widest text-[#F26430] uppercase block rotate-[-1deg]">
              [ study task planner ]
            </span>
            <h1 className="text-4xl font-sans font-black text-white tracking-tight leading-none mt-1 uppercase">Todo Dashboard</h1>
            <p className="text-xs text-stone-400 font-bold mt-1.5 leading-relaxed">Manage your milestones, assignments, and study tasks</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-5 py-3.5 bg-[#F8C537] text-stone-950 border-2 border-stone-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] transition-all shadow-[2.5px_2.5px_0px_0px_rgba(255,255,255,0.15)] self-start md:self-center"
          >
            <FiPlus className="w-4.5 h-4.5 text-stone-950 stroke-[3]" />
            <span>New Todo</span>
          </button>
        </div>

        {/* Filter & Search Tray */}
        <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#60a5fa] grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          {/* Search bar */}
          <div className="md:col-span-1 space-y-1">
            <label className="text-[9px] font-mono font-black text-stone-950 uppercase tracking-wider">Search Tasks</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-stone-400 w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-stone-900 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-950 placeholder-stone-400 font-sans font-bold shadow-sm"
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-black text-stone-950 uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-950 font-sans font-bold shadow-sm"
            >
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-black text-stone-950 uppercase tracking-wider">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-950 font-sans font-bold shadow-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Importance</option>
              <option value="medium">Medium Importance</option>
              <option value="low">Low Importance</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-black text-stone-950 uppercase tracking-wider">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-950 font-sans font-bold shadow-sm"
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
              <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#FFE066] hover:translate-y-[-1px] transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-wider">[ Total Tasks ]</p>
                    <p className="text-2xl font-black text-stone-950 mt-1">{filteredTodos.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-white border-2 border-stone-900 rounded-xl flex items-center justify-center text-stone-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <FiList className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#60a5fa] hover:translate-y-[-1px] transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-wider">[ In Progress ]</p>
                    <p className="text-2xl font-black text-stone-950 mt-1 font-sans">
                      {filteredTodos.filter(t => t.status === 'in-progress').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-[#dbe4ff] border-2 border-stone-900 rounded-xl flex items-center justify-center text-[#2C5EFA] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <FiClock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#22c55e] hover:translate-y-[-1px] transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-wider">[ Completed ]</p>
                    <p className="text-2xl font-black text-stone-950 mt-1 font-sans">
                      {filteredTodos.filter(t => t.status === 'completed').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-[#d3ffd0] border-2 border-stone-900 rounded-xl flex items-center justify-center text-[#22c55e] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <FiCheckCircle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Widget wrapper card */}
            <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-2 shadow-[4px_4px_0px_0px_#c084fc]">
              <TodoCalendarWidget />
            </div>
          </div>

          {/* Right Column - Todo Cards Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-stone-900/40 border border-stone-850 rounded-3xl">
                <FiLoader className="w-8 h-8 text-[#F8C537] animate-spin mb-3" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">Retrieving milestones...</span>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-16 bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-8 shadow-[6px_6px_0px_0px_#FFE066]">
                <div className="w-16 h-16 bg-white border-2 border-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <FiList className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-stone-950 mb-1 uppercase tracking-wider">No todos found</h3>
                <p className="text-stone-700 text-xs font-bold mb-6">Create a milestone or filter by different tags</p>
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