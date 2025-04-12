# AWS Cognito Logout Flow Documentation

## Overview

This document describes the AWS Cognito logout process implemented for the echoCorner application. The logout flow is designed to properly invalidate tokens and ensure users are securely signed out of the application.

## Logout Flow

The logout process in Cognito has two main components:

1. **Client-side logout**: Clears local tokens and session data
2. **Server-side logout**: Invalidates tokens on the AWS Cognito side

### Client-Side Logout Implementation

```javascript
// Example implementation in frontend code
async function signOut() {
  try {
    // Clear local storage and application state
    localStorage.removeItem('authenticated');
    localStorage.removeItem('user');
    
    // Call Cognito signOut method
    await Auth.signOut();
    
    // Redirect to login or home page
    navigate('Login');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
}
```

### Server-Side Token Invalidation

When a user signs out, AWS Cognito handles the following:

1. Invalidates the refresh token, preventing it from being used to obtain new access tokens
2. Access tokens remain valid until they expire (typically 1 hour), but they can't be refreshed
3. ID tokens also remain valid until expiration, but they can't be refreshed

For enhanced security, our Cognito configuration includes:

- Short access token lifetimes (1 hour)
- Configured OAuth flows with proper logout URLs
- A dedicated Cognito domain for hosting the logout endpoint

## Global Sign-Out

For cases where you need to sign out a user from all devices, use the global sign-out feature:

```javascript
async function globalSignOut() {
  try {
    await Auth.signOut({ global: true });
    // Handle post-signout UI updates
  } catch (error) {
    console.error('Error during global sign-out: ', error);
  }
}
```

## Testing Logout

To verify proper logout functionality:

1. Sign in to the application
2. Capture the JWT tokens from local storage
3. Perform a logout
4. Verify local storage is cleared
5. Attempt to use the captured tokens to access protected resources (should fail)

## Best Practices

- Always implement both client and server-side logout
- Set reasonable token expiration times
- Provide visual feedback to users when logout is complete
- Redirect users to an appropriate post-logout page
- Include error handling for failed logout attempts

## Common Issues

- **Tokens remaining valid**: Remember that access tokens remain valid until expiration, even after logout
- **Failed logout**: Network issues may prevent server-side token invalidation
- **Missing LogoutURLs**: Ensure Cognito client has proper LogoutURLs configured

## References

- [AWS Cognito User Pool Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [AWS Amplify Auth Documentation](https://docs.amplify.aws/lib/auth/getting-started/) 