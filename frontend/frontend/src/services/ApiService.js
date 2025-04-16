/**
 * Base API service for making HTTP requests using fetch instead of axios
 */
class ApiService {
  /**
   * @param {string} baseURL - Base URL for the API
   * @param {Object} config - Additional configuration
   */
  constructor(baseURL, config = {}) {
    this.baseURL = baseURL;
    this.isDev = process.env.NODE_ENV === 'development';
    this.timeout = config.timeout || 10000;
    
    // By default, don't use credentials in development to avoid CORS issues
    this.withCredentials = typeof config.withCredentials !== 'undefined' ? 
      config.withCredentials : !this.isDev;
    
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(config.headers || {})
    };
    
    // In development mode, warn about CORS config
    if (this.isDev) {
      console.log(`ApiService initialized with baseURL: ${baseURL}`);
      console.log(`Credentials mode: ${this.withCredentials ? 'include' : 'omit'}`);
      
      if (!this.withCredentials) {
        console.log('CORS: Using "omit" credentials mode for development - make sure API Gateway has CORS enabled');
      }
    }
  }

  /**
   * Helper to get auth token
   * @returns {string|null} Auth token
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Helper to handle API responses
   * @param {Response} response - Fetch Response object
   * @returns {Promise<Object>} Response data
   */
  async handleResponse(response) {
    if (!response.ok) {
      // Handle specific errors
      if (response.status === 401) {
        console.warn('Authentication error');
      } else if (response.status === 429) {
        console.warn('Rate limit exceeded');
      }

      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }

      throw {
        status: response.status,
        message: errorData.message || 'An error occurred',
        data: errorData
      };
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {};
    }

    // Parse JSON response
    try {
      return await response.json();
    } catch (error) {
      if (this.isDev) {
        console.error('Error parsing JSON:', error);
      }
      return {};
    }
  }

  /**
   * Create request options with defaults
   * @param {string} method - HTTP method
   * @param {Object} data - Request body data
   * @param {Object} options - Additional options
   * @returns {Object} Request options
   */
  createRequestOptions(method, data, options = {}) {
    const headers = { ...this.defaultHeaders, ...options.headers };
    
    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const requestOptions = {
      method,
      headers,
      ...options
    };

    // Add credentials mode
    if (this.withCredentials) {
      requestOptions.credentials = 'include';
    }

    // Add body for non-GET requests
    if (method !== 'GET' && data) {
      requestOptions.body = JSON.stringify(data);
    }

    return requestOptions;
  }

  /**
   * Make API request with timeout
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} Request promise
   */
  async request(url, options) {
    const fullUrl = this.buildUrl(url, options.params);
    
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject({ message: `Request timeout after ${this.timeout}ms` }), this.timeout);
      });
      
      // Race fetch against timeout
      const response = await Promise.race([
        fetch(fullUrl, options),
        timeoutPromise
      ]);
      
      return await this.handleResponse(response);
    } catch (error) {
      // Log error in development
      if (this.isDev) {
        console.error('API Request Error:', error);
      }
      throw error;
    }
  }

  /**
   * Build full URL with query parameters
   * @param {string} path - URL path
   * @param {Object} params - Query parameters
   * @returns {string} Full URL
   */
  buildUrl(path, params) {
    // Ensure path starts with slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseURL}${normalizedPath}`);
    
    // Add query parameters
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Make a GET request
   * @param {string} url - URL to request
   * @param {Object} options - Request options
   * @returns {Promise} Response
   */
  async get(url, options = {}) {
    const requestOptions = this.createRequestOptions('GET', null, options);
    const data = await this.request(url, requestOptions);
    return { data };
  }

  /**
   * Make a POST request
   * @param {string} url - URL to request
   * @param {Object} data - Data to send
   * @param {Object} options - Request options
   * @returns {Promise} Response
   */
  async post(url, data = {}, options = {}) {
    const requestOptions = this.createRequestOptions('POST', data, options);
    const responseData = await this.request(url, requestOptions);
    return { data: responseData };
  }

  /**
   * Make a PUT request
   * @param {string} url - URL to request
   * @param {Object} data - Data to send
   * @param {Object} options - Request options
   * @returns {Promise} Response
   */
  async put(url, data = {}, options = {}) {
    const requestOptions = this.createRequestOptions('PUT', data, options);
    const responseData = await this.request(url, requestOptions);
    return { data: responseData };
  }

  /**
   * Make a DELETE request
   * @param {string} url - URL to request
   * @param {Object} options - Request options
   * @returns {Promise} Response
   */
  async delete(url, options = {}) {
    const requestOptions = this.createRequestOptions('DELETE', null, options);
    const responseData = await this.request(url, requestOptions);
    return { data: responseData };
  }

  /**
   * Make a PATCH request
   * @param {string} url - URL to request
   * @param {Object} data - Data to send
   * @param {Object} options - Request options
   * @returns {Promise} Response
   */
  async patch(url, data = {}, options = {}) {
    const requestOptions = this.createRequestOptions('PATCH', data, options);
    const responseData = await this.request(url, requestOptions);
    return { data: responseData };
  }

  /**
   * Set authorization token
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }
}

export default ApiService; 