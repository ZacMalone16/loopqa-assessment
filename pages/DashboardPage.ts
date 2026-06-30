import { Page, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigates to the specified project board via the sidebar.
     */
    async navigateToBoard(boardName: string) {
        // Scope to the sidebar navigation to prevent clicking a similarly named item elsewhere
        const sidebar = this.page.locator('nav, aside, [class*="sidebar"]').first();
        await sidebar.getByText(boardName, { exact: true }).click();
        
        // Wait for the board title to render in the main content area to ensure state is ready
        await expect(this.page.getByRole('heading', { name: boardName, exact: true }).first()).toBeVisible();
    }


    /**
     * Locates a task card within a specific column and verifies its tags.
     */
    async verifyTaskInColumnAndTags(columnName: string, taskName: string, expectedTags: string[]) {
        
        // 1. Column Scope: Find the innermost div containing the column heading.
        // We use a simple regex to handle the dynamic "(2)" count without strict boundaries.
        const column = this.page.locator('div').filter({ 
            has: this.page.getByRole('heading', { name: new RegExp(columnName, 'i') }) 
        }).last();

        // 2. Card Scope: Find the innermost div within the column containing the exact task name.
        // Using getByText without strict regex allows the card to contain other text (dates, assignees).
        const taskCard = column.locator('div').filter({ 
            has: this.page.getByText(taskName, { exact: true }) 
        }).last();

        // Assert the card exists in the column
        await expect(taskCard, `Task "${taskName}" was not found in the "${columnName}" column`).toBeVisible();

        // 3. Tag Scope: Verify the tags exist strictly inside this specific card.
        for (const tag of expectedTags) {
            const tagLocator = taskCard.getByText(tag, { exact: true });
            await expect(tagLocator, `Expected tag "${tag}" was not found on task "${taskName}"`).toBeVisible();
        }
    }

}