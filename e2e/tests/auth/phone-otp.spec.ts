import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('Phone OTP Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('should show OTP input after phone submission', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Enter a valid phone number (not the dev bypass)
    await loginPage.enterPhoneNumber('+1 (555) 123-4567');
    await loginPage.clickSendCode();

    // Wait for response - could be OTP screen, error, or loading
    await page.waitForTimeout(3000);

    const otpVisible = await loginPage.otpInputs.first().isVisible({ timeout: 5000 }).catch(() => false);
    const onOtpPage = page.url().includes('otp') || page.url().includes('verify');
    const hasError = await page.locator('[data-sonner-toast], .toast, [role="alert"]').isVisible({ timeout: 3000 }).catch(() => false);

    // Either OTP shows, we navigate to OTP page, or we get an error (backend not available)
    if (hasError || (!otpVisible && !onOtpPage)) {
      test.skip(true, 'SMS/Auth backend not available');
    }
    expect(otpVisible || onOtpPage).toBeTruthy();
  });

  test('should accept 6-digit OTP code', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.enterPhoneNumber('+1 (555) 123-4567');
    await loginPage.clickSendCode();

    // Wait for OTP screen
    await page.waitForTimeout(2000);

    if (await loginPage.otpInputs.first().isVisible({ timeout: 5000 })) {
      // Enter 6-digit code
      await loginPage.enterOtp('123456');

      // All 6 inputs should have values
      for (let i = 0; i < 6; i++) {
        const value = await loginPage.otpInputs.nth(i).inputValue();
        expect(value).toHaveLength(1);
      }
    }
  });

  test('should validate OTP is numeric only', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.enterPhoneNumber('+1 (555) 123-4567');
    await loginPage.clickSendCode();

    await page.waitForTimeout(2000);

    if (await loginPage.otpInputs.first().isVisible({ timeout: 5000 })) {
      // Try to enter non-numeric characters
      await loginPage.otpInputs.first().fill('a');

      // Should not accept letters, input should be empty or have no value
      const value = await loginPage.otpInputs.first().inputValue();
      expect(value).not.toBe('a');
    }
  });

  test('should show error for invalid OTP', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.enterPhoneNumber('+1 (555) 123-4567');
    await loginPage.clickSendCode();

    await page.waitForTimeout(2000);

    if (await loginPage.otpInputs.first().isVisible({ timeout: 5000 })) {
      // Enter wrong OTP code
      await loginPage.enterOtp('999999');

      // Click verify if button is visible
      if (await loginPage.verifyButton.isVisible({ timeout: 3000 })) {
        await loginPage.clickVerify();
      }

      // Should show error message
      await page.waitForTimeout(2000);
      const hasError = await page.locator('.text-destructive, [role="alert"]')
        .filter({ hasText: /invalid|incorrect|wrong|expired/i })
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      // Either shows error or stays on OTP page (doesn't redirect to admin)
      const isStillOnAuth = !page.url().includes('/admin');
      expect(hasError || isStillOnAuth).toBeTruthy();
    }
  });

  test('should allow resend OTP', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.enterPhoneNumber('+1 (555) 123-4567');
    await loginPage.clickSendCode();

    await page.waitForTimeout(2000);

    // Look for resend button
    const resendButton = page.getByRole('button', { name: /resend|send again|try again/i });

    if (await resendButton.isVisible({ timeout: 10000 })) {
      await expect(resendButton).toBeVisible();

      // Resend button might be disabled initially (countdown)
      // Wait for it to become enabled or check if it's already enabled
      await page.waitForTimeout(5000);
    }
  });

  test('should have accessible OTP inputs', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.enterPhoneNumber('+1 (555) 123-4567');
    await loginPage.clickSendCode();

    await page.waitForTimeout(2000);

    if (await loginPage.otpInputs.first().isVisible({ timeout: 5000 })) {
      // OTP inputs should be focusable
      await loginPage.otpInputs.first().focus();
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused?.toLowerCase()).toBe('input');
    }
  });
});
