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
        return 'bg-[#FF6B6B] text-stone-950 border-2 border-stone-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
      case 'medium': 
        return 'bg-[#F8C537] text-stone-950 border-2 border-stone-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
      case 'low': 
        return 'bg-[#22c55e] text-stone-950 border-2 border-stone-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
      default: 
        return 'bg-stone-100 text-stone-850 border-2 border-stone-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed': 
        return 'bg-[#d3ffd0] text-[#1e6128] border-2 border-stone-950 font-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
      case 'in-progress': 
        return 'bg-[#dbe4ff] text-blue-900 border-2 border-stone-950 font-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
      case 'not-started': 
      default: 
        return 'bg-white text-stone-605 border-2 border-stone-950 font-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]';
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
      className="bg-[#FAF9F6] border-3 border-stone-950 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between text-stone-950"
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
                <div className="w-5 h-5 bg-[#22c55e] border-2 border-stone-950 rounded-md flex items-center justify-center">
                  <FiCheck className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 bg-white border-2 border-stone-950 rounded-md hover:bg-stone-50" />
              )}
            </button>
            <div className="text-left">
              <h3 className={`font-sans font-black text-base text-stone-950 ${
                todo.status === 'completed' ? 'line-through text-stone-450' : ''
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-xs text-stone-700 mt-1.5 leading-relaxed font-sans font-bold">
                  {todo.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => onEdit(todo)}
              className="p-1.5 text-stone-700 hover:text-stone-950 border-2 border-transparent hover:border-stone-950 hover:bg-white rounded-lg transition-all"
              title="Edit Task"
            >
              <FiEdit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(todo._id)}
              className="p-1.5 text-stone-700 hover:text-[#FF6B6B] border-2 border-transparent hover:border-stone-950 hover:bg-[#FFD2D2] rounded-lg transition-all"
              title="Delete Task"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Subtasks Checklist */}
        {totalSubtasks > 0 && (
          <div className="mt-4 mb-4 border-t-2 border-stone-200 pt-3 text-left">
            <div className="flex items-center justify-between text-[9px] font-mono font-black text-stone-950 uppercase tracking-wider mb-2">
              <span>Subtasks Progress</span>
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
            
            {/* Subtasks Progress Bar */}
            <div className="w-full bg-stone-200 border-2 border-stone-950 rounded-full h-3 overflow-hidden mb-3">
              <div
                className="bg-[#60a5fa] h-full transition-all duration-300"
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
                    className="flex items-center space-x-2.5 py-1 px-2 hover:bg-white border border-transparent hover:border-stone-200 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleSubtaskCheckboxClick(subtaskId, subtask.completed)}
                  >
                    <button
                      type="button"
                      disabled={isToggling}
                      className="flex-shrink-0 focus:outline-none"
                    >
                      {isToggling ? (
                        <FiLoader className="w-4.5 h-4.5 text-stone-950 animate-spin" />
                      ) : subtask.completed ? (
                        <div className="w-4 h-4 bg-[#22c55e] border border-stone-950 rounded flex items-center justify-center">
                          <FiCheck className="w-3 h-3 text-stone-950 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 bg-white border border-stone-950 rounded hover:bg-stone-100" />
                      )}
                    </button>
                    <span className={`text-xs font-sans font-bold ${
                      subtask.completed ? 'line-through text-stone-400' : 'text-stone-850'
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
          <span className="text-[10px] font-sans font-black flex items-center bg-white px-2 py-0.5 rounded-full border-2 border-stone-950">
            <span className="mr-1">{getCategoryIcon(todo.category)}</span>
            <span className="text-stone-950 capitalize">{todo.category}</span>
          </span>

          {/* Priority */}
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${getPriorityStyles(todo.priority)}`}>
            {todo.priority}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-sans font-black">
          {/* Due Date */}
          {todo.dueDate && (
            <span className={`flex items-center space-x-1 ${
              isOverdue ? 'text-[#FF6B6B]' : 'text-stone-605'
            }`}>
              <FiCalendar className="w-3.5 h-3.5" />
              <span className="font-mono">{formatDate(todo.dueDate)}</span>
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