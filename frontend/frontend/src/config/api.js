/**
 * API configuration file
 * Contains endpoints and configuration for API services
 */

export const API_CONFIG = {
  // Base URL for the notification API
  notificationApiUrl: 'https://m97gq044y3.execute-api.eu-central-1.amazonaws.com/prod',
  
  // Cognito configuration for authentication
  cognito: {
    userPoolId: 'eu-central-1_KYoRPR6pm',
    clientId: '696gege94e32mq1nhon0jkvi0r',
    region: 'eu-central-1'
  },
  
  // Endpoints
  endpoints: {
    notifications: '/notifications'
  }
};

// Default request timeout in milliseconds
export const DEFAULT_TIMEOUT = 10000;

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}; 