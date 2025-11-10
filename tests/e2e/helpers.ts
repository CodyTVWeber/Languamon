import type { Page } from "@playwright/test";

export async function enterOverworld(page: Page) {
    await page.goto("/");
    await page.click("body", { position: { x: 5, y: 5 } });
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
    for (let i = 0; i < 5; i += 1) {
        await page.keyboard.press("Space");
        await page.waitForTimeout(50);
    }
}
