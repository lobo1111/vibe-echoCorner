/**
 * Service for handling notification-related operations
 */
class NotificationService {
  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';
    this.apiUrl = 'https://m97gq044y3.execute-api.eu-central-1.amazonaws.com/prod';
    this.useMockData = false; // Set this to true to force using mock data
    
    // CORS proxy settings
    this.useProxy = this.isDev; // Only use proxy in development mode
    this.proxyUrl = 'https://corsproxy.io/?'; // A reliable CORS proxy service
    
    // Direct request options to avoid CORS issues
    this.fetchOptions = {
      mode: 'cors',
      credentials: 'omit', // Don't send credentials
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    // Endpoints
    this.endpoints = {
      getNotifications: '/notifications',
      markAsRead: '/notifications/:id/read',
      getAllUnread: '/notifications/unread'
    };
    
    console.log('NotificationService initialized in', this.isDev ? 'development' : 'production', 'mode');
    if (this.useProxy) {
      console.log('Using CORS proxy for API calls:', this.proxyUrl);
    }
  }

  /**
   * Get proxied URL if proxy is enabled
   * @param {string} url - Original URL
   * @returns {string} Proxied URL or original URL
   */
  getProxiedUrl(url) {
    if (this.useProxy) {
      return `${this.proxyUrl}${encodeURIComponent(url)}`;
    }
    return url;
  }

  /**
   * Helper method to make API requests with proper error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async makeRequest(endpoint, options = {}) {
    // If mock data is forced, skip real API call
    if (this.useMockData) {
      console.log(`[MOCK] Would make request to ${this.apiUrl}${endpoint}`);
      if (endpoint.includes('notifications')) {
        return this.getMockNotifications(10, 0);
      }
      return { success: true, mockData: true };
    }

    const originalUrl = `${this.apiUrl}${endpoint}`;
    const url = this.getProxiedUrl(originalUrl);
    const requestOptions = { ...this.fetchOptions, ...options };
    
    const isProxied = url !== originalUrl;
    console.log(`Making ${isProxied ? 'proxied ' : ''}request to ${isProxied ? originalUrl : url}`);
    
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error making request to ${originalUrl}:`, error);
      
      if (this.isDev) {
        console.log('Using mock data due to API error');
        // Return different mock data based on the endpoint
        if (endpoint.includes('notifications')) {
          return this.getMockNotifications(10, 0);
        }
        return { success: true, mockData: true };
      }
      
      throw error;
    }
  }

  /**
   * Get user notifications with pagination
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Number of items per page
   * @returns {Promise<Object>} Notifications data
   */
  async getNotifications(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const queryParams = new URLSearchParams({ limit, offset }).toString();
    const endpoint = `${this.endpoints.getNotifications}?${queryParams}`;
    
    // Try real API call even in development mode
    return this.makeRequest(endpoint);
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - ID of notification to mark as read
   * @returns {Promise<Object>} Success response
   */
  async markAsRead(notificationId) {
    const endpoint = this.endpoints.markAsRead.replace(':id', notificationId);
    
    // Try real API call even in development mode
    return this.makeRequest(endpoint, { 
      method: 'PUT' 
    });
  }

  /**
   * Get unread notifications count
   * @returns {Promise<number>} Count of unread notifications
   */
  async getUnreadNotifications() {
    // Try real API call even in development mode
    return this.makeRequest(this.endpoints.getAllUnread);
  }

  /**
   * Get mock notifications for development
   * @param {number} limit - Number of items per page
   * @param {number} offset - Offset for pagination
   * @returns {Object} Mock notification data with pagination
   */
  getMockNotifications(limit = 10, offset = 0) {
    const mockNotifications = [
      {
        id: '1',
        title: 'New update available',
        message: 'A new version of the app is available. Please update to the latest version.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: false,
        type: 'system'
      },
      {
        id: '2',
        title: 'Welcome to Echo Corner',
        message: 'Thank you for joining our platform. Start exploring and connecting with others!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isRead: true,
        type: 'welcome'
      },
      {
        id: '3',
        title: 'New follower',
        message: 'User JaneDoe is now following you',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isRead: false,
        type: 'social'
      },
      {
        id: '4',
        title: 'Your post was liked',
        message: 'User JohnSmith liked your recent post "Hello world"',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        isRead: false,
        type: 'social'
      },
      {
        id: '5',
        title: 'Comment on your post',
        message: 'User AliceWonder commented on your post: "Great insights!"',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        isRead: true,
        type: 'social'
      }
    ];

    // Generate more mock notifications if needed
    for (let i = 6; i <= 25; i++) {
      mockNotifications.push({
        id: i.toString(),
        title: `Mock Notification ${i}`,
        message: `This is mock notification content #${i}`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * i).toISOString(),
        isRead: i % 3 === 0,
        type: i % 4 === 0 ? 'system' : i % 3 === 0 ? 'welcome' : 'social'
      });
    }

    // Sort by date (newest first)
    const sortedNotifications = [...mockNotifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Implement pagination
    const startIndex = offset;
    const paginatedItems = sortedNotifications.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      pagination: {
        totalItems: mockNotifications.length,
        totalPages: Math.ceil(mockNotifications.length / limit),
        currentPage: Math.floor(offset / limit) + 1,
        pageSize: limit
      }
    };
  }
}

// Export a singleton instance
const notificationService = new NotificationService();
export default notificationService; 