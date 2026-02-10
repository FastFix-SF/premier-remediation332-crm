import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly header: Locator;
  readonly sidebar: Locator;
  readonly mainContent: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly projectsLink: Locator;
  readonly leadsLink: Locator;
  readonly teamLink: Locator;
  readonly settingsLink: Locator;
  readonly statsCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header, [role="banner"]');
    this.sidebar = page.locator('aside, nav[role="navigation"]');
    this.mainContent = page.locator('main, [role="main"], .dashboard, [data-testid="dashboard"], #app > div');
    this.userMenu = page.getByRole('button', { name: /profile|user|account|menu/i });
    this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    this.projectsLink = page.getByRole('link', { name: /projects/i });
    this.leadsLink = page.getByRole('link', { name: /leads/i });
    this.teamLink = page.getByRole('link', { name: /team/i });
    this.settingsLink = page.getByRole('link', { name: /settings/i });
    this.statsCards = page.locator('[data-testid="stats-card"], .stat-card');
  }

  async goto() {
    await this.page.goto('/admin');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToProjects() {
    await this.projectsLink.click();
    await this.page.waitForURL(/\/projects|\/admin\/projects/);
  }

  async navigateToLeads() {
    await this.leadsLink.click();
    await this.page.waitForURL(/\/leads|\/admin\/leads/);
  }

  async navigateToTeam() {
    await this.teamLink.click();
    await this.page.waitForURL(/\/team|\/admin\/team/);
  }

  async navigateToSettings() {
    await this.settingsLink.click();
    await this.page.waitForURL(/\/settings|\/admin\/settings/);
  }

  async logout() {
    // Try direct logout button first
    if (await this.logoutButton.isVisible({ timeout: 3000 })) {
      await this.logoutButton.click();
    } else {
      // Try through user menu
      await this.userMenu.click();
      await this.page.getByRole('menuitem', { name: /logout|sign out/i }).click();
    }
    await this.page.waitForURL(/\/admin-login|\/login|\/$/, { timeout: 10000 });
  }

  async expectToBeOnDashboard() {
    await expect(this.page).toHaveURL(/\/admin/);
    await expect(this.mainContent).toBeVisible();
  }

  async getStatsCardValue(cardTitle: string): Promise<string> {
    const card = this.statsCards.filter({ hasText: cardTitle });
    const value = card.locator('.stat-value, [data-testid="stat-value"], h2, h3').first();
    return await value.textContent() || '';
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.mainContent.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
