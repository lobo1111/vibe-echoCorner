import { test, expect } from '@playwright/test';

test('AWS Amplify configuration should load without errors', async ({ page }) => {
  const errors: string[] = [];
  const amplifyLogs: { type: string; text: string }[] = [];

  // Capture JavaScript errors
  page.on('pageerror', (err) => {
    console.log('Page error:', err.message);
    errors.push(err.message);
  });

  // Capture console messages related to Amplify
  page.on('console', (msg) => {
    if (msg.text().includes('Amplify') || 
        msg.text().includes('Auth') || 
        msg.text().includes('Cognito')) {
      amplifyLogs.push({ 
        type: msg.type(), 
        text: msg.text() 
      });
      console.log(`Amplify log [${msg.type()}]:`, msg.text());
    }
  });

  // Set up a specific flag to catch the loginWith error
  let loginWithErrorDetected = false;
  
  // Listen for the specific error pattern
  page.on('console', (msg) => {
    if (msg.text().includes('loginWith') || 
        msg.text().includes('Cannot read properties of undefined')) {
      loginWithErrorDetected = true;
      console.error('loginWith error detected:', msg.text());
    }
  });

  // Navigate to the app
  await page.goto('/');
  
  // Wait for the page to stabilize
  await page.waitForTimeout(3000);

  // Check for specific auth-related errors
  const authErrors = errors.filter(e => 
    e.includes('Amplify') || 
    e.includes('Auth') || 
    e.includes('Cognito') ||
    e.includes('loginWith')
  );

  // Generate detailed error report
  if (authErrors.length > 0 || loginWithErrorDetected) {
    console.error('\n==== AUTH CONFIGURATION ERRORS ====');
    authErrors.forEach((error, index) => {
      console.error(`[Error ${index + 1}] ${error}`);
    });
    
    console.error('\n==== AMPLIFY LOGS ====');
    amplifyLogs.forEach((log) => {
      console.error(`[${log.type}] ${log.text}`);
    });
  }

  // Create detailed error message
  const errorMessage = loginWithErrorDetected 
    ? "The 'loginWith' undefined error was detected. Check the auth.js configuration."
    : authErrors.length > 0 
      ? `Auth configuration errors detected:\n${authErrors.join('\n')}`
      : "";

  // Test assertions with detailed messages
  expect(loginWithErrorDetected, errorMessage).toBe(false);
  expect(authErrors.length, errorMessage).toBe(0);
}); 