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
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'not-started': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onToggleStatus(todo._id)}
            className="mt-1 transition-colors duration-200"
          >
            {todo.status === 'completed' ? (
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <FiCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 ${
              todo.status === 'completed' ? 'line-through text-gray-500' : ''
            }`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {todo.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(todo)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FiEdit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar (if subtasks exist) */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Category */}
          <span className="text-sm flex items-center space-x-1">
            <span>{getCategoryIcon(todo.category)}</span>
            <span className="text-gray-600 capitalize">{todo.category}</span>
          </span>

          {/* Priority */}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
            <FiFlag className="w-3 h-3 inline mr-1" />
            {todo.priority}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-gray-500">
          {/* Due Date */}
          {todo.dueDate && (
            <span className={`flex items-center space-x-1 ${
              isOverdue ? 'text-red-600' : 'text-gray-500'
            }`}>
              <FiCalendar className="w-3 h-3" />
              <span>{formatDate(todo.dueDate)}</span>
            </span>
          )}

          {/* Status */}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}>
            {todo.status.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}