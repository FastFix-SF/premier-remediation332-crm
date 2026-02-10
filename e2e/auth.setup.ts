import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

const authFile = 'playwright/.auth/user.json';

/**
 * Global auth setup - runs before all tests that depend on 'setup' project
 * Authenticates user and saves session state
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Try dev login first (only works on localhost)
  try {
    await loginPage.goto();

    // Check for dev login button (localhost only feature)
    const devLoginButton = page.getByRole('button', { name: /dev login/i });
    if (await devLoginButton.isVisible({ timeout: 5000 })) {
      await devLoginButton.click();
      await page.waitForURL(/\/admin/, { timeout: 15000 });
    } else {
      // Fall back to phone auth with dev bypass number
      await loginPage.loginWithPhone('+1 (555) 000-0000', '000000');
    }

    // Verify we're logged in
    await expect(page).toHaveURL(/\/admin/);

    // Save authentication state
    await page.context().storageState({ path: authFile });

  } catch (error) {
    console.error('Auth setup failed:', error);
    throw error;
  }
});
