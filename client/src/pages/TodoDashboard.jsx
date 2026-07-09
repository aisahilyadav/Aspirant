import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiList,
  FiCheckCircle,
  FiClock,
  FiFlag
} from 'react-icons/fi';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import TodoCalendarWidget from '../components/TodoCalendarWidget';
import { getTodos, createTodo, updateTodo, deleteTodo, getDashboardStats } from '../api/todoApi';

export default function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

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

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Add proper spacing from top navigation */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2">Todo Dashboard</h1>
              <p className="text-gray-450 text-sm">Manage your tasks and stay organized</p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-5 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-150 transition-colors duration-200 shadow-md shadow-white/5"
            >
              <FiPlus className="w-4 h-4 text-black" />
              <span>New Todo</span>
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Stats and Calendar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Simple Stats Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl p-4 border border-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Total Tasks</p>
                      <p className="text-2xl font-black text-white mt-1">{todos.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">
                      <FiList className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl p-4 border border-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">In Progress</p>
                      <p className="text-2xl font-black text-blue-400 mt-1">
                        {todos.filter(t => t.status === 'in-progress').length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/15 rounded-xl flex items-center justify-center text-blue-400">
                      <FiClock className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl p-4 border border-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Completed</p>
                      <p className="text-2xl font-black text-green-400 mt-1">
                        {todos.filter(t => t.status === 'completed').length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-green-500/10 border border-green-500/15 rounded-xl flex items-center justify-center text-green-400">
                      <FiCheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Widget */}
              <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-4">
                <TodoCalendarWidget />
              </div>
            </div>

            {/* Right Column - Todo List */}
            <div className="lg:col-span-3">
              {/* Todo List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center py-12 bg-white/[0.005] border border-white/5 rounded-3xl p-8">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <FiList className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-1 uppercase tracking-wider">No todos found</h3>
                  <p className="text-gray-500 text-xs mb-6">Get started by creating your first todo</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-150 transition-colors duration-200"
                  >
                    <FiPlus className="w-4 h-4 text-black" />
                    <span>Create Todo</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {todos.map((todo) => (
                    <TodoCard
                      key={todo._id}
                      todo={todo}
                      onToggleStatus={handleToggleStatus}
                      onEdit={handleEditTodo}
                      onDelete={handleDeleteTodo}
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
    </div>
  );
}