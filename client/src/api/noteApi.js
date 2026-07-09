const API_BASE_URL = 'http://localhost:8001/api/notes';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getHeaders = (isMultipart = false) => {
  const headers = {
    'Authorization': `Bearer ${getAuthToken()}`,
  };
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Get all notes
export const getNotes = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch notes');
    return await response.json();
  } catch (error) {
    console.error('getNotes error:', error);
    throw error;
  }
};

// Get note by ID
export const getNoteById = async (noteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${noteId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch note');
    return await response.json();
  } catch (error) {
    console.error('getNoteById error:', error);
    throw error;
  }
};

// Create note
export const createNote = async (noteData = {}) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error('Failed to create note');
    return await response.json();
  } catch (error) {
    console.error('createNote error:', error);
    throw error;
  }
};

// Update note
export const updateNote = async (noteId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${noteId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update note');
    return await response.json();
  } catch (error) {
    console.error('updateNote error:', error);
    throw error;
  }
};

// Delete note
export const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${noteId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete note');
    return await response.json();
  } catch (error) {
    console.error('deleteNote error:', error);
    throw error;
  }
};

// Upload note PDF
export const uploadNotePdf = async (noteId, file) => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch(`${API_BASE_URL}/${noteId}/upload-pdf`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    if (!response.ok) {
      const errBody = await response.json();
      throw new Error(errBody.message || 'Failed to upload PDF');
    }
    return await response.json();
  } catch (error) {
    console.error('uploadNotePdf error:', error);
    throw error;
  }
};

// Summarize note PDF
export const summarizeNotePdf = async (noteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${noteId}/summarize`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errBody = await response.json();
      throw new Error(errBody.message || 'Failed to summarize PDF');
    }
    return await response.json();
  } catch (error) {
    console.error('summarizeNotePdf error:', error);
    throw error;
  }
};

// Chat with note PDF
export const chatNotePdf = async (noteId, question) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${noteId}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ question }),
    });
    if (!response.ok) throw new Error('Failed to chat with PDF');
    return await response.json();
  } catch (error) {
    console.error('chatNotePdf error:', error);
    throw error;
  }
};
