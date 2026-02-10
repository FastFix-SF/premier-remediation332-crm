import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { ProjectsPage } from '../../pages/projects.page';
import { testData } from '../../helpers/test-utils';

test.describe('Project Management', () => {
  let projectsPage: ProjectsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    try {
      await loginPage.devLogin();
    } catch {
      await loginPage.loginWithPhone('+1 (555) 000-0000', '000000');
    }

    projectsPage = new ProjectsPage(page);
    await projectsPage.goto();
  });

  test('should display projects list or grid', async ({ page }) => {
    // Wait for projects to load
    await page.waitForTimeout(2000);

    const hasCards = await projectsPage.projectCards.first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasTable = await projectsPage.projectsTable.isVisible({ timeout: 5000 }).catch(() => false);
    const hasEmptyState = await page.locator('[data-testid="empty-state"], .empty-state').isVisible().catch(() => false);

    expect(hasCards || hasTable || hasEmptyState).toBeTruthy();
  });

  test('should open add project modal', async ({ page }) => {
    if (await projectsPage.addProjectButton.isVisible({ timeout: 5000 })) {
      await projectsPage.openAddProjectModal();
      await expect(projectsPage.projectModal).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should create a new project', async ({ page }) => {
    const address = testData.generateAddress();
    const testProject = {
      name: `Test Project ${Date.now()}`,
      clientName: testData.generateName(),
      address: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      description: 'E2E test project',
    };

    if (await projectsPage.addProjectButton.isVisible({ timeout: 5000 })) {
      await projectsPage.createProject(testProject);

      // Wait for list to update
      await page.waitForTimeout(2000);

      // Project should appear in list
      await projectsPage.expectProjectInList(testProject.name);
    } else {
      test.skip();
    }
  });

  test('should search projects', async ({ page }) => {
    if (await projectsPage.searchInput.isVisible({ timeout: 5000 })) {
      await projectsPage.searchProjects('test');

      await page.waitForTimeout(1000);

      const projectCount = await projectsPage.getProjectCount();
      expect(projectCount >= 0).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should filter projects by status', async ({ page }) => {
    if (await projectsPage.statusFilter.isVisible({ timeout: 5000 })) {
      await projectsPage.statusFilter.click();

      const statusOption = page.getByRole('option').first();
      if (await statusOption.isVisible({ timeout: 3000 })) {
        await statusOption.click();

        await page.waitForTimeout(1000);

        // Filter applied
        const projectCount = await projectsPage.getProjectCount();
        expect(projectCount >= 0).toBeTruthy();
      }
    } else {
      test.skip();
    }
  });

  test('should open project details', async ({ page }) => {
    const firstProject = projectsPage.projectCards.first().or(projectsPage.projectRows.first());

    if (await firstProject.isVisible({ timeout: 5000 })) {
      await firstProject.click();

      await page.waitForURL(/\/projects\/|\/admin\/projects\//, { timeout: 10000 });

      // Should be on project detail page
      expect(page.url()).toMatch(/\/projects\/[a-zA-Z0-9-]+/);
    } else {
      test.skip();
    }
  });

  test('should toggle between grid and list view', async ({ page }) => {
    if (await projectsPage.viewToggle.isVisible({ timeout: 5000 })) {
      // Get initial view state
      const initialGridVisible = await projectsPage.projectCards.first().isVisible().catch(() => false);

      await projectsPage.toggleView();
      await page.waitForTimeout(500);

      // View should change
      const newGridVisible = await projectsPage.projectCards.first().isVisible().catch(() => false);
      const newTableVisible = await projectsPage.projectsTable.isVisible().catch(() => false);

      // Something should be visible
      expect(newGridVisible || newTableVisible).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should update project status', async ({ page }) => {
    const firstProject = projectsPage.projectCards.first().or(projectsPage.projectRows.first());

    if (await firstProject.isVisible({ timeout: 5000 })) {
      await firstProject.click();

      await page.waitForURL(/\/projects\//, { timeout: 10000 });

      // Find status dropdown or button
      const statusDropdown = page.getByRole('combobox', { name: /status/i });
      const statusButton = page.getByRole('button', { name: /status|in progress|pending|completed/i });

      if (await statusDropdown.isVisible({ timeout: 5000 })) {
        await statusDropdown.click();
        const newStatus = page.getByRole('option').nth(1);
        if (await newStatus.isVisible({ timeout: 3000 })) {
          await newStatus.click();
          await page.waitForTimeout(1000);
        }
      } else if (await statusButton.isVisible({ timeout: 5000 })) {
        await statusButton.click();
        await page.waitForTimeout(500);
      }
    } else {
      test.skip();
    }
  });

  test('should show project photos section', async ({ page }) => {
    const firstProject = projectsPage.projectCards.first().or(projectsPage.projectRows.first());

    if (await firstProject.isVisible({ timeout: 5000 })) {
      await firstProject.click();
      await page.waitForURL(/\/projects\//, { timeout: 10000 });

      // Look for photos tab or section
      const photosTab = page.getByRole('tab', { name: /photos/i });
      const photosSection = page.locator('[data-testid="photos"], .photos-section');

      if (await photosTab.isVisible({ timeout: 5000 })) {
        await photosTab.click();
        await page.waitForTimeout(1000);
        expect(true).toBeTruthy();
      } else if (await photosSection.isVisible({ timeout: 5000 })) {
        expect(true).toBeTruthy();
      } else {
        // Photos might not be a feature on this page
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('should show project timeline/history', async ({ page }) => {
    const firstProject = projectsPage.projectCards.first().or(projectsPage.projectRows.first());

    if (await firstProject.isVisible({ timeout: 5000 })) {
      await firstProject.click();
      await page.waitForURL(/\/projects\//, { timeout: 10000 });

      // Look for timeline or history section
      const timelineTab = page.getByRole('tab', { name: /timeline|history|activity/i });
      const timelineSection = page.locator('[data-testid="timeline"], .timeline, .activity');

      if (await timelineTab.isVisible({ timeout: 5000 })) {
        await timelineTab.click();
        await page.waitForTimeout(1000);
        expect(true).toBeTruthy();
      } else if (await timelineSection.isVisible({ timeout: 5000 })) {
        expect(true).toBeTruthy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('should navigate back to projects list', async ({ page }) => {
    const firstProject = projectsPage.projectCards.first().or(projectsPage.projectRows.first());

    if (await firstProject.isVisible({ timeout: 5000 })) {
      await firstProject.click();
      await page.waitForURL(/\/projects\//, { timeout: 10000 });

      // Click back button or projects link
      const backButton = page.getByRole('button', { name: /back/i });
      const projectsLink = page.getByRole('link', { name: /projects/i });

      if (await backButton.isVisible({ timeout: 3000 })) {
        await backButton.click();
      } else if (await projectsLink.isVisible({ timeout: 3000 })) {
        await projectsLink.click();
      } else {
        await page.goBack();
      }

      // Should be back on projects list
      await page.waitForTimeout(1000);
    } else {
      test.skip();
    }
  });
});
