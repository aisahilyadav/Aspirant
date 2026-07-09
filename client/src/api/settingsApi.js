const API_BASE_URL = 'http://localhost:8001/api/settings';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  };
};

export const getSettings = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error('getSettings error:', error);
    throw error;
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settingsData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update preferences');
    }
    return await response.json();
  } catch (error) {
    console.error('updateSettings error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update credentials');
    }
    return await response.json();
  } catch (error) {
    console.error('updateProfile error:', error);
    throw error;
  }
};
