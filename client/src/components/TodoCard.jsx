import React, { useState } from 'react';
import { 
  FiClock, 
  FiFlag, 
  FiCheckCircle, 
  FiCircle, 
  FiCalendar,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiLoader
} from 'react-icons/fi';

export default function TodoCard({ todo, onToggleStatus, onEdit, onDelete, onSubtaskToggle }) {
  const [subtaskTogglingId, setSubtaskTogglingId] = useState(null);

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high': 
        return 'bg-[#FF6B6B] text-stone-950 border-2 border-stone-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
      case 'medium': 
        return 'bg-[#F8C537] text-stone-950 border-2 border-stone-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
      case 'low': 
        return 'bg-[#2ECC71] text-stone-950 border-2 border-stone-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
      default: 
        return 'bg-stone-100 text-stone-800 border-2 border-stone-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed': 
        return 'bg-[#EAF5E5] text-green-800 border border-green-300';
      case 'in-progress': 
        return 'bg-[#E3F2FD] text-blue-800 border border-blue-300';
      case 'not-started': 
      default: 
        return 'bg-stone-100 text-stone-605 border border-stone-250';
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed';
  const completedSubtasks = todo.subtasks?.filter(subtask => subtask.completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;

  const handleSubtaskCheckboxClick = async (subtaskId, currentCompletedState) => {
    if (!onSubtaskToggle) return;
    try {
      setSubtaskTogglingId(subtaskId);
      await onSubtaskToggle(todo._id, subtaskId, !currentCompletedState);
    } catch (error) {
      console.error(error);
    } finally {
      setSubtaskTogglingId(null);
    }
  };

  return (
    <div 
      className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] transition-all flex flex-col justify-between text-stone-900"
      style={{ filter: 'url(#handdrawn)' }}
    >
      <div>
        {/* Header Title and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => onToggleStatus(todo._id)}
              className="mt-1 flex-shrink-0 transition-transform active:scale-90"
            >
              {todo.status === 'completed' ? (
                <div className="w-5 h-5 bg-[#2ECC71] border-2 border-stone-900 rounded-md flex items-center justify-center">
                  <FiCheck className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 bg-white border-2 border-stone-900 rounded-md hover:bg-stone-50" />
              )}
            </button>
            <div className="text-left">
              <h3 className={`font-sans font-black text-base text-stone-950 ${
                todo.status === 'completed' ? 'line-through text-stone-400' : ''
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-xs text-stone-700 mt-1.5 leading-relaxed font-sans font-medium">
                  {todo.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => onEdit(todo)}
              className="p-1.5 text-stone-700 hover:text-stone-950 border border-transparent hover:border-stone-900 hover:bg-stone-50 rounded-lg transition-all"
              title="Edit Task"
            >
              <FiEdit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(todo._id)}
              className="p-1.5 text-stone-700 hover:text-red-600 border border-transparent hover:border-stone-900 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Task"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Feature: Interactive Subtasks Checklist */}
        {totalSubtasks > 0 && (
          <div className="mt-4 mb-4 border-t border-stone-200 pt-3 text-left">
            <div className="flex items-center justify-between text-[10px] font-bold text-stone-850 uppercase tracking-wider mb-2 font-mono">
              <span>Subtasks Progress</span>
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
            
            {/* Subtasks Progress Bar */}
            <div className="w-full bg-stone-100 border-2 border-stone-900 rounded-full h-2.5 overflow-hidden mb-3">
              <div
                className="bg-[#2C5EFA] h-full transition-all duration-300"
                style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              />
            </div>

            {/* Subtasks Interactive List */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {todo.subtasks.map((subtask) => {
                const subtaskId = subtask._id || subtask.id;
                const isToggling = subtaskTogglingId === subtaskId;
                return (
                  <div 
                    key={subtaskId} 
                    className="flex items-center space-x-2.5 py-1 px-2 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleSubtaskCheckboxClick(subtaskId, subtask.completed)}
                  >
                    <button
                      type="button"
                      disabled={isToggling}
                      className="flex-shrink-0 focus:outline-none"
                    >
                      {isToggling ? (
                        <FiLoader className="w-4.5 h-4.5 text-stone-850 animate-spin" />
                      ) : subtask.completed ? (
                        <div className="w-4 h-4 bg-[#2ECC71] border border-stone-900 rounded flex items-center justify-center">
                          <FiCheck className="w-3 h-3 text-stone-950 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 bg-white border border-stone-900 rounded hover:bg-stone-100" />
                      )}
                    </button>
                    <span className={`text-xs font-sans font-medium ${
                      subtask.completed ? 'line-through text-stone-400' : 'text-stone-800'
                    }`}>
                      {subtask.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-stone-200 gap-2">
        <div className="flex items-center space-x-2">
          {/* Category */}
          <span className="text-xs font-sans font-bold flex items-center bg-stone-100/80 px-2 py-0.5 rounded-full border border-stone-250">
            <span className="mr-1">{getCategoryIcon(todo.category)}</span>
            <span className="text-stone-750 capitalize">{todo.category}</span>
          </span>

          {/* Priority */}
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${getPriorityStyles(todo.priority)}`}>
            {todo.priority}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-sans font-bold">
          {/* Due Date */}
          {todo.dueDate && (
            <span className={`flex items-center space-x-1 ${
              isOverdue ? 'text-[#FF6B6B]' : 'text-stone-600'
            }`}>
              <FiCalendar className="w-3.5 h-3.5" />
              <span>{formatDate(todo.dueDate)}</span>
            </span>
          )}

          {/* Status */}
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${getStatusStyles(todo.status)}`}>
            {todo.status.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}