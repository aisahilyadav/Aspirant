import React from 'react';
import { 
  FiClock, 
  FiFlag, 
  FiCheckCircle, 
  FiCircle, 
  FiCalendar,
  FiEdit3,
  FiTrash2
} from 'react-icons/fi';

export default function TodoCard({ todo, onToggleStatus, onEdit, onDelete }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10';
      case 'in-progress': return 'text-blue-400 bg-blue-500/10';
      case 'not-started': return 'text-gray-400 bg-white/5';
      default: return 'text-gray-400 bg-white/5';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'quiz': return '📝';
      case 'study': return '📚';
      case 'reading': return '📖';
      case 'research': return '🔍';
      case 'assignment': return '📄';
      case 'exam': return '🎓';
      default: return '📋';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed';
  const completedSubtasks = todo.subtasks?.filter(subtask => subtask.completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;

  return (
    <div className="bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl border border-white/5 p-5 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onToggleStatus(todo._id)}
            className="mt-1 transition-colors duration-200"
          >
            {todo.status === 'completed' ? (
              <FiCheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <FiCircle className="w-5 h-5 text-gray-500 hover:text-gray-400" />
            )}
          </button>
          <div className="flex-1">
            <h3 className={`font-semibold text-white ${
              todo.status === 'completed' ? 'line-through text-gray-500' : ''
            }`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {todo.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(todo)}
            className="p-1 text-gray-500 hover:text-white transition-colors duration-200"
          >
            <FiEdit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="p-1 text-gray-500 hover:text-red-400 transition-colors duration-200"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1 font-mono">
            <span>Progress</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center space-x-2">
          {/* Category */}
          <span className="text-xs flex items-center space-x-1">
            <span>{getCategoryIcon(todo.category)}</span>
            <span className="text-gray-400 capitalize">{todo.category}</span>
          </span>

          {/* Priority */}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(todo.priority)}`}>
            {todo.priority}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-gray-500">
          {/* Due Date */}
          {todo.dueDate && (
            <span className={`flex items-center space-x-1 ${
              isOverdue ? 'text-red-400' : 'text-gray-500'
            }`}>
              <FiCalendar className="w-3.5 h-3.5" />
              <span>{formatDate(todo.dueDate)}</span>
            </span>
          )}

          {/* Status */}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(todo.status)}`}>
            {todo.status.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}