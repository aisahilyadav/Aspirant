const API_BASE_URL = 'http://localhost:8001/api/dashboard';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  };
};

export const getDashboardData = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('getDashboardData error:', error);
    throw error;
  }
};
