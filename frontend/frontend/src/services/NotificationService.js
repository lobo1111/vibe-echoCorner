import ApiService from './ApiService';
import { API_CONFIG } from '../config/api';

/**
 * Service for handling notification-related API calls
 */
class NotificationService {
  constructor() {
    this.apiService = new ApiService(API_CONFIG.notificationApiUrl);
    this.endpoints = API_CONFIG.endpoints;
  }

  /**
   * Fetch all notifications for the current user
   * @param {Object} options - Options for the request
   * @param {number} options.limit - Maximum number of notifications to fetch
   * @param {number} options.offset - Offset for pagination
   * @returns {Promise<Array>} Array of notification objects
   */
  async getNotifications(options = {}) {
    try {
      const { limit = 10, offset = 0 } = options;
      
      const params = {
        limit,
        offset
      };
      
      const response = await this.apiService.get(this.endpoints.notifications, { params });
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // For development, return mock data if API call fails
      if (process.env.NODE_ENV !== 'production') {
        return this.getMockNotifications();
      }
      
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
  }

  /**
   * Mark a notification as read
   * @param {string} notificationId - ID of the notification to mark as read
   * @returns {Promise<Object>} Updated notification object
   */
  async markAsRead(notificationId) {
    try {
      const endpoint = `${this.endpoints.notifications}/${notificationId}/read`;
      const response = await this.apiService.post(endpoint, {});
      return response;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Get mock notifications for development
   * @returns {Array} Array of mock notification objects
   */
  getMockNotifications() {
    // This is a fallback for development to avoid depending on the API
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return [
      {
        id: '1',
        title: 'New comment on your post "Getting Started with React Native"',
        author: 'Jane Doe',
        createdAt: yesterday.toISOString(),
        likes: 12,
        comments: 3
      },
      {
        id: '2',
        title: 'Your post received 15 likes',
        author: 'System',
        createdAt: twoDaysAgo.toISOString(),
        likes: 15,
        comments: 0
      },
      {
        id: '3',
        title: 'John Smith mentioned you in a comment',
        author: 'John Smith',
        createdAt: twoDaysAgo.toISOString(),
        likes: 2,
        comments: 1
      },
      {
        id: '4',
        title: 'New follower: Alice Johnson',
        author: 'System',
        createdAt: threeDaysAgo.toISOString(),
        likes: 0,
        comments: 0
      }
    ];
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService; 