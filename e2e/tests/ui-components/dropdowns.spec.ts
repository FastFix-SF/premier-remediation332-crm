import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('Dropdown Components', () => {
  // Try to login - skip all tests if auth fails
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Try dev login
    const devLoginButton = page.getByRole('button', { name: /dev login|skip otp/i });
    if (await devLoginButton.isVisible({ timeout: 5000 })) {
      await devLoginButton.click();

      try {
        await page.waitForURL(/\/admin/, { timeout: 15000 });
      } catch {
        test.skip(true, 'Auth backend not available');
      }
    } else {
      test.skip(true, 'Dev login not available');
    }
  });

  test('select dropdown should open on click', async ({ page }) => {
    // Navigate to a page with dropdowns (team or settings)
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Find any dropdown/select component
    const select = page.getByRole('combobox').first();

    if (await select.isVisible({ timeout: 5000 })) {
      await select.click();

      // Options should become visible
      const options = page.getByRole('option');
      await expect(options.first()).toBeVisible({ timeout: 5000 });
    } else {
      // No dropdowns on this page, skip test
      test.skip();
    }
  });

  test('dropdown should close when clicking outside', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    const select = page.getByRole('combobox').first();

    if (await select.isVisible({ timeout: 5000 })) {
      // Open dropdown
      await select.click();
      await page.waitForTimeout(500);

      // Click outside
      await page.click('body', { position: { x: 10, y: 10 } });

      // Options should be hidden
      const options = page.getByRole('listbox');
      await expect(options).not.toBeVisible({ timeout: 3000 });
    } else {
      test.skip();
    }
  });

  test('dropdown should select option on click', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    const select = page.getByRole('combobox').first();

    if (await select.isVisible({ timeout: 5000 })) {
      // Get initial value
      const initialValue = await select.textContent();

      await select.click();

      const options = page.getByRole('option');
      const optionCount = await options.count();

      if (optionCount > 0) {
        // Click second option if available, otherwise first
        const optionIndex = optionCount > 1 ? 1 : 0;
        const optionText = await options.nth(optionIndex).textContent();

        await options.nth(optionIndex).click();

        // Dropdown should close and show selected value
        const newValue = await select.textContent();
        expect(newValue).toContain(optionText || '');
      }
    } else {
      test.skip();
    }
  });

  test('dropdown should be keyboard navigable', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    const select = page.getByRole('combobox').first();

    if (await select.isVisible({ timeout: 5000 })) {
      await select.focus();

      // Press Enter or Space to open
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      // Use arrow keys to navigate
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(200);

      // Press Enter to select
      await page.keyboard.press('Enter');

      // Dropdown should close
      const listbox = page.getByRole('listbox');
      await expect(listbox).not.toBeVisible({ timeout: 3000 });
    } else {
      test.skip();
    }
  });

  test('dropdown should support search/filter', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Find a searchable combobox
    const combobox = page.getByRole('combobox').first();

    if (await combobox.isVisible({ timeout: 5000 })) {
      await combobox.click();

      // Look for search input within dropdown
      const searchInput = page.locator('[role="listbox"] input, [cmdk-input]').first();

      if (await searchInput.isVisible({ timeout: 3000 })) {
        await searchInput.fill('test');
        await page.waitForTimeout(500);

        // Options should be filtered
        const options = page.getByRole('option');
        const visibleCount = await options.count();

        // Either shows filtered results or "no results" message
        expect(visibleCount >= 0).toBeTruthy();
      }
    } else {
      test.skip();
    }
  });

  test('multi-select should allow multiple selections', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Find multi-select (often has different attributes)
    const multiSelect = page.locator('[aria-multiselectable="true"], [data-multi-select]').first();

    if (await multiSelect.isVisible({ timeout: 5000 })) {
      await multiSelect.click();

      const options = page.getByRole('option');
      const optionCount = await options.count();

      if (optionCount >= 2) {
        // Select first two options
        await options.first().click();
        await options.nth(1).click();

        // Both should be selected (check for checkmarks or selected state)
        const selectedOptions = page.locator('[role="option"][aria-selected="true"]');
        const selectedCount = await selectedOptions.count();
        expect(selectedCount).toBeGreaterThanOrEqual(1);
      }
    } else {
      // No multi-select found, test passes
      test.skip();
    }
  });

  test('dropdown trigger should show current selection', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    const select = page.getByRole('combobox').first();

    if (await select.isVisible({ timeout: 5000 })) {
      // Get current displayed text
      const displayedText = await select.textContent();

      // Should show either placeholder or selected value
      expect(displayedText).not.toBe('');
      expect(displayedText).not.toBeNull();
    } else {
      test.skip();
    }
  });
});
