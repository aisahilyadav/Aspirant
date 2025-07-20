import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiBell, FiCalendar, FiCheckCircle, FiClock, FiUser, FiAlertCircle } from 'react-icons/fi';

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
    // Reminder specific fields
    reminderTime: '',
    reminderType: 'notification',
    snoozeOptions: [],
    // Schedule specific fields
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
        // Reminder fields
        reminderTime: todo.reminderTime ? new Date(todo.reminderTime).toISOString().slice(0, 16) : '',
        reminderType: todo.reminderType || 'notification',
        snoozeOptions: todo.snoozeOptions || [],
        // Schedule fields
        location: todo.location || '',
        attendees: todo.attendees || [],
        isAllDay: todo.isAllDay || false,
        repeatPattern: todo.repeatPattern || 'none',
      });
    } else {
      // Reset form with prefilled date if provided and set defaults based on create type
      const baseForm = {
        title: '',
        description: '',
        status: getDefaultStatus(createType),
        priority: getDefaultPriority(createType),
        category: getDefaultCategory(createType),
        dueDate: '',
        startDate: '',
        endDate: '',
        estimatedDuration: '',
        tags: [],
        subtasks: [],
        notes: '',
        reminderTime: '',
        reminderType: 'notification',
        snoozeOptions: [],
        location: '',
        attendees: [],
        isAllDay: false,
        repeatPattern: 'none',
      };

      // Set type-specific defaults
      if (createType === 'todo') {
        baseForm.title = '';
        baseForm.dueDate = prefilledDate ? new Date(prefilledDate).toISOString().slice(0, 16) : '';
      } else if (createType === 'reminder') {
        baseForm.title = '';
        baseForm.reminderTime = prefilledDate ? new Date(prefilledDate).toISOString().slice(0, 16) : '';
      } else if (createType === 'schedule') {
        baseForm.title = '';
        baseForm.startDate = prefilledDate ? new Date(prefilledDate).toISOString().slice(0, 16) : '';
        baseForm.endDate = prefilledDate ? new Date(new Date(prefilledDate).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) : '';
      }

      setFormData(baseForm);
    }
  }, [todo, isOpen, prefilledDate, createType]);

  const getDefaultCategory = (type) => {
    switch (type) {
      case 'reminder': return 'reminder';
      case 'schedule': return 'schedule';
      case 'todo':
      default: return 'other';
    }
  };

  const getDefaultStatus = (type) => {
    switch (type) {
      case 'schedule': return 'not-started';
      case 'reminder': return 'not-started';
      case 'todo':
      default: return 'not-started';
    }
  };

  const getDefaultPriority = (type) => {
    switch (type) {
      case 'reminder': return 'high';
      case 'schedule': return 'medium';
      case 'todo':
      default: return 'medium';
    }
  };

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
      if (todo.category === 'reminder') return <FiBell className="w-5 h-5" />;
      if (todo.category === 'schedule') return <FiCalendar className="w-5 h-5" />;
      return <FiCheckCircle className="w-5 h-5" />;
    }
    
    switch (createType) {
      case 'reminder': return <FiBell className="w-5 h-5" />;
      case 'schedule': return <FiCalendar className="w-5 h-5" />;
      case 'todo':
      default: return <FiCheckCircle className="w-5 h-5" />;
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
      console.error('Form submission error:', error);
      alert('Failed to save. Please try again.');
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
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, { title: newSubtask.trim(), completed: false }],
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (index) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  };

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()],
      }));
      setNewAttendee('');
    }
  };

  const removeAttendee = (attendeeToRemove) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(attendee => attendee !== attendeeToRemove),
    }));
  };

  if (!isOpen) return null;

  // Render different forms based on type
  const renderTodoForm = () => (
    <>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter task title..."
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe what needs to be done..."
        />
      </div>

      {/* Status, Priority, Category */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {getCategoryOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="estimatedDuration"
            name="estimatedDuration"
            value={formData.estimatedDuration}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 60"
          />
        </div>
      </div>

      {/* Subtasks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtasks
        </label>
        <div className="space-y-2 mb-2">
          {formData.subtasks.map((subtask, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={(e) => {
                  const updatedSubtasks = [...formData.subtasks];
                  updatedSubtasks[index].completed = e.target.checked;
                  setFormData(prev => ({ ...prev, subtasks: updatedSubtasks }));
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {subtask.title}
              </span>
              <button
                type="button"
                onClick={() => removeSubtask(index)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                <FiTrash2 className="w-4 h-4" />
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a subtask..."
          />
          <button
            type="button"
            onClick={addSubtask}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 p-0.5 text-blue-600 hover:text-blue-800"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add additional notes..."
        />
      </div>
    </>
  );

  const renderReminderForm = () => (
    <>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Reminder Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="What do you want to be reminded about?"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="Additional details for your reminder..."
        />
      </div>

      {/* Reminder Time & Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-2">
            <FiBell className="w-4 h-4 inline mr-1" />
            Reminder Time *
          </label>
          <input
            type="datetime-local"
            id="reminderTime"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="reminderType" className="block text-sm font-medium text-gray-700 mb-2">
            Notification Type
          </label>
          <select
            id="reminderType"
            name="reminderType"
            value={formData.reminderType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="notification">Browser Notification</option>
            <option value="email">Email</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      {/* Priority & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            <FiAlertCircle className="w-4 h-4 inline mr-1" />
            Importance
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="low">Low - Just a gentle nudge</option>
            <option value="medium">Medium - Important reminder</option>
            <option value="high">High - Very important!</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            {getCategoryOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 p-0.5 text-yellow-600 hover:text-yellow-800"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="Any additional context for your reminder..."
        />
      </div>
    </>
  );

  const renderScheduleForm = () => (
    <>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter event title..."
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Event description or agenda..."
        />
      </div>

      {/* All Day Toggle */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isAllDay"
          name="isAllDay"
          checked={formData.isAllDay}
          onChange={handleChange}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="isAllDay" className="text-sm font-medium text-gray-700">
          <FiClock className="w-4 h-4 inline mr-1" />
          All day event
        </label>
      </div>

      {/* Start & End Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Time *
          </label>
          <input
            type={formData.isAllDay ? "date" : "datetime-local"}
            id="startDate"
            name="startDate"
            value={formData.isAllDay ? formData.startDate.split('T')[0] : formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Time *
          </label>
          <input
            type={formData.isAllDay ? "date" : "datetime-local"}
            id="endDate"
            name="endDate"
            value={formData.isAllDay ? formData.endDate.split('T')[0] : formData.endDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Where will this event take place?"
        />
      </div>

      {/* Attendees */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiUser className="w-4 h-4 inline mr-1" />
          Attendees
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.attendees.map((attendee, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
            >
              {attendee}
              <button
                type="button"
                onClick={() => removeAttendee(attendee)}
                className="ml-1 p-0.5 text-green-600 hover:text-green-800"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newAttendee}
            onChange={(e) => setNewAttendee(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Add attendee email..."
          />
          <button
            type="button"
            onClick={addAttendee}
            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {getCategoryOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Repeat Pattern */}
      <div>
        <label htmlFor="repeatPattern" className="block text-sm font-medium text-gray-700 mb-2">
          Repeat
        </label>
        <select
          id="repeatPattern"
          name="repeatPattern"
          value={formData.repeatPattern}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="none">Does not repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 p-0.5 text-green-600 hover:text-green-800"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Additional notes for this event..."
        />
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              createType === 'reminder' ? 'bg-yellow-100 text-yellow-600' :
              createType === 'schedule' ? 'bg-green-100 text-green-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {getFormIcon()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getFormTitle()}
              </h2>
              {prefilledDate && !todo && (
                <span className="text-sm text-gray-500">
                  for {prefilledDate.toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Render different form based on type */}
          {createType === 'todo' && renderTodoForm()}
          {createType === 'reminder' && renderReminderForm()}
          {createType === 'schedule' && renderScheduleForm()}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                createType === 'reminder' ? 'bg-yellow-600 hover:bg-yellow-700' :
                createType === 'schedule' ? 'bg-green-600 hover:bg-green-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Saving...' : 
               todo ? 'Update' : 
               createType === 'reminder' ? 'Create Reminder' :
               createType === 'schedule' ? 'Schedule Event' :
               'Create Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}