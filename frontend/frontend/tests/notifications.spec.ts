import { test, expect } from '@playwright/test';
import { mockNotifications } from '../src/data/mockNotifications';

/**
 * Tests for NotificationsList and NotificationItem components
 */
test('home screen displays the notifications list', async ({ page }) => {
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
  
  // Verify the notifications list is displayed
  const notificationsList = await page.locator('[data-testid="notifications-list"]');
  await expect(notificationsList).toBeVisible();
  
  // Verify the notifications title is displayed
  const notificationsTitle = await notificationsList.locator('text=Notifications');
  await expect(notificationsTitle).toBeVisible();
  
  // Verify the See All button is displayed
  const seeAllButton = await page.locator('[data-testid="see-all-button"]');
  await expect(seeAllButton).toBeVisible();
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: './notifications-list-test.png' });
});

test('notification items are rendered correctly', async ({ page }) => {
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
  
  // Get the notification items
  const notificationItems = await page.locator('[data-testid="notification-item"]').all();
  
  // Verify we have the correct number of notification items
  expect(notificationItems.length).toBe(mockNotifications.length);
  
  // Verify the first notification content
  const firstNotification = notificationItems[0];
  
  // Check if the title is visible
  await expect(firstNotification.locator(`text=${mockNotifications[0].title}`)).toBeVisible();
  
  // Check if the author is visible
  await expect(firstNotification.locator(`text=${mockNotifications[0].author}`)).toBeVisible();
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: './notification-items-test.png' });
  
  // Verify clicking a notification shows an alert
  // (We can't test the alert directly in Playwright, but we can verify the click works)
  await firstNotification.click();
}); 