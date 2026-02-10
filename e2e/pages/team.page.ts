import { Page, Locator, expect } from '@playwright/test';

export interface TeamMemberData {
  name?: string;
  phone?: string;
  email?: string;
  role?: string;
}

export class TeamPage {
  readonly page: Page;
  readonly inviteButton: Locator;
  readonly teamTable: Locator;
  readonly teamRows: Locator;
  readonly teamCards: Locator;
  readonly searchInput: Locator;
  readonly roleFilter: Locator;
  readonly inviteModal: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inviteButton = page.getByRole('button', { name: /invite|add member|add team/i });
    this.teamTable = page.locator('table, [role="table"]');
    this.teamRows = page.locator('tbody tr, [role="row"]');
    this.teamCards = page.locator('[data-testid="team-card"], .team-card, .member-card');
    this.searchInput = page.getByPlaceholder(/search/i);
    this.roleFilter = page.getByRole('combobox', { name: /role/i });
    this.inviteModal = page.locator('[role="dialog"], .modal');
    this.saveButton = page.getByRole('button', { name: /invite|send|submit/i });
    this.cancelButton = page.getByRole('button', { name: /cancel|close/i });
  }

  async goto() {
    await this.page.goto('/admin');
    const teamNav = this.page.getByRole('link', { name: /team/i }).or(
      this.page.getByRole('button', { name: /team/i })
    );
    if (await teamNav.isVisible({ timeout: 5000 })) {
      await teamNav.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async openInviteModal() {
    await this.inviteButton.click();
    await this.inviteModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillInviteForm(data: TeamMemberData) {
    if (data.name) {
      await this.page.getByLabel(/name/i).fill(data.name);
    }
    if (data.phone) {
      await this.page.locator('input[type="tel"]').first().fill(data.phone);
    }
    if (data.email) {
      await this.page.getByLabel(/email/i).fill(data.email);
    }
    if (data.role) {
      await this.page.getByLabel(/role/i).click();
      await this.page.getByRole('option', { name: data.role }).click();
    }
  }

  async sendInvite() {
    await this.saveButton.click();
    await this.inviteModal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async inviteMember(data: TeamMemberData) {
    await this.openInviteModal();
    await this.fillInviteForm(data);
    await this.sendInvite();
  }

  async searchMembers(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Debounce
  }

  async filterByRole(role: string) {
    await this.roleFilter.click();
    await this.page.getByRole('option', { name: role }).click();
  }

  async getMemberByName(name: string): Promise<Locator> {
    return this.teamRows.filter({ hasText: name }).first()
      .or(this.teamCards.filter({ hasText: name }).first());
  }

  async openMemberDetails(name: string) {
    const member = await this.getMemberByName(name);
    await member.click();
  }

  async getMemberCount(): Promise<number> {
    await this.page.waitForTimeout(1000); // Wait for data to load
    const rowCount = await this.teamRows.count();
    const cardCount = await this.teamCards.count();
    return Math.max(rowCount, cardCount);
  }

  async expectMemberInList(name: string) {
    const member = await this.getMemberByName(name);
    await expect(member).toBeVisible();
  }

  async updateMemberRole(name: string, newRole: string) {
    const member = await this.getMemberByName(name);

    // Find role dropdown or edit button within the member row/card
    const roleDropdown = member.getByRole('combobox', { name: /role/i });
    const editButton = member.getByRole('button', { name: /edit|change role/i });

    if (await roleDropdown.isVisible({ timeout: 3000 })) {
      await roleDropdown.click();
      await this.page.getByRole('option', { name: newRole }).click();
    } else if (await editButton.isVisible({ timeout: 3000 })) {
      await editButton.click();
      await this.page.getByLabel(/role/i).click();
      await this.page.getByRole('option', { name: newRole }).click();
      await this.saveButton.click();
    }
  }
}
