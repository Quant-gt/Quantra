import { test, expect } from '@playwright/test';

test.describe('System-wide Smoke Tests', () => {
  const publicRoutes = [
    { path: '/', titleText: 'Quantra' }, // Look for some text on homepage, or just check it doesn't 404
    { path: '/marketplace', titleText: 'Discover Your Edge' },
    { path: '/auth', titleText: 'Welcome back' },
    { path: '/builder/ai', titleText: 'AI Strategy Prompt Generator' },
    // Add other public routes here if they exist (e.g. /about, /features)
  ];

  for (const route of publicRoutes) {
    test(`Should load public route: ${route.path}`, async ({ page }) => {
      const response = await page.goto(route.path);
      // Ensure the page didn't return a 404 or 500 error
      expect(response?.status()).toBe(200);
      
      // Optionally check for specific text to ensure the page rendered properly
      if (route.titleText) {
        await expect(page.locator('body')).toContainText(route.titleText);
      }
    });
  }

  test('Protected routes should redirect to /auth without session', async ({ page }) => {
    // Attempt to access dashboard without logging in
    await page.goto('/dashboard');
    
    // Should be redirected to auth
    await expect(page).toHaveURL(/.*\/auth/);
  });
});
