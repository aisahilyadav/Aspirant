import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiPlus, 
  FiTrash2, 
  FiBell, 
  FiCalendar, 
  FiCheckCircle, 
  FiClock, 
  FiUser, 
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';

export default function TodoForm({ todo, isOpen, onClose, onSubmit, prefilledDate, createType = 'todo' }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    priority: 'medium',
    category: 'other',
    dueDate: '',
    startDate: '',
    endDate: '',
    estimatedDuration: '',
    tags: [],
    subtasks: [],
    notes: '',
    reminderTime: '',
    reminderType: 'notification',
    location: '',
    attendees: [],
    isAllDay: false,
    repeatPattern: 'none',
  });
  
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [newAttendee, setNewAttendee] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        status: todo.status || 'not-started',
        priority: todo.priority || 'medium',
        category: todo.category || 'other',
        dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : '',
        startDate: todo.startDate ? new Date(todo.startDate).toISOString().slice(0, 16) : '',
        endDate: todo.endDate ? new Date(todo.endDate).toISOString().slice(0, 16) : '',
        estimatedDuration: todo.estimatedDuration || '',
        tags: todo.tags || [],
        subtasks: todo.subtasks || [],
        notes: todo.notes || '',
        reminderTime: todo.reminderTime ? new Date(todo.reminderTime).toISOString().slice(0, 16) : '',
        reminderType: todo.reminderType || 'notification',
        location: todo.location || '',
        attendees: todo.attendees || [],
        isAllDay: todo.isAllDay || false,
        repeatPattern: todo.repeatPattern || 'none',
      });
    } else {
      const baseForm = {
        title: '',
        description: '',
        status: 'not-started',
        priority: createType === 'reminder' ? 'high' : 'medium',
        category: createType === 'reminder' ? 'reminder' : createType === 'schedule' ? 'schedule' : 'other',
        dueDate: '',
        startDate: '',
        endDate: '',
        estimatedDuration: '',
        tags: [],
        subtasks: [],
        notes: '',
        reminderTime: '',
        reminderType: 'notification',
        location: '',
        attendees: [],
        isAllDay: false,
        repeatPattern: 'none',
      };

      if (createType === 'todo') {
        baseForm.dueDate = prefilledDate ? new Date(prefilledDate).toISOString().slice(0, 16) : '';
      } else if (createType === 'reminder') {
        baseForm.reminderTime = prefilledDate ? new Date(prefilledDate).toISOString().slice(0, 16) : '';
      } else if (createType === 'schedule') {
        baseForm.startDate = prefilledDate ? new Date(prefilledDate).toISOString().slice(0, 16) : '';
        baseForm.endDate = prefilledDate ? new Date(new Date(prefilledDate).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) : '';
      }

      setFormData(baseForm);
    }
  }, [todo, isOpen, prefilledDate, createType]);

  const getFormTitle = () => {
    if (todo) return `Edit ${todo.category === 'reminder' ? 'Reminder' : todo.category === 'schedule' ? 'Event' : 'Todo'}`;
    switch (createType) {
      case 'reminder': return 'Create Reminder';
      case 'schedule': return 'Schedule Event';
      case 'todo':
      default: return 'Create New Todo';
    }
  };

  const getFormIcon = () => {
    if (todo) {
      if (todo.category === 'reminder') return <FiBell className="w-4.5 h-4.5" />;
      if (todo.category === 'schedule') return <FiCalendar className="w-4.5 h-4.5" />;
      return <FiCheckCircle className="w-4.5 h-4.5" />;
    }
    switch (createType) {
      case 'reminder': return <FiBell className="w-4.5 h-4.5" />;
      case 'schedule': return <FiCalendar className="w-4.5 h-4.5" />;
      case 'todo':
      default: return <FiCheckCircle className="w-4.5 h-4.5" />;
    }
  };

  const getCategoryOptions = () => {
    const baseOptions = [
      { value: 'study', label: 'Study' },
      { value: 'quiz', label: 'Quiz' },
      { value: 'reading', label: 'Reading' },
      { value: 'research', label: 'Research' },
      { value: 'assignment', label: 'Assignment' },
      { value: 'exam', label: 'Exam' },
      { value: 'other', label: 'Other' },
    ];

    if (createType === 'reminder') {
      return [{ value: 'reminder', label: 'Reminder' }, ...baseOptions];
    } else if (createType === 'schedule') {
      return [
        { value: 'schedule', label: 'Event' },
        { value: 'meeting', label: 'Meeting' },
        { value: 'class', label: 'Class' },
        { value: 'appointment', label: 'Appointment' },
        ...baseOptions
      ];
    }
    return baseOptions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        reminderTime: formData.reminderTime ? new Date(formData.reminderTime).toISOString() : null,
        estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : null,
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to save todo details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, { title: newSubtask.trim(), completed: false }]
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (index) => {
    setFormData(prev => ({ ...prev, subtasks: prev.subtasks.filter((_, i) => i !== index) }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        className="bg-white border-2 border-stone-900 rounded-3xl max-w-lg w-full p-6 text-left shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] overflow-hidden"
        style={{ filter: 'url(#handdrawn)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-900 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl border border-stone-900 flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${
              createType === 'reminder' ? 'bg-[#F8C537]' :
              createType === 'schedule' ? 'bg-[#2ECC71]' :
              'bg-[#2C5EFA] text-white'
            }`}>
              {getFormIcon()}
            </div>
            <div>
              <h2 className="text-lg font-sans font-black text-stone-950">
                {getFormTitle()}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-50 border border-stone-200 rounded-lg transition-all"
          >
            <FiX className="w-4 h-4 text-stone-850 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          
          {/* Title */}
          <div className="space-y-1">
            <label htmlFor="title" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-semibold shadow-sm"
              placeholder="e.g. Study Chemistry chapter 3"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-semibold shadow-sm"
              placeholder="Provide a short task summary..."
            />
          </div>

          {/* Todo fields */}
          {createType === 'todo' && (
            <>
              {/* Status, Priority, Category */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label htmlFor="status" className="text-[9px] font-bold text-stone-950 uppercase tracking-wider font-mono">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-bold shadow-sm"
                  >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="priority" className="text-[9px] font-bold text-stone-950 uppercase tracking-wider font-mono">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-bold shadow-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="category" className="text-[9px] font-bold text-stone-950 uppercase tracking-wider font-mono">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-bold shadow-sm"
                  >
                    {getCategoryOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="dueDate" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Due Date</label>
                  <input
                    type="datetime-local"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-semibold shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="estimatedDuration" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Duration (min)</label>
                  <input
                    type="number"
                    id="estimatedDuration"
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g. 45"
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 text-stone-900 font-sans font-semibold shadow-sm"
                  />
                </div>
              </div>

              {/* Subtasks */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Subtasks Checklist</label>
                <div className="space-y-1.5 max-h-28 overflow-y-auto">
                  {formData.subtasks.map((st, i) => (
                    <div key={i} className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs">
                      <span className="font-sans font-semibold text-stone-850">{st.title}</span>
                      <button
                        type="button"
                        onClick={() => removeSubtask(i)}
                        className="p-1 hover:bg-stone-200 rounded text-stone-500 hover:text-red-650 transition-colors"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                    className="flex-1 bg-white border-2 border-stone-900 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                    placeholder="Add step..."
                  />
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="px-3 bg-stone-150 border-2 border-stone-900 hover:bg-stone-900 hover:text-white rounded-xl transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <FiPlus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Reminder fields */}
          {createType === 'reminder' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="reminderTime" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Reminder Time *</label>
                  <input
                    type="datetime-local"
                    id="reminderTime"
                    name="reminderTime"
                    value={formData.reminderTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950 font-sans font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="reminderType" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Delivery Method</label>
                  <select
                    id="reminderType"
                    name="reminderType"
                    value={formData.reminderType}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-2 py-2 text-xs font-sans font-bold"
                  >
                    <option value="notification">Browser Notification</option>
                    <option value="email">Email</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="priority" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Importance</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-2 py-2 text-xs font-sans font-bold"
                  >
                    <option value="low">Low - Gentle</option>
                    <option value="medium">Medium - Important</option>
                    <option value="high">High - Critical</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="category" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-2 py-2 text-xs font-sans font-bold"
                  >
                    {getCategoryOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Schedule event fields */}
          {createType === 'schedule' && (
            <>
              <div className="flex items-center space-x-3 py-1">
                <input
                  type="checkbox"
                  id="isAllDay"
                  name="isAllDay"
                  checked={formData.isAllDay}
                  onChange={handleChange}
                  className="w-4 h-4 bg-white border-2 border-stone-900 rounded text-[#2ECC71] focus:ring-0"
                />
                <label htmlFor="isAllDay" className="text-xs font-extrabold uppercase tracking-wider text-stone-900 font-mono">
                  All day event
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="startDate" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Start Time *</label>
                  <input
                    type={formData.isAllDay ? "date" : "datetime-local"}
                    id="startDate"
                    name="startDate"
                    value={formData.isAllDay ? formData.startDate.split('T')[0] : formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="endDate" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">End Time *</label>
                  <input
                    type={formData.isAllDay ? "date" : "datetime-local"}
                    id="endDate"
                    name="endDate"
                    value={formData.isAllDay ? formData.endDate.split('T')[0] : formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="location" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where is this happening?"
                  className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Attendees</label>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                  {formData.attendees.map((at, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 bg-stone-100 border border-stone-250 text-[10px] rounded-full font-bold">
                      {at}
                      <button type="button" onClick={() => removeAttendee(at)} className="ml-1 text-stone-500 hover:text-stone-900 font-bold">x</button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={newAttendee}
                    onChange={(e) => setNewAttendee(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                    className="flex-1 bg-white border-2 border-stone-900 rounded-xl px-3 py-1.5 text-xs"
                    placeholder="e.g. peer@aspirant.edu"
                  />
                  <button
                    type="button"
                    onClick={addAttendee}
                    className="px-3 bg-stone-150 border-2 border-stone-900 hover:bg-stone-900 hover:text-white rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <FiPlus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Tags</label>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {formData.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 bg-[#FEF5D1] border border-stone-900 text-[10px] rounded-full font-bold shadow-sm">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-stone-605 font-bold">x</button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 bg-white border-2 border-stone-900 rounded-xl px-3 py-1.5 text-xs"
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 bg-stone-150 border-2 border-stone-900 hover:bg-stone-900 hover:text-white rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <FiPlus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label htmlFor="notes" className="text-[10px] font-bold text-stone-950 uppercase tracking-wider font-mono">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-stone-950"
              placeholder="Additional comments..."
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-stone-900 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 border-2 border-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !formData.title.trim()}
            className={`px-5 py-2.5 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-stone-900 transition-all ${
              isLoading || !formData.title.trim()
                ? 'bg-stone-100 text-stone-400 border-stone-300 shadow-none cursor-not-allowed'
                : 'bg-[#F26430] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center"><FiLoader className="animate-spin mr-2 w-3.5 h-3.5" />Saving...</span>
            ) : todo ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}