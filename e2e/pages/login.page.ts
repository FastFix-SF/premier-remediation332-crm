import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly phoneInput: Locator;
  readonly sendCodeButton: Locator;
  readonly otpInputs: Locator;
  readonly verifyButton: Locator;
  readonly devLoginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.phoneInput = page.locator('input[type="tel"]');
    this.sendCodeButton = page.getByRole('button', { name: /send verification code/i });
    this.otpInputs = page.locator('[data-input-otp-slot]');
    this.verifyButton = page.getByRole('button', { name: /verify|confirm|submit/i });
    this.devLoginButton = page.getByRole('button', { name: /dev login|skip otp/i });
    this.errorMessage = page.locator('[role="alert"], .text-destructive');
  }

  async goto() {
    await this.page.goto('/admin-login');
    await this.page.waitForLoadState('networkidle');
  }

  async enterPhoneNumber(phone: string) {
    await this.phoneInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.phoneInput.fill(phone);
  }

  async clickSendCode() {
    await this.sendCodeButton.click();
  }

  async enterOtp(code: string) {
    const digits = code.split('');
    for (let i = 0; i < digits.length; i++) {
      await this.otpInputs.nth(i).fill(digits[i]);
    }
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async loginWithPhone(phone: string, otp: string = '000000') {
    await this.goto();
    await this.enterPhoneNumber(phone);
    await this.clickSendCode();

    // Wait for OTP screen
    await this.page.waitForURL(/otp|verify/, { timeout: 15000 }).catch(() => {
      // If no redirect, OTP might be on same page
    });

    if (await this.otpInputs.first().isVisible({ timeout: 5000 })) {
      await this.enterOtp(otp);
      if (await this.verifyButton.isVisible({ timeout: 3000 })) {
        await this.clickVerify();
      }
    }

    await this.page.waitForURL(/\/admin/, { timeout: 15000 });
  }

  async devLogin() {
    await this.goto();
    if (await this.devLoginButton.isVisible({ timeout: 5000 })) {
      await this.devLoginButton.click();
      // Wait for navigation with longer timeout
      await this.page.waitForURL(/\/admin/, { timeout: 30000 });
      await this.page.waitForLoadState('networkidle');
    } else {
      throw new Error('Dev login button not available');
    }
  }

  async expectErrorMessage(message: string | RegExp) {
    await expect(this.errorMessage.filter({ hasText: message })).toBeVisible();
  }

  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('/admin-login') || this.page.url().includes('/login');
  }
}
