/**
 * API Helper - استبدال axios بـ fetch
 * استخدم هذا الملف لجميع API calls في التطبيق
 */

const BASE_URL = 'http://192.168.1.122:8000';

/**
 * GET request
 */
export const apiGet = async (url, params = {}) => {
  try {
    // بناء URL مع query parameters
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
};

/**
 * POST request
 */
export const apiPost = async (url, data = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
};

/**
 * PUT request
 */
export const apiPut = async (url, data = {}) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API PUT Error:', error);
    throw error;
  }
};

/**
 * DELETE request
 */
export const apiDelete = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API DELETE Error:', error);
    throw error;
  }
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  BASE_URL,
};

