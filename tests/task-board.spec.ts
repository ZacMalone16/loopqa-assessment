import { test } from '@playwright/test';
import taskData from '../data/task-scenarios.json';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// 1. Define the Interface: Shows strong TS fundamentals and prevents data-shape errors
interface TaskScenario {
    id: number;
    board: string;
    taskName: string;
    column: string;
    tags: string[];
}

// 2. Strongly type the imported JSON array
const scenarios: TaskScenario[] = taskData;

test.describe('LoopQA Task Board Verification', () => {
    
    // 3. Isolated State: Authenticate freshly before EVERY test to prevent cross-test contamination
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login();
    });

    // 4. Data-Driven Execution: Loop through the JSON array to generate tests dynamically
    scenarios.forEach((scenario) => {
        
        // Use backticks to create highly descriptive, unique test names in the report
        test(`Test Case ${scenario.id}: Verify "${scenario.taskName}" is in "${scenario.column}" with correct tags`, async ({ page }) => {
            
            const dashboardPage = new DashboardPage(page);
            
            // Step 1: Navigate to the correct board (Web or Mobile)
            await dashboardPage.navigateToBoard(scenario.board);
            
            // Step 2: Verify the task is in the exact column with the exact tags
            await dashboardPage.verifyTaskInColumnAndTags(
                scenario.column,
                scenario.taskName,
                scenario.tags
            );
        });
        
    });
});