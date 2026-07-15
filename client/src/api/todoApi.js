import { useAuth } from '../store/auth';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/todos`;

// Get auth token helper
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});

// Create todo
export const createTodo = async (todoData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(todoData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Create todo error:', error);
    throw error;
  }
};

// Get all todos
export const getTodos = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get todos error:', error);
    throw error;
  }
};

// Get todo by ID
export const getTodoById = async (todoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${todoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get todo by ID error:', error);
    throw error;
  }
};

// Update todo
export const updateTodo = async (todoId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${todoId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update todo error:', error);
    throw error;
  }
};

// Delete todo
export const deleteTodo = async (todoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${todoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Delete todo error:', error);
    throw error;
  }
};

// Toggle subtask
export const toggleSubtask = async (todoId, subtaskId, completed) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${todoId}/subtasks`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ subtaskId, completed }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle subtask');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Toggle subtask error:', error);
    throw error;
  }
};

// Get calendar todos (updated)
export const getCalendarTodos = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      includeCreated: 'true', // Add this to include creation dates
    });
    
    const response = await fetch(`${API_BASE_URL}/calendar?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch calendar todos');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get calendar todos error:', error);
    throw error;
  }
};

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};