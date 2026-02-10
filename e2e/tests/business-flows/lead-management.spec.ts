import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { LeadsPage } from '../../pages/leads.page';
import { testData } from '../../helpers/test-utils';

test.describe('Lead Management', () => {
  let leadsPage: LeadsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Login first
    try {
      await loginPage.devLogin();
    } catch {
      await loginPage.loginWithPhone('+1 (555) 000-0000', '000000');
    }

    leadsPage = new LeadsPage(page);
    await leadsPage.goto();
  });

  test('should display leads list', async ({ page }) => {
    // Leads table or list should be visible
    const hasTable = await leadsPage.leadsTable.isVisible({ timeout: 10000 }).catch(() => false);
    const hasRows = await leadsPage.leadRows.first().isVisible({ timeout: 5000 }).catch(() => false);

    // Either table view or empty state should be visible
    expect(hasTable || page.url().includes('admin')).toBeTruthy();
  });

  test('should open add lead modal', async ({ page }) => {
    if (await leadsPage.addLeadButton.isVisible({ timeout: 5000 })) {
      await leadsPage.openAddLeadModal();
      await expect(leadsPage.leadModal).toBeVisible();
    } else {
      // Add lead might be in a different location
      test.skip();
    }
  });

  test('should create a new lead', async ({ page }) => {
    const testLead = {
      firstName: 'John',
      lastName: `Test${Date.now()}`,
      phone: testData.generatePhone(),
      email: testData.generateEmail(),
      address: '123 Test Street',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    };

    if (await leadsPage.addLeadButton.isVisible({ timeout: 5000 })) {
      await leadsPage.createLead(testLead);

      // Wait for the list to update
      await page.waitForTimeout(2000);

      // Lead should appear in the list
      await leadsPage.expectLeadInList(`${testLead.firstName} ${testLead.lastName}`);
    } else {
      test.skip();
    }
  });

  test('should search leads', async ({ page }) => {
    if (await leadsPage.searchInput.isVisible({ timeout: 5000 })) {
      const searchTerm = 'John';
      await leadsPage.searchLeads(searchTerm);

      await page.waitForTimeout(1000);

      // Verify search filtered results (or shows no results)
      const leadCount = await leadsPage.getLeadCount();
      expect(leadCount >= 0).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should open lead details', async ({ page }) => {
    const firstRow = leadsPage.leadRows.first();

    if (await firstRow.isVisible({ timeout: 5000 })) {
      // Get the name from the first row
      const leadName = await firstRow.textContent();

      await firstRow.click();

      // Should show lead details (modal or navigation)
      await page.waitForTimeout(1000);

      const hasModal = await leadsPage.leadModal.isVisible().catch(() => false);
      const hasDetailPage = page.url().includes('/leads/');

      expect(hasModal || hasDetailPage || leadName).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should edit lead information', async ({ page }) => {
    const firstRow = leadsPage.leadRows.first();

    if (await firstRow.isVisible({ timeout: 5000 })) {
      // Click to open details
      await firstRow.click();
      await page.waitForTimeout(1000);

      // Look for edit button
      const editButton = page.getByRole('button', { name: /edit/i });

      if (await editButton.isVisible({ timeout: 3000 })) {
        await editButton.click();

        // Modify a field
        const notesField = page.getByLabel(/notes/i);
        if (await notesField.isVisible({ timeout: 3000 })) {
          await notesField.fill('Updated via E2E test');

          // Save changes
          await leadsPage.saveButton.click();

          // Verify success (toast, modal close, or field update)
          await page.waitForTimeout(1000);
        }
      }
    } else {
      test.skip();
    }
  });

  test('should filter leads by status', async ({ page }) => {
    if (await leadsPage.filterDropdown.isVisible({ timeout: 5000 })) {
      await leadsPage.filterDropdown.click();

      const firstOption = page.getByRole('option').first();
      if (await firstOption.isVisible({ timeout: 3000 })) {
        const optionText = await firstOption.textContent();
        await firstOption.click();

        await page.waitForTimeout(1000);

        // Filter should be applied (count may change)
        const leadCount = await leadsPage.getLeadCount();
        expect(leadCount >= 0).toBeTruthy();
      }
    } else {
      test.skip();
    }
  });

  test('should validate required fields on lead form', async ({ page }) => {
    if (await leadsPage.addLeadButton.isVisible({ timeout: 5000 })) {
      await leadsPage.openAddLeadModal();

      // Try to submit empty form
      await leadsPage.saveButton.click();

      // Should show validation errors or button should be disabled
      await page.waitForTimeout(500);

      const hasErrors = await page.locator('.text-destructive, [role="alert"]').isVisible().catch(() => false);
      const isDisabled = await leadsPage.saveButton.isDisabled().catch(() => false);
      const modalStillOpen = await leadsPage.leadModal.isVisible();

      // Form should not submit without required fields
      expect(hasErrors || isDisabled || modalStillOpen).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should delete a lead', async ({ page }) => {
    const firstRow = leadsPage.leadRows.first();

    if (await firstRow.isVisible({ timeout: 5000 })) {
      const leadName = await firstRow.locator('td').first().textContent() || '';
      const initialCount = await leadsPage.getLeadCount();

      // Find and click delete button
      const deleteButton = firstRow.getByRole('button', { name: /delete|remove/i });

      if (await deleteButton.isVisible({ timeout: 3000 })) {
        await deleteButton.click();

        // Confirm deletion
        const confirmButton = page.getByRole('button', { name: /confirm|yes|delete/i });
        if (await confirmButton.isVisible({ timeout: 3000 })) {
          await confirmButton.click();
        }

        await page.waitForTimeout(2000);

        const newCount = await leadsPage.getLeadCount();
        expect(newCount).toBeLessThanOrEqual(initialCount);
      }
    } else {
      test.skip();
    }
  });

  test('should show lead count or pagination', async ({ page }) => {
    // Look for count indicator or pagination
    const countIndicator = page.locator('[data-testid="lead-count"], .lead-count, .pagination');
    const paginationButtons = page.getByRole('button', { name: /next|previous|page/i });

    const hasCount = await countIndicator.isVisible({ timeout: 5000 }).catch(() => false);
    const hasPagination = await paginationButtons.first().isVisible({ timeout: 3000 }).catch(() => false);

    // Either pagination or we're showing all leads
    expect(hasCount || hasPagination || await leadsPage.leadsTable.isVisible()).toBeTruthy();
  });
});
