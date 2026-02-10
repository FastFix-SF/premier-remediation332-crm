import { Page, expect } from '@playwright/test';

/**
 * Wait for loading states to complete
 */
export async function waitForLoadingComplete(page: Page) {
  // Wait for any loading spinners to disappear
  const loadingSpinner = page.locator('[data-testid="loading"], .animate-spin, [role="progressbar"]');

  try {
    await loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
  } catch {
    // Loading spinner might not exist, which is fine
  }

  // Wait for network to be idle
  await page.waitForLoadState('networkidle', { timeout: 15000 });
}

/**
 * Fill a form field by label
 */
export async function fillFormField(page: Page, label: string, value: string) {
  const input = page.getByLabel(label);
  await input.fill(value);
}

/**
 * Select an option from a dropdown
 */
export async function selectOption(page: Page, label: string, optionText: string) {
  const select = page.getByLabel(label);
  await select.click();
  await page.getByRole('option', { name: optionText }).click();
}

/**
 * Click a button by text
 */
export async function clickButton(page: Page, text: string) {
  await page.getByRole('button', { name: text }).click();
}

/**
 * Assert toast notification appears with message
 */
export async function expectToast(page: Page, message: string | RegExp) {
  const toast = page.locator('[data-sonner-toast], [role="status"], .toast');
  await expect(toast.filter({ hasText: message })).toBeVisible({ timeout: 10000 });
}

/**
 * Assert error message appears
 */
export async function expectError(page: Page, message: string | RegExp) {
  const error = page.locator('[role="alert"], .error, .text-destructive');
  await expect(error.filter({ hasText: message })).toBeVisible();
}

/**
 * Generate random test data
 */
export const testData = {
  generatePhone: () => {
    const random = Math.floor(Math.random() * 9000000) + 1000000;
    return `+1555${random}`;
  },

  generateEmail: () => {
    const random = Math.random().toString(36).substring(7);
    return `test-${random}@example.com`;
  },

  generateName: () => {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'Alex', 'Chris'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  },

  generateAddress: () => {
    const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd'];
    const cities = ['Austin', 'Dallas', 'Houston', 'San Antonio'];
    const number = Math.floor(Math.random() * 9999) + 1;
    return {
      street: `${number} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: 'TX',
      zip: `7${Math.floor(Math.random() * 9000) + 1000}`,
    };
  },
};

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

/**
 * Wait for element and scroll into view
 */
export async function scrollToElement(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  return element;
}
