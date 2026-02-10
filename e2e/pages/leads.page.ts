import { Page, Locator, expect } from '@playwright/test';

export interface LeadFormData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
  source?: string;
}

export class LeadsPage {
  readonly page: Page;
  readonly addLeadButton: Locator;
  readonly leadsTable: Locator;
  readonly leadRows: Locator;
  readonly searchInput: Locator;
  readonly filterDropdown: Locator;
  readonly leadModal: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addLeadButton = page.getByRole('button', { name: /add lead|new lead|create lead/i });
    this.leadsTable = page.locator('table, [role="table"], [data-testid="leads-table"]');
    this.leadRows = page.locator('tbody tr, [role="row"]');
    this.searchInput = page.getByPlaceholder(/search/i);
    this.filterDropdown = page.getByRole('combobox', { name: /filter|status/i });
    this.leadModal = page.locator('[role="dialog"], .modal');
    this.saveButton = page.getByRole('button', { name: /save|submit|create/i });
    this.cancelButton = page.getByRole('button', { name: /cancel|close/i });
    this.deleteButton = page.getByRole('button', { name: /delete|remove/i });
  }

  async goto() {
    await this.page.goto('/admin');
    // Navigate to leads section - might be a tab or separate page
    const leadsNav = this.page.getByRole('link', { name: /leads/i }).or(
      this.page.getByRole('button', { name: /leads/i })
    );
    if (await leadsNav.isVisible({ timeout: 5000 })) {
      await leadsNav.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async openAddLeadModal() {
    await this.addLeadButton.click();
    await this.leadModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillLeadForm(data: LeadFormData) {
    if (data.firstName) {
      await this.page.getByLabel(/first name/i).fill(data.firstName);
    }
    if (data.lastName) {
      await this.page.getByLabel(/last name/i).fill(data.lastName);
    }
    if (data.phone) {
      await this.page.locator('input[type="tel"]').first().fill(data.phone);
    }
    if (data.email) {
      await this.page.getByLabel(/email/i).fill(data.email);
    }
    if (data.address) {
      await this.page.getByLabel(/address|street/i).fill(data.address);
    }
    if (data.city) {
      await this.page.getByLabel(/city/i).fill(data.city);
    }
    if (data.state) {
      await this.page.getByLabel(/state/i).fill(data.state);
    }
    if (data.zip) {
      await this.page.getByLabel(/zip|postal/i).fill(data.zip);
    }
    if (data.notes) {
      await this.page.getByLabel(/notes|comments/i).fill(data.notes);
    }
  }

  async saveLead() {
    await this.saveButton.click();
    await this.leadModal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async createLead(data: LeadFormData) {
    await this.openAddLeadModal();
    await this.fillLeadForm(data);
    await this.saveLead();
  }

  async searchLeads(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Debounce
  }

  async getLeadRowByName(name: string): Promise<Locator> {
    return this.leadRows.filter({ hasText: name }).first();
  }

  async openLeadDetails(name: string) {
    const row = await this.getLeadRowByName(name);
    await row.click();
  }

  async deleteLead(name: string) {
    const row = await this.getLeadRowByName(name);
    await row.locator(this.deleteButton).click();

    // Confirm deletion if dialog appears
    const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
    if (await confirmButton.isVisible({ timeout: 3000 })) {
      await confirmButton.click();
    }
  }

  async getLeadCount(): Promise<number> {
    await this.page.waitForTimeout(1000); // Wait for data to load
    return await this.leadRows.count();
  }

  async expectLeadInList(name: string) {
    const row = await this.getLeadRowByName(name);
    await expect(row).toBeVisible();
  }

  async expectLeadNotInList(name: string) {
    const row = await this.getLeadRowByName(name);
    await expect(row).not.toBeVisible();
  }
}
