import { Auth } from '../config/auth';
import { DEFAULT_HEADERS, DEFAULT_TIMEOUT } from '../config/api';

/**
 * Base API service class
 * Provides common functionality for API requests including authentication
 */
class ApiService {
  /**
   * Create a new ApiService instance
   * @param {string} baseUrl - Base URL for the API
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the authenticated user's token
   * @returns {Promise<string>} Authentication token
   */
  async getAuthToken() {
    try {
      // In a real Cognito implementation, we would get an ID token or access token
      // For the mock Auth, we'll just return a simple token if authenticated
      const user = await Auth.currentAuthenticatedUser();
      return `mock-token-${user.attributes.sub}`;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw new Error('Failed to get authentication token');
    }
  }

  /**
   * Get headers for API requests, including authentication
   * @param {boolean} includeAuth - Whether to include authentication headers
   * @returns {Promise<Object>} Headers for the request
   */
  async getHeaders(includeAuth = true) {
    const headers = { ...DEFAULT_HEADERS };
    
    if (includeAuth) {
      const token = await this.getAuthToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Make a GET request to the API
   * @param {string} endpoint - API endpoint to call
   * @param {Object} options - Additional options for the request
   * @returns {Promise<any>} Response data
   */
  async get(endpoint, options = {}) {
    const { params, includeAuth = true } = options;
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add query parameters if provided
    if (params) {
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
    }
    
    const headers = await this.getHeaders(includeAuth);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  /**
   * Make a POST request to the API
   * @param {string} endpoint - API endpoint to call
   * @param {Object} data - Data to send in the request body
   * @param {Object} options - Additional options for the request
   * @returns {Promise<any>} Response data
   */
  async post(endpoint, data, options = {}) {
    const { includeAuth = true } = options;
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getHeaders(includeAuth);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
}

export default ApiService; 