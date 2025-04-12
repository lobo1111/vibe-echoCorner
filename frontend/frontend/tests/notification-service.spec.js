import { Auth } from '../src/config/auth';
import ApiService from '../src/services/ApiService';
import notificationService from '../src/services/NotificationService';

// Mock the ApiService and Auth
jest.mock('../src/services/ApiService');
jest.mock('../src/config/auth');

describe('NotificationService', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should fetch notifications from the API service', async () => {
      // Setup mock response data
      const mockNotifications = [
        {
          id: '1',
          title: 'Test notification',
          author: 'Test Author',
          createdAt: '2023-01-01T00:00:00Z',
          likes: 5,
          comments: 2
        }
      ];

      // Setup API service mock to return mock notifications
      const apiServiceMock = {
        get: jest.fn().mockResolvedValue(mockNotifications)
      };
      notificationService.apiService = apiServiceMock;

      // Call getNotifications with default options
      const result = await notificationService.getNotifications();

      // Verify the result
      expect(result).toEqual(mockNotifications);
      
      // Verify that the API service was called correctly
      expect(apiServiceMock.get).toHaveBeenCalledWith('/notifications', {
        params: {
          limit: 10,
          offset: 0
        }
      });
    });

    it('should handle API errors gracefully', async () => {
      // Setup API service mock to throw an error
      const apiServiceMock = {
        get: jest.fn().mockRejectedValue(new Error('API error'))
      };
      notificationService.apiService = apiServiceMock;

      // Set NODE_ENV to 'test' to test the mock data fallback
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';

      // Mock getMockNotifications to return a known value
      const mockNotifications = [{ id: 'mock1', title: 'Mock notification' }];
      notificationService.getMockNotifications = jest.fn().mockReturnValue(mockNotifications);

      // Call getNotifications
      const result = await notificationService.getNotifications();

      // Verify the mock data was returned as fallback
      expect(result).toEqual(mockNotifications);
      expect(notificationService.getMockNotifications).toHaveBeenCalled();

      // Verify that API error was logged
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching notifications:', 
        expect.any(Error)
      );

      // Restore NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read via API service', async () => {
      // Setup mock response data
      const mockResponse = { success: true };

      // Setup API service mock
      const apiServiceMock = {
        post: jest.fn().mockResolvedValue(mockResponse)
      };
      notificationService.apiService = apiServiceMock;

      // Call markAsRead
      const result = await notificationService.markAsRead('notification-123');

      // Verify the result
      expect(result).toEqual(mockResponse);
      
      // Verify that the API service was called correctly
      expect(apiServiceMock.post).toHaveBeenCalledWith(
        '/notifications/notification-123/read',
        {}
      );
    });

    it('should handle errors when marking a notification as read', async () => {
      // Setup API service mock to throw an error
      const apiServiceMock = {
        post: jest.fn().mockRejectedValue(new Error('API error'))
      };
      notificationService.apiService = apiServiceMock;

      // Call markAsRead and expect it to throw
      await expect(notificationService.markAsRead('notification-123'))
        .rejects
        .toThrow('Failed to mark notification as read: API error');

      // Verify error was logged
      expect(console.error).toHaveBeenCalledWith(
        'Error marking notification notification-123 as read:',
        expect.any(Error)
      );
    });
  });
}); 