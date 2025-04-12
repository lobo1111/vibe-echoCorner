// Mock Auth implementation that doesn't rely on AWS Amplify
// This removes the dependency on the problematic AWS Amplify library

// Simulated credentials for testing
const TEST_CREDENTIALS = {
  username: 'testuser@example.com',
  password: 'TestP@ssw0rd123'
};

// Mock user 
const mockUser = {
  username: TEST_CREDENTIALS.username,
  attributes: {
    email: TEST_CREDENTIALS.username,
    email_verified: true,
    sub: '12345-abcde-67890-fghij'
  }
};

// Mock Auth implementation
const Auth = {
  // Mock sign in method
  signIn: async (username, password) => {
    console.log('Mock Auth: Attempting to sign in with', username);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate credentials (for testing purposes)
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } else {
      const error = new Error('Incorrect username or password');
      error.code = 'NotAuthorizedException';
      throw error;
    }
  },
  
  // Mock current authenticated user check
  currentAuthenticatedUser: async () => {
    console.log('Mock Auth: Checking current authenticated user');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if user is logged in
    const authenticated = localStorage.getItem('authenticated') === 'true';
    const userJson = localStorage.getItem('user');
    
    if (authenticated && userJson) {
      return JSON.parse(userJson);
    } else {
      const error = new Error('User is not authenticated');
      error.code = 'UserNotAuthenticatedException';
      throw error;
    }
  },
  
  // Mock sign out method
  signOut: async () => {
    console.log('Mock Auth: Signing out');
    localStorage.removeItem('authenticated');
    localStorage.removeItem('user');
    return true;
  }
};

console.log('Using mock Auth implementation for development');

export { Auth }; 