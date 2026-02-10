import { Page, Locator, expect } from '@playwright/test';

export interface ProjectFormData {
  name?: string;
  clientName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  description?: string;
  status?: string;
  type?: string;
}

export class ProjectsPage {
  readonly page: Page;
  readonly addProjectButton: Locator;
  readonly projectsGrid: Locator;
  readonly projectCards: Locator;
  readonly projectsTable: Locator;
  readonly projectRows: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly projectModal: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly viewToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addProjectButton = page.getByRole('button', { name: /add project|new project|create project/i });
    this.projectsGrid = page.locator('[data-testid="projects-grid"], .projects-grid');
    this.projectCards = page.locator('[data-testid="project-card"], .project-card');
    this.projectsTable = page.locator('table, [role="table"]');
    this.projectRows = page.locator('tbody tr, [role="row"]');
    this.searchInput = page.getByPlaceholder(/search/i);
    this.statusFilter = page.getByRole('combobox', { name: /status/i });
    this.projectModal = page.locator('[role="dialog"], .modal');
    this.saveButton = page.getByRole('button', { name: /save|submit|create/i });
    this.cancelButton = page.getByRole('button', { name: /cancel|close/i });
    this.viewToggle = page.getByRole('button', { name: /grid|list|view/i });
  }

  async goto() {
    await this.page.goto('/projects');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoAdmin() {
    await this.page.goto('/admin');
    const projectsNav = this.page.getByRole('link', { name: /projects/i }).or(
      this.page.getByRole('button', { name: /projects/i })
    );
    if (await projectsNav.isVisible({ timeout: 5000 })) {
      await projectsNav.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async openAddProjectModal() {
    await this.addProjectButton.click();
    await this.projectModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillProjectForm(data: ProjectFormData) {
    if (data.name) {
      await this.page.getByLabel(/project name|name/i).first().fill(data.name);
    }
    if (data.clientName) {
      await this.page.getByLabel(/client|customer/i).fill(data.clientName);
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
    if (data.description) {
      await this.page.getByLabel(/description|notes/i).fill(data.description);
    }
    if (data.status) {
      await this.page.getByLabel(/status/i).click();
      await this.page.getByRole('option', { name: data.status }).click();
    }
    if (data.type) {
      await this.page.getByLabel(/type/i).click();
      await this.page.getByRole('option', { name: data.type }).click();
    }
  }

  async saveProject() {
    await this.saveButton.click();
    await this.projectModal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async createProject(data: ProjectFormData) {
    await this.openAddProjectModal();
    await this.fillProjectForm(data);
    await this.saveProject();
  }

  async searchProjects(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Debounce
  }

  async filterByStatus(status: string) {
    await this.statusFilter.click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async getProjectCardByName(name: string): Promise<Locator> {
    return this.projectCards.filter({ hasText: name }).first();
  }

  async getProjectRowByName(name: string): Promise<Locator> {
    return this.projectRows.filter({ hasText: name }).first();
  }

  async openProjectDetails(name: string) {
    const card = await this.getProjectCardByName(name);
    if (await card.isVisible({ timeout: 3000 })) {
      await card.click();
    } else {
      const row = await this.getProjectRowByName(name);
      await row.click();
    }
    await this.page.waitForURL(/\/projects\//, { timeout: 10000 });
  }

  async getProjectCount(): Promise<number> {
    await this.page.waitForTimeout(1000); // Wait for data to load
    const cardCount = await this.projectCards.count();
    const rowCount = await this.projectRows.count();
    return Math.max(cardCount, rowCount);
  }

  async expectProjectInList(name: string) {
    const card = await this.getProjectCardByName(name);
    const row = await this.getProjectRowByName(name);
    await expect(card.or(row)).toBeVisible();
  }

  async toggleView() {
    await this.viewToggle.click();
  }
}
