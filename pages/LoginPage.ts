import { Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }


    /**
 * Navigates to the base URL defined in the environment
 */
async navigate() {
    const url = process.env.APP_URL;
    if (!url) throw new Error("APP_URL is not defined.");
    
    await this.page.goto(url);
}


    /**
     * Executes the login sequence using secure environment variables
     */
    async login(username = process.env.TEST_USER, password = process.env.TEST_PASS) {
        if (!username || !password) {
            throw new Error("Credentials are not defined in the environment.");
        }
        
        // Note: We use generic resilient locators. If the demo app uses different labels
        // (e.g., 'Username' instead of 'Email'), we will adjust these locators slightly.
        await this.page.locator('input[type="username"], input[id="username"], input[name="username"]').fill(username);
        await this.page.locator('input[type="password"], input[id="password"], input[name="password"]').fill(password);
        
        await this.page.getByRole('button', { name: /Sign in|Log in|Submit/i }).click();
        
        // Wait for the URL to change or the dashboard to load to confirm login success
        await this.page.waitForLoadState('networkidle');
    }
}