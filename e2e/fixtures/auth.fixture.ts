import { test as base, expect, Page } from '@playwright/test';

/**
 * Test user types for different role testing
 */
export type TestUserRole = 'admin' | 'manager' | 'viewer';

export interface TestUser {
  phone: string;
  role: TestUserRole;
  displayName: string;
}

/**
 * Test users for different roles
 */
export const testUsers: Record<TestUserRole, TestUser> = {
  admin: {
    phone: '+1 (555) 000-0000', // Dev bypass phone
    role: 'admin',
    displayName: 'Test Admin',
  },
  manager: {
    phone: '+1 (555) 555-5555',
    role: 'manager',
    displayName: 'Test Manager',
  },
  viewer: {
    phone: '+1 (555) 444-4444',
    role: 'viewer',
    displayName: 'Test Viewer',
  },
};

/**
 * Authentication helper for tests
 */
export class AuthHelper {
  constructor(private page: Page) {}

  /**
   * Login as admin using the dev bypass (localhost only)
   */
  async loginAsAdmin() {
    await this.page.goto('/admin-login');

    // Wait for the page to load
    await this.page.waitForSelector('input[type="tel"]', { timeout: 10000 });

    // Enter the dev bypass phone number
    const phoneInput = this.page.locator('input[type="tel"]');
    await phoneInput.fill(testUsers.admin.phone);

    // Click the send code / login button
    const sendCodeButton = this.page.getByRole('button', { name: /send|code|continue/i });
    await sendCodeButton.click();

    // Wait for navigation to admin dashboard or OTP screen
    await this.page.waitForURL(/\/(admin|otp)/, { timeout: 15000 });

    // If we're on OTP screen for dev bypass, the code should auto-fill or we use 000000
    if (this.page.url().includes('otp') || await this.page.locator('[data-input-otp="true"]').isVisible()) {
      // Enter dev bypass OTP code
      const otpInputs = this.page.locator('[data-input-otp-slot]');
      const count = await otpInputs.count();

      if (count > 0) {
        for (let i = 0; i < 6; i++) {
          await otpInputs.nth(i).fill('0');
        }
      }

      // Wait for redirect to admin
      await this.page.waitForURL(/\/admin/, { timeout: 15000 });
    }
  }

  /**
   * Login using the dev login button (localhost only)
   */
  async devLogin() {
    await this.page.goto('/admin-login');

    // Look for dev login button (only visible on localhost)
    const devLoginButton = this.page.getByRole('button', { name: /dev login/i });

    if (await devLoginButton.isVisible({ timeout: 5000 })) {
      await devLoginButton.click();
      await this.page.waitForURL(/\/admin/, { timeout: 15000 });
    } else {
      // Fall back to regular admin login
      await this.loginAsAdmin();
    }
  }

  /**
   * Logout from the application
   */
  async logout() {
    // Try to find and click logout button in various locations
    const logoutButton = this.page.getByRole('button', { name: /logout|sign out/i });

    if (await logoutButton.isVisible({ timeout: 3000 })) {
      await logoutButton.click();
    } else {
      // Try menu-based logout
      const menuButton = this.page.getByRole('button', { name: /menu|profile|settings/i });
      if (await menuButton.isVisible({ timeout: 3000 })) {
        await menuButton.click();
        await this.page.getByRole('menuitem', { name: /logout|sign out/i }).click();
      }
    }

    // Wait for redirect to login page
    await this.page.waitForURL(/\/(admin-login|login|$)/, { timeout: 10000 });
  }

  /**
   * Check if user is authenticated (on admin pages)
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // If we can access admin page without redirect, we're authenticated
      await this.page.goto('/admin', { waitUntil: 'networkidle' });
      return !this.page.url().includes('login');
    } catch {
      return false;
    }
  }
}

/**
 * Extended test with auth fixture
 */
export const test = base.extend<{ auth: AuthHelper }>({
  auth: async ({ page }, use) => {
    const auth = new AuthHelper(page);
    await use(auth);
  },
});

export { expect };
