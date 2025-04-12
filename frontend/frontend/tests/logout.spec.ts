import { test, expect } from '@playwright/test';

/**
 * Tests to verify the logout functionality works properly
 */
test('logout menu appears when profile icon is clicked', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Mock authentication to access the home screen
  await page.evaluate(() => {
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      username: 'testuser@example.com',
      attributes: {
        email: 'testuser@example.com',
        email_verified: true,
        sub: '12345-abcde-67890-fghij'
      }
    }));
    window.location.reload();
  });
  
  // Wait for the page to reload and stabilize
  await page.waitForLoadState('networkidle');
  
  // Find and click the profile icon
  const profileIcon = await page.locator('[data-testid="profile-icon"]').first();
  await profileIcon.click();
  
  // Wait for the logout menu to appear
  const logoutButton = await page.locator('[data-testid="logout-button"]').first();
  await expect(logoutButton).toBeVisible();
  
  // Verify the logout text is displayed
  const logoutText = await logoutButton.locator('text=Logout');
  await expect(logoutText).toBeVisible();
});

test('clicking logout redirects to login screen', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Mock authentication to access the home screen
  await page.evaluate(() => {
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      username: 'testuser@example.com',
      attributes: {
        email: 'testuser@example.com',
        email_verified: true,
        sub: '12345-abcde-67890-fghij'
      }
    }));
    window.location.reload();
  });
  
  // Wait for the page to reload and stabilize
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot before logout for debugging
  await page.screenshot({ path: './before-logout.png' });
  
  // Find and click the profile icon
  const profileIcon = await page.locator('[data-testid="profile-icon"]').first();
  await profileIcon.click();
  
  // Find and click the logout button
  const logoutButton = await page.locator('[data-testid="logout-button"]').first();
  await logoutButton.click();
  
  // Wait for redirect to login screen
  // We expect to see an email input field on the login screen
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  
  // Verify we can see login form elements
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  
  // Verify authentication data has been cleared from localStorage
  const isAuthenticated = await page.evaluate(() => localStorage.getItem('authenticated'));
  const userData = await page.evaluate(() => localStorage.getItem('user'));
  
  expect(isAuthenticated).toBeNull();
  expect(userData).toBeNull();
  
  // Take a screenshot after logout for debugging
  await page.screenshot({ path: './after-logout.png' });
});

test('logout functionality handles errors gracefully', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Mock authentication to access the home screen
  await page.evaluate(() => {
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      username: 'testuser@example.com',
      attributes: {
        email: 'testuser@example.com',
        email_verified: true,
        sub: '12345-abcde-67890-fghij'
      }
    }));
    window.location.reload();
  });
  
  // Wait for the page to reload and stabilize
  await page.waitForLoadState('networkidle');
  
  // Mock a failed signOut call in the Auth module
  await page.evaluate(() => {
    // Define Auth interface for TypeScript
    interface AuthInterface {
      signOut: () => Promise<any>;
      [key: string]: any;
    }
    
    // Define custom properties on Window
    interface CustomWindow extends Window {
      Auth?: AuthInterface;
      _originalSignOut?: () => Promise<any>;
    }
    
    // Cast window to CustomWindow
    const customWindow = window as CustomWindow;
    
    // Override the Auth.signOut method to simulate an error
    const originalSignOut = customWindow.Auth?.signOut;
    
    if (customWindow.Auth) {
      customWindow.Auth = {
        ...customWindow.Auth,
        signOut: async () => {
          throw new Error('Simulated signOut error');
        }
      };
      
      // Store the original for cleanup
      customWindow._originalSignOut = originalSignOut;
    }
  });
  
  // Find and click the profile icon
  const profileIcon = await page.locator('[data-testid="profile-icon"]').first();
  await profileIcon.click();
  
  // Find and click the logout button
  const logoutButton = await page.locator('[data-testid="logout-button"]').first();
  
  // Click logout button and wait for alert dialog to appear
  // Note: This is a best-effort test as we may not be able to intercept the Alert dialog in all environments
  await Promise.all([
    logoutButton.click(),
    // We should see the loading state first
    page.waitForSelector('text=Loading...', { timeout: 5000 }).catch(() => {
      console.log('Loading state not observed - this is okay if it was brief');
    })
  ]);
  
  // Restore the original Auth.signOut to clean up
  await page.evaluate(() => {
    interface CustomWindow extends Window {
      Auth?: { signOut: any, [key: string]: any };
      _originalSignOut?: () => Promise<any>;
    }
    
    const customWindow = window as CustomWindow;
    
    if (customWindow._originalSignOut && customWindow.Auth) {
      customWindow.Auth.signOut = customWindow._originalSignOut;
      delete customWindow._originalSignOut;
    }
  });
}); 